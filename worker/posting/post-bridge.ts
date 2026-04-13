import { getSetting } from "@/lib/settings";
import { db } from "@/lib/db";

interface PostParams {
  platform: string;
  content: string;
  mediaUrl?: string;
  userId: string;
}

async function downloadFile(url: string): Promise<Buffer> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to download file: ${response.statusText}`);
  }
  const arrayBuffer = await response.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

async function uploadMediaToPostBridge(
  mediaUrl: string,
  apiKey: string
): Promise<string> {
  try {
    const buffer = await downloadFile(mediaUrl);
    const uint8Array = new Uint8Array(buffer);

    const formData = new FormData();
    formData.append("file", new Blob([uint8Array], { type: "video/mp4" }), "video.mp4");

    const response = await fetch("https://api.post-bridge.com/v1/media", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Media upload failed: ${response.statusText}`);
    }

    const data = await response.json();
    return data.media_id;
  } catch (error) {
    console.error("Error uploading media:", error);
    throw error;
  }
}

async function createPostWithMedia(
  params: PostParams,
  mediaId: string,
  apiKey: string
): Promise<any> {
  const response = await fetch("https://api.post-bridge.com/v1/posts", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      platform: params.platform,
      content: params.content,
      media_id: mediaId,
      scheduled_at: new Date().toISOString(),
    }),
  });

  if (!response.ok) {
    throw new Error(`Post creation failed: ${response.statusText}`);
  }

  return response.json();
}

async function createPostWithoutMedia(
  params: PostParams,
  apiKey: string
): Promise<any> {
  const response = await fetch("https://api.post-bridge.com/v1/posts", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      platform: params.platform,
      content: params.content,
      scheduled_at: new Date().toISOString(),
    }),
  });

  if (!response.ok) {
    throw new Error(`Post creation failed: ${response.statusText}`);
  }

  return response.json();
}

export async function postToPlatform(
  params: PostParams
): Promise<string> {
  const apiKey = await getSetting("postbridge_api_key", params.userId);

  if (!apiKey) {
    throw new Error("post-bridge API key not configured");
  }

  try {
    // If media URL is provided, upload it first
    if (params.mediaUrl) {
      const mediaId = await uploadMediaToPostBridge(params.mediaUrl, apiKey);
      const result = await createPostWithMedia(params, mediaId, apiKey);
      return result.post_id;
    } else {
      const result = await createPostWithoutMedia(params, apiKey);
      return result.post_id;
    }
  } catch (error: any) {
    // Handle rate limiting with one retry
    if (error.message?.includes("429") || error.status === 429) {
      console.log("Rate limited, retrying after 5 seconds...");
      await new Promise(resolve => setTimeout(resolve, 5000));

      if (params.mediaUrl) {
        const mediaId = await uploadMediaToPostBridge(params.mediaUrl, apiKey);
        const result = await createPostWithMedia(params, mediaId, apiKey);
        return result.post_id;
      } else {
        const result = await createPostWithoutMedia(params, apiKey);
        return result.post_id;
      }
    }

    throw error;
  }
}

export async function listSocialAccounts(userId: string): Promise<any[]> {
  const apiKey = await getSetting("postbridge_api_key", userId);

  if (!apiKey) {
    throw new Error("post-bridge API key not configured");
  }

  const response = await fetch("https://api.post-bridge.com/v1/social-accounts", {
    headers: {
      Authorization: `Bearer ${apiKey}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to list accounts: ${response.statusText}`);
  }

  const data = await response.json();
  return data.accounts || [];
}
