export type ModelId = "dalle3" | "midjourney" | "sdxl" | "flux" | "nanobanana";

const MODEL_INSTRUCTIONS: Record<ModelId, string> = {
  dalle3: `You are an expert DALL-E 3 prompt engineer.
Create detailed, natural language prompts.
DALL-E 3 responds best to descriptive sentences, not keyword lists.
Include subject, style, lighting, mood, composition.
Write each prompt as flowing, descriptive prose.`,

  midjourney: `You are an expert Midjourney v6 prompt engineer.
Create prompts using comma-separated keywords.
Use weights like (detailed:1.4) for emphasis on key elements.
Always end masterPrompt and each variation with: --v 6 --style raw
Append the correct --ar parameter based on composition:
  Portrait (1:1) or Square (1:1) → --ar 1:1
  Landscape (16:9) → --ar 16:9
  Panoramic (21:9) → --ar 21:9
  Vertical (9:16) → --ar 9:16
  (default if no composition) → --ar 1:1
shortVersion should be a condensed keyword list without parameters.`,

  sdxl: `You are an expert Stable Diffusion XL prompt engineer.
Format each prompt as: [positive prompt]
Negative prompt: [comma-separated list of things to avoid, e.g. blurry, low quality, watermark, text, deformed]
Use emphasis notation (word:1.4) for important elements.
Include both positive and negative sections in masterPrompt and each variation.
shortVersion should be just the positive part, no negative prompt.`,

  flux: `You are an expert Flux prompt engineer.
Flux works best with short, precise, descriptive prompts.
Maximum 2-3 sentences per prompt. Focus on the key visual elements only.
Be concise and specific — avoid filler words.`,

  nanobanana: `You are an expert NanoBanana prompt engineer.
Create concise, vivid prompts optimized for the NanoBanana model.
Focus on artistic style and mood. Maximum 100 words per prompt.
Prioritize atmosphere and emotion over technical detail.`,
};

const JSON_WRAPPER = `Always respond in Polish language.
Generate the main prompt and short version in Polish.
All explanations, labels and text must be in Polish.

You MUST respond with ONLY valid JSON — no markdown fences, no explanation, no extra text.
The JSON must have exactly this shape:
{ "masterPrompt": string, "shortVersion": string }

masterPrompt: główny, najbardziej szczegółowy prompt
shortVersion: skrócona wersja zachowująca najważniejsze elementy

Apply the model-specific formatting rules above to both prompts.`;

export function buildSystemPrompt(model: ModelId): string {
  return `${MODEL_INSTRUCTIONS[model]}\n\n${JSON_WRAPPER}`;
}

export function buildUserMessage(
  input: string,
  style?: string,
  mood?: string,
  lighting?: string,
  composition?: string
): string {
  let message = `Enhance the following idea into image prompts:\n\n"${input}"`;

  const extras: string[] = [];
  if (style)       extras.push(`Style: ${style}`);
  if (mood)        extras.push(`Mood: ${mood}`);
  if (lighting)    extras.push(`Lighting: ${lighting}`);
  if (composition) extras.push(`Composition: ${composition}`);

  if (extras.length > 0) {
    message += `\n\nSelected parameters (incorporate all of these):\n${extras.join("\n")}`;
  }

  return message;
}
