import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { getSetting } from "@/lib/settings";
import { createPolarCheckout } from "@/lib/polar";

export async function POST(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

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
          priceMin: true,
        },
      },
    },
  });

  if (!ticket) {
    return NextResponse.json({ error: "Ticket not found" }, { status: 404 });
  }

  if (ticket.status !== "quoted") {
    return NextResponse.json(
      { error: "Ticket must be in quoted status to request payment" },
      { status: 400 }
    );
  }

  const polarApiKey = await getSetting("polar_api_key", session.user.id);
  if (!polarApiKey) {
    return NextResponse.json(
      { error: "Polar API key not configured" },
      { status: 400 }
    );
  }

  try {
    const { checkoutUrl, checkoutId } = await createPolarCheckout({
      polarApiKey,
      amount: Math.round(ticket.service.priceMin * 100),
      clientEmail: ticket.clientEmail,
      ticketId: ticket.id,
      serviceName: ticket.service.name,
    });

    await db.serviceTicket.update({
      where: { id: params.id },
      data: {
        polarCheckoutId: checkoutId,
        status: "awaiting_payment",
      },
    });

    return NextResponse.json({ checkoutUrl, checkoutId });
  } catch (error: any) {
    console.error("Polar checkout error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create checkout" },
      { status: 502 }
    );
  }
}
