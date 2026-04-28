import { auth } from "@/auth";
import { getSetting } from "@/lib/settings";
import { redirect } from "next/navigation";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/sign-in");
  }

  const userId = session.user.id;
  const clientId =
    (await getSetting("linkedin_client_id", userId)) ||
    process.env.LINKEDIN_CLIENT_ID;

  if (!clientId) {
    redirect("/settings?linkedin=missing_client_id");
  }

  const redirectUri = `${process.env.NEXTAUTH_URL}/api/auth/linkedin/callback`;
  const state = Buffer.from(userId).toString("base64");

  const params = new URLSearchParams({
    response_type: "code",
    client_id: clientId,
    redirect_uri: redirectUri,
    scope: "w_member_social openid profile",
    state,
  });

  redirect(
    `https://www.linkedin.com/oauth/v2/authorization?${params.toString()}`
  );
}
