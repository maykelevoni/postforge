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

// ========================================
// Template-based Generation
// ========================================

export interface GenerateFromTemplateOptions {
  template: string;
  variables: Record<string, string>;
  constraints: {
    maxLength?: number;
    requiredSections?: string[];
  };
  productInfo: {
    name: string;
    description: string;
    url: string;
  };
  system?: string;
  userId: string;
}

export async function generateFromTemplate({
  template,
  variables,
  constraints,
  productInfo,
  system = "You are a content generation expert. Follow the template structure exactly.",
  userId,
}: GenerateFromTemplateOptions): Promise<string> {
  // Fill template with variables
  let filledTemplate = template;
  Object.entries(variables).forEach(([key, value]) => {
    filledTemplate = filledTemplate.replace(new RegExp(`\\{${key}\\}`, 'g'), value);
  });

  // Generate prompt from filled template
  const prompt = `Generate content following this exact template structure:

Template: ${filledTemplate}

Product: ${productInfo.name}
Description: ${productInfo.description}
URL: ${productInfo.url}

Requirements:
- Follow the template structure EXACTLY
- Do not deviate from the template format
- Fill in any remaining placeholders with high-quality content
${constraints.maxLength ? `- Maximum length: ${constraints.maxLength} characters` : ''}
${constraints.requiredSections ? `- Must include: ${constraints.requiredSections.join(', ')}` : ''}`;

  const content = await generateText({
    prompt,
    system,
    userId,
  });

  return content;
}
