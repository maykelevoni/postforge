import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { sendDeliveryEmail } from "@/lib/email";

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

  // Require deliverables to exist
  if (!ticket.deliverables) {
    return NextResponse.json(
      { error: "Deliverables not generated yet. Please generate deliverables first." },
      { status: 400 }
    );
  }

  // Parse deliverables JSON, extract generated text
  let generatedContent: string;
  try {
    const deliverablesData = JSON.parse(ticket.deliverables);
    generatedContent = deliverablesData.generated;
  } catch (error) {
    return NextResponse.json(
      { error: "Invalid deliverables format" },
      { status: 400 }
    );
  }

  if (!generatedContent) {
    return NextResponse.json(
      { error: "No generated content found in deliverables" },
      { status: 400 }
    );
  }

  try {
    // Send delivery email via Resend
    await sendDeliveryEmail({
      clientName: ticket.clientName,
      clientEmail: ticket.clientEmail,
      service: {
        name: ticket.service.name,
        turnaroundDays: ticket.service.turnaroundDays,
      },
      userId: ticket.userId,
      deliverables: generatedContent,
    });

    // Update ticket: set deliveredAt and move to "delivered" status
    await db.serviceTicket.update({
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
