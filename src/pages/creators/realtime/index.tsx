import { SidebarToggle } from '@/components/shared/sidebar-toggle'
import { Button } from '@/components/ui/button'
import { useGetEventAnalytics } from '@/hooks/use-event-mutations'
import type { EventAnalyticsData, EventDetailData } from '@/types'
import { useEffect, type ComponentType } from 'react'
import { RiDownload2Line } from 'react-icons/ri'
import { useSearchParams } from 'react-router-dom'
import { CreatorPageContainer, SelectedEventGate } from '../_components/selected-event-page'
import type { IAnalyticsTabProps } from './components/analytics-state'
import { buildAnalyticsExport, downloadCsv } from './lib/analytics-export'
import AttendeeListTab from './tabs/attendee-list-tab'
import InsightsTab from './tabs/insights-tab'
import OrdersTab from './tabs/orders-tab'
import OverviewTab from './tabs/overview-tab'
import PromoCodesTab from './tabs/promo-codes-tab'
import VendorsTab from './tabs/vendors-tab'

/**
 * The analytics tabs, picked by ?tab=. The creator sidebar's ANALYTICS group
 * links to each one, so the page has no tab list of its own.
 */
const ANALYTICS_TABS = [
  {
    value: 'overview',
    title: 'Overview',
    description: 'Sales, tickets and your audience for this event, at a glance.',
    component: OverviewTab,
  },
  {
    value: 'insights',
    title: 'Audience Insights',
    description: 'Who’s buying tickets: their gender, age and where they’re from.',
    component: InsightsTab,
  },
  {
    value: 'vendors',
    title: 'Vendors',
    description: 'Vendor applications, the slots they’ve secured and what they’re worth.',
    component: VendorsTab,
  },
  {
    value: 'orders',
    title: 'Orders',
    description: 'Every ticket order for this event, and how sales have moved.',
    component: OrdersTab,
  },
  {
    value: 'attendee-list',
    title: 'Attendee List',
    description: 'Everyone with a ticket for this event, and whether they’ve checked in.',
    component: AttendeeListTab,
  },
  {
    value: 'promo-codes',
    title: 'Promo Codes',
    description: 'How your promo and partnership codes are doing.',
    component: PromoCodesTab,
  },
] as const satisfies readonly {
  value: string
  title: string
  description: string
  component: ComponentType<IAnalyticsTabProps>
}[]

export type AnalyticsTab = (typeof ANALYTICS_TABS)[number]['value']

const DEFAULT_TAB: AnalyticsTab = 'overview'

export default function RealtimePage() {
  return <SelectedEventGate>{(event) => <EventAnalytics event={event} />}</SelectedEventGate>
}

function EventAnalytics({ event }: { event: EventDetailData }) {
  const [searchParams, setSearchParams] = useSearchParams()
  const requestedTab = ANALYTICS_TABS.find((tab) => tab.value === searchParams.get('tab'))

  // A missing or unknown tab lands on Overview, in the URL too, so the
  // sidebar marks where you are.
  useEffect(() => {
    if (!requestedTab) setSearchParams({ tab: DEFAULT_TAB }, { replace: true })
  }, [requestedTab, setSearchParams])

  const { data: response, isLoading, isError } = useGetEventAnalytics(event.eventId)
  const analytics = response?.data as EventAnalyticsData | undefined

  const tabProps: IAnalyticsTabProps = {
    data: analytics,
    isLoading,
    isError,
    hasEvent: true,
  }

  const activeTab = requestedTab ?? ANALYTICS_TABS[0]
  const ActiveTab = activeTab.component
  const csv = analytics ? buildAnalyticsExport(activeTab.value, analytics) : null

  return (
    <CreatorPageContainer>
      <div className='w-full bg-white flex items-start justify-between gap-4 px-5 py-6'>
        <div className='flex items-start gap-4'>
          <SidebarToggle />

          <div className='flex flex-col gap-1'>
            <h1 className='font-inter-tight text-2xl font-bold text-black'>{activeTab.title}</h1>
            <p className='font-inter-tight text-sm text-black'>{activeTab.description}</p>
          </div>
        </div>

        <Button
          type='button'
          variant='outline'
          disabled={!csv || csv.rows.length === 0}
          onClick={() => csv && downloadCsv(csv, event.eventName)}
          className='h-9 shrink-0 gap-1.5 rounded-md border-black/20 bg-white px-3 font-inter-tight text-sm text-black shadow-none hover:bg-black/5'>
          <RiDownload2Line className='size-4' />
          Export CSV
        </Button>
      </div>

      <div className='w-full flex flex-col gap-6 px-5 py-6 md:py-8'>
        <ActiveTab {...tabProps} />
      </div>
    </CreatorPageContainer>
  )
}
