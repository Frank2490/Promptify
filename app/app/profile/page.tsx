'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

const CARD = 'rounded-2xl border border-white/10 bg-zinc-900/60 backdrop-blur-md p-6'
const SECTION_LABEL = 'mb-4 text-[10px] font-semibold uppercase tracking-widest text-zinc-500'
const INPUT = 'w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-2.5 text-sm text-zinc-100 placeholder-zinc-600 outline-none transition-colors focus:border-purple-500/60 focus:ring-1 focus:ring-purple-500/40 disabled:opacity-40 disabled:cursor-not-allowed'
const BTN_PRIMARY = 'rounded-xl bg-purple-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-purple-500 disabled:opacity-50 disabled:cursor-not-allowed'
const BTN_GHOST = 'rounded-xl border border-zinc-700 px-4 py-2 text-sm font-medium text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-zinc-200 disabled:opacity-40 disabled:cursor-not-allowed'

function Feedback({ success, error }: { success?: string; error?: string | null }) {
  if (error) return <p className="text-xs text-red-400">{error}</p>
  if (success) return <p className="text-xs text-green-400">{success}</p>
  return null
}

export default function ProfilePage() {
  const router = useRouter()
  const supabase = createClient()

  // user data
  const [firstName, setFirstName]   = useState('')
  const [lastName, setLastName]     = useState('')
  const [email, setEmail]           = useState('')
  const [joinedAt, setJoinedAt]     = useState('')
  const [avatarLetter, setAvatarLetter] = useState('?')

  // section states
  const [nameLoading, setNameLoading] = useState(false)
  const [nameSuccess, setNameSuccess] = useState('')
  const [nameError, setNameError]     = useState<string | null>(null)

  const [newPassword, setNewPassword]         = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [pwLoading, setPwLoading]             = useState(false)
  const [pwSuccess, setPwSuccess]             = useState('')
  const [pwError, setPwError]                 = useState<string | null>(null)

  const [newEmail, setNewEmail]       = useState('')
  const [emailLoading, setEmailLoading] = useState(false)
  const [emailSuccess, setEmailSuccess] = useState('')
  const [emailError, setEmailError]   = useState<string | null>(null)

  const [deleteConfirm, setDeleteConfirm] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [deleteError, setDeleteError]     = useState<string | null>(null)

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) { router.push('/auth'); return }
      const fn = user.user_metadata?.first_name ?? ''
      const ln = user.user_metadata?.last_name  ?? ''
      setFirstName(fn)
      setLastName(ln)
      setEmail(user.email ?? '')
      setAvatarLetter((fn[0] ?? user.email?.[0] ?? '?').toUpperCase())
      if (user.created_at) {
        setJoinedAt(
          new Date(user.created_at).toLocaleDateString('pl-PL', {
            day: 'numeric', month: 'long', year: 'numeric',
          })
        )
      }
    })
  }, [])

  const handleSaveName = async () => {
    setNameError(null); setNameSuccess('')
    if (!firstName.trim() || !lastName.trim()) { setNameError('Imię i nazwisko są wymagane'); return }
    setNameLoading(true)
    const { error } = await supabase.auth.updateUser({ data: { first_name: firstName.trim(), last_name: lastName.trim() } })
    setNameLoading(false)
    if (error) { setNameError(error.message); return }
    setAvatarLetter(firstName.trim()[0].toUpperCase())
    setNameSuccess('Zapisano.')
    setTimeout(() => setNameSuccess(''), 3000)
  }

  const handleChangePassword = async () => {
    setPwError(null); setPwSuccess('')
    if (!newPassword) { setPwError('Wprowadź nowe hasło'); return }
    if (newPassword.length < 6) { setPwError('Hasło musi mieć co najmniej 6 znaków'); return }
    if (newPassword !== confirmPassword) { setPwError('Hasła nie są zgodne'); return }
    setPwLoading(true)
    const { error } = await supabase.auth.updateUser({ password: newPassword })
    setPwLoading(false)
    if (error) { setPwError(error.message); return }
    setNewPassword(''); setConfirmPassword('')
    setPwSuccess('Hasło zostało zmienione.')
    setTimeout(() => setPwSuccess(''), 4000)
  }

  const handleChangeEmail = async () => {
    setEmailError(null); setEmailSuccess('')
    if (!newEmail.trim()) { setEmailError('Wprowadź nowy adres email'); return }
    setEmailLoading(true)
    const { error } = await supabase.auth.updateUser({ email: newEmail.trim() })
    setEmailLoading(false)
    if (error) { setEmailError(error.message); return }
    setNewEmail('')
    setEmailSuccess('Link potwierdzający został wysłany na nowy adres.')
    setTimeout(() => setEmailSuccess(''), 6000)
  }

  const handleDeleteAccount = async () => {
    setDeleteError(null)
    setDeleteLoading(true)
    const res = await fetch('/api/delete-account', { method: 'DELETE' })
    if (!res.ok) {
      const body = await res.json().catch(() => ({}))
      setDeleteError(body.error ?? 'Nie udało się usunąć konta')
      setDeleteLoading(false)
      return
    }
    await supabase.auth.signOut()
    router.push('/')
  }

  return (
    <div className="relative min-h-screen bg-[#0e0e0e] text-white overflow-hidden">
      <div className="pointer-events-none absolute left-1/2 top-1/3 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-purple-600/8 blur-[140px]" />

      <div className="relative mx-auto w-full max-w-xl px-4 py-12">

        {/* Back button */}
        <button
          type="button"
          onClick={() => router.push('/app')}
          className="mb-8 flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-zinc-500 transition-colors hover:bg-zinc-900 hover:text-zinc-200"
        >
          ← Wróć do aplikacji
        </button>

        <div className="flex flex-col gap-4">

          {/* 1 ── PODSTAWOWE DANE */}
          <section className={CARD}>
            <p className={SECTION_LABEL}>Podstawowe dane</p>

            {/* Avatar row */}
            <div className="mb-6 flex items-center gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-purple-600/20 text-xl font-bold text-purple-400 ring-2 ring-purple-500/30">
                {avatarLetter}
              </div>
              <div className="min-w-0">
                <p className="truncate font-semibold text-zinc-100">
                  {firstName && lastName ? `${firstName} ${lastName}` : email}
                </p>
                {joinedAt && (
                  <p className="mt-0.5 text-xs text-zinc-500">Dołączono: {joinedAt}</p>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <div className="flex gap-3">
                <div className="flex-1">
                  <label className="mb-1.5 block text-xs text-zinc-500">Imię</label>
                  <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="Imię" className={INPUT} />
                </div>
                <div className="flex-1">
                  <label className="mb-1.5 block text-xs text-zinc-500">Nazwisko</label>
                  <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Nazwisko" className={INPUT} />
                </div>
              </div>
              <div>
                <label className="mb-1.5 block text-xs text-zinc-500">Email</label>
                <input type="email" value={email} disabled className={INPUT} />
              </div>
              <Feedback success={nameSuccess} error={nameError} />
              <div>
                <button type="button" onClick={handleSaveName} disabled={nameLoading} className={BTN_PRIMARY}>
                  {nameLoading ? 'Zapisywanie…' : 'Zapisz zmiany'}
                </button>
              </div>
            </div>
          </section>

          {/* 2 ── PLAN I UŻYCIE */}
          <section className={CARD}>
            <p className={SECTION_LABEL}>Plan i użycie</p>
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-zinc-400">Aktualny plan</span>
                <span className="rounded-full bg-zinc-800 px-3 py-0.5 text-xs font-semibold text-zinc-300">
                  Free
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-zinc-400">Użycie promptów</span>
                <span className="text-sm font-medium text-zinc-200">0 / ∞ promptów</span>
              </div>
              <div className="h-px bg-zinc-800" />
              <button
                type="button"
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-purple-500 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
              >
                ✦ Ulepsz plan
              </button>
            </div>
          </section>

          {/* 3 ── PREFERENCJE */}
          <section className={CARD}>
            <p className={SECTION_LABEL}>Preferencje</p>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-zinc-300">Język interfejsu</p>
                <p className="mt-0.5 text-xs text-zinc-500">Polski</p>
              </div>
              <div title="Wkrótce dostępne">
                <button type="button" disabled className={BTN_GHOST}>
                  Zmień język
                </button>
              </div>
            </div>
          </section>

          {/* 4 ── BEZPIECZEŃSTWO */}
          <section className={CARD}>
            <p className={SECTION_LABEL}>Bezpieczeństwo</p>

            {/* Password change */}
            <div className="flex flex-col gap-3">
              <p className="text-sm font-medium text-zinc-300">Zmiana hasła</p>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Nowe hasło"
                autoComplete="new-password"
                className={INPUT}
              />
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Powtórz hasło"
                autoComplete="new-password"
                onKeyDown={(e) => e.key === 'Enter' && handleChangePassword()}
                className={INPUT}
              />
              <Feedback success={pwSuccess} error={pwError} />
              <div>
                <button type="button" onClick={handleChangePassword} disabled={pwLoading} className={BTN_PRIMARY}>
                  {pwLoading ? 'Zmienianie…' : 'Zmień hasło'}
                </button>
              </div>
            </div>

            <div className="my-5 h-px bg-zinc-800" />

            {/* Email change */}
            <div className="flex flex-col gap-3">
              <p className="text-sm font-medium text-zinc-300">Zmiana emaila</p>
              <p className="text-xs text-zinc-500">Na nowy adres zostanie wysłany link potwierdzający.</p>
              <input
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                placeholder="Nowy adres email"
                autoComplete="email"
                className={INPUT}
              />
              <Feedback success={emailSuccess} error={emailError} />
              <div>
                <button type="button" onClick={handleChangeEmail} disabled={emailLoading} className={BTN_PRIMARY}>
                  {emailLoading ? 'Wysyłanie…' : 'Zmień email'}
                </button>
              </div>
            </div>
          </section>

          {/* 5 ── STREFA NIEBEZPIECZNA */}
          <section className="rounded-2xl border border-red-900/50 bg-red-950/10 p-6">
            <p className="mb-1 text-[10px] font-semibold uppercase tracking-widest text-red-500/70">Strefa niebezpieczna</p>
            <p className="mb-5 text-xs text-zinc-500">
              Usunięcie konta jest nieodwracalne. Wszystkie Twoje dane zostaną trwale usunięte.
            </p>

            {deleteError && <p className="mb-3 text-xs text-red-400">{deleteError}</p>}

            {deleteConfirm ? (
              <div className="rounded-xl border border-red-900/40 bg-red-950/20 p-4">
                <p className="mb-4 text-sm text-zinc-300">
                  Czy na pewno chcesz usunąć konto? Tej operacji nie można cofnąć.
                </p>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={handleDeleteAccount}
                    disabled={deleteLoading}
                    className="rounded-xl bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {deleteLoading ? 'Usuwanie…' : 'Tak, usuń konto'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeleteConfirm(false)}
                    className={BTN_GHOST}
                  >
                    Anuluj
                  </button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setDeleteConfirm(true)}
                className="rounded-xl border border-red-900/50 bg-transparent px-4 py-2 text-sm font-medium text-red-400 transition-colors hover:bg-red-950/40 hover:border-red-700"
              >
                Usuń konto
              </button>
            )}
          </section>

        </div>
      </div>
    </div>
  )
}
