import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useGetOrganizerEvents } from '@/hooks/use-event-mutations'
import { useEventSelectorStore } from '@/stores'
import { cn } from '@/lib/utils'
import type { PaginatedResponse } from '@/types/api'
import type { EventData } from '@/types'
import { useEffect } from 'react'

interface VendorSelectProps {
  className?: string
}

export default function VendorSelect({ className }: VendorSelectProps) {
  const { data: response, isPending } = useGetOrganizerEvents()
  const { selectedEventId, setSelectedEventId } = useEventSelectorStore()


const eventData = response?.data as PaginatedResponse<EventData> | undefined
  const events = eventData?.items
    ? [...eventData.items].sort(
        (a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime(),
      )
    : []

  // Auto-select most recent event on first load
  useEffect(() => {
    if (events.length > 0 && !selectedEventId) {
      setSelectedEventId(events[0].eventId)
    }
  }, [events.length])

  if (isPending) {
    return (
      <div className={cn('w-[180px] h-10 rounded-[6px] bg-black/30 animate-pulse', className)} />
    )
  }

  return (
    <Select
      value={selectedEventId ?? ''}
      onValueChange={setSelectedEventId}
    >
      <SelectTrigger
        className={cn(
          '!h-10 text-xs text-white uppercase font-sf-pro-display font-semibold bg-black border-none outline-none shadow-none rounded-[6px] px-3 [&>span]:text-white [&>span]:opacity-100 [&_svg]:!text-white [&_svg]:!opacity-100 disabled:opacity-100 disabled:bg-black !w-[180px]',
          className,
        )}
      >
        <SelectValue placeholder={events.length === 0 ? 'No events yet' : 'Select event'} />
      </SelectTrigger>
      <SelectContent className='max-w-[280px]'>
        {events.length === 0 ? (
          <div className='px-3 py-4 text-xs text-gray-400 font-sf-pro-text text-center'>
            No events yet
          </div>
        ) : (
          events.map((event) => (
            <SelectItem
              key={event.eventId}
              value={event.eventId}
              className='text-xs font-sf-pro-text'
            >
              {event.eventName}
            </SelectItem>
          ))
        )}
      </SelectContent>
    </Select>
  )
}
