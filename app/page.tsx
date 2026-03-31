"use client";

import { useState } from "react";
import PromptCard from "@/components/PromptCard";

type PromptType = "image" | "text" | "code";

interface GenerateResponse {
  masterPrompt: string;
  shortVersion: string;
  variations: string[];
}

const TYPE_BUTTONS: { id: PromptType; label: string }[] = [
  { id: "image", label: "Image" },
  { id: "text", label: "Text" },
  { id: "code", label: "Code" },
];

const STYLE_OPTIONS = ["", "Realistic", "Cinematic", "Anime", "Oil painting", "Watercolor"];
const MOOD_OPTIONS = ["", "Dark", "Vibrant", "Futuristic", "Calm", "Dramatic"];
const QUALITY_OPTIONS = ["Standard", "High", "Ultra"];

export default function Home() {
  const [selectedType, setSelectedType] = useState<PromptType>("image");
  const [userInput, setUserInput] = useState("");
  const [style, setStyle] = useState("");
  const [mood, setMood] = useState("");
  const [quality, setQuality] = useState("Standard");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [result, setResult] = useState<GenerateResponse | null>(null);

  const handleGenerate = async () => {
    setError(false);
    setResult(null);
    setLoading(true);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: selectedType,
          input: userInput,
          style,
          mood,
          quality,
        }),
      });

      if (!res.ok) throw new Error("Non-OK response");

      const data: GenerateResponse = await res.json();
      setResult(data);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-zinc-950 px-4 py-12 text-white">
      <div className="mx-auto w-full max-w-[680px] space-y-8">
        {/* Header */}
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight">Prompt Enhancer</h1>
          <p className="text-sm text-zinc-400">Transform your idea into powerful AI prompts.</p>
        </div>

        {/* Step 1 — Type selector */}
        <section className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-widest text-zinc-400">
            Type
          </label>
          <div className="flex gap-2">
            {TYPE_BUTTONS.map(({ id, label }) => (
              <button
                key={id}
                onClick={() => {
                  setSelectedType(id);
                  if (id !== "image") {
                    setStyle("");
                    setMood("");
                    setQuality("Standard");
                  }
                }}
                className={`rounded-lg px-5 py-2.5 text-sm font-medium transition-all duration-150
                  ${
                    selectedType === id
                      ? "bg-purple-600 text-white shadow-lg shadow-purple-900/40"
                      : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700 hover:text-white"
                  }`}
              >
                {label}
              </button>
            ))}
          </div>
        </section>

        {/* Step 2 — Input */}
        <section className="space-y-2">
          <label
            htmlFor="userInput"
            className="text-xs font-semibold uppercase tracking-widest text-zinc-400"
          >
            Your idea
          </label>
          <textarea
            id="userInput"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder="Describe what you want to create..."
            rows={3}
            maxLength={500}
            className="w-full resize-y rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-3
              text-sm text-zinc-100 placeholder-zinc-600 outline-none
              transition-colors focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
          />
          <div className="flex justify-end">
            <span
              className={`text-xs ${
                userInput.length >= 500
                  ? "text-red-400"
                  : userInput.length >= 400
                  ? "text-yellow-400"
                  : "text-zinc-500"
              }`}
            >
              {userInput.length} / 500 znaków
            </span>
          </div>
        </section>

        {/* Step 3 — Image refinements */}
        {selectedType === "image" && (
          <section className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-widest text-zinc-400">
              Refinements
            </label>
            <div className="grid grid-cols-3 gap-3">
              {/* Style */}
              <div className="flex flex-col gap-1">
                <span className="text-xs text-zinc-500">Style</span>
                <select
                  value={style}
                  onChange={(e) => setStyle(e.target.value)}
                  className="rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2
                    text-sm text-zinc-100 outline-none transition-colors
                    focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                >
                  {STYLE_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt === "" ? "(none)" : opt}
                    </option>
                  ))}
                </select>
              </div>

              {/* Mood */}
              <div className="flex flex-col gap-1">
                <span className="text-xs text-zinc-500">Mood</span>
                <select
                  value={mood}
                  onChange={(e) => setMood(e.target.value)}
                  className="rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2
                    text-sm text-zinc-100 outline-none transition-colors
                    focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                >
                  {MOOD_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt === "" ? "(none)" : opt}
                    </option>
                  ))}
                </select>
              </div>

              {/* Quality */}
              <div className="flex flex-col gap-1">
                <span className="text-xs text-zinc-500">Quality</span>
                <select
                  value={quality}
                  onChange={(e) => setQuality(e.target.value)}
                  className="rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2
                    text-sm text-zinc-100 outline-none transition-colors
                    focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                >
                  {QUALITY_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </section>
        )}

        {/* Step 4 — Generate */}
        <button
          onClick={handleGenerate}
          disabled={loading || userInput.trim().length === 0}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-purple-600
            py-3 text-sm font-semibold transition-all duration-150
            hover:bg-purple-500 active:scale-[0.98]
            disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading && (
            <svg
              className="h-4 w-4 animate-spin"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
              />
            </svg>
          )}
          {loading ? "Generating…" : "Generate prompts"}
        </button>

        {/* Error banner */}
        {error && (
          <div className="rounded-lg border border-red-800 bg-red-950 px-4 py-3 text-sm text-red-300">
            Something went wrong. Check your API key and try again.
          </div>
        )}

        {/* Result section */}
        {result && (
          <section className="space-y-3">
            <PromptCard label="Master prompt" text={result.masterPrompt} accent />
            <PromptCard label="Short version" text={result.shortVersion} />
            {result.variations[0] && (
              <PromptCard label="Variation 1" text={result.variations[0]} />
            )}
            {result.variations[1] && (
              <PromptCard label="Variation 2" text={result.variations[1]} />
            )}
            {result.variations[2] && (
              <PromptCard label="Variation 3" text={result.variations[2]} />
            )}
          </section>
        )}
      </div>
    </main>
  );
}
