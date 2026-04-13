import { db } from "@/lib/db";

export async function seedDefaults(userId: string): Promise<void> {
  const existing = await db.scheduleEntry.count({
    where: { userId },
  });

  if (existing > 0) {
    return;
  }

  const defaults = [
    {
      userId,
      platform: "twitter",
      time: "09:00",
      daysOfWeek: "[1,2,3,4,5]", // Mon-Fri
    },
    {
      userId,
      platform: "linkedin",
      time: "10:00",
      daysOfWeek: "[1,2,3,4,5]", // Mon-Fri
    },
    {
      userId,
      platform: "reddit",
      time: "12:00",
      daysOfWeek: "[2,4]", // Tue/Thu
    },
    {
      userId,
      platform: "instagram",
      time: "14:00",
      daysOfWeek: "[1,2,3,4,5]", // Mon-Fri
    },
    {
      userId,
      platform: "tiktok",
      time: "17:00",
      daysOfWeek: "[1,2,3,4,5]", // Mon-Fri
    },
    {
      userId,
      platform: "email",
      time: "08:00",
      daysOfWeek: "[1,2,3,4,5]", // Mon-Fri
    },
  ];

  await db.scheduleEntry.createMany({
    data: defaults,
  });
}
