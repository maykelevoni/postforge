import { BrevoClient } from "@getbrevo/brevo";
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

async function getBrevoClient(
  userId: string
): Promise<{ client: BrevoClient; fromEmail: string; fromName: string }> {
  const apiKey = await getSetting("brevo_api_key", userId);
  if (!apiKey) throw new Error("Brevo API key not configured");

  const fromEmail = await getSetting("brevo_from_email", userId);
  if (!fromEmail) throw new Error("Brevo sender email (brevo_from_email) not configured");

  const fromName = (await getSetting("brevo_from_name", userId)) || "PostForge";

  const client = new BrevoClient({ apiKey: apiKey as string });

  return { client, fromEmail: fromEmail as string, fromName: fromName as string };
}

export async function sendConfirmationEmail(ticket: Ticket): Promise<void> {
  const { client, fromEmail, fromName } = await getBrevoClient(ticket.userId);

  await client.transactionalEmails.sendTransacEmail({
    sender: { email: fromEmail, name: fromName },
    to: [{ email: ticket.clientEmail, name: ticket.clientName }],
    subject: "Got your request — we'll be in touch soon",
    htmlContent: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
        <h2 style="color: #1a1a1a;">We received your request!</h2>
        <p>Hi ${ticket.clientName},</p>
        <p>Thanks for your interest in our <strong>${ticket.service.name}</strong> service!</p>
        <p>
          We've received your request and a member of our team will review it shortly.
          You can expect to receive a personalized quote within
          <strong>${ticket.service.turnaroundDays} business day${ticket.service.turnaroundDays === 1 ? "" : "s"}</strong>.
        </p>
        <p>If you have any questions in the meantime, feel free to reply to this email.</p>
        <p style="margin-top: 32px;">Best regards</p>
      </div>
    `.trim(),
  });

  console.log(`Confirmation email sent to ${ticket.clientEmail}`);
}

export async function sendQuoteEmail(ticket: Ticket): Promise<void> {
  if (!ticket.quote) throw new Error("Quote is required");

  const { client, fromEmail, fromName } = await getBrevoClient(ticket.userId);

  await client.transactionalEmails.sendTransacEmail({
    sender: { email: fromEmail, name: fromName },
    to: [{ email: ticket.clientEmail, name: ticket.clientName }],
    subject: `Your quote for ${ticket.service.name}`,
    htmlContent: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
        <h2 style="color: #1a1a1a;">Your personalized quote</h2>
        <p>Hi ${ticket.clientName},</p>
        <p>Thank you for your interest in <strong>${ticket.service.name}</strong>!</p>
        <p>Here's your personalized quote:</p>
        <div style="background: #f5f5f5; border-left: 4px solid #0070f3; padding: 16px; margin: 16px 0; white-space: pre-wrap;">${ticket.quote}</div>
        <p>If you have any questions or would like to proceed, simply reply to this email.</p>
        <p style="margin-top: 32px;">Best regards</p>
      </div>
    `.trim(),
  });

  console.log(`Quote email sent to ${ticket.clientEmail}`);
}

export async function sendDeliveryEmail(ticket: Ticket): Promise<void> {
  if (!ticket.deliverables) throw new Error("Deliverables are required");

  const { client, fromEmail, fromName } = await getBrevoClient(ticket.userId);

  await client.transactionalEmails.sendTransacEmail({
    sender: { email: fromEmail, name: fromName },
    to: [{ email: ticket.clientEmail, name: ticket.clientName }],
    subject: `Your ${ticket.service.name} deliverables are ready`,
    htmlContent: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
        <h2 style="color: #1a1a1a;">Your deliverables are ready!</h2>
        <p>Hi ${ticket.clientName},</p>
        <p>Great news! Your <strong>${ticket.service.name}</strong> deliverables are ready.</p>
        <p>Here are your deliverables:</p>
        <div style="background: #f5f5f5; border-left: 4px solid #22c55e; padding: 16px; margin: 16px 0; white-space: pre-wrap;">${ticket.deliverables}</div>
        <p>Please review and let us know if you need any adjustments.</p>
        <p style="margin-top: 32px;">Best regards</p>
      </div>
    `.trim(),
  });

  console.log(`Delivery email sent to ${ticket.clientEmail}`);
}

export async function sendNewsletter(newsletter: Newsletter): Promise<void> {
  const { client, fromEmail, fromName } = await getBrevoClient(newsletter.userId);

  const subscribers = await db.subscriber.findMany({
    where: { userId: newsletter.userId },
    select: { email: true, name: true },
  });

  if (subscribers.length === 0) {
    console.warn(`Newsletter ${newsletter.id}: no subscribers found`);
    await db.newsletter.update({
      where: { id: newsletter.id },
      data: { status: "sent", sentAt: new Date() },
    });
    return;
  }

  try {
    const sendResults = await Promise.allSettled(
      subscribers.map((subscriber) =>
        client.transactionalEmails.sendTransacEmail({
          sender: { email: fromEmail, name: fromName },
          to: [{ email: subscriber.email, name: subscriber.name ?? undefined }],
          subject: newsletter.subject,
          htmlContent: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
              ${newsletter.body}
            </div>
          `.trim(),
        })
      )
    );

    const failures = sendResults.filter((r) => r.status === "rejected");
    if (failures.length > 0) {
      console.warn(`Newsletter ${newsletter.id}: ${failures.length}/${subscribers.length} emails failed`);
    }

    console.log(`Newsletter ${newsletter.id} sent: ${sendResults.length - failures.length}/${subscribers.length} delivered`);

    await db.newsletter.update({
      where: { id: newsletter.id },
      data: { status: "sent", sentAt: new Date() },
    });
  } catch (error: any) {
    console.error(`Failed to send newsletter ${newsletter.id}:`, error);
    await db.newsletter.update({
      where: { id: newsletter.id },
      data: { status: "failed", error: error.message || "Unknown error" },
    });
    throw error;
  }
}
