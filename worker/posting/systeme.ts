import { getSetting } from "@/lib/settings";
import { db } from "@/lib/db";

interface Newsletter {
  id: string;
  subject: string;
  body: string;
  userId: string;
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
