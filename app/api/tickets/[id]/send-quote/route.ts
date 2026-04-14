import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { getSetting } from "@/lib/settings";

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

  // Require quote to exist
  if (!ticket.quote) {
    return NextResponse.json(
      { error: "Quote not generated yet. Please generate a quote first." },
      { status: 400 }
    );
  }

  try {
    // Send quote email via Systeme.io broadcast API
    const apiKey = await getSetting("systeme_api_key", session.user.id);
    if (!apiKey) {
      return NextResponse.json(
        { error: "Systeme.io API key not configured" },
        { status: 500 }
      );
    }

    const subject = `Your quote for ${ticket.service.name} — ${ticket.clientName}`;

    // Systeme.io broadcast API call
    const response = await fetch("https://api.systeme.io/api/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": apiKey,
      },
      body: JSON.stringify({
        email: ticket.clientEmail,
        subject: subject,
        body: ticket.quote,
        send_now: true,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Systeme.io API error: ${error}`);
    }

    // Update ticket: set quoteSentAt and move to "quoted" status
    const updated = await db.serviceTicket.update({
      where: { id: params.id },
      data: {
        quoteSentAt: new Date(),
        status: "quoted",
      },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Failed to send quote:", error);
    return NextResponse.json(
      { error: error.message || "Failed to send quote" },
      { status: 500 }
    );
  }
}
