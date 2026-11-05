import CreatorsFooter from '@/layouts/creators-landing-page-layout/sections/creators-footer'
import AboutHeroSection from './sections/about-hero'
import DustBackground from './sections/dust-background'
import TeamSection from './sections/team'
import WhatWeOfferSection from './sections/what-we-offer'
import WorkWithUsBanner from './sections/work-with-us-banner'

// The sections have no background of their own, so the dust shows behind all of them.
export default function AboutUsPage() {
  return (
    <main className='relative isolate w-full min-h-svh flex flex-col bg-black'>
      <DustBackground />
      <AboutHeroSection />
      <WhatWeOfferSection />
      <TeamSection />
      <WorkWithUsBanner />
      <CreatorsFooter tone='dark' />
    </main>
  )
}
