import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { toggleTemplateFavorite } from "@/lib/templates";

// POST /api/templates/[id]/favorite - Toggle template favorite status
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const template = await toggleTemplateFavorite(params.id, session.user.id);

    return NextResponse.json({ template });
  } catch (error) {
    console.error("Error toggling template favorite:", error);

    if (error instanceof Error && error.message.includes("not found")) {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }

    if (error instanceof Error && error.message.includes("Access denied")) {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }

    return NextResponse.json(
      { error: "Failed to toggle favorite" },
      { status: 500 }
    );
  }
}