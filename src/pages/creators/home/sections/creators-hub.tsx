import { getRoutePath } from '@/config/get-route-path'
import { useAuth } from '@/contexts/auth-context'
import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
const HERO_VIDEO_SRC = '/assets/creators/creators-dashboard-video.mp4'


export default function CreatorsHubSection() {
  const { openAuthModal } = useAuth()

  return (
    // flex-1: on a tall screen the hero fills down to the footer.
    <section className='relative w-full flex-1 overflow-hidden bg-[#0B0B0B] text-white'>
      <HeroVideo />

      <div className='relative z-10 w-full max-w-9xl  px-6 md:px-[60px] pt-28 pb-16 md:pt-[112px] md:pb-24'>
        <div className='flex w-full max-w-[700px] flex-col'>
          <h1 className='font-work-sans font-black uppercase text-[44px] leading-[1.1] md:text-[100px] md:leading-[1.15]'>
            All-in-one hub for creators
          </h1>

          <p className='mt-2 font-work-sans text-xl font-bold uppercase leading-snug md:text-2xl'>
            Explore our tools for seamless event management.
          </p>

          <p className='mt-2 font-work-sans text-base text-[#464444] md:text-lg'>Choose Your Role</p>
          <div className='mt-2 flex items-center gap-3'>
            <RoleButton onClick={() => openAuthModal('signup', 'creator')}>Organizer</RoleButton>
            <RoleButton onClick={() => openAuthModal('signup', 'vendor')}>Vendor</RoleButton>
          </div>

          <div className='mt-8 flex flex-col gap-6 font-work-sans text-base leading-snug md:text-xl'>
            <p>
              <strong className='font-bold'>AFROREVIVE</strong> is a powerhouse for entertainment,
              connecting the tools and experiences that bring events to life.
            </p>
            <p>
              Beyond ticketing, we provide screen rental solutions for live experiences while
              expanding into media production and original entertainment concepts. At the centre is
              our ticketing platform, built for organizers and vendors to manage opportunities,
              connect with audiences and bring their ideas to life.
            </p>
            <p>
              Our creative thinking also extends beyond the platform. As co-founders of <span className='font-bold italic'>OFFTHEDECK
                </span>,
              we bring that vision into set design, visual direction, marketing.
            </p>
          </div>

          <Link
            to={getRoutePath('creators_about')}
            className='mt-4 w-fit font-work-sans text-sm uppercase underline text-tech-blue decoration-2 underline-offset-[6px] hover:text-white/70'>
            About Us
          </Link>
        </div>
      </div>
    </section>
  )
}

function RoleButton({ onClick, children }: { onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type='button'
      onClick={onClick}
      className='h-10 min-w-[120px] rounded-lg border border-white/50 px-6 font-inter-tight text-sm font-semibold text-white transition-colors hover:bg-white hover:text-black'>
      {children}
    </button>
  )
}


function HeroVideo() {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    // Autoplay only works muted, and the attribute alone isn't always enough.
    // Older browsers (and jsdom) return nothing from play(), so the catch is optional.
    video.muted = true
    video.play()?.catch(() => {})
  }, [])

  if (!HERO_VIDEO_SRC) return null

  return (
    <div
      aria-hidden
      className='absolute inset-0 md:block hidden opacity-40 md:inset-y-0 md:left-auto md:right-0 md:w-[60%] md:opacity-100'>
      <video
        ref={videoRef}
        src={HERO_VIDEO_SRC}
        autoPlay
        muted
        loop
        playsInline
        preload='auto'
        className='size-full object-cover [mask-image:radial-gradient(ellipse_at_center,black_35%,transparent_72%)]'
      />
    </div>
  )
}
