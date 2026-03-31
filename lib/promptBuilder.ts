export function buildSystemPrompt(type: "image" | "text" | "code"): string {
  const base = `You are an expert prompt engineer. Your task is to enhance the user's input into a high-quality, detailed prompt.
You MUST respond with ONLY valid JSON — no markdown fences, no explanation, no extra text.
The JSON must have exactly this shape:
{ "masterPrompt": string, "shortVersion": string, "variations": [string, string, string] }`;

  const typeInstructions: Record<typeof type, string> = {
    image: `You are enhancing a prompt for an AI image generator (e.g. Midjourney, DALL-E, Stable Diffusion).
Expand the user's input by incorporating all of the following dimensions:
- Subject: who or what is the main focus
- Environment: setting, location, surroundings, time of day
- Lighting: type, direction, quality, color temperature
- Composition: framing, perspective, depth of field, angle
- Style: artistic movement, medium, artist references if relevant
- Quality keywords: resolution, detail level, rendering quality (e.g. 8k, ultra-detailed, photorealistic)

masterPrompt: a rich, detailed image prompt (~80-120 words)
shortVersion: a concise version (~20-30 words) keeping the most important elements
variations: three creative alternative takes on the same subject`,

    text: `You are enhancing a writing prompt or text instruction.
Improve and expand by addressing:
- Tone: formal/informal, emotional register, voice
- Audience: who is this text for, their knowledge level and expectations
- Structure: how the text should be organized (intro, body, conclusion, sections, etc.)
- Purpose: the goal of the text — inform, persuade, entertain, instruct, etc.

masterPrompt: a fully developed writing brief (~60-100 words)
shortVersion: a one-sentence summary of the core instruction
variations: three alternative framings or angles for the same topic`,

    code: `You are enhancing a coding task description or technical prompt.
Clarify and expand by specifying:
- Language: programming language(s), version if relevant
- Constraints: performance requirements, memory limits, coding style, patterns to use or avoid
- Expected behavior: inputs, outputs, edge cases, error handling

masterPrompt: a detailed technical specification (~60-100 words)
shortVersion: a one-sentence task description
variations: three alternative implementations or approaches to the same problem`,
  };

  return `${base}\n\n${typeInstructions[type]}`;
}

export function buildUserMessage(
  input: string,
  style?: string,
  mood?: string,
  quality?: string
): string {
  let message = `Enhance the following input:\n\n"${input}"`;

  const extras: string[] = [];
  if (style) extras.push(`Style: ${style}`);
  if (mood) extras.push(`Mood: ${mood}`);
  if (quality) extras.push(`Quality level: ${quality}`);

  if (extras.length > 0) {
    message += `\n\nAdditional parameters:\n${extras.join("\n")}`;
  }

  return message;
}
