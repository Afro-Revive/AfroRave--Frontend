/**
 * Shared plumbing for the analytics tabs.
 *
 * Every tab receives the same props from the page and hands them to `AnalyticsGate`,
 * which resolves the no-event / loading / error / empty states in one place and only
 * calls its child once there is data to render.
 */
import { Skeleton } from '@/components/ui/skeleton'
import type { EventAnalyticsData } from '@/types'

export interface IAnalyticsTabProps {
  /** Analytics payload for the selected event */
  data?: EventAnalyticsData
  /** The request is in flight */
  isLoading: boolean
  /** The request failed */
  isError: boolean
  /** An event is selected — the query is disabled without one */
  hasEvent: boolean
}

interface IAnalyticsGateProps extends IAnalyticsTabProps {
  /** Rendered once the payload has arrived */
  children: (data: EventAnalyticsData) => React.ReactNode
}

export function AnalyticsGate({ data, isLoading, isError, hasEvent, children }: IAnalyticsGateProps) {
  if (!hasEvent) {
    return <AnalyticsMessage message='Select an event to see its analytics.' />
  }

  if (isLoading) return <AnalyticsSkeleton />

  if (isError) {
    return <AnalyticsMessage message="We couldn't load analytics for this event. Try again shortly." />
  }

  if (!data) return <AnalyticsMessage message='No analytics available for this event yet.' />

  return <>{children(data)}</>
}

export function AnalyticsMessage({ message }: { message: string }) {
  return (
    <div className='w-full min-h-[240px] flex items-center justify-center rounded-xl bg-white px-6 text-center font-inter-tight text-sm text-mid-dark-gray'>
      {message}
    </div>
  )
}

/** The shape of a tab while it loads: the summary card, then two chart cards. */
function AnalyticsSkeleton() {
  return (
    <div className='w-full flex flex-col gap-6'>
      <div className='flex flex-col gap-5 rounded-xl bg-white p-5'>
        <Skeleton className='h-6 w-32 rounded-md' />
        <div className='grid gap-4 sm:grid-cols-2 xl:grid-cols-4'>
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className='h-[84px] rounded-lg' />
          ))}
        </div>
      </div>
      <div className='grid gap-6 xl:grid-cols-3'>
        <Skeleton className='h-[340px] rounded-xl xl:col-span-2' />
        <Skeleton className='h-[340px] rounded-xl' />
      </div>
    </div>
  )
}
