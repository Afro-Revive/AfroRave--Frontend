import { Link } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { getRoutePath } from '@/config/get-route-path'
import { ArrowRight } from 'lucide-react'
import { RenderEventImage } from './render-event-flyer'
import { formatEventDate } from '@/lib/helper-func'

const MAX_HOME_EVENTS = 8

export function CategoryBlock({
  name,
  data,
  layout = 'start',
  showLocation,
  display = 'flex',
  homePage = false,
  isLoading = false,
}: ICategoryBlock) {
  const filteredData = homePage ? data?.slice(0, MAX_HOME_EVENTS) : data

  if (isLoading) {
    return <CategoryBlockSkeleton name={name} />
  }

  return (
    <div className='flex flex-col gap-5 w-full min-w-0'>
      {name && <CategoryBlockName name={name} />}

      {data && data.length > 0 ? (
        <div
          className={cn({
            // min-w-0 lets the row be narrower than its cards, which is what
            // turns the overflow into scrolling rather than a wider parent.
            'flex gap-5 overflow-x-auto scrollbar-none w-full min-w-0': display === 'flex',
            'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 md:gap-2 gap-4 justify-center':
              display === 'grid',
          })}>
          {filteredData?.map((item) => (
            <EventCard
              key={item.eventId}
              id={item.eventId}
              customUrl={item.customUrl}
              image={item.desktopMedia?.flyer}
              event_location={item.venue}
              event_date={item.startDate}
              event_name={item.eventName}
              start_time={item.startTime}
              showLocation={showLocation}
              layout={layout}
              display={display}
            />
          ))}
        </div>
      ) : (
        <div className='flex flex-col items-center justify-center py-12 w-full rounded-lg'>
          <p className='text-lg font-semibold text-muted-foreground mb-1'>No events found</p>
          <span className='text-sm text-muted-foreground'>
            New events will be added soon. Stay tuned!
          </span>
        </div>
      )}
    </div>
  )
}

function EventCard({
  image,
  event_name,
  event_location,
  event_date,
  customUrl,
  showLocation,
  display = 'flex',
}: IEventCardProps) {
  return (
    <Link
      to={getRoutePath('individual_event', { eventId: customUrl })}
      className={cn(
        'group relative flex flex-col justify-end overflow-hidden rounded-2xl border border-white/10 aspect-[5/7]',
        display === 'grid'
          ? // Fill the grid column — a fixed width overflows the narrow mobile columns.
            'w-full'
          : // Horizontal scroller: hold the width instead of being squeezed by flex.
            'w-48 shrink-0 md:w-60 lg:w-65',
      )}>
      <RenderEventImage
        image={image}
        event_name={event_name}
        className='absolute inset-0 w-full! h-full! md:h-full! object-cover transition-transform duration-500 group-hover:scale-105'
      />

      <div className='absolute inset-x-0 bottom-0 h-3/5 bg-gradient-to-t from-black via-black/75 to-transparent' />

      <div className='relative flex flex-col gap-1.5 p-4'>
        <p className='font-inter-tight text-base md:text-lg font-black text-white capitalize leading-tight'>
          {event_name}
        </p>

        <p className='font-inter-tight text-sm text-white leading-snug'>
          {formatEventDate(event_date)}
          {showLocation && event_location ? ` at ${event_location }.` : ''}
        </p>
        <span className='mt-2 w-fit hidden group-hover:inline-flex items-center gap-6 rounded-md bg-white px-4 py-2 font-input-mono text-xs uppercase tracking-wide text-deep-red transition-colors'>
          Get Tickets
          <ArrowRight size={14} />
        </span>
      </div>
    </Link>
  )
}

function CategoryBlockName({ name }: { name: string }) {
  return <p className='text-xl font-bold font-sf-pro-display'>{name}</p>
}

export function CategoryBlockSkeleton({ name }: { name?: string }) {
  return (
    <div className='flex flex-col gap-6 w-full'>
      {name && <CategoryBlockName name={name} />}

      <div className='gap-7 flex pr-7 overflow-x-auto scrollbar-none w-full'>
        {Array.from({ length: 4 }).map((_, idx) => (
          <div
            key={`event-skeleton-${idx}`}
            className='relative flex flex-col justify-end overflow-hidden rounded-2xl aspect-[5/7] min-w-[220px] max-w-[260px] md:min-w-[240px] lg:min-w-[255px] bg-gray-200 animate-pulse'>
            <div className='flex flex-col gap-2 p-4'>
              <div className='h-5 w-3/4 bg-gray-300 rounded' />
              <div className='h-3 w-2/3 bg-gray-300 rounded' />
              <div className='mt-2 h-8 w-[130px] bg-gray-300 rounded-[4px]' />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}


export interface IEventCardData {
  eventId: string
  eventName: string
  venue: string
  startDate: string
  startTime: string
  customUrl: string
  desktopMedia?: { flyer?: string }
}

interface ICategoryBlock {
  name?: string
  data?: IEventCardData[]
  layout?: IEventCardProps['layout']
  showLocation?: IEventCardProps['showLocation']
  display?: 'flex' | 'grid'
  homePage?: boolean
  isLoading?: boolean
}

interface IEventCardProps {
  id: string
  image?: string
  event_name: string
  event_location: string
  event_date: string
  start_time: string
  isTrending?: boolean
  layout?: 'start' | 'middle'
  showLocation?: boolean
  customUrl: string
  /** Grid cards fill their column; flex cards keep a fixed width to scroll. */
  display?: 'flex' | 'grid'
}