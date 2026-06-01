'use client'

import Link from 'next/link'
import { motion, type Variants } from 'framer-motion'
import { GridPattern } from '@/components/ui/grid-pattern'
import { cn } from '@/lib/utils'

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1]

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
}
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
}

export default function Hero() {
  return (
    <section id="hero" className="relative min-h-screen flex flex-col items-center justify-center px-6 pt-16 text-center overflow-hidden">
      <GridPattern
        squares={[[2,2],[4,6],[8,3],[13,8],[16,4],[20,10],[6,12],[10,5],[18,7]]}
        className={cn(
          'fill-white/[0.03] stroke-white/[0.06]',
          '[mask-image:radial-gradient(ellipse_60%_70%_at_50%_50%,transparent_30%,white_100%)]',
        )}
      />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-primary/20 blur-[120px] rounded-full pointer-events-none" />

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="relative z-10 max-w-3xl flex flex-col items-center gap-6"
      >


        <motion.h1
          variants={fadeUp}
          className="font-heading font-bold text-[2rem] sm:text-5xl md:text-7xl text-foreground tracking-tight leading-[1.08]"
        >
          Zamień swój pomysł w{' '}
          <span className="text-primary-light">potężne prompty dla AI.</span>
        </motion.h1>

        <motion.p
          variants={fadeUp}
          className="text-base md:text-xl text-muted-alt max-w-xl leading-relaxed"
        >
          Opisujesz obraz w swoich słowach, a Promptify przekształca go w zoptymalizowany prompt dla modeli AI.
        </motion.p>

        <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-3 mt-2 w-full sm:w-auto">
          <Link
            href="/app"
            className="px-8 py-3.5 rounded-full bg-primary text-white font-medium text-base hover:bg-primary-hover transition-colors text-center"
          >
            Zacznij za darmo
          </Link>
          <a
            href="#features"
            className="px-8 py-3.5 rounded-full border border-border text-foreground font-medium text-base hover:bg-surface transition-colors text-center"
          >
            Zobacz przykłady
          </a>
        </motion.div>
      </motion.div>
    </section>
  )
}
