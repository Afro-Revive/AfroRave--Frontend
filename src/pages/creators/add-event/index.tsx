import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { getRoutePath } from '@/config/get-route-path'
import { cn } from '@/lib/utils'
import { useEventStore } from '@/stores'
// import { Info } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useIsMutating } from '@tanstack/react-query'
import { toast } from 'sonner'
import { eventKeys } from '@/lib/event-keys'
import { EVENT_DETAILS_FORM_ID } from './constant'
import EventDetailsTab from './tabs/event-details-tab'
import PublishTab from './tabs/publish-tab'
import TicketsTab from './tabs/tickets-tab'
import { OnlyShowIf } from '@/lib/environment'
import { BiArrowBack } from "react-icons/bi";

export default function AddEventPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [activeTab, setActiveTab] = useState<string>('event-details')
  const [heading, setHeading] = useState<string>('')
  const [description, setDescription] = useState<string>('')
  const [step, setStep] = useState<number>()
  const [showError, setShowError] = useState(false)

  const resetEventData = useEventStore((state) => state.resetEventData)

  const navigate = useNavigate()

  // The in-progress event lives in a store that outlives this page, so leaving
  // — by publishing or abandoning — clears it. Otherwise the next Create Event
  // opened with the last event's id, and jumping straight to the Tickets tab
  // added tickets to that one.
  useEffect(() => resetEventData, [resetEventData])



  useEffect(() => {
    const tabParam = searchParams.get('tab')

    // The theme step is gone. An old link to it lands on publish, which is
    // where the theme step used to lead, rather than on a tab with no content.
    if (tabParam === 'theme') {
      setSearchParams({ tab: 'publish' }, { replace: true })
      return
    }

    if (tabParam === 'event-details' || tabParam === 'tickets' || tabParam === 'publish') {
      setActiveTab(tabParam)
      RenderHeadline(tabParam, setHeading, setDescription)
    } else if (!tabParam) {
      setActiveTab('event-details')
      setSearchParams({ tab: 'event-details' })
      RenderHeadline('event-details', setHeading, setDescription)
    }
  }, [searchParams, setSearchParams])

  const setActiveTabState = (incomingTab: string) => {
    setSearchParams({ tab: incomingTab })
    RenderHeadline(incomingTab, setHeading, setDescription)
  }

  const eventId = useEventStore((state) => state.eventId)
  const isCreatingEvent = useIsMutating({ mutationKey: eventKeys.create() }) > 0

  // Until Event Info is submitted there's nothing saved, so Save As Drafts
  // submits that form (same checks as Continue) and creates the event; it then
  // lands on the dashboard. After that the event and its tickets are saved as
  // they go and stay unpublished, so it only has to leave.
  const savesByCreating = activeTab === 'event-details' && !eventId
  // Tells that form's submit it came from here, so it ends on the dashboard.
  const savingDraft = useRef(false)

  const leaveAsDraft = () => {
    toast.success('Saved as a draft. Finish it any time from your dashboard.')
    navigate(getRoutePath('standalone'))
  }



  const tabs: IEditTabProps[] = [
    {
      value: 'event-details',
      name: 'Event Info',
      element: (
        <EventDetailsTab
          setStep={setStep}
          setActiveTabState={setActiveTabState}
          savingDraft={savingDraft}
        />
      ),
    },
    {
      value: 'tickets',
      name: 'Tickets',
      element: (
        <TicketsTab
          setStep={setStep}
          setActiveTabState={setActiveTabState}
          showError={() => setShowError(true)}
        />
      ),
    },
    // {
    //   value: 'theme',
    //   name: 'Theme',
    //   element: <ThemeTab setStep={setStep} setActiveTabState={setActiveTabState} />,
    // },
    {
      value: 'publish',
      name: 'Publish',
      element: <PublishTab setStep={setStep} />,
    },
  ]

  return (
    <Tabs
      defaultValue={activeTab}
      value={activeTab}
      onValueChange={setActiveTabState}
      className='w-full min-h-screen flex flex-col items-center bg-[#1E1E1E] overflow-x-hidden'>
      <div className='w-full flex flex-col'>
        <div className='w-full h-[72px] flex items-center justify-between py-4 px-8'>
          {/* <img src='/assets/landing-page/AR.png' alt='AR' width={60} height={32} /> */}
          <Link
            to={getRoutePath('standalone')}
            className='inline-flex items-center uppercase font-inter-tight text-sm font-semibold text-white transition-colors hover:text-white/70'>
            <BiArrowBack className='mr-4 md:size-4' />
            Dashboard
          </Link>

          <CustomTabTriggers tabs={tabs} className='hidden lg:flex p-0' />
          <Button
            variant='ghost'
            type={savesByCreating ? 'submit' : 'button'}
            // Outside the Event Info form, so it submits it by id. The click
            // runs before the submit, so the form sees the flag.
            form={savesByCreating ? EVENT_DETAILS_FORM_ID : undefined}
            onClick={() => {
              if (savesByCreating) savingDraft.current = true
              else leaveAsDraft()
            }}
            disabled={isCreatingEvent}
            className='h-8 w-fit px-4 text-[10px] uppercase font-sf-pro-text font-bold rounded-[5px] bg-white text-deep-red border border-deep-red hover:bg-white/90'>
            {isCreatingEvent ? 'SAVING...' : 'SAVE AS DRAFTS'}
          </Button>
          {/* <CreatorMenuButton user={user} variant='dark' /> */}
        </div>
        <CustomTabTriggers tabs={tabs} className='w-full flex lg:hidden px-5' />
      </div>
      {tabs.map((tab) => (
        <TabsContent
          key={tab.value}
          value={tab.value}
          className='w-full h-fit max-w-screen overflow-x-hidden bg-white'>
          <div className='w-full h-fit flex flex-col items-center'>
            <section className='w-full flex flex-col gap-10 px-5 md:px-14 pt-6 md:pt-8'>
              <div className='flex flex-col gap-6 '>
                <div className='flex flex-col gap-2 text-black font-sf-pro-display'>
                  <p className='font-black text-2xl md:text-4xl uppercase'>{heading}</p>
                  <p className='text-[13px] max-w-[351px] uppercase'>{description}</p>
                  <p className='text-xl font-black'>STEP {step || 1}</p>
                </div>

                <OnlyShowIf condition={showError}>
                  <MoreTabDetails />
                </OnlyShowIf>

              </div>

              {tab.element}
            </section>
          </div>
        </TabsContent>
      ))}
    </Tabs>
  )
}

function CustomTabTriggers({
  tabs,
  className,
}: {
  tabs: IEditTabProps[]
  className?: string
}) {
  return (
    <TabsList className={cn('items-center gap-5 md:gap-48 w-fit h-fit bg-transparent', className)}>
      {tabs.map((tab) => (
        <TabsTrigger
          disabled
          key={tab.value}
          value={tab.value}
          className='bg-transparent p-0 font-sf-pro-rounded font-normal text-xs md:text-sm text-white/50 data-[state=active]:text-white data-[state=active]:bg-transparent data-[state=active]:shadow-none disabled:opacity-100 uppercase'>
          {tab.name}
        </TabsTrigger>
      ))}
    </TabsList>
  )
}

function MoreTabDetails({ type = 'error' }: { type?: 'error' | 'theme' }) {
  return (
    <div
      className={cn('w-[253px] flec flex-col text-charcoal', {
        'text-deep-red': type === 'error',
        'text-charcoal': type === 'theme',
      })}>
      {/* <div className='flex items-center gap-2'>
        <Info size={16} className='text-inherit' />
        <p className='text-sm font-medium leading-[100%] font-sf-pro-display'>
          {type === 'error' ? 'Changes will be lost' : 'You can come back to this later'}
        </p>
      </div>
      <p className='text-[13px] font-sf-pro-display'>
        {type === 'error'
          ? 'If you leave now any changes will not be saved.'
          : `No worries if you’re not ready to complete this step now. You can always return to it at anytime from your dashboard.`}
      </p> */}
    </div>
  )
}

function RenderHeadline(
  activeTab: string,
  setHeading: (heading: string) => void,
  setDescription: (description: string) => void,
) {
  if (activeTab === 'tickets') {
    setHeading('CREATE YOUR TICKETS!')
    setDescription('Create different ticket types, set prices, and start your journey to a sold-out event!')
    return
  }

  if (activeTab === 'publish') {
    setHeading("Let's Go Live!")
    setDescription(
      "You're one step from live sales. Review your event details and publish when you're confident",
    )
    return
  }

  setHeading('BUILD YOUR STAGE!')
  setDescription('Your moment starts here! tell us about your event')
  return
}

interface IEditTabProps {
  value: string
  name: string
  element: React.ReactNode
}
