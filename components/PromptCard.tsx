"use client";

import { useState } from "react";

interface PromptCardProps {
  label: string;
  text: string;
  accent?: boolean;
}

export default function PromptCard({ label, text, accent = false }: PromptCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div
      className={`relative rounded-lg bg-zinc-900 p-5 ${
        accent ? "border-l-4 border-purple-500" : "border border-zinc-800"
      }`}
    >
      <div className="mb-2 flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-widest text-zinc-400">
          {label}
        </span>
        <button
          onClick={handleCopy}
          className="rounded-md px-3 py-1 text-xs font-medium transition-all duration-150
            bg-zinc-800 text-zinc-300 hover:bg-zinc-700 hover:text-white
            active:scale-95"
        >
          {copied ? "SKOPIOWANO ✓" : "KOPIUJ"}
        </button>
      </div>
      <p className="whitespace-pre-wrap text-sm leading-relaxed text-zinc-100">{text}</p>
    </div>
  );
}
