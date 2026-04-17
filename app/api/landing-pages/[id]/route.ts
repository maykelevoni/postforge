import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const landingPage = await db.landingPage.findFirst({
    where: {
      id: params.id,
      userId: session.user.id,
    },
  });

  if (!landingPage) {
    return NextResponse.json({ error: "Landing page not found" }, { status: 404 });
  }

  const body = await req.json();
  const { variables, sections, status } = body;

  const updated = await db.landingPage.update({
    where: { id: params.id },
    data: {
      ...(variables !== undefined && { variables: JSON.stringify(variables) }),
      ...(sections !== undefined && { sections: JSON.stringify(sections) }),
      ...(status !== undefined && { status }),
    },
  });

  return NextResponse.json(updated);
}

export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const landingPage = await db.landingPage.findFirst({
    where: {
      id: params.id,
      userId: session.user.id,
    },
  });

  if (!landingPage) {
    return NextResponse.json({ error: "Landing page not found" }, { status: 404 });
  }

  // Null out Service.landingPageId before deleting to avoid FK constraint issues
  await db.service.updateMany({
    where: { landingPageId: params.id },
    data: { landingPageId: null },
  });

  await db.landingPage.delete({
    where: { id: params.id },
  });

  return NextResponse.json({ success: true });
}
