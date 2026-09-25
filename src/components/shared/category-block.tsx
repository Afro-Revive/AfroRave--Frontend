import { Link } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { getRoutePath } from '@/config/get-route-path'
import { ArrowRight } from 'lucide-react'
import { RenderEventImage } from './render-event-flyer'
import { formatEventDate } from '@/lib/helper-func'

const MAX_HOME_EVENTS = 8


/**
 * One card size for both layouts.
 *
 * Phones: the grid keeps two fluid columns there (a fixed track would fit only
 * one), so a fixed width can't match it — the calc reproduces the grid's own
 * arithmetic instead. 28px is half the width the grid loses per row: the
 * events container's `px-5` either side plus one `gap-4` between the two
 * cards, i.e. (20 + 20 + 16) / 2. Update it if either of those changes.
 *
 * Tablet portrait and up: the grid switches to fixed tracks, so both layouts
 * use the same literal width. `tablet:` has to restate a value because an
 * upright tablet takes the mobile layout but is nowhere near phone-sized.
 * Each width here must match its grid track below — 16rem and 18rem.
 */
const CARD_WIDTH = 'w-[calc(50vw_-_28px)] tablet:w-64 md:w-72'

export function CategoryBlock({
  name,
  data,
  layout = 'start',
  showLocation,
  display = 'flex',
  homePage = false,
  isLoading = false,
  rowClassName,
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
          className={cn(
            {
              'flex gap-5 overflow-x-auto scrollbar-none w-full min-w-0': display === 'flex',
              // Fixed tracks rather than fractional columns, so a wider screen
              // buys more cards instead of bigger ones. Track widths mirror
              // CARD_WIDTH.
              'grid grid-cols-2 tablet:grid-cols-[repeat(auto-fill,16rem)] md:grid-cols-[repeat(auto-fill,18rem)] justify-center gap-4 tablet:gap-5 md:gap-5':
                display === 'grid',
            },
            // Padding set here scrolls away with the content, unlike padding on
            // an outer wrapper which insets the whole scroller.
            rowClassName,
          )}>
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
        'group relative flex flex-col justify-end overflow-hidden rounded-2xl border border-white/10 aspect-[3/4]',
        display === 'grid'
          ? // Fills its track, which is itself capped at CARD_WIDTH's 18rem.
            'w-full'
          : // Horizontal scroller: hold the width instead of being squeezed by flex.
            cn(CARD_WIDTH, 'shrink-0'),
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
  /** Applied to the row/grid itself — use for gutters that should scroll away. */
  rowClassName?: string
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