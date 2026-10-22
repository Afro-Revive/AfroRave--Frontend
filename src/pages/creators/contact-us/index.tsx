import CreatorsFooter from '@/layouts/creators-landing-page-layout/sections/creators-footer'
import GetInTouchSection from './section/get-in-touch'

export default function ContactUsPage() {
  return (
    <main className='w-full min-h-svh flex flex-col bg-white'>
      <GetInTouchSection />
      <CreatorsFooter tone='dark' />
    </main>
  )
}
