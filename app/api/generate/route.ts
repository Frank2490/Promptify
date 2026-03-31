import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { buildSystemPrompt, buildUserMessage } from "@/lib/promptBuilder";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

interface RequestBody {
  type: "image" | "text" | "code";
  input: string;
  style?: string;
  mood?: string;
  quality?: string;
}

interface GenerateResponse {
  masterPrompt: string;
  shortVersion: string;
  variations: [string, string, string];
}

export async function POST(request: NextRequest) {
  let body: RequestBody;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { type, input, style, mood, quality } = body;

  if (!type || !["image", "text", "code"].includes(type)) {
    return NextResponse.json(
      { error: "Missing or invalid 'type'. Must be image, text, or code." },
      { status: 400 }
    );
  }

  if (!input || typeof input !== "string" || input.trim().length === 0) {
    return NextResponse.json(
      { error: "Missing or empty 'input'." },
      { status: 400 }
    );
  }

  try {
    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: buildSystemPrompt(type) },
        { role: "user", content: buildUserMessage(input, style, mood, quality) },
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
      typeof parsed.shortVersion !== "string" ||
      !Array.isArray(parsed.variations) ||
      parsed.variations.length < 3
    ) {
      return NextResponse.json({ error: "Generation failed" }, { status: 500 });
    }

    const result: GenerateResponse = {
      masterPrompt: parsed.masterPrompt,
      shortVersion: parsed.shortVersion,
      variations: [parsed.variations[0], parsed.variations[1], parsed.variations[2]],
    };

    return NextResponse.json(result, { status: 200 });
  } catch {
    return NextResponse.json({ error: "Generation failed" }, { status: 500 });
  }
}
