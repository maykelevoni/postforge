import { NextResponse } from "next/server";
import { getSetting } from "@/lib/settings";
import { db } from "@/lib/db";
import { sendConfirmationEmail } from "@/worker/posting/systeme";

interface SystemeWebhookPayload {
  contact: {
    first_name: string;
    email: string;
  };
  fields: {
    niche?: string;
    service_id?: string;
    message?: string;
  };
  funnel_url?: string;
}

export async function POST(req: Request) {
  try {
    // Check webhook token for security
    const token = req.headers.get("x-systeme-token");

    // Get the first user's webhook token (for MVP, single-user setup)
    const users = await db.user.findMany({
      take: 1,
    });

    if (users.length === 0) {
      console.error("No users found in database");
      return NextResponse.json({ received: true }, { status: 200 });
    }

    const user = users[0];
    const expectedToken = await getSetting("systeme_webhook_token", user.id);

    if (!token || token !== expectedToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse webhook payload
    const body: SystemeWebhookPayload = await req.json();
    const { contact, fields, funnel_url } = body;

    if (!contact?.email) {
      console.error("Missing email in webhook payload");
      return NextResponse.json({ received: true }, { status: 200 });
    }

    // Find the service by service_id or match by funnel URL
    let service = null;

    if (fields?.service_id) {
      service = await db.service.findFirst({
        where: {
          id: fields.service_id,
        },
      });
    }

    // Fallback: try to match by funnel URL if service not found
    if (!service && funnel_url) {
      service = await db.service.findFirst({
        where: {
          funnelUrl: funnel_url,
        },
      });
    }

    // Fallback: use first active service if still not found
    if (!service) {
      service = await db.service.findFirst({
        where: {
          status: "active",
        },
      });
    }

    // Create the service ticket
    const ticket = await db.serviceTicket.create({
      data: {
        userId: user.id,
        serviceId: service?.id || "",
        clientName: contact.first_name || "Client",
        clientEmail: contact.email,
        niche: fields?.niche || "General",
        message: fields?.message || "",
        source: funnel_url || "Systeme.io",
        status: "new",
      },
      include: {
        service: true,
      },
    });

    // Send confirmation email
    try {
      await sendConfirmationEmail({
        clientName: ticket.clientName,
        clientEmail: ticket.clientEmail,
        service: ticket.service,
      });
    } catch (emailError) {
      console.error("Failed to send confirmation email:", emailError);
      // Don't fail the webhook if email fails
    }

    // Always return 200 to Systeme.io
    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Error processing Systeme.io webhook:", error);
    // Always return 200 to Systeme.io even on errors
    return NextResponse.json({ received: true }, { status: 200 });
  }
}
