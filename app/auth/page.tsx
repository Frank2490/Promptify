'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Mail, CheckCircle, X } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

const INPUT_CLASS =
  'w-full px-4 py-3 rounded-xl bg-background border border-border text-foreground text-sm placeholder:text-muted focus:outline-none focus:border-primary/60 transition-colors'

export default function AuthPage() {
  const router = useRouter()
  const supabase = createClient()

  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [registered, setRegistered] = useState(false)
  const [verified, setVerified] = useState(false)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    if (params.get('verified') === 'true') {
      setVerified(true)
      const t = setTimeout(() => setVerified(false), 5000)
      return () => clearTimeout(t)
    }
    if (params.get('mode') === 'register') {
      setMode('register')
    }
  }, [])

  const switchMode = (next: 'login' | 'register') => {
    setMode(next)
    setError(null)
    setConfirmPassword('')
    setFirstName('')
    setLastName('')
  }

  const handleGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    })
  }

  const handleSubmit = async () => {
    setError(null)

    if (mode === 'register') {
      if (!firstName.trim() || !lastName.trim() || !email.trim() || !password) {
        setError('Wszystkie pola są wymagane')
        return
      }
      if (password !== confirmPassword) {
        setError('Hasła nie są zgodne')
        return
      }
    }

    setLoading(true)
    try {
      if (mode === 'login') {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) { setError(error.message); return }
        router.push('/app')
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { first_name: firstName, last_name: lastName },
            emailRedirectTo: `${window.location.origin}/auth/callback`,
          },
        })
        if (error) { setError(error.message); return }
        setRegistered(true)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-6 py-16 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-primary/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="relative z-10 w-full max-w-sm">
        <div className="text-center mb-8">
          <Link
            href="/"
            className="font-heading font-semibold text-xl text-foreground tracking-tight hover:text-primary-light transition-colors"
          >
            Promptify
          </Link>
        </div>

        {verified && (
          <div className="mb-4 flex items-start gap-3 rounded-xl border border-green-500/30 bg-green-500/10 px-4 py-3">
            <CheckCircle size={18} className="mt-0.5 shrink-0 text-green-400" />
            <p className="flex-1 text-sm text-green-300">
              Email zweryfikowany! Możesz się teraz zalogować.
            </p>
            <button type="button" onClick={() => setVerified(false)} className="shrink-0 text-green-500 hover:text-green-300 transition-colors">
              <X size={16} />
            </button>
          </div>
        )}

        <div className="bg-surface/60 backdrop-blur-md border border-white/10 rounded-2xl p-8 flex flex-col gap-6">
          {registered ? (
            <div className="flex flex-col items-center gap-5 py-4 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/15 ring-1 ring-primary/30">
                <Mail size={26} className="text-primary-light" />
              </div>
              <div className="flex flex-col gap-2">
                <h2 className="font-heading font-bold text-xl text-foreground tracking-tight">
                  Sprawdź swoją skrzynkę
                </h2>
                <p className="text-sm text-muted-alt leading-relaxed">
                  Wysłaliśmy link weryfikacyjny na adres{' '}
                  <span className="text-foreground font-medium">{email}</span>.
                  Kliknij go, aby aktywować konto.
                </p>
              </div>
              <p className="text-xs text-muted">
                Nie widzisz maila? Sprawdź folder spam.
              </p>
            </div>
          ) : (
            <>
              <div className="text-center">
                <h1 className="font-heading font-bold text-2xl text-foreground tracking-tight">
                  {mode === 'login' ? 'Zaloguj się' : 'Zarejestruj się'}
                </h1>
                <p className="mt-1.5 text-sm text-muted-alt">
                  Zaloguj się lub stwórz nowe konto
                </p>
              </div>

              <button
                type="button"
                onClick={handleGoogle}
                className="w-full inline-flex items-center justify-center gap-3 px-5 py-3 rounded-full bg-white text-gray-800 text-sm font-medium hover:bg-gray-50 transition-colors shadow-sm cursor-pointer"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                </svg>
                Kontynuuj z Google
              </button>

              <div className="flex items-center gap-3">
                <div className="flex-1 h-px bg-border/60" />
                <span className="text-xs text-muted">lub</span>
                <div className="flex-1 h-px bg-border/60" />
              </div>

              <div className="flex flex-col gap-3">
                {mode === 'register' && (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="Imię"
                      autoComplete="given-name"
                      className={INPUT_CLASS}
                    />
                    <input
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="Nazwisko"
                      autoComplete="family-name"
                      className={INPUT_CLASS}
                    />
                  </div>
                )}

                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Adres e-mail"
                  autoComplete="email"
                  className={INPUT_CLASS}
                />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Hasło"
                  autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                  onKeyDown={(e) => mode === 'login' && e.key === 'Enter' && handleSubmit()}
                  className={INPUT_CLASS}
                />

                {mode === 'register' && (
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Powtórz hasło"
                    autoComplete="new-password"
                    onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                    className={INPUT_CLASS}
                  />
                )}

                {error && (
                  <p className="text-xs text-red-400 px-1">{error}</p>
                )}

                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={loading}
                  className="w-full mt-1 py-3 rounded-xl bg-primary text-white text-sm font-medium hover:bg-primary-hover transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Ładowanie…' : mode === 'login' ? 'Zaloguj się' : 'Zarejestruj się'}
                </button>
              </div>

              <p className="text-center text-sm text-muted">
                {mode === 'login' ? 'Nie masz konta?' : 'Masz już konto?'}{' '}
                <button
                  type="button"
                  onClick={() => switchMode(mode === 'login' ? 'register' : 'login')}
                  className="text-primary-light hover:underline underline-offset-2 transition-colors"
                >
                  {mode === 'login' ? 'Zarejestruj się' : 'Zaloguj się'}
                </button>
              </p>
            </>
          )}
        </div>
      </div>
    </main>
  )
}
