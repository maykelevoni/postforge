import { getSetting } from "@/lib/settings";

interface FalQueueResponse {
  request_id: string;
}

interface FalResultResponse {
  images?: Array<{ url: string }>;
  video?: { url: string };
}

async function submitToFal(
  endpoint: string,
  input: Record<string, any>,
  apiKey: string
): Promise<string> {
  // Submit to queue
  const queueResponse = await fetch(`https://queue.fal.run/${endpoint}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Key ${apiKey}`,
    },
    body: JSON.stringify(input),
  });

  if (!queueResponse.ok) {
    throw new Error(`fal.ai queue error: ${queueResponse.statusText}`);
  }

  const queueData = (await queueResponse.json()) as FalQueueResponse;
  const requestId = queueData.request_id;

  // Poll for result
  const statusUrl = `https://queue.fal.run/${endpoint}/requests/${requestId}/status`;

  while (true) {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const statusResponse = await fetch(statusUrl, {
      headers: {
        Authorization: `Key ${apiKey}`,
      },
    });

    if (!statusResponse.ok) {
      throw new Error(`fal.ai status error: ${statusResponse.statusText}`);
    }

    const statusData = await statusResponse.json();

    if (statusData.status === "COMPLETED") {
      const resultUrl = `https://queue.fal.run/${endpoint}/requests/${requestId}`;
      const resultResponse = await fetch(resultUrl, {
        headers: {
          Authorization: `Key ${apiKey}`,
        },
      });

      if (!resultResponse.ok) {
        throw new Error(`fal.ai result error: ${resultResponse.statusText}`);
      }

      const resultData = (await resultResponse.json()) as FalResultResponse;

      if (resultData.images?.[0]?.url) {
        return resultData.images[0].url;
      }

      if (resultData.video?.url) {
        return resultData.video.url;
      }

      throw new Error("No result URL found in fal.ai response");
    }

    if (statusData.status === "FAILED") {
      throw new Error(`fal.ai generation failed: ${statusData.error || "Unknown error"}`);
    }
  }
}

export async function generateImage(
  prompt: string,
  userId: string
): Promise<string> {
  const apiKey = await getSetting("falai_api_key", userId);
  if (!apiKey) {
    throw new Error(
      "fal.ai API key not configured. Please add it in settings."
    );
  }

  return submitToFal(
    "fal-ai/flux/schnell",
    { prompt },
    apiKey
  );
}

export async function generateVideo(
  imageUrl: string,
  prompt: string,
  userId: string
): Promise<string> {
  const apiKey = await getSetting("falai_api_key", userId);
  if (!apiKey) {
    throw new Error(
      "fal.ai API key not configured. Please add it in settings."
    );
  }

  return submitToFal(
    "fal-ai/kling-video/v1/standard/image-to-video",
    {
      image_url: imageUrl,
      prompt,
      duration: "5",
    },
    apiKey
  );
}
