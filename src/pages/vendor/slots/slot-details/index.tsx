import { RichTextContent } from '@/components/reusable/rich-text-content'
import { getRoutePath } from '@/config/get-route-path'
import { useGetEvent, useGetVendorApplications } from '@/hooks/use-event-mutations'
import { usePayVendorSlot, useWithdrawVendorApplication } from '@/hooks/use-vendor'
import { eventKeys } from '@/lib/event-keys'
import type { EventDetailData, PaginatedResponse } from '@/types'
import type { VendorApplications } from '@/types/vendor'
import { useQueryClient } from '@tanstack/react-query'
import { useEffect, useRef } from 'react'
import { RiInstagramLine, RiLinksLine, RiTwitterXLine } from 'react-icons/ri'
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { toast } from 'sonner'
import { VendorTypeTag } from '../../component/slot-status-pill'
import { VendorEmptyState } from '../../component/vendor-empty-state'
import { VendorPageHeader } from '../../component/vendor-page-header'
import { getSlotName, getSlotStatus, isRevenueApplication } from '../slot-status'
import { SlotSummaryCard } from './slot-summary-card'

const PAYMENT_METHOD = 'paystack-checkout'

/** Paystack checkout link from the pay endpoint. The API doesn't send one yet (FEATURES.md §5). */
function getCheckoutUrl(data: unknown): string | undefined {
  if (!data || typeof data !== 'object') return undefined
  const record = data as Record<string, unknown>
  const url = record.authorizationUrl ?? record.authorization_url ?? record.checkoutUrl ?? record.paymentUrl
  return typeof url === 'string' ? url : undefined
}

export default function VendorSlotDetailsPage() {
  const { applicationId } = useParams<{ applicationId: string }>()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [searchParams, setSearchParams] = useSearchParams()

  const { data, isPending } = useGetVendorApplications()
  const application = (data?.data as PaginatedResponse<VendorApplications> | undefined)?.items.find(
    (item) => String(item.id) === applicationId,
  )
  const { data: eventResponse } = useGetEvent(application?.eventId ?? '')
  const event = eventResponse?.data as EventDetailData | undefined

  const withdraw = useWithdrawVendorApplication()
  const pay = usePayVendorSlot()

  function onSlotSecured() {
    toast.success('Slot secured!')
    queryClient.invalidateQueries({ queryKey: eventKeys.vendorApplications() })
    queryClient.invalidateQueries({ queryKey: eventKeys.vendorSummary() })
  }

  function handlePay() {
    if (!application) return
    pay.mutate(
      { applicationId: application.id, paymentMethod: PAYMENT_METHOD },
      {
        onSuccess: (response) => {
          const checkoutUrl = getCheckoutUrl(response?.data)
          if (checkoutUrl) {
            window.location.href = checkoutUrl
            return
          }
          // TODO: remove once the pay endpoint returns a Paystack link. Until then nothing is
          // paid, so don't say the slot is secured; just pick up any status change.
          toast.info('Online payment isn’t available yet. Contact the organizer to pay for this slot.')
          queryClient.invalidateQueries({ queryKey: eventKeys.vendorApplications() })
        },
        onError: () => toast.error('Could not start the payment. Please try again.'),
      },
    )
  }

  function handleWithdraw() {
    if (!application) return
    withdraw.mutate(application.id, {
      onSuccess: () => navigate(getRoutePath('vendor_slots'), { replace: true }),
    })
  }

  // Back from Paystack: confirm the payment with its reference, once.
  const reference = searchParams.get('reference') ?? searchParams.get('trxref')
  const confirmedReference = useRef<string | null>(null)
  useEffect(() => {
    if (!reference || !application || confirmedReference.current === reference) return
    confirmedReference.current = reference
    pay.mutate(
      { applicationId: application.id, paymentMethod: PAYMENT_METHOD, reference },
      {
        onSuccess: onSlotSecured,
        onError: () => toast.error('We couldn’t confirm your payment yet. Refresh in a moment.'),
        onSettled: () => setSearchParams({}, { replace: true }),
      },
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reference, application])

  if (isPending) {
    return (
      <section className='flex w-full flex-col'>
        <div className='h-[88px] w-full animate-pulse border-b border-[#232323] bg-[#1E1E1E]' />
        <div className='grid gap-5 px-4 py-6 md:px-7 lg:grid-cols-2'>
          <div className='aspect-[2/3] animate-pulse rounded-[20px] bg-[#2A2A2A]' />
          <div className='h-[520px] animate-pulse rounded-xl bg-[#262626]' />
        </div>
      </section>
    )
  }

  if (!application) {
    return (
      <VendorEmptyState
        className='py-40'
        title='Slot Not Found'
        description='This request may have been withdrawn.'
        action={
          <Link
            to={getRoutePath('vendor_slots')}
            className='inline-flex h-9 items-center rounded-md bg-light-red px-3 font-sf-pro-text text-sm font-medium text-white'>
            Back to My Slots
          </Link>
        }
      />
    )
  }

  const isRevenue = isRevenueApplication(application)

  return (
    <section className='flex w-full flex-col'>
      <VendorPageHeader
        title={application.eventName}
        subtitle={getSlotName(application)}
        onBack={() => navigate(getRoutePath('vendor_slots'))}
        aside={<VendorTypeTag isRevenue={isRevenue} />} 
      />

      <div className='grid items-start gap-5 px-4 py-6 md:px-7 lg:grid-cols-2'>
        <EventFlyerCard application={application} event={event} />

        <div className='flex flex-col gap-9'>
          <SlotSummaryCard
            application={application}
            event={event}
            status={getSlotStatus(application, event)}
            onWithdraw={handleWithdraw}
            isWithdrawing={withdraw.isPending}
            onPay={handlePay}
            isPaying={pay.isPending}
          />
          <CommunityCard />
        </div>
      </div>
    </section>
  )
}

function EventFlyerCard({ application, event }: { application: VendorApplications; event?: EventDetailData }) {
  const flyer = event?.eventDetails?.desktopMedia?.flyer

  return (
    <article className='relative flex aspect-[2/3] max-h-[760px] w-full flex-col justify-end overflow-hidden rounded-[20px] bg-[#2A2A2A] lg:sticky lg:top-[82px]'>
      {flyer && <img src={flyer} alt={application.eventName} className='absolute inset-0 size-full object-cover' />}
      <div className='absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent' />

      <div className='relative flex flex-col gap-2 p-4 md:p-5'>
        <h2 className='font-inter-tight text-xl font-black text-white'>About Event</h2>
        <RichTextContent
          value={event?.description || 'The organizer hasn’t added a description yet.'}
          className='line-clamp-6 font-inter-tight text-sm leading-snug text-white'
        />
        {event?.customUrl && (
          <Link
            to={getRoutePath('individual_event', { eventId: event.customUrl })}
            target='_blank'
            rel='noopener noreferrer'
            className='mt-2 w-fit rounded-md bg-white/30 px-3 py-1.5 font-inter text-xs font-bold text-white backdrop-blur-sm transition-colors hover:bg-white/40'>
            Go to eventpage
          </Link>
        )}
      </div>
    </article>
  )
}

const COMMUNITY_LINKS = [
  { label: 'Instagram', href: 'https://www.instagram.com/afrorevive_', Icon: RiInstagramLine },
  { label: 'X', href: 'https://x.com/afrorevive', Icon: RiTwitterXLine },
  { label: 'AfroRevive for creators', href: getRoutePath('creators_home'), Icon: RiLinksLine },
]

function CommunityCard() {
  return (
    <section className='flex flex-col gap-2 rounded-2xl border border-white/30 p-5'>
      <h2 className='font-inter-tight text-lg font-bold text-white'>Join The Community</h2>
      <p className='font-sf-pro-text text-[13px] leading-snug text-white'>
        Follow us on social media for exciting updates and become a certified Afrorevive vendor!
      </p>
      <div className='mt-2 flex items-center gap-4'>
        {COMMUNITY_LINKS.map(({ label, href, Icon }) => (
          <a
            key={label}
            href={href}
            target='_blank'
            rel='noopener noreferrer'
            aria-label={label}
            className='text-white transition-opacity hover:opacity-70'>
            <Icon className='size-5' />
          </a>
        ))}
      </div>
    </section>
  )
}
