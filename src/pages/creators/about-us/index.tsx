import CreatorsFooter from '@/layouts/creators-landing-page-layout/sections/creators-footer'
import AboutHeroSection from './sections/about-hero'
import TeamSection from './sections/team'
import WhatWeOfferSection from './sections/what-we-offer'
import WorkWithUsBanner from './sections/work-with-us-banner'

export default function AboutUsPage() {
  return (
    <main className='w-full min-h-svh flex flex-col bg-black'>
      <AboutHeroSection />
      <WhatWeOfferSection />
      <TeamSection />
      <WorkWithUsBanner />
      <CreatorsFooter tone='dark' />
    </main>
  )
}
