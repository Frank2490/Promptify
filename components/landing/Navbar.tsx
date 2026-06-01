'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'

const links = [
  { label: 'Produkt', href: '#hero' },
  { label: 'Funkcje', href: '#features' },
  { label: 'Jak to działa', href: '#jak-to-dziala' },
  { label: 'Cennik', href: '#cennik' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  const handleLinkClick = () => setMenuOpen(false)

  return (
    <motion.header
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled || menuOpen ? 'bg-background/90 backdrop-blur-md border-b border-border/50' : ''
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <span className="font-heading font-semibold text-lg text-foreground tracking-tight">
          Promptify
        </span>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="px-4 py-2 text-sm text-muted-alt hover:text-foreground transition-colors rounded-full hover:bg-white/5"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Desktop CTA + mobile hamburger */}
        <div className="flex items-center gap-2">
          <Link
            href="/auth"
            className="hidden md:inline-flex px-5 py-2 rounded-full border border-border text-foreground text-sm font-medium hover:bg-white/5 transition-colors"
          >
            Zaloguj się
          </Link>
          <Link
            href="/auth?mode=register"
            className="hidden md:inline-flex px-5 py-2 rounded-full bg-primary text-white text-sm font-medium hover:bg-primary-hover transition-colors"
          >
            Zarejestruj się
          </Link>

          <button
            type="button"
            aria-label="Menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((o) => !o)}
            className="md:hidden flex flex-col justify-center items-center w-9 h-9 gap-1.5 rounded-lg hover:bg-white/5 transition-colors"
          >
            <motion.span
              animate={menuOpen ? { rotate: 45, y: 7 } : { rotate: 0, y: 0 }}
              transition={{ duration: 0.2 }}
              className="block w-5 h-px bg-foreground origin-center"
            />
            <motion.span
              animate={menuOpen ? { opacity: 0 } : { opacity: 1 }}
              transition={{ duration: 0.15 }}
              className="block w-5 h-px bg-foreground"
            />
            <motion.span
              animate={menuOpen ? { rotate: -45, y: -7 } : { rotate: 0, y: 0 }}
              transition={{ duration: 0.2 }}
              className="block w-5 h-px bg-foreground origin-center"
            />
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
            className="md:hidden overflow-hidden border-t border-border/40"
          >
            <nav className="flex flex-col px-6 py-4 gap-1">
              {links.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={handleLinkClick}
                  className="py-2.5 px-3 text-sm text-muted-alt hover:text-foreground hover:bg-white/5 rounded-lg transition-colors"
                >
                  {link.label}
                </a>
              ))}
              <Link
                href="/auth"
                onClick={handleLinkClick}
                className="mt-3 py-3 px-5 rounded-full border border-border text-foreground text-sm font-medium text-center hover:bg-white/5 transition-colors"
              >
                Zaloguj się
              </Link>
              <Link
                href="/auth?mode=register"
                onClick={handleLinkClick}
                className="py-3 px-5 rounded-full bg-primary text-white text-sm font-medium text-center hover:bg-primary-hover transition-colors"
              >
                Zarejestruj się
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}
