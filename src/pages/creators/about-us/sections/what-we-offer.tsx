export default function WhatWeOfferSection() {
  return (
    <section className='w-full bg-black text-white'>
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
              className='flex flex-col items-center justify-center gap-2 border-[#ACACAC] py-10 text-center font-inter font-medium uppercase max-md:border-b max-md:last:border-b-0 md:min-h-[250px] md:border-r md:last:border-r-0'>
              <dd className='text-3xl md:text-[32px]'>{stat.value}</dd>
              <dt className='max-w-[200px] text-base md:text-xl leading-tight'>{stat.label}</dt>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}

function OfferCard({ role, points }: (typeof OFFERS)[number]) {
  return (
    <div
      className='rounded-4xl border border-[#464444] p-5 md:p-6'
      >
      <div className='flex h-full flex-col gap-8 rounded-[36px] bg-black px-10 py-12 md:px-8 md:py-20'>
        <h3 className='font-input-mono text-lg md:text-xl uppercase tracking-[0.5em]'>{role}</h3>

        <ul className='flex flex-col gap-5 font-inter-tight text-base leading-snug md:text-lg'>
          {points.map((point) => (
            <li key={point}>{point}</li>
          ))}
        </ul>
      </div>
    </div>
  )
}

const OFFERS = [
  {
    role: 'Organizer',
    points: [
      'Configure ticket tiers in one seamless platform',
      'Communicate and assign vendor slots',
      'Track live sales and access in-depth audience insights to plan smarter',
    ],
  },
  {
    role: 'Vendor',
    points: [
      'Book and reserve slots/stalls',
      'Chat with organizers to ensure seamless workflow',
      'Share assets',
    ],
  },
]

const STATS = [
  { value: '₦0', label: 'Setup cost' },
  { value: '100%', label: 'Creator satisfaction' },
  { value: '24/7', label: 'Creator support' },
]
