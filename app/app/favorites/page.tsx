'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Heart } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

interface PromptRow {
  id: string
  content: string
  model: string
  created_at: string
  is_favorite: boolean
  user_id: string
}

export default function FavoritesPage() {
  const router = useRouter()
  const supabase = createClient()

  const [prompts, setPrompts] = useState<PromptRow[]>([])
  const [loading, setLoading] = useState(true)
  const [copiedId, setCopiedId] = useState<string | null>(null)

  useEffect(() => {
    fetchFavorites()
  }, [])

  const fetchFavorites = async () => {
    setLoading(true)
    const { data } = await supabase
      .from('prompts')
      .select('*')
      .eq('is_favorite', true)
      .order('created_at', { ascending: false })
    setPrompts(data ?? [])
    setLoading(false)
  }

  const handleCopy = async (id: string, content: string) => {
    await navigator.clipboard.writeText(content)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const handleRemoveFavorite = async (id: string) => {
    await supabase.from('prompts').update({ is_favorite: false }).eq('id', id)
    setPrompts((prev) => prev.filter((p) => p.id !== id))
  }

  const formatDate = (iso: string) => {
    const d = new Date(iso)
    return d.toLocaleDateString('pl-PL', { day: '2-digit', month: '2-digit', year: 'numeric' })
  }

  return (
    <div className="min-h-screen bg-[#121212] text-white">
      <div className="mx-auto w-full max-w-3xl px-4 py-12">

        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <button
            type="button"
            onClick={() => router.push('/app')}
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-zinc-400 transition-colors hover:bg-zinc-900 hover:text-white"
          >
            <span>←</span>
            <span>Wróć do aplikacji</span>
          </button>
          <h1 className="text-lg font-semibold text-zinc-100">Ulubione</h1>
          <div className="w-[140px]" />
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <svg className="h-6 w-6 animate-spin text-purple-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
            </svg>
          </div>
        ) : prompts.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 py-24 text-center">
            <Heart size={32} className="text-zinc-700" />
            <p className="text-zinc-400">Nie masz jeszcze ulubionych promptów.</p>
            <p className="text-xs text-zinc-600">Kliknij ikonę serca przy dowolnym prompcie, aby go tu zapisać.</p>
            <button
              type="button"
              onClick={() => router.push('/app')}
              className="mt-2 rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium transition-colors hover:bg-purple-500"
            >
              Przejdź do generatora
            </button>
          </div>
        ) : (
          <ul className="space-y-3">
            {prompts.map((prompt) => (
              <li
                key={prompt.id}
                className="rounded-xl border border-zinc-800 bg-zinc-900 p-4 transition-colors hover:border-zinc-700"
              >
                {/* Row 1: meta */}
                <div className="mb-3 flex items-center gap-2">
                  <span className="rounded bg-purple-600/20 px-2 py-0.5 text-[11px] font-medium text-purple-400">
                    {prompt.model}
                  </span>
                  <span className="text-xs text-zinc-600">{formatDate(prompt.created_at)}</span>
                </div>

                {/* Row 2: content */}
                <p className="mb-4 text-sm leading-relaxed text-zinc-300 whitespace-pre-wrap">
                  {prompt.content}
                </p>

                {/* Row 3: actions */}
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleCopy(prompt.id, prompt.content)}
                    className="rounded-lg bg-zinc-800 px-3 py-1.5 text-xs font-medium text-zinc-300 transition-colors hover:bg-zinc-700 hover:text-white"
                  >
                    {copiedId === prompt.id ? 'Skopiowano ✓' : 'Kopiuj'}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRemoveFavorite(prompt.id)}
                    title="Usuń z ulubionych"
                    className="rounded-lg p-1.5 transition-colors hover:bg-zinc-800"
                  >
                    <Heart size={15} className="fill-red-500 text-red-500" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
