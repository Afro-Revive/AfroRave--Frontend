import { getRoutePath } from '@/config/get-route-path'
import { useGetEvent, useGetEventTickets, usePublishEvent } from '@/hooks/use-event-mutations'
import { formatDateLong } from '@/lib/helper-func'
import { cn } from '@/lib/utils'
import { useEventStore } from '@/stores'
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { BsTicketPerforated } from 'react-icons/bs'
import { ContinueButton } from '../component/continue-button'
import { RichTextContent } from '@/components/reusable/rich-text-content'
import { TicketSummaryCard } from '@/components/shared/ticket-summary-card'
import ContactSection from '@/pages/landing-page/event-page/individual-event/sections/contact'
import type { EventDetailData, PaginatedResponse, TicketData } from '@/types'

const TICKET_TYPE_LABELS: Record<NonNullable<TicketData['ticketType']>, string> = {
  Single: 'single ticket',
  Group: 'group ticket',
  MultiDay: 'multi-day ticket',
}

/**
 * The last step: the event as fans will meet it (flyer, description, contact
 * details) and its tickets, then Publish.
 */
export default function PublishTab({
  setStep,
}: {
  setStep: (step: number) => void
}) {
  // Step 3: Event Info, Tickets, then this. It read 4 while theme sat at 3.
  useEffect(() => setStep(3), [setStep])

  const { eventId } = useEventStore()

  const event = useGetEvent(eventId || '').data?.data as EventDetailData | undefined
  const tickets = useGetEventTickets(eventId || '').data?.data as PaginatedResponse<TicketData> | undefined
  const ticketItems = useMemo(() => tickets?.items ?? [], [tickets])

  const publishEventMutation = usePublishEvent()
  const navigate = useNavigate()

  const handlePublishEvent = async () => {
    if (!eventId) {
      console.error('No event ID found')
      return
    }

    await publishEventMutation.mutateAsync(eventId, {
      onSuccess: () => {
        navigate(getRoutePath('standalone'))
      },
    })
  }

  return (
    <div className='w-full flex flex-col items-center gap-6 mb-10'>
      <div className='w-full max-w-250 flex flex-col gap-10 rounded-2xl bg-[#1E1E1E] p-8 md:p-16 text-white'>
        <div className='grid grid-cols-1 gap-8 md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]'>
          <FlyerCard event={event} />

          <div className='flex flex-col justify-between gap-8'>
            <div className='flex flex-col gap-4'>
              <h3 className='font-inter-tight text-xl md:text-2xl font-black uppercase'>
                Event Description
              </h3>

              {event?.description?.trim() ? (
                <DescriptionPreview description={event.description} />
              ) : (
                <p className='font-inter-tight text-sm text-white/50'>No description yet.</p>
              )}
            </div>

            {event && <ContactSection event={event} title='Contact details' />}
          </div>
        </div>

        <div className='flex flex-col gap-4'>
          <h3 className='flex items-center gap-2 font-inter-tight text-2xl md:text-3xl font-black'>
            <BsTicketPerforated className='size-7 -rotate-45 text-deep-red' aria-hidden />
            Tickets
          </h3>

          {ticketItems.length > 0 ? (
            <div className='flex flex-col gap-3'>
              {ticketItems.map((ticket) => {
                const isUnlimited = ticket.quantity === 0

                return (
                  <TicketSummaryCard
                    key={ticket.ticketId}
                    name={ticket.ticketName}
                    price={ticket.basePrice ?? ticket.price}
                    typeLabel={ticket.ticketType ? TICKET_TYPE_LABELS[ticket.ticketType] : 'single ticket'}
                    accessLabel={ticket.accessType === 'Invite' ? 'Invite' : undefined}
                    isGroupTicket={ticket.ticketType === 'Group'}
                    groupSize={ticket.groupSize}
                    // Sold out of the total; an unlimited ticket has no total to show.
                    usedQuantity={isUnlimited ? undefined : ticket.soldQuantity ?? 0}
                    availableQuantity={isUnlimited ? undefined : ticket.quantity}
                    className='rounded-xl border-transparent bg-white px-5 py-4 shadow-none'
                  />
                )
              })}
            </div>
          ) : (
            <p className='font-inter-tight text-sm text-white/50'>No tickets yet.</p>
          )}
        </div>
      </div>

      <ContinueButton
        isLoading={publishEventMutation.isPending}
        onClick={handlePublishEvent}
        text='Publish'
        updatingText='Publishing'
        className='bg-[#CB342C] hover:bg-[#A62B24] w-[200px] h-10 text-xs uppercase font-bold tracking-wider rounded-[6px] shadow-sm'
      />
    </div>
  )
}

/** The poster with the event's name, date and venue over a fade at its foot. */
function FlyerCard({ event }: { event?: EventDetailData }) {
  // posterUrl is what the detail response carries; the nested flyer is only a
  // fallback for events saved before that field existed.
  const image = event?.posterUrl || event?.eventDetails.desktopMedia?.flyer

  return (
    <div className='relative w-full aspect-3/4 overflow-hidden rounded-2xl bg-white/10'>
      {image && (
        <img src={image} alt='' className='absolute inset-0 size-full object-cover' />
      )}
      <div className='absolute inset-0 bg-linear-to-t from-black/90 via-black/30 to-transparent' />

      <div className='absolute inset-x-0 bottom-0 flex flex-col gap-2 p-6 md:p-8'>
        <p className='font-inter-tight text-2xl md:text-3xl font-black uppercase leading-tight'>
          {event?.eventName}
        </p>
        {event && (
          <p className='font-inter-tight text-sm md:text-lg leading-snug'>
            {formatDateLong(event.eventDate.startDate)} at {event.venue}.
          </p>
        )}
      </div>
    </div>
  )
}

/**
 * The description, clipped to five lines with a fade until Read More. Whether
 * it needs the toggle is measured, since bullets and paragraphs make its height
 * more than its length.
 */
function DescriptionPreview({ description }: { description: string }) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [overflows, setOverflows] = useState(false)
  const contentRef = useRef<HTMLDivElement>(null)

  // Measured while clipped: expanded, nothing overflows and the toggle would vanish.
  useLayoutEffect(() => {
    const content = contentRef.current
    if (content && !isExpanded) setOverflows(content.scrollHeight > content.clientHeight + 1)
  }, [description, isExpanded])

  return (
    <div className='flex flex-col items-start gap-3'>
      <div
        ref={contentRef}
        className={cn(
          'font-inter-tight text-base leading-snug',
          !isExpanded && 'max-h-[5lh] overflow-hidden',
          !isExpanded && overflows && 'mask-[linear-gradient(to_bottom,black_70%,transparent)]',
        )}>
        <RichTextContent value={description} className='text-white' />
      </div>

      {overflows && (
        <button
          type='button'
          onClick={() => setIsExpanded((expanded) => !expanded)}
          className='font-inter-tight text-base font-semibold text-white underline underline-offset-4 transition-opacity hover:opacity-80'>
          {isExpanded ? 'Show Less' : 'Read More'}
        </button>
      )}
    </div>
  )
}
