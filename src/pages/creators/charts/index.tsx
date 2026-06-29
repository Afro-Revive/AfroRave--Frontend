import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { AddFilterBUtton } from '@/pages/creators/standalone/components/add-filter-btn'
import { Download } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import VendorSelect from '@/components/shared/vendor-select'
import { useEventSelectorStore } from '@/stores'
import { useGetOrganizerEvents } from '@/hooks/use-event-mutations'
import { EventData, PaginatedResponse } from '@/types'

export default function ChartPage() {
  const [activeTab, setActiveTab] = useState<string>('issued-net')
  const [searchParams, setSearchParams] = useSearchParams()

  useEffect(() => {
    const tabParam = searchParams.get('tab')

    if (
      tabParam === 'issued-net' ||
      tabParam === 'issued-before-start-date' ||
      tabParam === 'ticket-order-type' ||
      tabParam === 'ticket-net-sales' ||
      tabParam === 'cummulative-count' ||
      tabParam === 'sales-order-type' ||
      tabParam === 'realized'
    ) {
      setActiveTab(tabParam)
    } else {
      setActiveTab('issued-net')
      setSearchParams({ tab: 'issued-net' })
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
  const { data: response } = useGetOrganizerEvents()
  const eventData = response?.data as PaginatedResponse<EventData> | undefined
  const selectedEvent = eventData?.items.find((e) => e.eventId === selectedEventId)

  return (
    <div className='w-full flex items-center justify-between bg-white h-14 px-8 border-l border-light-gray'>
      <div className='flex items-center gap-3'>
        <AddFilterBUtton />
        {selectedEvent && (
          <span className='hidden md:block text-xs text-gray-400 font-sf-pro-text truncate max-w-[200px]'>
            {selectedEvent.eventName}
          </span>
        )}
      </div>

      <div className='flex items-center gap-8'>
        <Button variant='ghost' className='gap-1 py-0.5 px-1.5 hover:bg-black/10'>
          <Download color='#000000' size={16} />
          <span className='font-medium text-xs font-sf-pro-rounded text-black'>Download</span>
        </Button>

        <VendorSelect />
      </div>
    </div>
  )
}

const chartTabs: IChartTabs[] = [
  {
    section: 'Tickets',
    tabs: [
      {
        value: 'issued-net',
        name: 'Issued (Net)',
        element: <div className='w-full min-h-full bg-white rounded-[4px]' />,
      },
      {
        value: 'issued-before-start-date',
        name: 'Issued before start date',
        element: <div className='w-full min-h-full bg-white rounded-[4px]' />,
      },
      {
        value: 'ticket-order-type',
        name: 'By order type',
        element: <div className='w-full min-h-full bg-white rounded-[4px]' />,
      },
    ],
  },
  {
    section: 'Sales',
    tabs: [
      {
        value: 'ticket-net-sales',
        name: 'Ticket Net Sales',
        element: <div className='w-full min-h-full bg-white rounded-[4px]' />,
      },
      {
        value: 'cummulative-count',
        name: 'Cumulative count',
        element: <div className='w-full min-h-full bg-white rounded-[4px]' />,
      },
      {
        value: 'sales-order-type',
        name: 'By order type',
        element: <div className='w-full min-h-full bg-white rounded-[4px]' />,
      },
    ],
  },
  {
    section: 'Revenue',
    tabs: [
      {
        value: 'realized',
        name: 'Realized',
        element: <div className='w-full h-full bg-white rounded-[4px]' />,
      },
    ],
  },
]

interface IChartTabs {
  section: string
  tabs: { value: string; name: string; element: React.ReactNode }[]
}
