import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { generateText } from "@/lib/ai";

const LEAD_MAGNET_SYSTEM = `You are a document generator. Return ONLY valid JSON with no markdown fences. For a lead magnet, return: { title, subtitle, introduction, sections: [{heading, body}] (3-7 sections), cta }`;

const QUOTE_SYSTEM = `You are a professional proposal writer. Return ONLY valid JSON with no markdown fences. For a service quote, return: { title, serviceDescription, scopeOfWork: [string], deliverables: [string], timeline, investment, terms }`;

// POST /api/documents/generate - Generate document content using AI
export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    if (!body.type || !body.prompt) {
      return NextResponse.json(
        { error: "Missing required fields: type and prompt" },
        { status: 400 }
      );
    }

    const { type, prompt } = body;

    let systemPrompt: string;
    if (type === "lead_magnet") {
      systemPrompt = LEAD_MAGNET_SYSTEM;
    } else if (type === "quote") {
      systemPrompt = QUOTE_SYSTEM;
    } else {
      return NextResponse.json(
        { error: "Invalid type. Must be 'lead_magnet' or 'quote'" },
        { status: 400 }
      );
    }

    const rawText = await generateText({
      prompt,
      system: systemPrompt,
      userId: session.user.id,
    });

    let parsed: Record<string, unknown>;
    try {
      parsed = JSON.parse(rawText);
    } catch {
      return NextResponse.json(
        { error: "Failed to parse AI response as JSON", raw: rawText },
        { status: 500 }
      );
    }

    return NextResponse.json({ ...parsed, type });
  } catch (error) {
    console.error("Error generating document:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to generate document",
      },
      { status: 500 }
    );
  }
}
