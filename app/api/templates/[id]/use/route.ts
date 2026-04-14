import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { trackTemplateUsage, getTemplateById } from "@/lib/templates";

// POST /api/templates/[id]/use - Increment template usage counter
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if template exists and user has access
    const template = await getTemplateById(params.id, session.user.id);

    if (!template) {
      return NextResponse.json({ error: "Template not found" }, { status: 404 });
    }

    // Track usage
    await trackTemplateUsage(params.id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error tracking template usage:", error);
    return NextResponse.json(
      { error: "Failed to track usage" },
      { status: 500 }
    );
  }
}