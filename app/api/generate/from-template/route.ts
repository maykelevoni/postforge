import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import {
  getTemplateById,
  generateFromTemplate,
  fillTemplateVariables,
} from "@/lib/templates";

// POST /api/generate/from-template - Generate content using template
export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    // Validate required fields
    if (!body.templateId) {
      return NextResponse.json(
        { error: "Missing required field: templateId" },
        { status: 400 }
      );
    }

    if (!body.productInfo || !body.productInfo.name) {
      return NextResponse.json(
        { error: "Missing required field: productInfo" },
        { status: 400 }
      );
    }

    // Get template
    const template = await getTemplateById(body.templateId, session.user.id);

    if (!template) {
      return NextResponse.json({ error: "Template not found" }, { status: 404 });
    }

    // Fill variables with AI if not provided
    let variables = body.variables;
    if (!variables || Object.keys(variables).length === 0) {
      variables = await fillTemplateVariables(
        template,
        body.productInfo,
        session.user.id
      );
    }

    // Generate content from template
    const result = await generateFromTemplate(
      template,
      variables,
      body.productInfo,
      session.user.id
    );

    return NextResponse.json({
      content: result.content,
      validation: result.validation,
      template: template.name,
      variables: variables,
    });
  } catch (error) {
    console.error("Error generating from template:", error);
    return NextResponse.json(
      { error: "Failed to generate content from template" },
      { status: 500 }
    );
  }
}