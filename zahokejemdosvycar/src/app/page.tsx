import { HeroSection } from '@/components/HeroSection'
import { RegistrationForm } from '@/components/RegistrationForm'
import { LogoBar } from '@/components/LogoBar'
import { Footer } from '@/components/Footer'
import { PageBackground } from '@/components/PageBackground'
import { PrizesSection } from '@/components/PrizesSection'
import { HowItWorksSection } from '@/components/HowItWorksSection'
import { PhotoBreak } from '@/components/StadiumSection'
import { WinnersSection } from '@/components/WinnersSection'

export default function HomePage() {
  return (
    <>
      <PageBackground />
      <main>
        <HeroSection />
        <HowItWorksSection />
        <PrizesSection />
        <PhotoBreak
          src="/images/venkufinal.png"
          alt="Hokejový stadion ve švýcarských horách"
          heading="Zažijte hokej ve Švýcarsku"
          subtitle={undefined}
        />
        <RegistrationForm />
        <WinnersSection />
      </main>
      <Footer />
    </>
  )
}
