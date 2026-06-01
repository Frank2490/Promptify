'use client'

import { useRef } from 'react'
import { motion, useInView, type Variants } from 'framer-motion'
import { IconPencil, IconBrandOpenai, IconClipboardCheck, type Icon } from '@tabler/icons-react'

interface Step {
  icon: Icon
  title: string
  description: string
}

const steps: Step[] = [
  {
    icon: IconPencil,
    title: 'Opisz swój pomysł',
    description: 'Powiedz Promptify co chcesz stworzyć, zwykłymi słowami.',
  },
  {
    icon: IconBrandOpenai,
    title: 'Wybierz model AI',
    description: 'Wybierz DALL-E, Midjourney, Nanobanana, Flux lub Stable Diffusion.',
  },
  {
    icon: IconClipboardCheck,
    title: 'Skopiuj i generuj',
    description: 'Wklej zoptymalizowany prompt bezpośrednio do swojego narzędzia AI.',
  },
]

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1]

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.15 } },
}
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } },
}

export default function HowItWorks() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section id="jak-to-dziala" className="py-24 px-6 bg-surface/30">
      <div ref={ref} className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="font-heading font-bold text-3xl md:text-4xl text-foreground tracking-tight">
            Jak to działa
          </h2>
          <p className="mt-3 text-muted-alt max-w-lg mx-auto">
            Od pomysłu do idealnego promptu w trzech prostych krokach.
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          animate={inView ? 'show' : 'hidden'}
          className="grid grid-cols-1 md:grid-cols-3 gap-10"
        >
          {steps.map((step) => {
            const StepIcon = step.icon
            return (
              <motion.div key={step.title} variants={fadeUp} className="flex flex-col gap-4">
                <StepIcon size={28} stroke={1.5} className="text-primary" />
                <h3 className="font-heading font-semibold text-foreground text-lg">
                  {step.title}
                </h3>
                <p className="text-muted-alt text-sm leading-relaxed">{step.description}</p>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
