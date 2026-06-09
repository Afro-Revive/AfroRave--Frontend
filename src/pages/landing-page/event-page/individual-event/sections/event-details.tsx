import { cn } from '@/lib/utils'
import type { EventDetailData } from '@/types'
import { RenderEventImage } from '@/components/shared/render-event-flyer'

export default function EventDetailsSection({ event, layout }: ComponentProps) {
  return (
    <div
      className={cn('relative w-full flex items-end justify-between px-5 lg:px-[120px]', {
        'mb-[220px]': layout === 'standard-carousel',
      })}>
      <div className='flex flex-col gap-3'>
        {layout === 'standard-carousel' && (
          <>
            <RenderEventImage
              image={event.eventDetails.desktopMedia?.flyer}
              event_name={event.eventName}
              className='w-[142px] h-[182px] md:w-[284px] md:h-[364px] !text-base'
            />
          </>
        )}

        <div className='flex flex-col gap-1'>
          <p className='text-2xl md:text-[30px] lg:text-[30px] uppercase font-sf-compact tracking-[-0.25px] font-bold'>
            {event.eventName}
          </p>

          <div className='flex flex-col gap-2 font-sf-pro-display font-light'>
            <p className='text-lg md:text-2xl lg:text-xl'>{event.venue}</p>
            <p>{event.eventDate.endDate}</p>
          </div>
        </div>
      </div>

    </div>
  )
}

type ComponentProps = {
  layout: 'default' | 'standard-carousel' | 'with-flyer'
  event: EventDetailData
}
