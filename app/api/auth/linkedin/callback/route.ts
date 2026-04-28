import { setSetting, getSetting } from "@/lib/settings";
import { redirect } from "next/navigation";

const TOKEN_URL = "https://www.linkedin.com/oauth/v2/accessToken";
const USERINFO_URL = "https://api.linkedin.com/v2/userinfo";
const SIXTY_DAYS_MS = 60 * 24 * 60 * 60 * 1000;

export async function GET(req: Request) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const error = url.searchParams.get("error");

  if (error || !code || !state) {
    redirect("/settings?linkedin=error");
  }

  let userId: string;
  try {
    userId = Buffer.from(state, "base64").toString("utf-8");
  } catch {
    redirect("/settings?linkedin=error");
  }

  try {
    const clientId =
      (await getSetting("linkedin_client_id", userId)) ||
      process.env.LINKEDIN_CLIENT_ID ||
      "";
    const clientSecret =
      (await getSetting("linkedin_client_secret", userId)) ||
      process.env.LINKEDIN_CLIENT_SECRET ||
      "";

    const redirectUri = `${process.env.NEXTAUTH_URL}/api/auth/linkedin/callback`;

    const tokenParams = new URLSearchParams({
      grant_type: "authorization_code",
      code,
      redirect_uri: redirectUri,
      client_id: clientId,
      client_secret: clientSecret,
    });

    const tokenRes = await fetch(TOKEN_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: tokenParams.toString(),
    });

    if (!tokenRes.ok) {
      redirect("/settings?linkedin=error");
    }

    const tokenData = await tokenRes.json();

    const userinfoRes = await fetch(USERINFO_URL, {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });

    if (!userinfoRes.ok) {
      redirect("/settings?linkedin=error");
    }

    const userinfo = await userinfoRes.json();
    // sub may be "urn:li:person:XXXX" or just "XXXX"
    const personId: string = (userinfo.sub as string).replace(
      "urn:li:person:",
      ""
    );

    const expiresAt = Date.now() + SIXTY_DAYS_MS;

    await Promise.all([
      setSetting("linkedin_access_token", tokenData.access_token, userId),
      tokenData.refresh_token
        ? setSetting("linkedin_refresh_token", tokenData.refresh_token, userId)
        : Promise.resolve(),
      setSetting("linkedin_token_expires_at", String(expiresAt), userId),
      setSetting("linkedin_person_urn", personId, userId),
    ]);
  } catch {
    redirect("/settings?linkedin=error");
  }

  redirect("/settings?linkedin=connected");
}
