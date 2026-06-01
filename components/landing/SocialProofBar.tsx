'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

const models = ['DALL-E', 'Midjourney', 'Flux', 'Stable Diffusion', 'NanoBanana']

export default function SocialProofBar() {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <motion.section
      ref={ref}
      initial={{ opacity: 0, y: 16 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="py-10 border-y border-border/50"
    >
      <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-center gap-4">
        <span className="text-muted text-sm font-medium">Współpracuje z:</span>
        <div className="flex flex-wrap items-center justify-center gap-3">
          {models.map((model) => (
            <span
              key={model}
              className="px-4 py-1.5 rounded-full bg-surface border border-border/60 text-muted-alt text-sm font-medium"
            >
              {model}
            </span>
          ))}
        </div>
      </div>
    </motion.section>
  )
}
