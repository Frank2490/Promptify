'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import Link from 'next/link'

export default function CTASection() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section id="cta" className="py-24 px-6">
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 24 }}
        animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
        className="max-w-3xl mx-auto"
      >
        <div className="relative overflow-hidden rounded-3xl bg-surface-alt border border-border p-8 sm:p-12 text-center">
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[400px] h-[200px] bg-primary/15 blur-[80px] rounded-full pointer-events-none" />

          <div className="relative z-10 flex flex-col items-center gap-6">
            <div>
              <h2 className="font-heading font-bold text-2xl sm:text-3xl md:text-4xl text-foreground tracking-tight mb-3">
                Ulepsz swoje prompty już dziś.
              </h2>
              <p className="text-muted-alt text-sm sm:text-base">
                Dołącz do tysięcy twórców bezpłatnie.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
              <Link
                href="/auth?mode=register"
                className="inline-flex items-center justify-center gap-3 px-6 py-3.5 rounded-full bg-white text-gray-800 text-sm font-medium hover:bg-gray-50 transition-colors shadow-sm"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                </svg>
                Zarejestruj się z Google
              </Link>

              <Link
                href="/auth?mode=register"
                className="px-6 py-3.5 rounded-full bg-primary text-white text-sm font-medium hover:bg-primary-hover transition-colors text-center"
              >
                Zarejestruj się z e-mailem
              </Link>
            </div>

            <p className="text-xs text-muted">
              Masz już konto?{' '}
              <Link href="/auth" className="text-primary-light hover:underline underline-offset-2 transition-colors">
                Zaloguj się
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </section>
  )
}
