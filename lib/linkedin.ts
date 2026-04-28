import { getSetting, setSetting, getSettings } from "@/lib/settings";

const UGC_POSTS_URL = "https://api.linkedin.com/v2/ugcPosts";
const TOKEN_URL = "https://www.linkedin.com/oauth/v2/accessToken";
const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;

interface LinkedInTokens {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
  personUrn: string;
  clientId: string;
  clientSecret: string;
}

export async function getLinkedInTokens(
  userId: string
): Promise<LinkedInTokens | null> {
  const settings = await getSettings(
    [
      "linkedin_access_token",
      "linkedin_refresh_token",
      "linkedin_token_expires_at",
      "linkedin_person_urn",
      "linkedin_client_id",
      "linkedin_client_secret",
    ],
    userId
  );

  const {
    linkedin_access_token,
    linkedin_refresh_token,
    linkedin_token_expires_at,
    linkedin_person_urn,
    linkedin_client_id,
    linkedin_client_secret,
  } = settings;

  if (
    !linkedin_access_token ||
    !linkedin_refresh_token ||
    !linkedin_token_expires_at ||
    !linkedin_person_urn ||
    !linkedin_client_id ||
    !linkedin_client_secret
  ) {
    return null;
  }

  return {
    accessToken: linkedin_access_token,
    refreshToken: linkedin_refresh_token,
    expiresAt: Number(linkedin_token_expires_at),
    personUrn: linkedin_person_urn,
    clientId: linkedin_client_id,
    clientSecret: linkedin_client_secret,
  };
}

export async function refreshLinkedInToken(userId: string): Promise<string> {
  const tokens = await getLinkedInTokens(userId);
  if (!tokens) {
    throw new Error("LinkedIn token expired — reconnect in Settings");
  }

  const params = new URLSearchParams({
    grant_type: "refresh_token",
    refresh_token: tokens.refreshToken,
    client_id: tokens.clientId,
    client_secret: tokens.clientSecret,
  });

  const res = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: params.toString(),
  });

  if (!res.ok) {
    throw new Error("LinkedIn token expired — reconnect in Settings");
  }

  const data = await res.json();
  const newExpiresAt = Date.now() + data.expires_in * 1000;

  await Promise.all([
    setSetting("linkedin_access_token", data.access_token, userId),
    setSetting("linkedin_token_expires_at", String(newExpiresAt), userId),
    data.refresh_token
      ? setSetting("linkedin_refresh_token", data.refresh_token, userId)
      : Promise.resolve(),
  ]);

  return data.access_token;
}

export async function postToLinkedIn(
  userId: string,
  content: string
): Promise<string> {
  let tokens = await getLinkedInTokens(userId);
  if (!tokens) {
    throw new Error("LinkedIn token expired — reconnect in Settings");
  }

  let { accessToken } = tokens;

  if (tokens.expiresAt - Date.now() < SEVEN_DAYS_MS) {
    accessToken = await refreshLinkedInToken(userId);
    const refreshed = await getLinkedInTokens(userId);
    if (refreshed) tokens = refreshed;
  }

  const body = {
    author: `urn:li:person:${tokens.personUrn}`,
    lifecycleState: "PUBLISHED",
    specificContent: {
      "com.linkedin.ugc.ShareContent": {
        shareCommentary: { text: content },
        shareMediaCategory: "NONE",
      },
    },
    visibility: {
      "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC",
    },
  };

  const res = await fetch(UGC_POSTS_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
      "X-Restli-Protocol-Version": "2.0.0",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const errText = await res.text().catch(() => res.statusText);
    throw new Error(`LinkedIn API error (${res.status}): ${errText}`);
  }

  const data = await res.json();
  return data.id as string;
}
