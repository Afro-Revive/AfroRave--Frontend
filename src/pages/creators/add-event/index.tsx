import { CreatorMenuButton } from '@/components/reusable/creator-menu-button'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { getRoutePath } from '@/config/get-route-path'
import { cn } from '@/lib/utils'
import { useAfroStore } from '@/stores'
import { ChevronLeft, Info } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import EventDetailsTab from './tabs/event-details-tab'
import PublishTab from './tabs/publish-tab'
import ThemeTab from './tabs/theme-tab'
import TicketsTab from './tabs/tickets-tab'
import { OnlyShowIf } from '@/lib/environment'
import { ApplyPromoCodePopover } from './component/apply-promo-popover'

export default function AddEventPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [activeTab, setActiveTab] = useState<string>('event-details')
  const [heading, setHeading] = useState<string>('')
  const [description, setDescription] = useState<string>('')
  const [step, setStep] = useState<number>()
  const [showError, setShowError] = useState(false)

  const { user } = useAfroStore()

  const navigate = useNavigate()



  useEffect(() => {
    const tabParam = searchParams.get('tab')
    const formParam = searchParams.get('form')

    if (
      tabParam === 'event-details' ||
      tabParam === 'tickets' ||
      tabParam === 'theme' ||
      tabParam === 'publish'
    ) {
      setActiveTab(tabParam)
      RenderHeadline(tabParam, setHeading, setDescription, formParam)
    } else if (!tabParam) {
      setActiveTab('event-details')
      setSearchParams({ tab: 'event-details' })
      RenderHeadline('event-details', setHeading, setDescription, null)
    }
  }, [searchParams, setSearchParams])

  const setActiveTabState = (incomingTab: string) => {
    setSearchParams({ tab: incomingTab })
    RenderHeadline(incomingTab, setHeading, setDescription)
  }

  const handleBackClick = () => {
    const currentIndex = tabs.findIndex((tab) => tab.value === activeTab)
    if (currentIndex > 0) {
      const previousTab = tabs[currentIndex - 1].value
      setActiveTab(previousTab)
      setSearchParams({ tab: previousTab })
    } else {
      navigate(getRoutePath('standalone'))
    }
  }



  const tabs: IEditTabProps[] = [
    {
      value: 'event-details',
      name: 'Event Details',
      element: <EventDetailsTab setStep={setStep} setActiveTabState={setActiveTabState} />,
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
    {
      value: 'theme',
      name: 'Theme',
      element: <ThemeTab setStep={setStep} setActiveTabState={setActiveTabState} />,
    },
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
          <img src='/assets/landing-page/AR.png' alt='AR' width={60} height={32} />

          <CustomTabTriggers tabs={tabs} className='hidden lg:flex p-0' />

          <CreatorMenuButton user={user} variant='dark' />
        </div>
        <CustomTabTriggers tabs={tabs} className='w-full flex lg:hidden px-5' />
      </div>
      {tabs.map((tab) => (
        <TabsContent
          key={tab.value}
          value={tab.value}
          className='w-full h-fit max-w-screen overflow-x-hidden bg-white'>
          <div className='w-full h-fit flex flex-col items-center'>
            {/** Nav */}
            <TabNav
              handleBackClick={handleBackClick}
              activeTab={activeTab}
              navigate={navigate}
              formParam={searchParams.get('form')}
            />

            <section className='max-w-[1536px] w-full flex flex-col gap-10 px-5 md:px-14'>
              <div className='flex flex-col gap-6 md:py-10'>
                <div className='flex flex-col gap-2 text-black font-sf-pro-display'>
                  <p className='font-black text-2xl md:text-4xl uppercase'>{heading}</p>
                  <p className='text-[13px] max-w-[351px] uppercase'>{description}</p>
                  <p className='text-xl font-black'>STEP {step || 1}</p>
                </div>

                <OnlyShowIf condition={showError}>
                  <MoreTabDetails />
                </OnlyShowIf>

                <OnlyShowIf condition={activeTab === 'theme' && false}>
                  <MoreTabDetails type='theme' />
                </OnlyShowIf>

                <OnlyShowIf condition={activeTab === 'tickets' && searchParams.get('form') === 'promocode'}>
                  <div className='flex items-start gap-2 text-charcoal'>
                    <span className='text-sm'>ⓘ</span>
                    <div className='flex flex-col'>
                      <p className='text-sm font-bold font-sf-pro-display'>You can come back to this later</p>
                      <p className='text-xs font-sf-pro-display text-charcoal/70'>No worries if you're not ready to complete this step now. You can always return to it at anytime from your dashboard.</p>
                    </div>
                  </div>
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
    <TabsList className={cn('items-center gap-5 md:gap-24 w-fit h-fit bg-transparent', className)}>
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

function TabNav({ activeTab, handleBackClick, navigate, formParam }: ITabNav) {
  return (
    <div className='w-full h-fit flex items-center justify-between py-3 px-5 md:px-8 md:py-4'>
      <Button
        variant='ghost'
        className='w-fit h-fit hover:bg-black/10 !p-0'
        onClick={handleBackClick}>
        <ChevronLeft color='#000000' className='min-w-1.5 min-h-3' />
      </Button>

      <div className='flex gap-3'>
        {activeTab === 'tickets' && formParam === 'promocode' && <ApplyPromoCodePopover />}




        <Button
          variant='ghost'
          className='h-8 w-fit px-4 text-[10px] uppercase font-sf-pro-text font-bold rounded-[5px] bg-white text-deep-red border border-deep-red hover:bg-white/90'
          onClick={() => navigate(getRoutePath('standalone'))}>
          SAVE AS DRAFTS
        </Button>
      </div>
    </div>
  )
}

function MoreTabDetails({ type = 'error' }: { type?: 'error' | 'theme' }) {
  return (
    <div
      className={cn('w-[253px] flec flex-col text-charcoal', {
        'text-deep-red': type === 'error',
        'text-charcoal': type === 'theme',
      })}>
      <div className='flex items-center gap-2'>
        <Info size={16} className='text-inherit' />
        <p className='text-sm font-medium leading-[100%] font-sf-pro-display'>
          {type === 'error' ? 'Changes will be lost' : 'You can come back to this later'}
        </p>
      </div>
      <p className='text-[13px] font-sf-pro-display'>
        {type === 'error'
          ? 'If you leave now any changes will not be saved.'
          : `No worries if you’re not ready to complete this step now. You can always return to it at anytime from your dashboard.`}
      </p>
    </div>
  )
}

function RenderHeadline(
  activeTab: string,
  setHeading: (heading: string) => void,
  setDescription: (description: string) => void,
  formParam?: string | null,
) {
  if (activeTab === 'tickets') {
    if (formParam === 'promocode' || formParam === 'upgrades') {
      setHeading('GO BEYOND THE BASICS!')
      setDescription('Enhance your ticketing power with flexible, fan-friendly features')
      return
    }
    setHeading('CREATE YOUR TICKETS!')
    setDescription('Create different ticket types, set prices, and start your journey to a sold-out event!')
    return
  }

  if (activeTab === 'theme') {
    setHeading('AESTHETICS MATTERS!')
    setDescription(
      'CHOOSE A THEME FOR YOUR EVENT PAGE.',
    )
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

interface ITabNav {
  activeTab: string
  handleBackClick: () => void
  navigate: (path: string) => void
  formParam?: string | null
}

interface IEditTabProps {
  value: string
  name: string
  element: React.ReactNode
}
