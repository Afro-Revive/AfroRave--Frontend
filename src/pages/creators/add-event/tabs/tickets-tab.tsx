import { useEventStore, useGuideStore } from '@/stores'
import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import PromoCodeForm from '../ticket-forms/promo-code-form/promo-code-form'
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

    // Upgrades are no longer a feature. ?form=upgrades falls through to the
    // create form below instead of rendering an empty tab.
    if (formParam === 'create' || formParam === 'promocode') {
      setCurrentForm(formParam)
    } else if (searchParams.get('tab') === 'tickets') {
      setSearchParams({ tab: 'tickets', form: 'create' })
    }
  }, [searchParams])

  function handleFormChange(form: string) {
    setSearchParams({ tab: 'tickets', form: form })
    setCurrentForm(form)
  }

  // Promo codes hand straight on to the publish preview. The theme step that
  // used to sit between them is gone, and routing to it rendered a blank page.
  // setActiveTabState replaces the whole query, so `form` is dropped with it.
  function goToPublish() {
    setActiveTabState('publish')
  }

  if (!eventId && !guideActive) {
    return <NoEventId setActiveTabState={setActiveTabState} />
  }

  if (currentForm === 'promocode') {
    setStep(2.5)
    return <PromoCodeForm handleFormChange={goToPublish} />
  }

  // if (currentForm === 'upgrades') {
  //   setStep(2.5)
  //   return <UpgradeForm renderThemeTab={goToPublish} />
  // }

  if (currentForm === 'create') {
    setStep(2)
    return <CreateTicketForm handleFormChange={handleFormChange} showError={showError} />
  }
}

interface ITicketsTab {
  setStep: (step: number) => void
  setActiveTabState: (activeTab: string) => void
  showError: () => void
}
