import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { buildSystemPrompt, buildUserMessage, ModelId } from "@/lib/promptBuilder";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const VALID_MODELS: ModelId[] = ["dalle3", "midjourney", "sdxl", "flux", "nanobanana"];

interface RequestBody {
  type: "image";
  input: string;
  selectedModel?: ModelId;
  style?: string;
  mood?: string;
  lighting?: string;
  composition?: string;
  artistReference?: string;
}

interface GenerateResponse {
  masterPrompt: string;
  shortVersion: string;
  negativePrompt: string | null;
}

export async function POST(request: NextRequest) {
  let body: RequestBody;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { input, selectedModel, style, mood, lighting, composition, artistReference } = body;

  if (!input || typeof input !== "string" || input.trim().length === 0) {
    return NextResponse.json({ error: "Missing or empty 'input'." }, { status: 400 });
  }

  const model: ModelId =
    selectedModel && VALID_MODELS.includes(selectedModel) ? selectedModel : "dalle3";

  try {
    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: buildSystemPrompt(model) },
        { role: "user", content: buildUserMessage(input, style, mood, lighting, composition, artistReference) },
      ],
      temperature: 0.8,
      response_format: { type: "json_object" },
    });

    const raw = completion.choices[0]?.message?.content ?? "";

    let parsed: GenerateResponse;
    try {
      parsed = JSON.parse(raw) as GenerateResponse;
    } catch {
      return NextResponse.json({ error: "Generation failed" }, { status: 500 });
    }

    if (
      typeof parsed.masterPrompt !== "string" ||
      typeof parsed.shortVersion !== "string"
    ) {
      return NextResponse.json({ error: "Generation failed" }, { status: 500 });
    }

    const result: GenerateResponse = {
      masterPrompt: parsed.masterPrompt,
      shortVersion: parsed.shortVersion,
      negativePrompt: typeof parsed.negativePrompt === "string" ? parsed.negativePrompt : null,
    };

    return NextResponse.json(result, { status: 200 });
  } catch {
    return NextResponse.json({ error: "Generation failed" }, { status: 500 });
  }
}
