import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { AiOutlineUsergroupAdd } from "react-icons/ai"
import { IoAnalytics } from 'react-icons/io5'
import { BsShopWindow } from 'react-icons/bs'
import { FaRegLightbulb } from "react-icons/fa";
import { BiSearchAlt } from 'react-icons/bi'
import { GrSecure } from "react-icons/gr";
import { AiFillThunderbolt } from "react-icons/ai";
import { GoUnverified } from "react-icons/go";

export default function WhatWeOfferSection() {
  return (
    <section className='w-full text-white'>
      <div className='w-full max-w-[1280px] mx-auto flex flex-col items-center px-6 pt-6 md:px-[60px]'>
        <h2 className='text-center font-work-sans font-black uppercase text-[40px] leading-none md:text-[88px]'>
          What we offer
        </h2>

        <p className='mt-6 max-w-2xl text-center font-work-sans text-base leading-snug md:text-xl'>
          We give creators the tools to sell tickets, manage vendors, and grow their audience, all
          from one powerful platform built for the live event scene.
        </p>

        <div className='mt-10 grid w-full max-w-5xl grid-cols-1 gap-4 md:mt-12 md:grid-cols-2 md:gap-8'>
          {OFFERS.map((offer) => (
            <OfferCard key={offer.role} {...offer} />
          ))}
        </div>

        <dl className='mt-10 grid w-full max-w-[1040px] grid-cols-1 border-y border-[#ACACAC] md:grid-cols-3'>
          {STATS.map((stat) => (
            <div
              key={stat.label}
              className='flex flex-col items-center justify-center gap-2 border-[#ACACAC] py-10 text-center font-inter-tight font-medium uppercase max-md:border-b max-md:last:border-b-0 md:min-h-[250px] md:border-r md:last:border-r-0'>
              <dd className='text-3xl md:text-[32px]'>{stat.value}</dd>
              <dt className='max-w-[200px] text-base md:text-xl leading-tight'>{stat.label}</dt>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}

/** One role's card: its features as an accordion, one open at a time (all closed to start). */
function OfferCard({ role, features }: (typeof OFFERS)[number]) {
  return (
    <div
      className='rounded-4xl border border-[#464444]'
      >
      <div className='flex h-full flex-col gap-8 rounded-[36px] px-8 py-10 md:px-14 '>
        <h3 className='font-input-mono text-lg md:text-xl uppercase tracking-[0.7em]'>{role}</h3>

        <Accordion type='single' collapsible className='w-full'>
          {features.map(({ title, description, Icon }) => (
            <AccordionItem key={title} value={title} className='border-[#464444]'>
              <AccordionTrigger className='items-center rounded-none py-4 font-inter-tight text-sm font-semibold text-white hover:no-underline md:text-base data-[state=open]:text-deep-red [&>svg]:text-white [&[data-state=open]>svg]:text-deep-red'>
                <span className='flex items-center gap-2.5'>
                  <Icon className='xl:size-5 size-4 shrink-0' />
                  {title}
                </span>
              </AccordionTrigger>
              <AccordionContent className='font-inter-tight text-sm leading-snug text-white'>
                {description}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  )
}

const OFFERS = [
  {
    role: 'Organizer',
    features: [
      {
        title: 'Private Events & Guestlists',
        Icon: AiOutlineUsergroupAdd,
        description:
          'Keep your event exclusive. Approve who can buy tickets, send invite-only tickets to guests on your guestlist and admit them by name at the door.',
      },
      {
        title: 'Event Analytics',
        Icon: IoAnalytics,
        description:
          'Track ticket sales, revenue and check-ins as they happen, so you always know how your event is performing.',
      },
      {
        title: 'Vendor Applications',
        Icon: BsShopWindow,
        description:
          'Post vendor slots on your event and let vendors come to you. Review each application and approve the ones that fit your event.',
      },
      {
        title: 'Production Consulting',
        Icon: FaRegLightbulb,
        description:
          'Get expert production support from our affiliate, Cytech World Communications, with more than 20 years of experience in sound, lighting, screens and staging.',
      },
    ],
  },
  {
    role: 'Vendor',
    features: [
      {
        title: 'Discover Slots',
        Icon: BiSearchAlt,
        description:
          'Browse upcoming events, find vendor slots that suit your business and apply in minutes. Track every request from approval to payment.',
      },
      {
        title: 'Secured Payments',
        Icon: GrSecure,
        description:
          'Pay for approved slots securely with Paystack and lock in your spot. Free slots are confirmed as soon as the organizer approves you.',
      },
      {
        title: 'Brand Control',
        Icon: AiFillThunderbolt,
        description:
          'Build a vendor profile that shows organizers who you are, with your bio, contact details, social links and a gallery of your past work.',
      },
      {
        title: 'Verified Events',
        Icon: GoUnverified,
        description:
          'Apply with confidence. Every organizer is verified before they can publish an event, so the slots you find come from real organizers.',
      },
    ],
  },
]

const STATS = [
  { value: '₦0', label: 'Setup cost' },
  { value: '100%', label: 'Creator satisfaction' },
  { value: '24/7', label: 'Creator support' },
]
