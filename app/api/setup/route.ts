import { NextResponse } from "next/server";
import { randomBytes } from "crypto";
import { writeFileSync, mkdirSync } from "fs";

export async function POST(request: Request) {
  // Block if already configured (prevent re-setup)
  if (process.env.DATABASE_URL && process.env.AUTH_SECRET) {
    return NextResponse.json({ error: "Already configured" }, { status: 403 });
  }

  const { databaseUrl, nextauthUrl } = await request.json();

  // Validate DB URL format
  if (
    typeof databaseUrl !== "string" ||
    (!databaseUrl.startsWith("postgresql://") && !databaseUrl.startsWith("postgres://"))
  ) {
    return NextResponse.json(
      { error: "Invalid database URL. Must start with postgresql:// or postgres://" },
      { status: 400 }
    );
  }

  const authSecret = randomBytes(32).toString("base64");
  const appUrl = (typeof nextauthUrl === "string" && nextauthUrl.trim())
    ? nextauthUrl.trim()
    : "http://localhost:3000";

  const configDir = "/app/config";
  const configPath = `${configDir}/.env`;

  const content = [
    `DATABASE_URL="${databaseUrl}"`,
    `AUTH_SECRET="${authSecret}"`,
    `NEXTAUTH_URL="${appUrl}"`,
  ].join("\n") + "\n";

  try {
    mkdirSync(configDir, { recursive: true });
    writeFileSync(configPath, content, { mode: 0o600 });
  } catch (err) {
    console.error("[setup] Failed to write config:", err);
    return NextResponse.json({ error: "Failed to save configuration" }, { status: 500 });
  }

  // Respond first, then exit — Docker will restart via restart: unless-stopped
  const response = NextResponse.json({ success: true });
  setTimeout(() => {
    console.log("[setup] Config saved. Restarting...");
    process.exit(0);
  }, 300);

  return response;
}
