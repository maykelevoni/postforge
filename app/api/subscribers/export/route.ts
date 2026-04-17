import { auth } from "@/auth";
import { db } from "@/lib/db";

export async function GET(req: Request) {
  const session = await auth();

  if (!session?.user?.id) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  const { searchParams } = new URL(req.url);
  const landingPageId = searchParams.get("landingPageId");
  const serviceId = searchParams.get("serviceId");

  const where: any = {
    userId: session.user.id,
  };

  if (landingPageId && landingPageId !== "all") {
    where.landingPageId = landingPageId;
  }

  if (serviceId && serviceId !== "all") {
    where.serviceId = serviceId;
  }

  const subscribers = await db.subscriber.findMany({
    where,
    include: {
      landingPage: {
        select: {
          slug: true,
        },
      },
      service: {
        select: {
          name: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const header = "Name,Email,Source,Landing Page,Service,Date Joined\n";

  const rows = subscribers.map((sub) => {
    const name = `"${(sub.name ?? "").replace(/"/g, '""')}"`;
    const email = `"${(sub.email ?? "").replace(/"/g, '""')}"`;
    const source = `"${(sub.source ?? "").replace(/"/g, '""')}"`;
    const landingPage = `"${(sub.landingPage?.slug ?? "").replace(/"/g, '""')}"`;
    const service = `"${(sub.service?.name ?? "").replace(/"/g, '""')}"`;
    const dateJoined = `"${new Date(sub.createdAt).toISOString().split("T")[0]}"`;
    return [name, email, source, landingPage, service, dateJoined].join(",");
  });

  const csv = header + rows.join("\n");

  return new Response(csv, {
    status: 200,
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": 'attachment; filename="subscribers.csv"',
    },
  });
}
