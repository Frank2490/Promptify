import Navbar from '@/components/landing/Navbar'
import Hero from '@/components/landing/Hero'
import SocialProofBar from '@/components/landing/SocialProofBar'
import Features from '@/components/landing/Features'
import HowItWorks from '@/components/landing/HowItWorks'
import Pricing from '@/components/landing/Pricing'
import CTASection from '@/components/landing/CTASection'
import Footer from '@/components/landing/Footer'

export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />
      <SocialProofBar />
      <Features />
      <HowItWorks />
      <Pricing />
      <CTASection />
      <Footer />
    </main>
  )
}
