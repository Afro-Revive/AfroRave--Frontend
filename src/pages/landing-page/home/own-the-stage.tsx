//Hope! animation included to the section.
import { CategoryBlock } from '@/components/shared/category-block'
import { getRoutePath } from '@/config/get-route-path'
import { useGetTrendingEvents } from '@/hooks/use-event-mutations'
import { cn } from '@/lib/utils'
import { Link } from 'react-router-dom'
import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'

export default function OwnTheStage() {
  const { data: trendingEventResponse, isPending: isLoadingTrending } = useGetTrendingEvents()

  const trendingEvents = trendingEventResponse?.data

  // Ref and inView for the CategoryBlock animation (x-slide)
  const categoryRef = useRef(null)
  const isCategoryInView = useInView(categoryRef, {
    once: true,
    margin: '-100px 0px -100px 0px'
  })

  // Ref and inView for the DetailsBlocks rows animation (y-slide)
  const detailsRef = useRef(null)
  const isDetailsInView = useInView(detailsRef, {
    once: true,
    margin: '-100px 0px -100px 0px'
  })

  return (
    <section className='relative flex flex-col gap-10 md:gap-[100px] pb-8 md:pb-[182px] w-full overflow-hidden'>
      {/* Background layers */}
      <div className='absolute inset-0 bg-[url(/assets/landing-page/section-bg.png)] bg-cover bg-center [filter:grayscale(100%)_opacity(25%)]' />
      <div className='absolute inset-0 bg-gradient-to-b from-[#1e1f1f] via-transparent to-[#1e1f1f] from-[5%] via-50% to-[96%]' />

      {/* Content container */}
      <div className='relative px-5 md:px-14'>
        {/* Animated CategoryBlock (x-slide from right) */}
        <motion.div
          ref={categoryRef}
          initial={false}
          animate={{
            x: (isCategoryInView && !isLoadingTrending) ? 0 : '100%',
            opacity: (isCategoryInView && !isLoadingTrending) ? 1 : 0
          }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          style={{ overflow: 'hidden' }}
          className='mb-7 md:mb-10 overflow-x-hidden'
        >
          <CategoryBlock
            name='Trending'
            data={(trendingEvents ?? [])
              .filter((event) => event)
              .map((event) => ({
                eventId: event.eventId,
                eventName: event.eventName,
                image: event.desktopMedia?.flyer,
                venue: event.venue,
                startDate: event.startDate,
                customUrl: event.customUrl,
                startTime: event.startTime,
              }))}
            showLocation={true}
            isLoading={isLoadingTrending}
            layout='start'
            homePage={true}
          />
        </motion.div>

        {/* Animated wrapper for both DetailsBlock rows (y-slide from bottom) */}
        <motion.div
          ref={detailsRef}
          initial={false}
          animate={{ y: isDetailsInView ? 0 : '50%' }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          {/* First row - blocks 1 and 3 */}
          <div className='flex max-lg:flex-col items-center lg:items-start justify-center gap-[100px] mb-[100px]'>
            <DetailsBlock {...details[0]} position='first' />
            <DetailsBlock {...details[2]} position='third' />
          </div>

          {/* Second row - block 2 centered */}
          <div className='flex justify-center'>
            <DetailsBlock {...details[1]} position='second' />
          </div>
        </motion.div>
      </div>
    </section>
  )
}

function DetailsBlock({ title, href, linkName, details, position = 'first' }: IDetailsBlockProps) {
  return (
    <div
      className={cn('max-w-[554px] flex flex-col items-center gap-2', {
        'z-10 lg:max-w-[375px]': position === 'second',
      })}>
      <span
        className={cn(
          'inline-block text-xl md:text-[28px] lg:leading-[88px] lg:text-[36px] text-center font-phosphate-inline text-white max-lg:text-center text-wrap',
          {
            'max-md:max-w-[190px] lg:w-[426px]': position === 'third' || position === 'first',
            'max-md:max-w-[171px] md:w-full': position === 'second',
          },
        )}>
        {title}
      </span>
      <p
        className={cn(
          'text-sm md:text-xl uppercase text-center font-phosphate max-lg:text-center',
          {
            'mb-1 max-w-[444px]': position === 'second',
          },
        )}>
        {details}
      </p>
      <LinkToAuth href={href} linkName={linkName} />
    </div>
  )
}

function LinkToAuth({ href, linkName }: { href: string; linkName: string }) {
  return (
    <Link
      to={href}
      className='w-fit bg-deep-red text-sm font-light uppercase rounded-[6px] flex items-center justify-center text-center font-sf-compact px-4 py-2'>
      <span>{linkName}</span>
    </Link>
  )
}

const details: IDetails[] = [
  {
    title: 'OWN THE STAGE!',
    href: getRoutePath('creators_home'),
    linkName: 'Create Your Event',
    details:
      'Ready to bring your event to life? With Afro Revive, creating and managing your event has never been easier! From ticket sales to attendee insights, we give you all the tools you need to sell out your event and make it unforgettable.',
  },
  {
    title: "CAN'T MAKE IT TO A CONCERT?",
    href: getRoutePath('resell'),
    linkName: 'RESELL YOUR TICKET',
    details:
      'Our Ticket Resell feature lets you easily sell your tickets to other fans, safely and securely. List, set your price, and let us handle the rest!',
  },
  {
    title: 'READY TO CONNECT WITH EVENTS?',
    href: getRoutePath('creators_home'),
    linkName: 'REGISTER AS A VENDOR',
    details:
      "Get notified about open slots, express interest, and let organizers come to you. Whether you're offering food, tech, logistics, or entertainment—we'll help you stay booked and busy!",
  },
]

interface IDetails {
  title: string
  href: string
  linkName: string
  details: string
}

interface IDetailsBlockProps extends IDetails {
  position: 'first' | 'second' | 'third'
}