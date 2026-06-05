'use client'

import { useRef, useState } from 'react'
import { motion, useInView, type Variants } from 'framer-motion'

interface PricingTier {
  name: string
  price: string
  period: string
  description: string
  features: string[]
  cta: string
  highlighted: boolean
  priceId?: string
  plan?: string
}

const tiers: PricingTier[] = [
  {
    name: 'Free',
    price: '0 zł',
    period: '/mies.',
    description: 'Idealne na start z Promptify.',
    features: [
      '5 promptów dziennie',
      'Tylko model DALL-E',
      'Historia promptów 7 dni',
      '5 ulubionych promptów',
    ],
    cta: 'Zacznij za darmo',
    highlighted: false,
  },
  {
    name: 'Pro',
    price: '29 zł',
    period: '/mies.',
    description: 'Dla twórców, którzy generują często.',
    features: [
      '50 promptów dziennie',
      'Wszystkie modele (DALL-E, Midjourney, Flux, SDXL, NanoBanana)',
      'Historia promptów 30 dni',
      'Nielimitowane ulubione',
    ],
    cta: 'Wybierz Pro',
    highlighted: true,
    priceId: process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID,
    plan: 'pro',
  },
  {
    name: 'Creator',
    price: '79 zł',
    period: '/mies.',
    description: 'Dla zaawansowanych użytkowników i profesjonalistów.',
    features: [
      'Nielimitowane prompty',
      'Wszystkie modele',
      'Nielimitowana historia',
      'Nielimitowane ulubione',
      'Dostęp do API',
    ],
    cta: 'Wybierz Creator',
    highlighted: false,
    priceId: process.env.NEXT_PUBLIC_STRIPE_CREATOR_PRICE_ID,
    plan: 'creator',
  },
]

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1]

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
}
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } },
}

export default function Pricing() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const [loadingTier, setLoadingTier] = useState<string | null>(null)

  const handleCheckout = async (tier: PricingTier) => {
    if (!tier.priceId || !tier.plan) {
      window.location.href = '/auth'
      return
    }
    setLoadingTier(tier.plan)
    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priceId: tier.priceId, plan: tier.plan }),
      })
      if (res.status === 401) {
        window.location.href = '/auth'
        return
      }
      const { url } = await res.json()
      if (url) window.location.href = url
    } finally {
      setLoadingTier(null)
    }
  }

  return (
    <section id="cennik" className="py-24 px-6">
      <div ref={ref} className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="font-heading font-bold text-3xl md:text-4xl text-foreground tracking-tight">
            Cennik
          </h2>
          <p className="mt-3 text-muted-alt max-w-lg mx-auto">
            Bez dodatkowych opłat. Anuluj w dowolnym momencie.
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          animate={inView ? 'show' : 'hidden'}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch"
        >
          {tiers.map((tier) => (
            <motion.div
              key={tier.name}
              variants={fadeUp}
              className={`relative flex flex-col gap-6 rounded-2xl p-7 border ${
                tier.highlighted
                  ? 'bg-surface-alt border-primary/50 shadow-lg shadow-primary/10'
                  : 'bg-surface/50 border-white/10'
              }`}
            >
              {tier.highlighted && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-primary text-white text-xs font-semibold whitespace-nowrap">
                  Najpopularniejszy
                </span>
              )}

              <div>
                <p className="font-heading font-semibold text-foreground text-sm mb-3">
                  {tier.name}
                </p>
                <div className="flex items-baseline gap-1">
                  <span className="font-heading font-bold text-4xl text-foreground">
                    {tier.price}
                  </span>
                  <span className="text-muted text-sm">{tier.period}</span>
                </div>
                <p className="text-muted-alt text-sm mt-2">{tier.description}</p>
              </div>

              <ul className="flex flex-col gap-2.5 flex-1">
                {tier.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-muted-alt">
                    <span className="text-primary-light flex-shrink-0">✓</span>
                    {f}
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handleCheckout(tier)}
                disabled={loadingTier === tier.plan}
                className={`text-center py-2.5 px-5 rounded-full font-medium text-sm transition-colors disabled:opacity-60 disabled:cursor-not-allowed ${
                  tier.highlighted
                    ? 'bg-primary text-white hover:bg-primary-hover'
                    : 'border border-border text-foreground hover:bg-surface'
                }`}
              >
                {loadingTier === tier.plan ? 'Przekierowanie…' : tier.cta}
              </button>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
