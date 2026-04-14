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
          description: true,
          deliverables: true,
          priceMin: true,
          priceMax: true,
          turnaroundDays: true,
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
    // Generate AI quote
    const prompt = `Write a professional quote proposal for:
Service: ${ticket.service.name}
Description: ${ticket.service.description}
Client: ${ticket.clientName}
Their niche/topic: ${ticket.niche}
Their message: ${ticket.message}
What you will deliver: ${ticket.service.deliverables}
Investment range: $${ticket.service.priceMin}–$${ticket.service.priceMax}
Turnaround: ${ticket.service.turnaroundDays} days

Structure: personalized intro → scope of work (specific to their niche) → deliverables list → timeline → investment → next steps (reply to accept).`;

    const quote = await generateText({
      prompt,
      system: "You are a professional freelance services consultant writing proposals.",
      userId: session.user.id,
    });

    // Save quote to ticket
    const updated = await db.serviceTicket.update({
      where: { id: params.id },
      data: { quote },
    });

    return NextResponse.json({ quote });
  } catch (error: any) {
    console.error("Failed to generate quote:", error);
    return NextResponse.json(
      { error: error.message || "Failed to generate quote" },
      { status: 500 }
    );
  }
}
