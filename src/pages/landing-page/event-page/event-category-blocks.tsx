import { date_list } from '@/components/constants'
import { BaseSelect, type ICustomSelectProps } from '@/components/reusable/base-select'
import { useMemo } from 'react'
import { useGetTrendingEvents, useGetAllEvents } from '@/hooks/use-event-mutations'
import { CategoryBlock } from '@/components/shared/category-block'
import { useSearchParams, useNavigate, useLocation } from 'react-router-dom'
import type { EventData } from '@/types/event'

const MONTH_ABBRS = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec']

/** Map category label to slug keywords for matching against event names */
const CATEGORY_KEYWORDS: Record<string, string[]> = {
  'concerts-and-festivals': ['concert', 'festival', 'music', 'live'],
  'arts-and-performance': ['art', 'perform', 'theatre', 'theater', 'dance', 'show'],
  'children': ['child', 'kid', 'family', 'youth'],
  'sports': ['sport', 'football', 'basketball', 'athletics', 'game', 'match'],
  'career-and-business': ['career', 'business', 'conference', 'summit', 'networking', 'workshop'],
  'comedy': ['comedy', 'stand-up', 'standup', 'laugh'],
  'culture-and-religion': ['culture', 'cultural', 'religion', 'religious', 'heritage', 'tradition'],
}

function filterEvents(events: EventData[], params: URLSearchParams): EventData[] {
  const q = params.get('q')?.toLowerCase().trim() ?? ''
  const exactDate = params.get('date') ?? ''           // YYYY-MM-DD from calendar
  const month = params.get('month') ?? ''              // jan/feb/... from BaseSelect
  const categorySlug = params.get('category') ?? ''   // slug from BaseSelect

  return events.filter(event => {
    // Text search — match event name or venue
    if (q) {
      const matchesName = event.eventName.toLowerCase().includes(q)
      const matchesVenue = event.venue.toLowerCase().includes(q)
      if (!matchesName && !matchesVenue) return false
    }

    // Exact date filter (from search bar calendar, format YYYY-MM-DD)
    if (exactDate) {
      // event.startDate could be "YYYY-MM-DD" or "YYYY-MM-DDTHH:mm:ss"
      if (!event.startDate.startsWith(exactDate)) return false
    }

    // Month filter (from events page BaseSelect)
    if (month) {
      const eventDate = new Date(event.startDate)
      if (!isNaN(eventDate.getTime())) {
        const eventMonth = MONTH_ABBRS[eventDate.getMonth()]
        if (eventMonth !== month) return false
      }
    }

    // Category filter — match against event name keywords
    if (categorySlug) {
      const keywords = CATEGORY_KEYWORDS[categorySlug] ?? []
      if (keywords.length > 0) {
        const name = event.eventName.toLowerCase()
        const hasMatch = keywords.some(kw => name.includes(kw))
        if (!hasMatch) return false
      }
    }

    return true
  })
}

export default function EventCategoryBlocks() {
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()
  const location = useLocation()
  const fromSearch = (location.state as { fromSearch?: boolean } | null)?.fromSearch === true

  // Sync BaseSelect state with URL params
  const selectedCategory = searchParams.get('category') ?? ''
  const selectedMonth = searchParams.get('month') ?? ''

  const { data: trendingEventResponse, isPending: isLoadingTrending } = useGetTrendingEvents()
  const { data: allEventResponse, isPending: isLoadingAllEvent } = useGetAllEvents()

  const trendingEvents = trendingEventResponse?.data
  const allEvents = allEventResponse?.data ?? []

  const filteredEvents = useMemo(
    () => filterEvents(allEvents, searchParams),
    [allEvents, searchParams]
  )
  console.log('Filtered events:', trendingEventResponse)

  const activeFilters = [
    searchParams.get('q'),
    searchParams.get('date'),
    searchParams.get('month'),
    searchParams.get('category'),
  ].filter(Boolean)

  const clearFilters = () => {
    if (fromSearch) {
      // Came from search bar on another page — go back to where they were
      navigate(-1)
    } else {
      // Filtered on this page itself — just reset URL params
      setSearchParams(new URLSearchParams())
    }
  }

  return (
    <section className='w-full flex flex-col gap-10 md:gap-20 mt-[120px] md:mt-36 pb-16 px-3 md:px-8 lg:px-0 min-h-[calc(100vh-300px)]'>
      <div className='lg:pl-[60px]'>
        <CategoryBlock
          name='Trending'
          data={(trendingEvents ?? []).map((event) => ({
            eventId: event.eventId,
            eventName: event.eventName,
            image: event.desktopMedia.flyer,
            venue: event.venue,
            startDate: event.startDate,
            startTime: event.startTime,
            customUrl: event.customUrl,
          }))}
          showLocation={false}
          isLoading={isLoadingTrending}
          layout='middle'
        />
      </div>

      <div className='flex flex-col gap-[60px] lg:pl-[60px] xl:pl-[120px]'>
        <div className='flex flex-col gap-3'>
          <div className='flex items-center gap-3 md:gap-6 overflow-x-auto min-h-[40px]'>
            <BaseSelect
              type='others'
              placeholder={category_list.placeholder}
              width={category_list.width}
              items={category_list.items}
              value={selectedCategory}
              onChange={(value) => {
                const next = new URLSearchParams(searchParams)
                if (value) next.set('category', value)
                else next.delete('category')
                setSearchParams(next)
              }}
            />

            <BaseSelect
              type='others'
              placeholder={date_list.placeholder}
              items={date_list.items}
              value={selectedMonth}
              onChange={(value) => {
                const next = new URLSearchParams(searchParams)
                if (value) next.set('month', value)
                else next.delete('month')
                // Clear exact date when month is chosen (they'd conflict)
                next.delete('date')
                setSearchParams(next)
              }}
            />

            {activeFilters.length > 0 && (
              <button
                onClick={clearFilters}
                className='text-xs text-white/50 hover:text-white underline underline-offset-2 transition-colors whitespace-nowrap'
              >
                Clear filters
              </button>
            )}
          </div>

          {/* Show result count only when there's an active text search */}
          {searchParams.get('q') && (
            <p className='text-xs text-white/40'>
              {filteredEvents.length} result{filteredEvents.length !== 1 ? 's' : ''} for &ldquo;{searchParams.get('q')}&rdquo;
            </p>
          )}
        </div>

        <CategoryBlock
          data={filteredEvents.map(event => ({
            eventId: event.eventId,
            eventName: event.eventName,
            venue: event.venue,
            image: event.metadata.desktopMedia.flyer,
            startDate: event.startDate,
            startTime: event.startTime,
            customUrl: event.customUrl,
          }))}
          showLocation={true}
          isLoading={isLoadingAllEvent}
          display='grid'
        />
      </div>
    </section>
  )
}

const category_list: ICustomSelectProps = {
  width: 368,
  defaultValue: 'sports',
  placeholder: 'Select Category',
  items: [
    { value: 'concerts-and-festivals', label: 'Concerts & Festivals' },
    { value: 'arts-and-performance', label: 'Arts & Performance' },
    { value: 'children', label: 'Children' },
    { value: 'sports', label: 'Sports' },
    { value: 'career-and-business', label: 'Career & Business' },
    { value: 'comedy', label: 'Comedy' },
    { value: 'culture-and-religion', label: 'Culture & Religion' },
  ],
}
