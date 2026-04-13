import { db } from "@/lib/db";
import { getSetting } from "@/lib/settings";
import { postToPlatform } from "./post-bridge";
import { sendNewsletter } from "./systeme";

export async function postScheduledPieces(userId: string): Promise<void> {
  console.log(`Checking for scheduled content pieces for user ${userId}...`);

  const gateModeSetting = await getSetting("gate_mode", userId);
  const gateMode = gateModeSetting === "true";

  const now = new Date();

  // Find due pieces that are approved (or gate mode is off)
  const duePieces = await db.contentPiece.findMany({
    where: {
      userId,
      status: "scheduled",
      scheduledAt: {
        lte: now,
      },
      approved: !gateMode ? undefined : true,
    },
  });

  console.log(`Found ${duePieces.length} due content pieces`);

  for (const piece of duePieces) {
    try {
      const postId = await postToPlatform({
        platform: piece.platform,
        content: piece.content,
        mediaUrl: piece.videoUrl || piece.imageUrl || undefined,
        userId: piece.userId,
      });

      await db.contentPiece.update({
        where: { id: piece.id },
        data: {
          status: "published",
          postBridgeId: postId,
          postedAt: now,
        },
      });

      console.log(`Published content piece ${piece.id} to ${piece.platform}`);
    } catch (error: any) {
      console.error(`Failed to publish content piece ${piece.id}:`, error);

      // Retry once after 30 minutes
      const retryAt = new Date(now.getTime() + 30 * 60 * 1000);

      await db.contentPiece.update({
        where: { id: piece.id },
        data: {
          scheduledAt: retryAt,
          error: error.message || "Unknown error",
        },
      });

      console.log(`Scheduled retry for piece ${piece.id} at ${retryAt}`);
    }
  }
}

export async function postScheduledNewsletters(userId: string): Promise<void> {
  console.log(`Checking for scheduled newsletters for user ${userId}...`);

  const gateModeSetting = await getSetting("gate_mode", userId);
  const gateMode = gateModeSetting === "true";

  const now = new Date();

  // Find due newsletters that are approved (or gate mode is off)
  const dueNewsletters = await db.newsletter.findMany({
    where: {
      userId,
      status: "scheduled",
      scheduledAt: {
        lte: now,
      },
      approved: !gateMode ? undefined : true,
    },
  });

  console.log(`Found ${dueNewsletters.length} due newsletters`);

  for (const newsletter of dueNewsletters) {
    try {
      await sendNewsletter(newsletter);
      console.log(`Sent newsletter ${newsletter.id}`);
    } catch (error: any) {
      console.error(`Failed to send newsletter ${newsletter.id}:`, error);

      // Retry once after 30 minutes
      const retryAt = new Date(now.getTime() + 30 * 60 * 1000);

      await db.newsletter.update({
        where: { id: newsletter.id },
        data: {
          scheduledAt: retryAt,
          error: error.message || "Unknown error",
        },
      });

      console.log(`Scheduled retry for newsletter ${newsletter.id} at ${retryAt}`);
    }
  }
}

export async function scheduleContent(userId: string): Promise<void> {
  console.log(`Scheduling content for user ${userId}...`);

  // Get all schedule entries
  const scheduleEntries = await db.scheduleEntry.findMany({
    where: {
      userId,
      active: true,
    },
  });

  if (scheduleEntries.length === 0) {
    console.log("No active schedule entries found");
    return;
  }

  const now = new Date();
  const gateModeSetting = await getSetting("gate_mode", userId);
  const gateMode = gateModeSetting === "true";

  for (const entry of scheduleEntries) {
    // Find unscheduled content pieces for this platform
    const unscheduledPieces = await db.contentPiece.findMany({
      where: {
        userId,
        platform: entry.platform,
        status: {
          in: ["draft"],
        },
        scheduledAt: null,
        approved: !gateMode ? undefined : true,
      },
      take: 1,
    });

    if (unscheduledPieces.length === 0) {
      continue;
    }

    // Calculate next scheduled time based on schedule entry
    const [hours, minutes] = entry.time.split(":").map(Number);
    const daysOfWeek = JSON.parse(entry.daysOfWeek || "[1,2,3,4,5]");

    let nextScheduledDate = new Date();
    nextScheduledDate.setHours(hours, minutes, 0, 0);

    // Find next occurrence
    while (true) {
      if (daysOfWeek.includes(nextScheduledDate.getDay()) && nextScheduledDate > now) {
        break;
      }
      nextScheduledDate.setDate(nextScheduledDate.getDate() + 1);
      nextScheduledDate.setHours(hours, minutes, 0, 0);
    }

    // Update the piece with scheduled time
    await db.contentPiece.update({
      where: { id: unscheduledPieces[0].id },
      data: {
        scheduledAt: nextScheduledDate,
        status: "scheduled",
      },
    });

    console.log(`Scheduled ${entry.platform} piece for ${nextScheduledDate.toISOString()}`);
  }

  // Do the same for newsletters
  const emailEntry = scheduleEntries.find(e => e.platform === "email");
  if (emailEntry) {
    const unscheduledNewsletters = await db.newsletter.findMany({
      where: {
        userId,
        status: {
          in: ["draft"],
        },
        scheduledAt: null,
        approved: !gateMode ? undefined : true,
      },
      take: 1,
    });

    if (unscheduledNewsletters.length > 0) {
      const [hours, minutes] = emailEntry.time.split(":").map(Number);
      const daysOfWeek = JSON.parse(emailEntry.daysOfWeek || "[1,2,3,4,5]");

      let nextScheduledDate = new Date();
      nextScheduledDate.setHours(hours, minutes, 0, 0);

      while (true) {
        if (daysOfWeek.includes(nextScheduledDate.getDay()) && nextScheduledDate > now) {
          break;
        }
        nextScheduledDate.setDate(nextScheduledDate.getDate() + 1);
        nextScheduledDate.setHours(hours, minutes, 0, 0);
      }

      await db.newsletter.update({
        where: { id: unscheduledNewsletters[0].id },
        data: {
          scheduledAt: nextScheduledDate,
          status: "scheduled",
        },
      });

      console.log(`Scheduled newsletter for ${nextScheduledDate.toISOString()}`);
    }
  }
}
