"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import PromptCard from "@/components/PromptCard";
import Sidebar from "@/components/Sidebar";
import { createClient } from "@/lib/supabase/client";

interface GenerateResponse {
  masterPrompt: string;
  shortVersion: string;
}

interface HistoryEntry {
  id: number;
  userInput: string;
  generatedPrompt: string;
  model: string;
  modelId: ModelId;
  style: string;
  date: string;
}

const STYLE_OPTIONS   = ["Realistic", "Cinematic", "Anime", "Oil Painting", "Watercolor", "Pixel Art", "3D Render", "Sketch"];
const MOOD_OPTIONS    = ["Dark", "Vibrant", "Futuristic", "Calm", "Dramatic", "Ethereal", "Minimalist"];
const LIGHTING_OPTIONS = ["Golden Hour", "Studio Light", "Neon", "Dramatic", "Soft", "Moonlight"];
const COMPOSITION_OPTIONS = ["Portrait (1:1)", "Landscape (16:9)", "Square (1:1)", "Panoramic (21:9)", "Vertical (9:16)"];

type ModelId = "dalle3" | "midjourney" | "sdxl" | "flux" | "nanobanana";

const MODELS: { id: ModelId; name: string; icon: string; badge?: string; description: string }[] = [
  { id: "dalle3",     name: "DALL-E 3",           icon: "✦", badge: "Best Quality", description: "Najwyższa jakość i szczegółowość" },
  { id: "midjourney", name: "Midjourney v6",       icon: "◈", badge: "Popular",      description: "Artystyczny styl, idealne kompozycje" },
  { id: "sdxl",       name: "Stable Diffusion XL", icon: "⬡",                        description: "Open-source, pełna kontrola" },
  { id: "flux",       name: "Flux",                icon: "⚡", badge: "Fast",         description: "Szybka generacja, świetne detale" },
  { id: "nanobanana", name: "NanoBanana",          icon: "🍌", badge: "Experimental", description: "Eksperymentalny, zaskakujące wyniki" },
];

export default function AppPage() {
  const router = useRouter();
  const supabase = createClient();

  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/auth");
  };

  const [selectedModel, setSelectedModel] = useState<ModelId>("dalle3");
  const [userInput, setUserInput] = useState("");
  const [style, setStyle] = useState("");
  const [mood, setMood] = useState("");
  const [lighting, setLighting] = useState("");
  const [composition, setComposition] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [result, setResult] = useState<GenerateResponse | null>(null);
  const [submittedInput, setSubmittedInput] = useState("");
  const [resultModel, setResultModel] = useState<ModelId>("dalle3");
  const [copiedMain, setCopiedMain] = useState(false);

  const [history, setHistory] = useState<HistoryEntry[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      return JSON.parse(localStorage.getItem("promptify_history") ?? "[]");
    } catch {
      return [];
    }
  });

  const saveHistory = (updated: HistoryEntry[]) => {
    setHistory(updated);
    localStorage.setItem("promptify_history", JSON.stringify(updated));
  };

  const deleteFromHistory = (id: number) => {
    saveHistory(history.filter((e) => e.id !== id));
  };

  const loadFromHistory = (entry: HistoryEntry) => {
    setSubmittedInput(entry.userInput);
    setResultModel(entry.modelId);
    setResult({ masterPrompt: entry.generatedPrompt, shortVersion: "" });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCopyMain = async (text: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedMain(true);
    setTimeout(() => setCopiedMain(false), 2000);
  };

  const handleGenerate = async () => {
    setError(false);
    setResult(null);
    setLoading(true);
    setSubmittedInput(userInput);
    setResultModel(selectedModel);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "image",
          input: userInput,
          selectedModel,
          style,
          mood,
          lighting,
          composition,
        }),
      });

      if (!res.ok) throw new Error("Non-OK response");

      const data: GenerateResponse = await res.json();
      setResult(data);

      supabase.auth.getUser().then(async ({ data: { user } }) => {
        if (!user) return
        const { data: insertData, error } = await supabase.from('prompts').insert({
          user_id: user.id,
          content: data.masterPrompt,
          model: selectedModel,
          is_favorite: false,
        })
        console.log('Prompt save result:', insertData, error)
      })

      const entry: HistoryEntry = {
        id: Date.now(),
        userInput,
        generatedPrompt: data.masterPrompt,
        model: MODELS.find((m) => m.id === selectedModel)?.name ?? selectedModel,
        modelId: selectedModel,
        style,
        date: new Date().toISOString().split("T")[0],
      };
      saveHistory([entry, ...history].slice(0, 10));
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#121212]">
      <Sidebar user={user} onSignOut={handleSignOut} />

      <main className="flex-1 overflow-y-auto px-4 py-14 text-white">
        <div className="mx-auto w-full max-w-[720px] space-y-10">
          {/* Header */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-600/15 text-lg text-purple-400 ring-1 ring-purple-500/20">
                ✦
              </div>
              <h1 className="bg-gradient-to-br from-white via-zinc-200 to-zinc-500 bg-clip-text text-3xl font-bold tracking-tight text-transparent">
                Promptify
              </h1>
            </div>
            <p className="text-sm leading-relaxed text-zinc-500">
              Zamień swój pomysł w potężne prompty dla AI.
            </p>
          </div>

          {/* Step 1 — Model */}
          <section className="space-y-3">
            <label className="text-xs font-semibold uppercase tracking-widest text-zinc-500">
              Model AI
            </label>
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
              {MODELS.map(({ id, name, icon }) => (
                <button
                  key={id}
                  onClick={() => setSelectedModel(id)}
                  className={`group flex flex-col items-center gap-1.5 rounded-lg px-2 py-3 text-center transition-all duration-200
                    ${
                      selectedModel === id
                        ? "border border-purple-500/70 bg-zinc-900 shadow-[0_0_0_1px_rgba(168,85,247,0.35),0_0_20px_rgba(168,85,247,0.10)] text-white"
                        : "border border-zinc-800 bg-zinc-900/40 text-zinc-400 hover:border-zinc-700 hover:bg-zinc-900/80 hover:text-zinc-200"
                    }`}
                >
                  <span
                    className={`text-xl transition-transform duration-200 ${selectedModel === id ? "scale-110" : "group-hover:scale-105"}`}
                  >
                    {icon}
                  </span>
                  <p className={`text-[11px] font-medium leading-tight ${selectedModel === id ? "text-white" : "text-zinc-400"}`}>
                    {name}
                  </p>
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
              Twój pomysł
            </label>
            <textarea
              id="userInput"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder="Opisz co chcesz stworzyć..."
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

          {/* Step 3 — Refinements */}
          <section className="space-y-5">
            <label className="text-xs font-semibold uppercase tracking-widest text-zinc-400">
              Doprecyzowanie
            </label>

            <div className="space-y-2">
              <span className="text-xs text-zinc-500">Styl</span>
              <div className="flex flex-wrap gap-2">
                {STYLE_OPTIONS.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => setStyle(style === opt ? "" : opt)}
                    className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all duration-150
                      ${style === opt
                        ? "bg-purple-600 text-white shadow-lg shadow-purple-900/40"
                        : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700 hover:text-white"
                      }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <span className="text-xs text-zinc-500">Nastrój</span>
              <div className="flex flex-wrap gap-2">
                {MOOD_OPTIONS.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => setMood(mood === opt ? "" : opt)}
                    className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all duration-150
                      ${mood === opt
                        ? "bg-purple-600 text-white shadow-lg shadow-purple-900/40"
                        : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700 hover:text-white"
                      }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <span className="text-xs text-zinc-500">Oświetlenie</span>
              <div className="flex flex-wrap gap-2">
                {LIGHTING_OPTIONS.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => setLighting(lighting === opt ? "" : opt)}
                    className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all duration-150
                      ${lighting === opt
                        ? "bg-purple-600 text-white shadow-lg shadow-purple-900/40"
                        : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700 hover:text-white"
                      }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <span className="text-xs text-zinc-500">Kompozycja</span>
              <div className="flex flex-wrap gap-2">
                {COMPOSITION_OPTIONS.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => setComposition(composition === opt ? "" : opt)}
                    className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all duration-150
                      ${composition === opt
                        ? "bg-purple-600 text-white shadow-lg shadow-purple-900/40"
                        : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700 hover:text-white"
                      }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          </section>

          {/* Generate button */}
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
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
              </svg>
            )}
            {loading ? "Generowanie…" : "Generuj prompty"}
          </button>

          {/* Error banner */}
          {error && (
            <div className="rounded-lg border border-red-800 bg-red-950 px-4 py-3 text-sm text-red-300">
              Coś poszło nie tak. Sprawdź klucz API i spróbuj ponownie.
            </div>
          )}

          {/* Result section */}
          {result && (
            <section className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="flex flex-col gap-3 rounded-lg bg-zinc-800/50 p-5">
                  <span className="text-xs font-semibold uppercase tracking-widest text-zinc-500">
                    Twój pomysł
                  </span>
                  <p className="whitespace-pre-wrap text-sm leading-relaxed text-zinc-300">
                    {submittedInput}
                  </p>
                </div>

                <div className="flex flex-col gap-3 rounded-lg border border-purple-500/30 bg-zinc-900 p-5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-semibold uppercase tracking-widest text-purple-400">
                      Prompt dla {MODELS.find((m) => m.id === resultModel)?.name}
                    </span>
                    <button
                      onClick={() => handleCopyMain(result.masterPrompt)}
                      className="shrink-0 rounded-md bg-zinc-800 px-3 py-1 text-xs font-semibold
                        text-zinc-300 transition-all duration-150 hover:bg-zinc-700
                        hover:text-white active:scale-95"
                    >
                      {copiedMain ? "SKOPIOWANO ✓" : "KOPIUJ"}
                    </button>
                  </div>
                  <p className="whitespace-pre-wrap text-sm leading-relaxed text-zinc-100">
                    {result.masterPrompt}
                  </p>
                </div>
              </div>

              <PromptCard label="Skrócona wersja" text={result.shortVersion} />
            </section>
          )}

          {/* History */}
          {history.length > 0 && (
            <section className="space-y-3">
              <label className="text-xs font-semibold uppercase tracking-widest text-zinc-400">
                Historia
              </label>
              <ul className="space-y-2">
                {history.map((entry) => {
                  const modelMeta = MODELS.find((m) => m.id === entry.modelId);
                  return (
                    <li
                      key={entry.id}
                      className="flex items-center gap-3 rounded-lg border border-zinc-800
                        bg-zinc-900 px-4 py-3 transition-colors hover:border-zinc-700"
                    >
                      <button
                        onClick={() => loadFromHistory(entry)}
                        className="flex min-w-0 flex-1 flex-col gap-1 text-left"
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-xs">{modelMeta?.icon}</span>
                          <span className="text-xs font-medium text-purple-400">
                            {entry.model}
                          </span>
                          {entry.style && (
                            <span className="text-xs text-zinc-600">· {entry.style}</span>
                          )}
                          <span className="ml-auto shrink-0 text-xs text-zinc-600">
                            {entry.date}
                          </span>
                        </div>
                        <p className="truncate text-xs text-zinc-400">
                          {entry.generatedPrompt.slice(0, 50)}
                          {entry.generatedPrompt.length > 50 ? "…" : ""}
                        </p>
                      </button>
                      <button
                        onClick={() => deleteFromHistory(entry.id)}
                        aria-label="Usuń z historii"
                        className="shrink-0 rounded-md p-1.5 text-zinc-600 transition-colors
                          hover:bg-zinc-800 hover:text-zinc-300"
                      >
                        ✕
                      </button>
                    </li>
                  );
                })}
              </ul>
            </section>
          )}
        </div>
      </main>
    </div>
  );
}
