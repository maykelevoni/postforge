import { NextResponse } from "next/server";
import { createHmac } from "crypto";
import { db } from "@/lib/db";
import { getSetting } from "@/lib/settings";

function verifyPolarSignature(
  rawBody: string,
  webhookId: string,
  webhookTimestamp: string,
  webhookSignature: string,
  secret: string
): boolean {
  const signedContent = `${webhookId}.${webhookTimestamp}.${rawBody}`;
  const expectedSig = createHmac("sha256", secret)
    .update(signedContent)
    .digest("base64");
  const signatures = webhookSignature.split(" ");
  return signatures.some((sig) => sig === `v1,${expectedSig}`);
}

export async function POST(req: Request) {
  const rawBody = await req.text();

  const webhookId = req.headers.get("webhook-id") ?? "";
  const webhookTimestamp = req.headers.get("webhook-timestamp") ?? "";
  const webhookSignature = req.headers.get("webhook-signature") ?? "";

  let event: any;
  try {
    event = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  // Find the ticket matching the checkout ID
  const checkoutId = event?.data?.id;
  if (!checkoutId) {
    return NextResponse.json({ received: true });
  }

  const ticket = await db.serviceTicket.findFirst({
    where: { polarCheckoutId: checkoutId },
  });

  if (!ticket) {
    return NextResponse.json({ error: "Ticket not found" }, { status: 404 });
  }

  // Verify HMAC signature if secret is configured
  const secret = await getSetting("polar_webhook_secret", ticket.userId);
  if (secret && webhookId && webhookTimestamp && webhookSignature) {
    const valid = verifyPolarSignature(
      rawBody,
      webhookId,
      webhookTimestamp,
      webhookSignature,
      secret
    );
    if (!valid) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }
  }

  // Handle checkout.updated with status succeeded
  if (
    event?.type === "checkout.updated" &&
    event?.data?.status === "succeeded"
  ) {
    await db.serviceTicket.update({
      where: { id: ticket.id },
      data: {
        status: "paid",
        paidAt: new Date(),
        amountPaid: event.data.amount ?? null,
        polarOrderId: event.data.metadata?.orderId ?? null,
      },
    });
  }

  return NextResponse.json({ received: true });
}
