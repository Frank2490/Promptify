'use client'

import { useRef } from 'react'
import { motion, useInView, type Variants } from 'framer-motion'
import { IconBolt, IconSparkles, IconAdjustmentsHorizontal } from '@tabler/icons-react'

const features = [
  {
    icon: IconBolt,
    title: 'Błyskawiczne generowanie',
    description:
      'Opisz swoją wizję i otrzymaj idealnie stworzony prompt w ułamku sekundy.',
  },
  {
    icon: IconSparkles,
    title: 'Wsparcie wielu modeli',
    description:
      'Każdy prompt jest zoptymalizowany pod konkretną składnię i mocne strony danego modelu AI.',
  },
  {
    icon: IconAdjustmentsHorizontal,
    title: 'Edytuj każdy detal',
    description:
      'Oświetlenie, nastrój, kompozycja i styl. Każdy parametr edytujesz jednym kliknięciem.',
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

export default function Features() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section id="features" className="py-24 px-6">
      <div ref={ref} className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="font-heading font-bold text-3xl md:text-4xl text-foreground tracking-tight">
            Wie czego potrzebujesz
          </h2>
          <p className="mt-3 text-muted-alt max-w-lg mx-auto">
            Zaprojektowane dla twórców, którym zależy na każdym szczególe.

          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          animate={inView ? 'show' : 'hidden'}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {features.map((f) => (
            <motion.div
              key={f.title}
              variants={fadeUp}
              className="bg-surface/50 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:border-primary/30 transition-colors"
            >
              <f.icon size={28} stroke={1.5} className="mb-4 text-primary" />
              <h3 className="font-heading font-semibold text-lg text-foreground mb-2">
                {f.title}
              </h3>
              <p className="text-muted-alt text-sm leading-relaxed">{f.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
