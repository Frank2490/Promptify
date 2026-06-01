'use client'

import { useState } from 'react'
import type { User } from '@supabase/supabase-js'

interface SidebarProps {
  user: User | null
  onSignOut: () => void
}

export default function Sidebar({ user, onSignOut }: SidebarProps) {
  const [expanded, setExpanded] = useState(false)

  const firstName = user?.user_metadata?.first_name as string | undefined
  const lastName  = user?.user_metadata?.last_name  as string | undefined
  const email     = user?.email ?? ''

  const displayName = firstName && lastName ? `${firstName} ${lastName}` : firstName ?? email
  const avatarLetter = (firstName?.[0] ?? email[0] ?? '?').toUpperCase()

  return (
    <aside
      style={{ width: expanded ? '240px' : '64px', transition: 'width 200ms ease' }}
      className={`flex flex-col justify-between border-r border-zinc-800 bg-zinc-950 shrink-0 ${!expanded ? 'cursor-pointer' : ''}`}
      onClick={() => setExpanded((v) => !v)}
    >
      {/* Top — avatar + user info */}
      <div className="flex flex-col gap-4 p-3 pt-6">
        <div className={`flex items-center gap-3 ${expanded ? '' : 'justify-center'}`}>
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-purple-600/20 text-sm font-semibold text-purple-400 ring-1 ring-purple-500/30">
            {avatarLetter}
          </div>
          {expanded && (
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-zinc-200">{displayName}</p>
              {firstName && (
                <p className="truncate text-xs text-zinc-500">{email}</p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Bottom — sign out + toggle */}
      <div className="flex flex-col gap-1 p-3 pb-6">
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); onSignOut() }}
          title="Wyloguj się"
          className={`flex items-center gap-2 rounded-lg px-2 py-2 text-sm text-zinc-500 transition-colors hover:bg-zinc-900 hover:text-red-400 ${
            expanded ? '' : 'justify-center'
          }`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
          {expanded && <span>Wyloguj się</span>}
        </button>

        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); setExpanded((v) => !v) }}
          title={expanded ? 'Zwiń' : 'Rozwiń'}
          className={`flex items-center gap-2 rounded-lg px-2 py-2 text-xs text-zinc-600 transition-colors hover:bg-zinc-900 hover:text-zinc-400 ${
            expanded ? '' : 'justify-center'
          }`}
        >
          <span className="text-base leading-none">{expanded ? '‹' : '›'}</span>
          {expanded && <span>Zwiń</span>}
        </button>
      </div>
    </aside>
  )
}
