import { Button } from '@/components/ui/button'
import { SEO } from '@/components/seo'
import { getRoutePath } from '@/config/get-route-path'
import { VideoBackgroundWrapper } from '@/components/shared/video-background-wrapper'

export default function CreatorsPage() {
  return (
    <>
      <SEO
        title='Afrorevive - For Creators & Organizers'
        description='All-in-one hub for fans and creators. Create, manage, and sell out your events.'
      />
      <VideoBackgroundWrapper
        videoSrc='/assets/creators-background.mp4'
        backgroundImage='/assets/landing-page/BG-3.webp'
        secondColor='#a2a2a2'
        overlayOpacity={0.2}
      >
        <div className='text-white pt-40 md:pt-36'>
          <HeroSection />
          <OrganizersSection />
          <VendorsSection />
          <SeamlessManagementSection />
          <OurStorySection />
          <OurMissionSection />
          <NextGenLeadershipSection />
          <WorkWithUsSection />
          <NewsletterSection />
        </div>
      </VideoBackgroundWrapper>
    </>
  )
}

function HeroSection() {
  return (
    <section className='min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 md:px-12 py-20 text-center'>
      <div className='max-w-4xl space-y-8 md:space-y-10'>
        <h1 className='text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black uppercase leading-tight tracking-tight'>
          ALL-IN-ONE HUB<br />FOR FANS AND ORGANIZERS
        </h1>
        <p className='text-xs sm:text-sm md:text-base text-white max-w-3xl mx-auto leading-relaxed px-4 uppercase tracking-wide'>
          AFRO REVIVE BRINGS TOGETHER ORGANIZERS, VENDORS, AND FANS IN ONE UNIFIED PLATFORM. ORGANIZERS CAN EFFICIENTLY CREATE AND MANAGE EVENTS, VENDORS CAN SHOWCASE THEIR OFFERINGS AND SECURE SLOTS, WHILE FANS BENEFIT FROM SEAMLESS TICKETING WITH THE FLEXIBILITY TO RESELL, TRANSFER, OR UPGRADE. A TRULY COMPREHENSIVE SOLUTION FOR EVERY EVENT EXPERIENCE
        </p>

        {/* Email input and button */}
        <div className='flex flex-col sm:flex-row gap-3 max-w-xl mx-auto items-center justify-center'>
          <input
            type='email'
            placeholder='ENTER EMAIL ADDRESS'
            className='w-full sm:flex-1 h-12 px-6 rounded-md bg-white text-black placeholder:text-gray-500 text-sm uppercase tracking-wide focus:outline-none'
          />
          <button className='w-full sm:w-auto h-12 px-8 bg-white text-black font-semibold uppercase text-sm rounded-md hover:bg-gray-100 transition-colors whitespace-nowrap'>
            STAY TUNED
          </button>
        </div>
      </div>
    </section>
  )
}

function OrganizersSection() {
  return (
    <section className='min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 md:px-12 py-12 md:py-20'>
      <div className='max-w-4xl w-full space-y-6 md:space-y-8'>
        <h2 className='text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black uppercase text-center'>
          Organizers
        </h2>
        <p className='text-sm sm:text-base md:text-lg text-white/80 text-center leading-relaxed max-w-2xl mx-auto px-4'>
          Let's create a world of seamless event planning and execution. Manage every aspect of your events with ease—from ticketing and guestlists to real-time analytics. Sell out faster, engage your audience, and bring your vision to life.
        </p>
        <div className='flex justify-center pt-2 md:pt-4'>
          <Button
            asChild
            className='bg-white text-black hover:bg-white/90 rounded-full px-6 sm:px-8 py-4 sm:py-6 h-auto text-sm sm:text-base font-semibold uppercase'
          >
            <a href='#organizers'>Learn More</a>
          </Button>
        </div>

        {/* Placeholder for image */}
        <div className='w-full h-48 sm:h-64 md:h-80 lg:h-96 bg-gray-800/50 rounded-lg flex items-center justify-center mt-8 md:mt-12'>
          <p className='text-white/50 uppercase text-xs sm:text-sm'>Find offers will be here</p>
        </div>
      </div>
    </section>
  )
}

function VendorsSection() {
  return (
    <section className='min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 md:px-12 py-12 md:py-20'>
      <div className='max-w-4xl w-full space-y-6 md:space-y-8'>
        <h2 className='text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black uppercase text-center'>
          Vendors
        </h2>
        <p className='text-sm sm:text-base md:text-lg text-white/80 text-center leading-relaxed max-w-2xl mx-auto px-4'>
          Our smart vendor marketplace offers everything from catering to AV services, connecting vendors with organizers for seamless collaboration. Grow your business, expand your network, and unlock new revenue streams.
        </p>
        <div className='flex justify-center pt-2 md:pt-4'>
          <Button
            asChild
            className='bg-white text-black hover:bg-white/90 rounded-full px-6 sm:px-8 py-4 sm:py-6 h-auto text-sm sm:text-base font-semibold uppercase'
          >
            <a href='#vendors'>Learn More</a>
          </Button>
        </div>

        {/* Placeholder for image */}
        <div className='w-full h-48 sm:h-64 md:h-80 lg:h-96 bg-gray-800/50 rounded-lg flex items-center justify-center mt-8 md:mt-12'>
          <p className='text-white/50 uppercase text-xs sm:text-sm'>Find offers will be here</p>
        </div>
      </div>
    </section>
  )
}

function SeamlessManagementSection() {
  return (
    <section className='min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 md:px-12 py-12 md:py-20'>
      <div className='max-w-4xl w-full space-y-6 md:space-y-8'>
        <h2 className='text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black uppercase text-center'>
          Seamless Management
        </h2>
        <p className='text-sm sm:text-base md:text-lg text-white/80 text-center leading-relaxed max-w-2xl mx-auto px-4'>
          The Afrorevive mobile app brings all your event management tools to your fingertips. Scan tickets, manage guestlists, stay connected—all in one place. Download now and make managing events effortless, whether you're on-site or on-the-go.
        </p>

        {/* App Store Badges */}
        <div className='flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center pt-4'>
          <a href='#' className='inline-block'>
            <div className='h-10 sm:h-12 md:h-14 px-6 py-2 bg-black rounded-lg flex items-center gap-2'>
              <span className='text-white text-xs sm:text-sm'>Google Play</span>
            </div>
          </a>
          <a href='#' className='inline-block'>
            <div className='h-10 sm:h-12 md:h-14 px-6 py-2 bg-black rounded-lg flex items-center gap-2'>
              <span className='text-white text-xs sm:text-sm'>App Store</span>
            </div>
          </a>
        </div>
      </div>
    </section>
  )
}

function OurStorySection() {
  return (
    <section className='min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 md:px-12 py-12 md:py-20'>
      <div className='max-w-4xl w-full space-y-6 md:space-y-8'>
        <h2 className='text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black uppercase text-center'>
          Our Story
        </h2>
        <div className='text-sm sm:text-base md:text-lg text-white/80 leading-relaxed space-y-4 px-4'>
          <p>
            Afro Revive was founded to make the event experience more accessible and more convenient for fans. We believe that creative events like <span className='font-bold'>Afrobeats</span> are <span className='font-bold'>Cybernetic Organisms</span>, <span className='font-bold'>External Mediation</span>, Nigeria's largest event company, rental company, and media brand together with <span className='font-bold'>Afro Revive</span>.
          </p>
          <p>
            What started as a small idea has grown into a "company" with these key aims: together, we connect people, introduction, and upcoming media platform for promoting creative and business.
          </p>
        </div>
      </div>
    </section>
  )
}

function OurMissionSection() {
  return (
    <section className='min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 md:px-12 py-12 md:py-20'>
      <div className='max-w-4xl w-full space-y-6 md:space-y-8'>
        <h2 className='text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black uppercase text-center'>
          Our Mission
        </h2>
        <div className='text-sm sm:text-base md:text-lg text-white/80 leading-relaxed space-y-4 px-4'>
          <p>
            Our mission is to bridge creativity, technology and commerce. Whether you're an event organizer or a vendor, we're here to help you succeed.
          </p>
          <p>
            We're building intuitive tools and platforms that empower creatives, vendors, and organizers—while fostering connection, culture, and community across Africa's entertainment landscape.
          </p>
          <p>
            Through innovation and inclusivity, we aim to make every experience more seamless, expressive, and impactful—from Nigeria to the world.
          </p>
        </div>
      </div>
    </section>
  )
}

function NextGenLeadershipSection() {
  const team = [
    {
      initials: 'EA',
      name: 'Ebosele Atie',
      role: 'Co-Founder & President/Design',
    },
    {
      initials: 'CY',
      name: 'Cyril Atie',
      role: 'Co-Founder',
    },
    {
      initials: 'PO',
      name: 'Peter Osian',
      role: 'Head Developer',
    },
  ]

  return (
    <section className='min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 md:px-12 py-12 md:py-20'>
      <div className='max-w-4xl w-full space-y-8 md:space-y-12'>
        <h2 className='text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black uppercase text-center'>
          Next Gen Leadership
        </h2>
        <p className='text-sm sm:text-base md:text-lg text-white/80 text-center leading-relaxed px-4'>
          Our leadership reflects a new generation shaping the future of events, technology and creative culture.
        </p>

        <div className='space-y-6 md:space-y-8 max-w-md mx-auto'>
          {team.map((member) => (
            <div key={member.initials} className='flex items-center gap-4 sm:gap-6'>
              <div className='w-12 h-12 sm:w-16 sm:h-16 rounded-full border-2 border-white flex items-center justify-center flex-shrink-0'>
                <span className='text-lg sm:text-xl font-bold'>{member.initials}</span>
              </div>
              <div>
                <h3 className='text-base sm:text-xl font-bold'>{member.name}</h3>
                <p className='text-sm sm:text-base text-white/70'>{member.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function WorkWithUsSection() {
  return (
    <section className='min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 md:px-12 py-12 md:py-20 border-t border-white/10'>
      <div className='max-w-4xl w-full space-y-6 md:space-y-8'>
        <h2 className='text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black uppercase text-center'>
          Work with us
        </h2>
        <p className='text-sm sm:text-base md:text-lg text-white/80 text-center leading-relaxed max-w-2xl mx-auto px-4'>
          As we grow, we're always open to working with forward-thinking brands, creatives, and government partners who share our vision for culture and community.
        </p>
        <p className='text-sm sm:text-base md:text-lg text-white/80 text-center leading-relaxed max-w-2xl mx-auto px-4'>
          Interested in partnering with us? Let's build something great together.
        </p>
        <div className='flex justify-center pt-2 md:pt-4'>
          <Button
            asChild
            className='bg-white text-black hover:bg-white/90 rounded-full px-6 sm:px-8 py-4 sm:py-6 h-auto text-sm sm:text-base font-semibold uppercase'
          >
            <a href={getRoutePath('creators_contact')}>Contact Us</a>
          </Button>
        </div>
      </div>
    </section>
  )
}

function NewsletterSection() {
  return (
    <section className='min-h-[60vh] flex flex-col items-center justify-center px-4 sm:px-6 md:px-12 py-12 md:py-20'>
      <div className='max-w-2xl w-full space-y-4 md:space-y-6 text-center'>
        <h2 className='text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black uppercase'>
          Stay in the loop
        </h2>
        <p className='text-sm sm:text-base text-white/80 px-4'>
          Subscribe for updates, exclusive offers, and insider news.
        </p>
        <div className='flex flex-col sm:flex-row gap-3 sm:gap-4 max-w-md mx-auto pt-2'>
          <input
            type='email'
            placeholder='Enter your email'
            className='flex-1 h-10 sm:h-12 px-4 rounded-full bg-white/10 border border-white/20 text-white placeholder:text-white/50 focus:outline-none focus:border-white/40 text-sm sm:text-base'
          />
          <Button className='bg-black border-2 border-white text-white hover:bg-white hover:text-black rounded-full px-6 sm:px-8 h-10 sm:h-12 font-semibold uppercase text-sm sm:text-base'>
            Submit
          </Button>
        </div>
      </div>
    </section>
  )
}
