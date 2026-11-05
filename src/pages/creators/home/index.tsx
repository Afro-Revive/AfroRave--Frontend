import CreatorsFooter from '@/layouts/creators-landing-page-layout/sections/creators-footer'
import CreatorsHubSection from './sections/creators-hub'

export default function CreatorsHomePage() {
  return (
    <main className='w-full min-h-svh flex flex-col bg-[#0B0B0B]'>
      <CreatorsHubSection />
      <CreatorsFooter tone='dark' />
    </main>
  )
}
