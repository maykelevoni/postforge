import cron from "node-cron";
import { db } from "@/lib/db";
import { seedDefaults } from "@/lib/seeds";
import { runResearch } from "./research";
import { runDiscover } from "./discover";
import { runContent } from "./content";
import { postScheduledPieces, postScheduledNewsletters } from "./posting/scheduler";

let scheduledTasks: cron.ScheduledTask[] = [];

async function runForAllUsers(
  fn: (userId: string) => Promise<void>,
  jobName: string
): Promise<void> {
  console.log(`\n========== ${jobName} started ==========`);

  try {
    const users = await db.user.findMany({
      select: { id: true },
    });

    console.log(`Found ${users.length} users to process`);

    for (const user of users) {
      try {
        await fn(user.id);
      } catch (error) {
        console.error(`Error processing user ${user.id} for ${jobName}:`, error);
      }
    }

    console.log(`========== ${jobName} completed ==========\n`);
  } catch (error) {
    console.error(`Error in ${jobName}:`, error);
  }
}

async function initializeSchedules(): Promise<void> {
  console.log("Initializing worker schedules...");

  // Research: 06:00 UTC every day
  scheduledTasks.push(
    cron.schedule("0 6 * * *", () => {
      runForAllUsers(runResearch, "Research");
    })
  );

  // Discover: 07:00 UTC every day
  scheduledTasks.push(
    cron.schedule("0 7 * * *", () => {
      runForAllUsers(runDiscover, "Discover");
    })
  );

  // Content: Dynamic daily_run_hour from DB (check each time)
  const contentTask = cron.schedule("0 * * * *", async () => {
    const now = new Date();
    const currentHour = now.getUTCHours();

    // Get all users and check their daily_run_hour setting
    const users = await db.user.findMany({
      select: { id: true },
    });

    for (const user of users) {
      try {
        const { getSetting } = await import("@/lib/settings");
        const dailyRunHour = await getSetting("daily_run_hour", user.id);
        const hour = parseInt(dailyRunHour || "9", 10);

        if (currentHour === hour) {
          console.log(`Running content generation for user ${user.id} at ${currentHour}:00 UTC`);
          await runContent(user.id);
        }
      } catch (error) {
        console.error(`Error checking content schedule for user ${user.id}:`, error);
      }
    }
  });

  scheduledTasks.push(contentTask);

  // Posting: Every 5 minutes
  scheduledTasks.push(
    cron.schedule("*/5 * * * *", () => {
      runForAllUsers(async (userId) => {
        await postScheduledPieces(userId);
        await postScheduledNewsletters(userId);
      }, "Posting");
    })
  );

  console.log(`Registered ${scheduledTasks.length} cron jobs`);
}

export async function triggerFullRun(userId: string): Promise<void> {
  console.log(`Triggering full engine run for user ${userId}...`);

  try {
    await runResearch(userId);
    await runDiscover(userId);
    await runContent(userId);
    await postScheduledPieces(userId);
    await postScheduledNewsletters(userId);

    console.log(`Full engine run complete for user ${userId}`);
  } catch (error) {
    console.error(`Error in full run for user ${userId}:`, error);
    throw error;
  }
}

async function shutdown(): Promise<void> {
  console.log("\nShutting down worker...");

  scheduledTasks.forEach((task) => task.stop());
  scheduledTasks = [];

  await db.$disconnect();

  console.log("Worker shut down complete");
  process.exit(0);
}

async function main(): Promise<void> {
  console.log("PostForge Worker starting...");

  // Seed default schedules for all users on startup
  try {
    const users = await db.user.findMany({
      select: { id: true },
    });

    console.log(`Seeding default schedules for ${users.length} users...`);

    for (const user of users) {
      try {
        await seedDefaults(user.id);
        console.log(`Seeded defaults for user ${user.id}`);
      } catch (error) {
        console.error(`Error seeding defaults for user ${user.id}:`, error);
      }
    }
  } catch (error) {
    console.error("Error seeding defaults:", error);
  }

  // Initialize cron schedules
  await initializeSchedules();

  console.log("Worker started successfully");

  // Handle graceful shutdown
  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);
}

// Start the worker
main().catch((error) => {
  console.error("Failed to start worker:", error);
  process.exit(1);
});
