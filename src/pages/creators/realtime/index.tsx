import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useState, useEffect } from 'react'
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

const defaultTab = 'overview'

export default function RealtimePage() {
  const [activeTab, setActiveTab] = useState<string>(defaultTab)
  const [searchParams, setSearchParams] = useSearchParams()

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

  useEffect(() => {
    const tabParam = searchParams.get('tab')

    if (tabParam && chartTabValues.includes(tabParam)) {
      setActiveTab(tabParam)
    } else {
      setActiveTab(defaultTab)
      setSearchParams({ tab: defaultTab })
    }
  }, [searchParams])

  function handleTabChange(currentTab: string) {
    setActiveTab(currentTab)
    setSearchParams({ tab: currentTab })
  }

  return (
    <Tabs
      value={activeTab}
      onValueChange={handleTabChange}
      className='w-full h-full flex flex-col lg:flex-row gap-1 overflow-hidden'>
      <TabsList className='lg:w-[208px] h-fit lg:min-h-full flex flex-row lg:flex-col justify-start items-start lg:py-14 px-0 lg:bg-secondary-white rounded-none overflow-x-scroll scrollbar-none'>
        {chartTabs.map((item) => (
          <div key={item.section} className='w-full flex flex-col'>
            <p className='py-5 px-3 font-medium font-sf-pro-display text-black'>{item.section}</p>
            <div className='flex lg:flex-col'>
              {item.tabs.map((tab) => (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  className='w-full lg:min-h-[60px] flex justify-start rounded-none text-mid-dark-gray data-[state=active]:text-black bg-transparent border-l-2 border-l-transparent data-[state=active]:border-l-[4px] data-[state=active]:border-l-deep-red data-[state=active]:bg-deep-red/15 data-[state=active]:shadow-none'>
                  {tab.name}
                </TabsTrigger>
              ))}
            </div>
          </div>
        ))}
      </TabsList>

      <div className='w-full h-full flex flex-col'>
        <ChartHeader />
        <div className='w-full h-full pt-10 pb-14 px-5'>
          {chartTabs.flatMap((section) =>
            section.tabs.map((tab) => (
              <TabsContent key={tab.value} value={tab.value}>
                <tab.component {...tabProps} />
              </TabsContent>
            )),
          )}
        </div>
      </div>
    </Tabs>
  )
}

function ChartHeader() {
  return (
    <div className='w-full flex items-center justify-between bg-white h-14 px-8 border-l border-light-gray'>
      <div className='flex items-center gap-3' />

      <div className='flex items-center gap-8'>
        <ExportButton />
        <EventSelect />
      </div>
    </div>
  )
}

const chartTabs: IChartTabs[] = [
  {
    section: 'Event',
    tabs: [
      { value: 'overview', name: 'Overview', component: OverviewTab },
      { value: 'vendors', name: 'Vendors', component: VendorsTab },
    ],
  },
  {
    section: 'Tickets',
    tabs: [
      { value: 'orders', name: 'Orders', component: OrdersTab },
      { value: 'attendee-list', name: 'Attendee List', component: AttendeeListTab },
      { value: 'promo-codes', name: 'Promo Codes', component: PromoCodesTab },
    ],
  },
  {
    section: 'Audience',
    tabs: [{ value: 'insights', name: 'Insights', component: InsightsTab }],
  },
]

const chartTabValues = chartTabs.flatMap((section) => section.tabs.map((tab) => tab.value))

interface IChartTabs {
  section: string
  tabs: {
    value: string
    name: string
    component: React.ComponentType<IAnalyticsTabProps>
  }[]
}
