import { getSetting } from "@/lib/settings";
import { db } from "@/lib/db";

interface Newsletter {
  id: string;
  subject: string;
  body: string;
  userId: string;
}

interface Service {
  name: string;
  turnaroundDays: number;
}

interface Ticket {
  clientName: string;
  clientEmail: string;
  service: Service;
  quote?: string;
  deliverables?: string;
}

export async function sendNewsletter(
  newsletter: Newsletter
): Promise<void> {
  const apiKey = await getSetting("systeme_api_key", newsletter.userId);

  if (!apiKey) {
    throw new Error("Systeme.io API key not configured");
  }

  try {
    const response = await fetch("https://api.systeme.io/api/email_campaigns", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": apiKey,
      },
      body: JSON.stringify({
        subject: newsletter.subject,
        body: newsletter.body,
        sender_name: "PostForge",
        send_now: true,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Systeme.io API error: ${error}`);
    }

    // Update newsletter status
    await db.newsletter.update({
      where: { id: newsletter.id },
      data: {
        status: "sent",
        sentAt: new Date(),
      },
    });

    console.log(`Newsletter ${newsletter.id} sent successfully`);
  } catch (error: any) {
    console.error(`Failed to send newsletter ${newsletter.id}:`, error);

    // Update with error
    await db.newsletter.update({
      where: { id: newsletter.id },
      data: {
        status: "failed",
        error: error.message || "Unknown error",
      },
    });

    throw error;
  }
}

export async function publishLandingPage(
  html: string,
  title: string,
  userId: string
): Promise<string> {
  const apiKey = await getSetting("systeme_api_key", userId);

  if (!apiKey) {
    throw new Error("Systeme.io API key not configured");
  }

  try {
    const response = await fetch("https://api.systeme.io/api/funnels", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": apiKey,
      },
      body: JSON.stringify({
        name: title,
        type: "landing_page",
        html,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Systeme.io funnel API error: ${error}`);
    }

    const data = await response.json();
    return data.funnel_url || data.url || "";
  } catch (error: any) {
    console.error("Failed to publish landing page:", error);
    throw error;
  }
}

/**
 * Send a broadcast email via Systeme.io API
 */
async function sendBroadcastEmail(
  email: string,
  subject: string,
  body: string,
  userId: string
): Promise<void> {
  const apiKey = await getSetting("systeme_api_key", userId);

  if (!apiKey) {
    throw new Error("Systeme.io API key not configured");
  }

  const response = await fetch("https://api.systeme.io/api/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-API-Key": apiKey,
    },
    body: JSON.stringify({
      email,
      subject,
      body,
      send_now: true,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Systeme.io broadcast API error: ${error}`);
  }
}

/**
 * Send confirmation email to new lead
 */
export async function sendConfirmationEmail(ticket: Ticket): Promise<void> {
  // Find userId from the service
  const service = await db.service.findFirst({
    where: {
      name: ticket.service.name,
    },
  });

  if (!service) {
    throw new Error("Service not found");
  }

  const subject = "Got your request — we'll be in touch soon";
  const body = `
Hi ${ticket.clientName},

Thanks for your interest in our ${ticket.service.name} service!

We've received your request and a member of our team will review it shortly. You can expect to receive a personalized quote within ${ticket.service.turnaroundDays} business days.

If you have any questions in the meantime, feel free to reply to this email.

Best regards
  `.trim();

  await sendBroadcastEmail(
    ticket.clientEmail,
    subject,
    body,
    service.userId
  );

  console.log(`Confirmation email sent to ${ticket.clientEmail}`);
}

/**
 * Send quote email to lead
 */
export async function sendQuoteEmail(ticket: Ticket): Promise<void> {
  if (!ticket.quote) {
    throw new Error("Quote is required");
  }

  const service = await db.service.findFirst({
    where: {
      name: ticket.service.name,
    },
  });

  if (!service) {
    throw new Error("Service not found");
  }

  const subject = `Your quote for ${ticket.service.name}`;
  const body = `
Hi ${ticket.clientName},

Thank you for your interest in ${ticket.service.name}!

Here's your personalized quote:

${ticket.quote}

If you have any questions or would like to proceed, simply reply to this email.

Best regards
  `.trim();

  await sendBroadcastEmail(
    ticket.clientEmail,
    subject,
    body,
    service.userId
  );

  console.log(`Quote email sent to ${ticket.clientEmail}`);
}

/**
 * Send delivery email with deliverables
 */
export async function sendDeliveryEmail(ticket: Ticket): Promise<void> {
  if (!ticket.deliverables) {
    throw new Error("Deliverables are required");
  }

  const service = await db.service.findFirst({
    where: {
      name: ticket.service.name,
    },
  });

  if (!service) {
    throw new Error("Service not found");
  }

  const subject = `Your ${ticket.service.name} deliverables are ready`;
  const body = `
Hi ${ticket.clientName},

Great news! Your ${ticket.service.name} deliverables are ready.

Here are your deliverables:

${ticket.deliverables}

Please review the deliverables and let us know if you have any questions or need any adjustments.

Best regards
  `.trim();

  await sendBroadcastEmail(
    ticket.clientEmail,
    subject,
    body,
    service.userId
  );

  console.log(`Delivery email sent to ${ticket.clientEmail}`);
}
