'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function AuthPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  return (
    <main className="min-h-screen flex items-center justify-center px-6 py-16 relative overflow-hidden">
      {/* background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-primary/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="relative z-10 w-full max-w-sm">
        {/* logo */}
        <div className="text-center mb-8">
          <Link
            href="/"
            className="font-heading font-semibold text-xl text-foreground tracking-tight hover:text-primary-light transition-colors"
          >
            Promptify
          </Link>
        </div>

        {/* card */}
        <div className="bg-surface/60 backdrop-blur-md border border-white/10 rounded-2xl p-8 flex flex-col gap-6">
          {/* heading */}
          <div className="text-center">
            <h1 className="font-heading font-bold text-2xl text-foreground tracking-tight">
              Zaloguj się
            </h1>
            <p className="mt-1.5 text-sm text-muted-alt">
              Zaloguj się lub stwórz nowe konto
            </p>
          </div>

          {/* Google button */}
          <button
            type="button"
            className="w-full inline-flex items-center justify-center gap-3 px-5 py-3 rounded-full bg-white text-gray-800 text-sm font-medium hover:bg-gray-50 transition-colors shadow-sm"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            Kontynuuj z Google
          </button>

          {/* divider */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-border/60" />
            <span className="text-xs text-muted">lub</span>
            <div className="flex-1 h-px bg-border/60" />
          </div>

          {/* form */}
          <div className="flex flex-col gap-3">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Adres e-mail"
              autoComplete="email"
              className="w-full px-4 py-3 rounded-xl bg-background border border-border text-foreground text-sm placeholder:text-muted focus:outline-none focus:border-primary/60 transition-colors"
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Hasło"
              autoComplete="current-password"
              className="w-full px-4 py-3 rounded-xl bg-background border border-border text-foreground text-sm placeholder:text-muted focus:outline-none focus:border-primary/60 transition-colors"
            />
            <button
              type="button"
              className="w-full mt-1 py-3 rounded-xl bg-primary text-white text-sm font-medium hover:bg-primary-hover transition-colors"
            >
              Zaloguj się
            </button>
          </div>

          {/* login link */}
          <p className="text-center text-sm text-muted">
            Nie masz konta?{' '}
            <button type="button" className="text-primary-light hover:underline underline-offset-2 transition-colors">
              Zarejestruj się
            </button>
          </p>
        </div>
      </div>
    </main>
  )
}
