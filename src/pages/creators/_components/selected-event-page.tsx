import { LoadingFallback } from '@/components/loading-fallback'
import { Button } from '@/components/ui/button'
import { getRoutePath } from '@/config/get-route-path'
import { useGetEvent } from '@/hooks/use-event-mutations'
import { useEventSelectorStore } from '@/stores'
import type { EventDetailData } from '@/types'
import { ChevronLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

/**
 * Resolves the event these creator pages work on. Their routes carry no id, so
 * it comes from the selector store — the same one the sidebar's summary card
 * reads, set when an event is opened from the dashboard.
 */
export function SelectedEventGate({
  children,
}: {
  children: (event: EventDetailData) => React.ReactNode
}) {
  const navigate = useNavigate()
  const { selectedEventId } = useEventSelectorStore()

  const { data: response, isPending } = useGetEvent(selectedEventId ?? '')
  const event = response?.data as EventDetailData | undefined

  if (!selectedEventId) {
    return (
      <EmptyState
        heading='No event selected'
        body='Open an event from your dashboard to manage it.'
        onGoToEvents={() => navigate(getRoutePath('standalone'))}
      />
    )
  }

  if (isPending) return <LoadingFallback />

  if (!event) {
    return (
      <EmptyState
        heading='No event found'
        onGoToEvents={() => navigate(getRoutePath('standalone'))}
      />
    )
  }

  return <>{children(event)}</>
}

function EmptyState({
  heading,
  body,
  onGoToEvents,
}: {
  heading: string
  body?: string
  onGoToEvents: () => void
}) {
  return (
    <div className='w-full flex flex-col items-center justify-center gap-4 py-16'>
      <p className='font-sf-pro-display text-xl font-bold text-black'>{heading}</p>
      {body && <p className='font-sf-pro-text text-sm text-mid-dark-gray'>{body}</p>}
      <Button onClick={onGoToEvents}>Go to Events</Button>
    </div>
  )
}

/**
 * The header the edit-event tabs use, without the tab selector — these are
 * pages now, so the sidebar handles getting anywhere else.
 */
export function CreatorPageContainer({
  heading,
  onBack,
  action,
  children,
}: {
  heading?: string
  onBack?: () => void
  action?: React.ReactNode
  children: React.ReactNode
}) {
  // Pages that open with their own banner pass nothing here, and the bar is
  // left out entirely rather than rendered empty.
  const hasHeader = Boolean(heading || onBack || action)

  return (
    <div className='w-full'>
      {hasHeader && (
        <div className='w-full flex items-center justify-between gap-4 py-3 px-5 md:px-8 bg-white border-l border-[#e9e9e9]'>
          {onBack ? (
            <Button
              variant='ghost'
              className='w-fit h-fit hover:bg-black/10 !p-1 flex items-center gap-3'
              onClick={onBack}>
              <ChevronLeft color='#000000' className='min-w-1.5 min-h-3' />
              <span className='text-sm font-medium font-sf-pro-display text-black'>{heading}</span>
            </Button>
          ) : (
            <span className='text-sm font-medium font-sf-pro-display text-black'>{heading}</span>
          )}

          {action}
        </div>
      )}

      <div className='w-full h-fit flex flex-col'>{children}</div>
    </div>
  )
}
