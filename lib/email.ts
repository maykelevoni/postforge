import { Resend } from "resend";
import { getSetting } from "@/lib/settings";
import { db } from "@/lib/db";

interface Service {
  name: string;
  turnaroundDays: number;
}

interface Ticket {
  clientName: string;
  clientEmail: string;
  service: Service;
  userId: string;
  quote?: string;
  deliverables?: string;
}

interface Newsletter {
  id: string;
  subject: string;
  body: string;
  userId: string;
}

/**
 * Build a Resend client from the user's stored API key.
 * Returns null (with reason) if the key is not configured.
 */
async function getResendClient(
  userId: string
): Promise<{ resend: Resend; fromEmail: string }> {
  const apiKey = await getSetting("resend_api_key", userId);
  if (!apiKey) {
    throw new Error("Resend API key not configured");
  }

  const fromEmail = await getSetting("resend_from_email", userId);
  if (!fromEmail) {
    throw new Error("Resend sender email (resend_from_email) not configured");
  }

  return { resend: new Resend(apiKey), fromEmail: fromEmail as string };
}

/**
 * Send a confirmation email to a new lead after form submission.
 */
export async function sendConfirmationEmail(ticket: Ticket): Promise<void> {
  const client = await getResendClient(ticket.userId);

  const subject = "Got your request — we'll be in touch soon";
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
      <h2 style="color: #1a1a1a;">We received your request!</h2>
      <p>Hi ${ticket.clientName},</p>
      <p>
        Thanks for your interest in our <strong>${ticket.service.name}</strong> service!
      </p>
      <p>
        We've received your request and a member of our team will review it shortly.
        You can expect to receive a personalized quote within
        <strong>${ticket.service.turnaroundDays} business day${ticket.service.turnaroundDays === 1 ? "" : "s"}</strong>.
      </p>
      <p>If you have any questions in the meantime, feel free to reply to this email.</p>
      <p style="margin-top: 32px;">Best regards</p>
    </div>
  `.trim();

  try {
    const { error } = await client.resend.emails.send({
      from: client.fromEmail,
      to: ticket.clientEmail,
      subject,
      html,
    });

    if (error) {
      throw new Error(`Resend API error: ${error.message}`);
    }

    console.log(`Confirmation email sent to ${ticket.clientEmail}`);
  } catch (error: any) {
    console.error(`Failed to send confirmation email to ${ticket.clientEmail}:`, error);
    throw new Error(`Failed to send confirmation email: ${error.message || "Unknown error"}`);
  }
}

/**
 * Send a quote email to a lead.
 */
export async function sendQuoteEmail(ticket: Ticket): Promise<void> {
  if (!ticket.quote) {
    throw new Error("Quote is required");
  }

  const client = await getResendClient(ticket.userId);

  const subject = `Your quote for ${ticket.service.name}`;
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
      <h2 style="color: #1a1a1a;">Your personalized quote</h2>
      <p>Hi ${ticket.clientName},</p>
      <p>Thank you for your interest in <strong>${ticket.service.name}</strong>!</p>
      <p>Here's your personalized quote:</p>
      <div style="background: #f5f5f5; border-left: 4px solid #0070f3; padding: 16px; margin: 16px 0; white-space: pre-wrap;">${ticket.quote}</div>
      <p>If you have any questions or would like to proceed, simply reply to this email.</p>
      <p style="margin-top: 32px;">Best regards</p>
    </div>
  `.trim();

  try {
    const { error } = await client.resend.emails.send({
      from: client.fromEmail,
      to: ticket.clientEmail,
      subject,
      html,
    });

    if (error) {
      throw new Error(`Resend API error: ${error.message}`);
    }

    console.log(`Quote email sent to ${ticket.clientEmail}`);
  } catch (error: any) {
    console.error(`Failed to send quote email to ${ticket.clientEmail}:`, error);
    throw new Error(`Failed to send quote email: ${error.message || "Unknown error"}`);
  }
}

/**
 * Send a delivery email with deliverables to the client.
 */
export async function sendDeliveryEmail(ticket: Ticket): Promise<void> {
  if (!ticket.deliverables) {
    throw new Error("Deliverables are required");
  }

  const client = await getResendClient(ticket.userId);

  const subject = `Your ${ticket.service.name} deliverables are ready`;
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
      <h2 style="color: #1a1a1a;">Your deliverables are ready!</h2>
      <p>Hi ${ticket.clientName},</p>
      <p>Great news! Your <strong>${ticket.service.name}</strong> deliverables are ready.</p>
      <p>Here are your deliverables:</p>
      <div style="background: #f5f5f5; border-left: 4px solid #22c55e; padding: 16px; margin: 16px 0; white-space: pre-wrap;">${ticket.deliverables}</div>
      <p>Please review the deliverables and let us know if you have any questions or need any adjustments.</p>
      <p style="margin-top: 32px;">Best regards</p>
    </div>
  `.trim();

  try {
    const { error } = await client.resend.emails.send({
      from: client.fromEmail,
      to: ticket.clientEmail,
      subject,
      html,
    });

    if (error) {
      throw new Error(`Resend API error: ${error.message}`);
    }

    console.log(`Delivery email sent to ${ticket.clientEmail}`);
  } catch (error: any) {
    console.error(`Failed to send delivery email to ${ticket.clientEmail}:`, error);
    throw new Error(`Failed to send delivery email: ${error.message || "Unknown error"}`);
  }
}

/**
 * Send a newsletter to all subscribers of the user via Resend.
 * Queries the Subscriber table, batch-sends one email per subscriber,
 * then updates newsletter status to "sent" or "failed".
 */
export async function sendNewsletter(newsletter: Newsletter): Promise<void> {
  const client = await getResendClient(newsletter.userId);

  // Fetch all subscribers for this user
  const subscribers = await db.subscriber.findMany({
    where: { userId: newsletter.userId },
    select: { email: true, name: true },
  });

  if (subscribers.length === 0) {
    console.warn(`Newsletter ${newsletter.id}: no subscribers found for user ${newsletter.userId}`);
    // Still mark as sent — nothing to deliver
    await db.newsletter.update({
      where: { id: newsletter.id },
      data: { status: "sent", sentAt: new Date() },
    });
    return;
  }

  try {
    // Batch-send one email per subscriber
    const sendResults = await Promise.allSettled(
      subscribers.map((subscriber) =>
        client.resend.emails.send({
          from: client.fromEmail,
          to: subscriber.email,
          subject: newsletter.subject,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
              ${newsletter.body}
            </div>
          `.trim(),
        })
      )
    );

    const failures = sendResults.filter((r) => r.status === "rejected");
    if (failures.length > 0) {
      console.warn(
        `Newsletter ${newsletter.id}: ${failures.length}/${subscribers.length} emails failed`
      );
    }

    console.log(
      `Newsletter ${newsletter.id} sent: ${sendResults.length - failures.length}/${subscribers.length} delivered`
    );

    await db.newsletter.update({
      where: { id: newsletter.id },
      data: { status: "sent", sentAt: new Date() },
    });
  } catch (error: any) {
    console.error(`Failed to send newsletter ${newsletter.id}:`, error);

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
