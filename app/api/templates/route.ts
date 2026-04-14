import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import {
  getTemplates,
  createTemplate,
} from "@/lib/templates";

// GET /api/templates - List templates with filtering
export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get("category") || undefined;
    const type = searchParams.get("type") as "prebuilt" | "custom" | undefined;
    const favorites = searchParams.get("favorites") === "true";

    const templates = await getTemplates(session.user.id, {
      category,
      type,
      favorites,
    });

    return NextResponse.json({ templates });
  } catch (error) {
    console.error("Error fetching templates:", error);
    return NextResponse.json(
      { error: "Failed to fetch templates" },
      { status: 500 }
    );
  }
}

// POST /api/templates - Create new template
export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    // Validate required fields
    if (!body.name || !body.category || !body.template) {
      return NextResponse.json(
        { error: "Missing required fields: name, category, template" },
        { status: 400 }
      );
    }

    const templateData = {
      name: body.name,
      category: body.category,
      type: body.type || "custom",
      template: body.template,
      variables: body.variables || {},
      constraints: body.constraints || {},
      example: body.example,
      isFavorite: body.isFavorite || false,
      usageCount: 0,
    };

    const template = await createTemplate(session.user.id, templateData);

    return NextResponse.json({ template }, { status: 201 });
  } catch (error) {
    console.error("Error creating template:", error);
    return NextResponse.json(
      { error: "Failed to create template" },
      { status: 500 }
    );
  }
}