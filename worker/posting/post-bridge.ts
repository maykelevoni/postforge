import { postLinkedIn } from "./linkedin";

interface PostParams {
  platform: string;
  content: string;
  mediaUrl?: string;
  userId: string;
}

export const MANUAL_QUEUE = "needs_manual_post";

export async function postToPlatform(params: PostParams): Promise<string> {
  if (params.platform === "linkedin") {
    return postLinkedIn(params.userId, params.content);
  }

  // All other platforms go to manual queue
  return MANUAL_QUEUE;
}

export async function listSocialAccounts(_userId: string): Promise<any[]> {
  return [];
}
