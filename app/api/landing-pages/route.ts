import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { randomBytes } from "crypto";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 50);
}

async function generateUniqueSlug(serviceName: string): Promise<string> {
  const base = slugify(serviceName);
  const suffix = randomBytes(4).toString("hex"); // 8 hex chars
  const slug = base ? `${base}-${suffix}` : suffix;

  // Verify uniqueness (collision is extremely unlikely but check anyway)
  const existing = await db.landingPage.findUnique({ where: { slug } });
  if (existing) {
    // Re-generate with a fresh suffix
    const newSuffix = randomBytes(4).toString("hex");
    return base ? `${base}-${newSuffix}` : newSuffix;
  }

  return slug;
}

export async function GET(_req: Request) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const landingPages = await db.landingPage.findMany({
    where: {
      userId: session.user.id,
    },
    select: {
      id: true,
      slug: true,
      template: true,
      status: true,
      createdAt: true,
      updatedAt: true,
      service: {
        select: {
          id: true,
          name: true,
        },
      },
      _count: {
        select: {
          subscribers: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return NextResponse.json(landingPages);
}

export async function POST(req: Request) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { serviceId, template, variables, sections } = body;

  if (!serviceId || !template) {
    return NextResponse.json(
      { error: "Missing required fields: serviceId and template" },
      { status: 400 }
    );
  }

  // Verify service exists and belongs to the user
  const service = await db.service.findFirst({
    where: {
      id: serviceId,
      userId: session.user.id,
    },
  });

  if (!service) {
    return NextResponse.json({ error: "Service not found" }, { status: 404 });
  }

  // Check if a landing page already exists for this service
  const existingPage = await db.landingPage.findUnique({
    where: { serviceId },
  });

  if (existingPage) {
    return NextResponse.json(
      { error: "A landing page already exists for this service" },
      { status: 409 }
    );
  }

  const slug = await generateUniqueSlug(service.name);

  const landingPage = await db.landingPage.create({
    data: {
      userId: session.user.id,
      serviceId,
      slug,
      template,
      variables: variables ? JSON.stringify(variables) : "{}",
      sections: sections ? JSON.stringify(sections) : "{}",
      status: "published",
    },
  });

  // Link the landing page back to the service
  await db.service.update({
    where: { id: serviceId },
    data: { landingPageId: landingPage.id },
  });

  return NextResponse.json({
    id: landingPage.id,
    slug: landingPage.slug,
    url: `/l/${landingPage.slug}`,
  });
}
