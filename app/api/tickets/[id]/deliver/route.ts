import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { generateText } from "@/lib/ai";

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Load ticket with service
  const ticket = await db.serviceTicket.findFirst({
    where: {
      id: params.id,
      userId: session.user.id,
    },
    include: {
      service: {
        select: {
          id: true,
          name: true,
          type: true,
          deliverables: true,
        },
      },
    },
  });

  if (!ticket) {
    return NextResponse.json({ error: "Ticket not found" }, { status: 404 });
  }

  if (!ticket.service) {
    return NextResponse.json(
      { error: "Service not found for this ticket" },
      { status: 400 }
    );
  }

  try {
    // Replace [niche] placeholder in service's deliverables template
    const prompt = ticket.service.deliverables.replace(
      /\[niche\]/gi,
      ticket.niche
    );

    // Generate AI deliverables
    const generated = await generateText({
      prompt,
      system: "You are an expert content creator. Follow the instructions exactly and produce high-quality output.",
      userId: session.user.id,
    });

    // Save result as JSON string to ticket.deliverables
    const deliverablesJson = JSON.stringify({
      generated,
      generatedAt: new Date(),
    });

    const updated = await db.serviceTicket.update({
      where: { id: params.id },
      data: { deliverables: deliverablesJson },
    });

    return NextResponse.json({ deliverables: deliverablesJson });
  } catch (error: any) {
    console.error("Failed to generate deliverables:", error);
    return NextResponse.json(
      { error: error.message || "Failed to generate deliverables" },
      { status: 500 }
    );
  }
}
