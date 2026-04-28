import { postToLinkedIn } from "@/lib/linkedin";

export async function postLinkedIn(
  userId: string,
  content: string
): Promise<string> {
  return postToLinkedIn(userId, content);
}
