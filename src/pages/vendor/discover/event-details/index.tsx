import { ShowMoreText } from '@/components/reusable/show-more-text'
import { RenderEventImage } from '@/components/shared/render-event-flyer'
import { getRoutePath } from '@/config/get-route-path'
import { useGetEvent, useGetVendorApplications, useGetVendorSlots } from '@/hooks/use-event-mutations'
import { useRequestVendorSlots } from '@/hooks/use-vendor'
import { formatDateLong, formatTimeLong } from '@/lib/helper-func'
import type { EventDetailData, PaginatedResponse } from '@/types'
import type { VendorApplications, VendorSlot } from '@/types/vendor'
import { useState } from 'react'
import { RiCloseLine } from 'react-icons/ri'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { toast } from 'sonner'
import { VendorEmptyState } from '../../component/vendor-empty-state'
import { formatVendorDate } from '../../lib/format-date'
import { SlotCart } from './slot-cart'
import { SlotRow } from './slot-row'
import { getSlotsLeft, isRevenueSlot, toApplicationRequest, type SlotCartItem } from './slot-request'

/** A request the vendor can still act on blocks requesting the same slot again. */
const LIVE_STATUSES = ['pending', 'approved', 'accepted', 'secured']

/**
 * The vendor's "ticket page" for an event: its details, the slots and offers it's taking
 * applications for, and "Your Slots", where the vendor gathers what to request.
 */
export default function VendorEventDetailsPage() {
  const { eventId = '' } = useParams()
  const navigate = useNavigate()
  const [cart, setCart] = useState<SlotCartItem[]>([])

  const { data: eventResponse, isPending: isLoadingEvent } = useGetEvent(eventId)
  const { data: slotsResponse, isPending: isLoadingSlots } = useGetVendorSlots(eventId)
  const { data: applicationsResponse } = useGetVendorApplications()
  const requestSlots = useRequestVendorSlots()

  const event = eventResponse?.data as EventDetailData | undefined
  const slots = (slotsResponse?.data as PaginatedResponse<VendorSlot> | undefined)?.items ?? []
  const applications = (applicationsResponse?.data as PaginatedResponse<VendorApplications> | undefined)?.items ?? []
  const eventEnded = !!event && new Date(event.eventDate.endDate) < new Date()

  const close = () => navigate(getRoutePath('vendor_discover'))

  function liveApplicationFor(slot: VendorSlot) {
    return applications.find(
      (application) =>
        application.eventVendorId === slot.vendorId && LIVE_STATUSES.includes(application.status?.toLowerCase()),
    )
  }

  function addRevenue(slot: VendorSlot) {
    setCart((prev) => {
      const existing = prev.find((item) => item.slot.vendorId === slot.vendorId)
      if (!existing) return [...prev, { slot, quantity: 1 }]
      const quantity = Math.min(existing.quantity + 1, getSlotsLeft(slot))
      return prev.map((item) => (item === existing ? { ...item, quantity } : item))
    })
  }

  function addService(slot: VendorSlot, priceOffer: number) {
    // One offer per service: adding again replaces the price.
    setCart((prev) => [...prev.filter((item) => item.slot.vendorId !== slot.vendorId), { slot, quantity: 1, priceOffer }])
  }

  function decrease(vendorId: string) {
    setCart((prev) =>
      prev.flatMap((item) => {
        if (item.slot.vendorId !== vendorId) return [item]
        return item.quantity > 1 ? [{ ...item, quantity: item.quantity - 1 }] : []
      }),
    )
  }

  function handleRequest() {
    requestSlots.mutate(cart.map(toApplicationRequest), {
      onSuccess: (failedIndexes) => {
        if (failedIndexes.length === 0) {
          toast.success(cart.length === 1 ? 'Request sent' : `${cart.length} requests sent`)
          navigate(getRoutePath('vendor_slots'))
          return
        }
        const sent = cart.length - failedIndexes.length
        toast.error(
          sent > 0
            ? `${sent} sent, but ${failedIndexes.length} couldn’t be sent. They’re still in Your Slots.`
            : 'Your request couldn’t be sent. Please try again.',
        )
        setCart((prev) => prev.filter((_, index) => failedIndexes.includes(index)))
      },
    })
  }

  if (isLoadingEvent) {
    return (
      <div className='min-h-screen bg-[#1E1E1E] px-4 py-10 md:px-[108px]'>
        <div className='h-24 max-w-[650px] animate-pulse rounded-xl bg-[#2A2A2A]' />
        <div className='mt-14 h-60 max-w-[650px] animate-pulse rounded-xl bg-[#2A2A2A]' />
      </div>
    )
  }

  if (!event) {
    return (
      <div className='min-h-screen bg-[#1E1E1E]'>
        <VendorEmptyState
          className='py-40'
          title='Event Not Found'
          action={
            <Link
              to={getRoutePath('vendor_discover')}
              className='inline-flex h-9 items-center rounded-md bg-light-red px-3 font-sf-pro-text text-sm font-medium text-white'>
              Back to Discover
            </Link>
          }
        />
      </div>
    )
  }

  return (
    // pb-36 keeps the last slot clear of the Your Slots bar.
    <div className='min-h-screen bg-[#1E1E1E] pb-36 text-white'>
      <header className='flex items-start justify-between gap-4 border-b border-[#2E2E2E] px-4 pt-6 pb-7 md:px-[108px]'>
        <div className='flex min-w-0 flex-col gap-1.5'>
          <h1 className='font-work-sans text-2xl leading-tight font-black uppercase md:text-[28px]'>
            {event.eventName}
          </h1>
          <p className='font-inter-tight text-base'>{event.venue}</p>
          <p className='font-inter-tight text-base'>{formatVendorDate(event.eventDate.startDate)}</p>
        </div>
        <button
          type='button'
          aria-label='Close'
          onClick={close}
          className='flex size-12 shrink-0 items-center justify-center rounded-full bg-[#3A3A3A] text-white transition-colors hover:bg-[#4A4A4A] md:size-[58px]'>
          <RiCloseLine className='size-8' />
        </button>
      </header>

      <main className='box-content flex max-w-[650px] flex-col gap-8 px-4 pt-8 md:px-[108px]'>
        <AboutEvent event={event} />

        <section className='flex flex-col gap-4'>
          <h2 className='font-inter-tight text-2xl font-bold'>Available Slots</h2>

          {isLoadingSlots ? (
            <div className='h-48 animate-pulse rounded-lg bg-[#3D3D3D]' />
          ) : slots.length > 0 ? (
            // One card, like the fans' ticket list: divide-y draws the separators.
            <div className='w-full flex flex-col overflow-hidden rounded-md bg-gunmetal-gray divide-y divide-mid-dark-gray'>
              {slots.map((slot) => (
                <SlotRow
                  key={slot.vendorId}
                  slot={slot}
                  eventEnded={eventEnded}
                  quantityInCart={cart.find((item) => item.slot.vendorId === slot.vendorId)?.quantity ?? 0}
                  requestedApplicationId={liveApplicationFor(slot)?.id}
                  onAddRevenue={() => addRevenue(slot)}
                  onAddService={(price) => addService(slot, price)}
                  onDecrease={() => decrease(slot.vendorId)}
                />
              ))}
            </div>
          ) : (
            <VendorEmptyState className='rounded-lg bg-[#2A2A2A] py-14' title='No Slots Yet' description='This event isn’t taking vendor applications yet.' />
          )}

          {slots.some((slot) => !isRevenueSlot(slot)) && (
            <p className='font-sf-pro-text text-xs text-[#9A9A9A]'>
              For services, enter the price you’d charge. The organizer sees it with your request.
            </p>
          )}
        </section>
      </main>

      <SlotCart items={cart} onRequest={handleRequest} isRequesting={requestSlots.isPending} />
    </div>
  )
}

// Same markup as the fans' cart page (cart-container.tsx), so the two stay identical.
function AboutEvent({ event }: { event: EventDetailData }) {
  return (
    <section className='w-full flex flex-col md:flex-row items-stretch gap-4'>
      <div className='md:w-[300px] md:h-[400px] w-[200px] h-[300px] mt-4 md:mt-0 shrink-0'>
        <RenderEventImage
          image={event.eventDetails?.desktopMedia?.flyer}
          event_name={event.eventName}
          className='!w-full !h-full object-cover'
        />
      </div>
      <div className='flex flex-col flex-1 gap-2 md:gap-0'>
        <p className='font-inter-tight md:text-2xl text-lg font-bold md:mb-4'>About Event</p>
        <div className='flex flex-col gap-1'>
          <p className='font-inter-tight text-lg font-bold uppercase'>{event.eventName}</p>
          <p className='font-inter-tight text-sm md:text-base'>
            {formatDateLong(event.eventDate.startDate)} | {event.venue}
          </p>
          <p className='font-inter-tight text-sm md:text-base'>
            Doors open: {formatTimeLong(event.eventDate.startTime)} - {formatTimeLong(event.eventDate.endTime)}
          </p>
        </div>
        <div className='flex flex-col gap-1 font-inter-tight text-sm'>
          <ShowMoreText text={event.description} limit={200} className='text-sm font-inter-tight' />
        </div>
      </div>
    </section>
  )
}
