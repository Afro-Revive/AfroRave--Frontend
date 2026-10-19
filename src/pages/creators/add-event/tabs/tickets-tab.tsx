import { useEventStore, useGuideStore } from '@/stores'
import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
//  import UpgradeForm from '../ticket-forms/upgrade-form'
import CreateTicketForm from '../ticket-forms/create'
import { NoEventId } from '../component/no-event-id'

export default function TicketsTab({ setStep, setActiveTabState, showError }: ITicketsTab) {
  const [searchParams, setSearchParams] = useSearchParams()
  const [currentForm, setCurrentForm] = useState<string>()
  const { eventId } = useEventStore()
  const { guideActive } = useGuideStore()

  useEffect(() => {
    const formParam = searchParams.get('form')

    // Tickets is the only form left in this step. The promo code and upgrade
    // steps are gone, so an old ?form=promocode or ?form=upgrades link lands
    // on the ticket form instead of an empty tab.
    if (formParam === 'create') {
      setCurrentForm(formParam)
    } else if (searchParams.get('tab') === 'tickets') {
      setSearchParams({ tab: 'tickets', form: 'create' }, { replace: true })
    }
  }, [searchParams])

  // Tickets hand straight on to the publish preview; promo codes are set up
  // from the Promo Codes page instead. setActiveTabState replaces the whole
  // query, so `form` is dropped with it.
  function goToPublish() {
    setActiveTabState('publish')
  }

  if (!eventId && !guideActive) {
    return <NoEventId setActiveTabState={setActiveTabState} />
  }

  // if (currentForm === 'upgrades') {
  //   setStep(2.5)
  //   return <UpgradeForm renderThemeTab={goToPublish} />
  // }

  if (currentForm === 'create') {
    setStep(2)
    return <CreateTicketForm onContinue={goToPublish} showError={showError} />
  }
}

interface ITicketsTab {
  setStep: (step: number) => void
  setActiveTabState: (activeTab: string) => void
  showError: () => void
}
