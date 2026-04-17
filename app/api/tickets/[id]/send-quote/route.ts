import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { sendQuoteEmail } from "@/lib/email";

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

  // Require quote to exist
  if (!ticket.quote) {
    return NextResponse.json(
      { error: "Quote not generated yet. Please generate a quote first." },
      { status: 400 }
    );
  }

  try {
    // Send quote email via Resend
    await sendQuoteEmail({
      clientName: ticket.clientName,
      clientEmail: ticket.clientEmail,
      service: {
        name: ticket.service.name,
        turnaroundDays: ticket.service.turnaroundDays,
      },
      userId: ticket.userId,
      quote: ticket.quote,
    });

    // Update ticket: set quoteSentAt and move to "quoted" status
    await db.serviceTicket.update({
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
