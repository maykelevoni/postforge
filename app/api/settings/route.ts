import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getSetting, setSetting, getSettings } from "@/lib/settings";
import { db } from "@/lib/db";

const ALL_SETTING_KEYS = [
  "openrouter_api_key",
  "openrouter_model",
  "falai_api_key",
  "brevo_api_key",
  "brevo_from_email",
  "brevo_from_name",
  "youtube_api_key",
  "newsapi_key",
  "research_keywords",
  "research_subreddits",
  "timezone",
  "gate_mode",
  "daily_run_hour",
  "linkedin_access_token",
  "linkedin_person_urn",
  "linkedin_client_id",
  "linkedin_client_secret",
];

export async function GET() {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const settings = await getSettings(ALL_SETTING_KEYS, session.user.id);

  return NextResponse.json(settings);
}

export async function POST(req: Request) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { settings } = await req.json();

  if (!Array.isArray(settings)) {
    return NextResponse.json({ error: "Invalid settings format" }, { status: 400 });
  }

  // Bulk upsert settings
  for (const { key, value } of settings) {
    await setSetting(key, value, session.user.id);
  }

  // Also update schedule entries if provided
  const scheduleSettings = settings.filter(s =>
    s.key.startsWith("schedule_")
  );

  for (const setting of scheduleSettings) {
    const [_, platform, field] = setting.key.split("_");
    const daysOfWeek = setting.key.includes("days") ? setting.value : undefined;
    const time = setting.key.includes("time") ? setting.value : undefined;
    const active = setting.key.includes("active") ? setting.value === "true" : undefined;

    const existing = await db.scheduleEntry.findFirst({
      where: {
        userId: session.user.id,
        platform,
      },
    });

    if (existing) {
      await db.scheduleEntry.update({
        where: { id: existing.id },
        data: {
          ...(daysOfWeek !== undefined && { daysOfWeek }),
          ...(time !== undefined && { time }),
          ...(active !== undefined && { active }),
        },
      });
    }
  }

  return NextResponse.json({ ok: true });
}

export async function DELETE(req: Request) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { keys } = await req.json();

  if (!Array.isArray(keys)) {
    return NextResponse.json({ error: "Invalid keys format" }, { status: 400 });
  }

  await db.setting.deleteMany({
    where: { userId: session.user.id, key: { in: keys } },
  });

  return NextResponse.json({ ok: true });
}
