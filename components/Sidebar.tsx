'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Clock, Heart, User as UserIcon } from 'lucide-react'
import type { User } from '@supabase/supabase-js'

interface SidebarProps {
  user: User | null
  onSignOut: () => void
}

const NAV_ITEMS = [
  { href: '/app/history',   label: 'Historia promptów', Icon: Clock  },
  { href: '/app/favorites', label: 'Ulubione',           Icon: Heart  },
  { href: '/app/profile',   label: 'Profil',             Icon: UserIcon },
]

export default function Sidebar({ user, onSignOut }: SidebarProps) {
  const pathname = usePathname()

  const firstName = user?.user_metadata?.first_name as string | undefined
  const lastName  = user?.user_metadata?.last_name  as string | undefined
  const email     = user?.email ?? ''

  const displayName = firstName && lastName ? `${firstName} ${lastName}` : firstName ?? email
  const avatarLetter = (firstName?.[0] ?? email[0] ?? '?').toUpperCase()

  return (
    <aside className="fixed left-0 top-0 h-screen w-60 flex flex-col border-r border-zinc-800 bg-zinc-950">

      {/* Logo */}
      <div className="shrink-0 px-5 pt-6 pb-5">
        <Link
          href="/app"
          className="font-bold text-white text-lg tracking-tight hover:text-purple-400 transition-colors"
        >
          Promptify
        </Link>
      </div>

      {/* Nowy prompt */}
      <div className="shrink-0 px-3 pb-3">
        <Link
          href="/app"
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-purple-600 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-purple-500"
        >
          <span className="text-base leading-none">+</span>
          Nowy prompt
        </Link>
      </div>

      {/* Nav buttons */}
      <nav className="shrink-0 px-3 flex flex-col gap-0.5">
        {NAV_ITEMS.map(({ href, label, Icon }) => (
          <Link
            key={href}
            href={href}
            className={`flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors
              ${pathname === href
                ? 'bg-zinc-800 text-zinc-100'
                : 'text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200'
              }`}
          >
            <Icon size={15} className="shrink-0" />
            {label}
          </Link>
        ))}
      </nav>

      {/* Spacer */}
      <div className="flex-1" />

      {/* User + sign out */}
      <div className="shrink-0 p-3 pb-5 border-t border-zinc-800/60">
        <Link
          href="/app/profile"
          className="flex items-center gap-3 px-1 mb-3 rounded-lg py-1 transition-colors hover:bg-zinc-900 group"
        >
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-purple-600/20 text-xs font-semibold text-purple-400 ring-1 ring-purple-500/30 group-hover:ring-purple-400/50 transition-all">
            {avatarLetter}
          </div>
          <div className="min-w-0">
            <p className="truncate text-xs font-medium text-zinc-300 group-hover:text-zinc-100 transition-colors">{displayName}</p>
          </div>
        </Link>
        <button
          type="button"
          onClick={onSignOut}
          className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-zinc-500 transition-colors hover:bg-zinc-900 hover:text-red-400"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
          Wyloguj się
        </button>
      </div>
    </aside>
  )
}
