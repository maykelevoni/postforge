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

  // Require deliverables to exist
  if (!ticket.deliverables) {
    return NextResponse.json(
      { error: "Deliverables not generated yet. Please generate deliverables first." },
      { status: 400 }
    );
  }

  try {
    // Parse deliverables JSON, extract generated text
    let deliverablesData;
    try {
      deliverablesData = JSON.parse(ticket.deliverables);
    } catch (error) {
      return NextResponse.json(
        { error: "Invalid deliverables format" },
        { status: 400 }
      );
    }

    const generatedContent = deliverablesData.generated;

    if (!generatedContent) {
      return NextResponse.json(
        { error: "No generated content found in deliverables" },
        { status: 400 }
      );
    }

    // Send delivery email via Systeme.io broadcast API
    const apiKey = await getSetting("systeme_api_key", session.user.id);
    if (!apiKey) {
      return NextResponse.json(
        { error: "Systeme.io API key not configured" },
        { status: 500 }
      );
    }

    const subject = `Your ${ticket.service.name} deliverables are ready — ${ticket.clientName}`;

    // Email body with intro paragraph + generated content
    const body = `Hi ${ticket.clientName},

Your deliverables for ${ticket.service.name} are ready!

Please review the materials below and let me know if you have any questions or need any adjustments.

---
${generatedContent}
---

Best regards`;

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
        body: body,
        send_now: true,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Systeme.io API error: ${error}`);
    }

    // Update ticket: set deliveredAt and move to "delivered" status
    const updated = await db.serviceTicket.update({
      where: { id: params.id },
      data: {
        deliveredAt: new Date(),
        status: "delivered",
      },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Failed to send delivery:", error);
    return NextResponse.json(
      { error: error.message || "Failed to send delivery" },
      { status: 500 }
    );
  }
}
