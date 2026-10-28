import { cn } from '@/lib/utils'

/** "Built for the culture": who Afrorevive is, and its story. */
export default function AboutHeroSection() {
  return (
    <section className='w-full text-white'>
      <div className='w-full max-w-[1280px]  flex flex-col px-6 md:px-[60px] h-[95vh] justify-end pb-24'>
        <SectionLabel>Afrorevive ticketing</SectionLabel>

        <h1 className='mt-6 font-work-sans font-black uppercase text-[52px] leading-[1.05] md:text-[112px] md:leading-[1.25]'>
          Built for
          <br />
          the culture
        </h1>

        <p className='mt-6 max-w-3xl font-work-sans text-sm leading-5 md:text-lg'>
          We are Africa’s next-generation event ticketing platform, designed by professionals who
          live and breathe the event business.
        </p>

        <SectionLabel className='mt-8'>Our story</SectionLabel>

        <p  className='mt-6 max-w-3xl font-work-sans text-sm leading-5 md:text-lg'>
          Afrorevive was built to reimagine how events are managed, experienced, and scaled across
          Africa. Created through a strategic blend of deep industry expertise and forward-thinking
          product innovation. The platform was designed to go beyond traditional ticketing by
          offering organizers smarter tools, better insights, and a more seamless event ecosystem.
        </p>
      </div>
    </section>
  )
}

/** A small mono label with the deep red rule under it. */
function SectionLabel({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <p
      className={cn(
        'w-fit border-b-2 border-deep-red pb-1 font-input-mono text-xs uppercase md:text-sm',
        className,
      )}>
      {children}
    </p>
  )
}
