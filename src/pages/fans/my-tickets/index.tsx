import { BaseAnimatedTab } from '@/components/reusable/base-animated-tab'
import { useUserActiveTickets, useUserPastTickets } from '@/hooks/use-profile-mutations'
import type { UserTicketData } from '@/types'
import type { PaginatedResponse } from '@/types/api'
import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import ActiveTicketsTab from './my-tickets-tabs/active-tab'
import PastTicketsTab from './my-tickets-tabs/past-tab'

export default function MyTicketsPage() {
  const [activeTab, setActiveTab] = useState<string>('active')
  const [searchParams, setSearchParams] = useSearchParams()

  const myTicketParam = searchParams.get('tab')

  const { data: activeTicketResponse, isLoading: isLoadingActiveTickets } = useUserActiveTickets()
  const { data: pastTicketResponse, isLoading: isLoadingPastTickets } = useUserPastTickets()

  const activeTickets = (activeTicketResponse?.data as PaginatedResponse<UserTicketData>)?.items ?? []
  const pastTickets = (pastTicketResponse?.data as PaginatedResponse<UserTicketData>)?.items ?? []
  useEffect(() => {
    if (myTicketParam === 'active' || myTicketParam === 'past') {
      setActiveTab(myTicketParam)
    } else {
      setActiveTab('active')
      setSearchParams({ tab: 'active' })
    }
  }, [searchParams])

  const setActiveTabState = (nextTab: string) => {
    setActiveTab(nextTab)
    setSearchParams({ tab: nextTab })
  }

  const my_tickets_tabs: IMyTicketsTab[] = [
    {
      value: 'active',
      name: 'Active',
      element: <ActiveTicketsTab data={activeTickets} isLoading={isLoadingActiveTickets} />,
    },
    {
      value: 'past',
      name: 'Past',
      element: <PastTicketsTab data={pastTickets} isLoading={isLoadingPastTickets} />,
    },
  ]

  return (
    <section className='w-full flex flex-col items-center px-10'>
      <BaseAnimatedTab
        activeTab={activeTab}
        setActiveTab={setActiveTabState}
        tabs={my_tickets_tabs}
        variant='listed-tickets'
      />
    </section>
  )
}

interface IMyTicketsTab {
  value: 'active' | 'past'
  name: string
  element: React.ReactNode
}
