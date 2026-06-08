import { Button } from '@/components/ui/button'
import { Tabs, TabsContent } from '@/components/ui/tabs'
import { getRoutePath } from '@/config/get-route-path'
import { useGetEvent } from '@/hooks/use-event-mutations'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useSearchParams } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import EventDetailsTab from './tabs/event-details-tab'
// import SettingsTab from './tabs/settings-tab'
import ThemeTab from './tabs/theme-tab'
import TicketsTab from './tabs/tickets-tab'
import { LoadingFallback } from '@/components/loading-fallback'
import ConfimationMailTab from './tabs/confimation-mail-tab'

export default function EditEventPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [activeTab, setActiveTab] = useState<string>('event-details')

  const { eventId } = useParams()

  // const deleteEventMutation = useDeleteEvent()

  const navigate = useNavigate()

  const { data: eventResponse, isPending: isLoading } = useGetEvent(eventId || '')

  const event = eventResponse?.data

  useEffect(() => {
    const editParam = searchParams.get('tab')

    if (
      editParam === 'event-details' ||
      editParam === 'tickets' ||
      editParam === 'theme' ||
      editParam === 'settings'
    ) {
      setActiveTab(editParam)
    } else {
      setActiveTab('event-details')
      setSearchParams({ tab: 'event-details' })
    }
  }, [searchParams, setSearchParams])

  const setActiveTabState = (nextTab: string) => {
    setActiveTab(nextTab)
    setSearchParams({ tab: nextTab })
  }

  // const handleDeleteEvent = async () => {
  //   if (!eventId) {
  //     console.error('No event ID found')
  //     return
  //   }

  //   await deleteEventMutation.mutateAsync(eventId, {
  //     onSuccess: () => navigate(getRoutePath('standalone')),
  //   })
  // }

  if (!eventId) {
    return (
      <div className='w-full flex flex-col items-center justify-center gap-4 py-8'>
        <div className='text-center'>
          <h2 className='text-xl font-bold text-black mb-2'>No Event Found</h2>
          <p className='text-gray-600 mb-4'>Please select an event to edit tickets.</p>
          <Button
            onClick={() => navigate(getRoutePath('standalone'))}
            className='bg-black text-white hover:bg-gray-800'>
            Go to Event Details
          </Button>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return <LoadingFallback />
  }

  if (!event) {
    return (
      <div className='w-full h-screen flex flex-col gap-5 items-center justify-center bg-white'>
        <p className='text-charcoal text-4xl font-semibold'>No Event Found</p>
        <Button onClick={() => navigate(-1)}>Go Back</Button>
      </div>
    )
  }

  const edit_tabs: IEditTabProps[] = [
    {
      value: 'event-details',
      name: 'Event Details',
      element: <EventDetailsTab event={event} setActiveTab={setActiveTabState} handleBackClick={() => navigate(getRoutePath('standalone'))} />,
    },
    {
      value: 'tickets',
      name: 'Tickets',
      element: (
        <TicketsTab
          eventId={event.eventId}
          setActiveTab={setActiveTabState}
          eventName={event.eventName}
        />
      ),
    },
    {
      value: 'theme',
      name: 'Theme',
      element: <ThemeTab event={event} setActiveTab={setActiveTabState} />,
    },
    // {
    //   value: 'settings',
    //   name: 'Settings',
    //   element: (
    //     <SettingsTab onDeleteEvent={handleDeleteEvent} isDeleting={deleteEventMutation.isPending} />
    //   ),
    // },
    {
      value: 'settings',
      name: 'Settings',
      element: <ConfimationMailTab event={event} setActiveTab={setActiveTabState} />,
    },
  ]

  return (
    <Tabs
      defaultValue={activeTab}
      value={activeTab}
      onValueChange={setActiveTabState}
      className='w-full min-h-screen flex flex-col items-center bg-white overflow-x-hidden'>
      {edit_tabs.map((tab) => (
        <TabsContent
          key={tab.value}
          value={tab.value}
          className='w-full max-w-screen overflow-x-hidden bg-[#f8f8f8]'>
          {tab.element}
        </TabsContent>
      ))}
    </Tabs>
  )
}

interface IEditTabProps {
  value: string
  name: string
  element: React.ReactNode
}
