import { getSetting } from "@/lib/settings";

interface GenerateTextOptions {
  prompt: string;
  system?: string;
  userId: string;
}

export async function generateText({
  prompt,
  system = "You are a helpful assistant.",
  userId,
}: GenerateTextOptions): Promise<string> {
  const apiKey = await getSetting("openrouter_api_key", userId);
  if (!apiKey) {
    throw new Error(
      "OpenRouter API key not configured. Please add it in settings."
    );
  }

  const model =
    (await getSetting("openrouter_model", userId)) ||
    "deepseek/deepseek-r1";

  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages: [
        {
          role: "system",
          content: system,
        },
        {
          role: "user",
          content: prompt,
        },
      ],
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`OpenRouter API error: ${error}`);
  }

  const data = await response.json();
  return data.choices[0]?.message?.content || "";
}
