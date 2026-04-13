import { db } from "@/lib/db";

export async function getSetting(
  key: string,
  userId: string
): Promise<string | null> {
  const setting = await db.setting.findUnique({
    where: {
      userId_key: {
        userId,
        key,
      },
    },
  });

  return setting?.value ?? null;
}

export async function setSetting(
  key: string,
  value: string,
  userId: string
): Promise<void> {
  await db.setting.upsert({
    where: {
      userId_key: {
        userId,
        key,
      },
    },
    create: {
      userId,
      key,
      value,
    },
    update: {
      value,
    },
  });
}

export async function getSettings(
  keys: string[],
  userId: string
): Promise<Record<string, string>> {
  const settings = await db.setting.findMany({
    where: {
      userId,
      key: {
        in: keys,
      },
    },
  });

  return settings.reduce(
    (acc, setting) => {
      acc[setting.key] = setting.value;
      return acc;
    },
    {} as Record<string, string>
  );
}
