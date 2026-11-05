import { SidebarToggle } from '@/components/shared/sidebar-toggle'
import { useEffect, type ComponentType } from 'react'
import { useSearchParams } from 'react-router-dom'
import EventSelect from '@/components/shared/vendor-select'
import { useEventSelectorStore } from '@/stores'
import { ExportButton } from '@/pages/vendor/component/export-btn'
import { useGetEventAnalytics } from '@/hooks/use-event-mutations'
import type { EventAnalyticsData } from '@/types'
import type { IAnalyticsTabProps } from './components/analytics-state'
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
  { value: 'overview', title: 'Overview', component: OverviewTab },
  { value: 'insights', title: 'Audience Insights', component: InsightsTab },
  { value: 'vendors', title: 'Vendors', component: VendorsTab },
  { value: 'orders', title: 'Orders', component: OrdersTab },
  { value: 'attendee-list', title: 'Attendee List', component: AttendeeListTab },
  { value: 'promo-codes', title: 'Promo Codes', component: PromoCodesTab },
] as const satisfies readonly {
  value: string
  title: string
  component: ComponentType<IAnalyticsTabProps>
}[]

export type AnalyticsTab = (typeof ANALYTICS_TABS)[number]['value']

const DEFAULT_TAB: AnalyticsTab = 'overview'

export default function RealtimePage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const requestedTab = ANALYTICS_TABS.find((tab) => tab.value === searchParams.get('tab'))

  // A missing or unknown tab lands on Overview, in the URL too, so the
  // sidebar marks where you are.
  useEffect(() => {
    if (!requestedTab) setSearchParams({ tab: DEFAULT_TAB }, { replace: true })
  }, [requestedTab, setSearchParams])

  const { selectedEventId } = useEventSelectorStore()
  const {
    data: response,
    isLoading,
    isError,
  } = useGetEventAnalytics(selectedEventId ?? '')

  const analytics = response?.data as EventAnalyticsData | undefined

  const tabProps: IAnalyticsTabProps = {
    data: analytics,
    isLoading,
    isError,
    hasEvent: Boolean(selectedEventId),
  }

  const activeTab = requestedTab ?? ANALYTICS_TABS[0]
  const ActiveTab = activeTab.component

  return (
    <div className='w-full h-full flex flex-col overflow-hidden'>
      <ChartHeader title={activeTab.title} />
      <div className='w-full h-full pt-10 pb-14 px-5'>
        <ActiveTab {...tabProps} />
      </div>
    </div>
  )
}

/** The open tab's name, since there's no tab list beside it to show which. */
function ChartHeader({ title }: { title: string }) {
  return (
    <div className='w-full flex items-center justify-between gap-4 bg-white h-14 px-8 border-l border-light-gray'>
      <div className='flex items-center gap-4'>
        <SidebarToggle />
        <h1 className='font-work-sans text-lg font-bold text-black'>{title}</h1>
      </div>

      <div className='flex items-center gap-8'>
        <ExportButton />
        <EventSelect />
      </div>
    </div>
  )
}
