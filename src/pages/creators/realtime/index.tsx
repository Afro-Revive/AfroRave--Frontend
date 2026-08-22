import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import EventSelect from '@/components/shared/vendor-select'
import { useEventSelectorStore } from '@/stores'
import { ExportButton } from '@/pages/vendor/component/export-btn'
import { useGetEventAnalytics } from '@/hooks/use-event-mutations'

const defaultTab = 'issued-net'

export default function RealtimePage() {
  const [activeTab, setActiveTab] = useState<string>(defaultTab)
  const [searchParams, setSearchParams] = useSearchParams()

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
      {chartTabs.flatMap((section) =>
        section.tabs.map((tab) => (
          <TabsContent key={tab.value} value={tab.value}>
            <div className='w-full h-full flex flex-col'>
              <ChartHeader />
              <div className='w-full h-full pt-10 pb-14 px-5'>{tab.element}</div>
            </div>
          </TabsContent>
        )),
      )}
    </Tabs>
  )
}

function ChartHeader() {
  const { selectedEventId } = useEventSelectorStore()
  const { data: analyticsData } = useGetEventAnalytics(selectedEventId ?? '')
  console.log('analyticsData', analyticsData)

  return (
    <div className='w-full flex items-center justify-between bg-white h-14 px-8 border-l border-light-gray'>
      <div className='flex items-center gap-3'>
      </div>
      <div className='flex items-center gap-8'>
        <Button variant='ghost' className='gap-1 py-0.5 px-1.5 hover:bg-black/10'>
          <ExportButton  />
        </Button>

        <EventSelect />
      </div>
    </div>
  )
}

const chartTabs: IChartTabs[] = [
  {
    section: 'Event',
    tabs: [
      {
        value: 'Overview',
        name: 'Overview',
        element: <div className='w-full min-h-full bg-white rounded-[4px]' />,
      },
      {
        value: 'Vendors',
        name: 'Vendors',
        element: <div className='w-full min-h-full bg-white rounded-[4px]' />,
      },
    ],
  },
  {
    section: 'Tickets',
    tabs: [
      {
        value: 'Orders',
        name: 'Orders',
        element: <div className='w-full min-h-full bg-white rounded-[4px]' />,
      },
      {
        value: 'Attendee-list',
        name: 'Attendee List',
        element: <div className='w-full min-h-full bg-white rounded-[4px]' />,
      },
      {
        value: 'promo-codes',
        name: 'Promo Codes',
        element: <div className='w-full min-h-full bg-white rounded-[4px]' />,
      },
    ],
  },
  {
    section: 'Audience',
    tabs: [
      {
        value: 'insights',
        name: 'Insights',
        element: <div className='w-full h-full bg-white rounded-[4px]' />,
      },
    ],
  },
]

const chartTabValues = chartTabs.flatMap((section) => section.tabs.map((tab) => tab.value))

interface IChartTabs {
  section: string
  tabs: { value: string; name: string; element: React.ReactNode }[]
}
