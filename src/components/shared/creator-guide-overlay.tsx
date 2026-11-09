import { getRoutePath } from '@/config/get-route-path'
import { useGuideStore } from '@/stores'
import { ArrowRight, X } from 'lucide-react'
import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { useNavigate } from 'react-router-dom'
import { Button } from '../ui/button'

const GUIDE_STEPS = [
  {
    step: '01',
    tab: 'event-details',
    title: 'Event Details',
    description: 'Start by giving your event a name, date, venue, category and poster. Everything fans need to know at a glance.',
    hint: 'Use a high resolution poster so it looks sharp on every screen, then hit "Continue".',
  },
  {
    step: '02',
    tab: 'tickets',
    title: 'Add Tickets',
    description: 'Create ticket tiers — VIP, General Admission, Early Bird. Set prices and quantity for each type.',
    hint: 'You can add multiple ticket types and come back to edit them anytime.',
  },
  {
    step: '03',
    tab: 'publish',
    title: 'Publish',
    description: "You're almost there! Review your event details one last time, then go live for fans to discover.",
    hint: 'Not ready? Save as draft and come back whenever you are.',
  },
]

export default function CreatorGuideOverlay() {
  const { guideActive, guideStep, nextGuideStep, prevGuideStep, endGuide } = useGuideStore()
  const navigate = useNavigate()

  const current = GUIDE_STEPS[guideStep]
  const isLast = guideStep === GUIDE_STEPS.length - 1
  const isFirst = guideStep === 0

  // Navigate to the correct add-event tab whenever step changes
  useEffect(() => {
    if (guideActive) {
      navigate(`${getRoutePath('add_event')}?tab=${current.tab}`)
    }
  }, [guideActive, guideStep])

  function handleNext() {
    if (isLast) {
      endGuide()
      navigate(`${getRoutePath('add_event')}?tab=event-details`)
    } else {
      nextGuideStep()
    }
  }

  function handleClose() {
    endGuide()
    navigate(getRoutePath('standalone'))
  }

  if (!guideActive) return null

  return createPortal(
    <div className='fixed inset-0 z-[9999] pointer-events-none'>
      {/* Dim overlay — does NOT block the page so users can interact */}
      <div className='absolute inset-0 bg-black/40 pointer-events-none' />

      {/* Floating bottom card */}
      <div
        className='absolute bottom-6 left-1/2 -translate-x-1/2 w-[90vw] max-w-[480px] pointer-events-auto'
        style={{ filter: 'drop-shadow(0 8px 32px rgba(0,0,0,0.35))' }}>

        {/* Arrow pointing up to the page content */}
        <div className='flex justify-center mb-1'>
          <svg width='24' height='14' viewBox='0 0 24 14' fill='none'>
            <path d='M12 0L24 14H0L12 0Z' fill='white' />
          </svg>
        </div>

        <div className='bg-white rounded-2xl overflow-hidden'>
          {/* Progress bar */}
          <div className='w-full h-1 bg-gray-100'>
            <div
              className='h-full bg-deep-red transition-all duration-500 ease-out'
              style={{ width: `${((guideStep + 1) / GUIDE_STEPS.length) * 100}%` }}
            />
          </div>

          <div className='px-6 py-5 flex flex-col gap-4'>
            {/* Header row */}
            <div className='flex items-start justify-between'>
              <div className='flex items-center gap-3'>
                <span className='text-3xl font-black text-deep-red/12 font-sf-pro-display leading-none select-none'>
                  {current.step}
                </span>
                <div className='flex gap-1.5 items-center'>
                  {GUIDE_STEPS.map((_, i) => (
                    <div
                      key={i}
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        i === guideStep ? 'w-5 bg-deep-red' : i < guideStep ? 'w-2.5 bg-deep-red/35' : 'w-2.5 bg-gray-200'
                      }`}
                    />
                  ))}
                </div>
              </div>

              <button
                onClick={handleClose}
                className='w-6 h-6 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors text-gray-400 hover:text-gray-600'>
                <X size={13} />
              </button>
            </div>

            {/* Content */}
            <div className='flex flex-col gap-1.5'>
              <p className='text-base font-bold text-charcoal font-sf-pro-display'>{current.title}</p>
              <p className='text-xs text-gray-500 font-sf-pro-text leading-relaxed'>{current.description}</p>
            </div>

            {/* Hint */}
            <div className='flex items-start gap-2 bg-gray-50 rounded-lg px-3.5 py-2.5'>
              <span className='text-sm mt-px'>💡</span>
              <p className='text-[11px] text-gray-500 font-sf-pro-text leading-relaxed'>{current.hint}</p>
            </div>

            {/* Actions */}
            <div className='flex items-center justify-between'>
              <button
                onClick={prevGuideStep}
                className={`text-xs font-sf-pro-text text-gray-400 hover:text-gray-600 transition-colors ${isFirst ? 'invisible' : ''}`}>
                ← Back
              </button>

              <Button
                onClick={handleNext}
                className='h-8 px-5 rounded-[6px] bg-deep-red hover:bg-deep-red/90 text-white font-sf-pro-text text-xs font-semibold gap-1.5'>
                {isLast ? (
                  'Done — start creating!'
                ) : (
                  <>
                    Next step
                    <ArrowRight size={12} />
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  )
}
