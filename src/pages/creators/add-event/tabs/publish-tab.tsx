import { BasePopover } from '@/components/reusable'
import { Button } from '@/components/ui/button'
import { getRoutePath } from '@/config/get-route-path'
import { useGetEventPromoCodes, usePublishEvent } from '@/hooks/use-event-mutations'
import { useGetEvent, useGetEventTickets, useGetEventVendors } from '@/hooks/use-event-mutations'
import { cn } from '@/lib/utils'
import { useEventStore } from '@/stores'
import { Ellipsis, Pencil, MapPin, Calendar } from 'lucide-react'
import { useEffect } from 'react'
import { useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ContinueButton } from '../component/continue-button'
import { RenderEventImage } from '@/components/shared/render-event-flyer'
import { EventDetailData, PaginatedResponse, PromoCodeData, TicketData, VendorData} from '@/types'

export default function PublishTab({
  setStep,
}: {
  setStep: (step: number) => void
}) {
  useEffect(() => setStep(5), [setStep])

  const { eventId } = useEventStore()

  const vendors = useGetEventVendors(eventId || '').data?.data as PaginatedResponse<VendorData> | undefined
  const event = useGetEvent(eventId || '').data?.data as EventDetailData | undefined
  const tickets = useGetEventTickets(eventId || '').data?.data as PaginatedResponse<TicketData> | undefined
  const promoCodes = useGetEventPromoCodes(eventId || '').data?.data as PaginatedResponse<PromoCodeData> | undefined

  const publishEventMutation = usePublishEvent()
  const navigate = useNavigate()

  const vendorNames = useMemo(() => {
    if (!vendors || !Array.isArray(vendors)) return []
    return vendors.map((v) => v.vendorName || '').filter((n: string) => n && typeof n === 'string')
  }, [vendors])

  const ticketNames = useMemo(() => {
    if (!tickets || !Array.isArray(tickets)) return []

    return tickets.map((item) => item.ticketName).filter((n: string) => n && typeof n === 'string')
  }, [tickets])

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
      <div className='max-w-[700px] w-full flex flex-col self-center rounded-[12px] p-6 bg-secondary-white shadow-sm border border-gray-100'>
        <div className='w-full flex justify-between gap-4 mb-4'>
          <div className='flex flex-col gap-3 font-sf-pro-display text-charcoal flex-1 pt-1'>
            <div className='flex flex-col gap-0.5'>
              <div className='flex items-center gap-2'>
                <p className='text-2xl font-black leading-[100%] uppercase tracking-tight'>{event?.eventName}</p>
                <div className='p-1.5 rounded-full hover:bg-black/5 cursor-pointer transition-colors'>
                  <Pencil size={14} className='text-charcoal/60' />
                </div>
              </div>
            </div>

            <div className='flex flex-col gap-1.5 mt-1'>
              <div className='flex items-center gap-2 text-charcoal/70'>
                <MapPin size={14} />
                <p className='text-xs font-medium leading-[100%]'>{event?.venue}</p>
              </div>
              <div className='flex items-center gap-2 text-charcoal/70'>
                <Calendar size={14} />
                <p className='text-xs font-medium leading-[100%]'>
                  {event?.eventDate.startDate} at {event?.eventDate.startTime}
                </p>
              </div>
            </div>
          </div>

          <RenderEventImage
            image={event?.eventDetails.desktopMedia?.flyer}
            event_name={event?.eventName || ''}
            className='rounded-[6px] w-[250px] h-[180px] object-cover shadow-sm border border-gray-100'
          />
        </div>

        <div className='flex flex-col gap-0'>
          <SectionContainer
            name='Tickets'
            quantity={tickets?.items.length || 0}
            href={`${getRoutePath('add_event')}/?tab=tickets`}
            data={ticketNames.map((item) => ({ tool: item, enabled: false }))}
          />

          <SectionContainer
            name='Vendor Listings'
            quantity={vendors?.items.length || 0}
            href={`${getRoutePath('add_event')}/?tab=vendor`}
            data={vendorNames.map((name) => ({ tool: name, enabled: false }))}
          />

          <SectionContainer
            name='Advanced Tools'
            href={`${getRoutePath('add_event')}/?tab=tickets`}
            data={[
              { tool: 'Promo Codes', enabled: (promoCodes?.items.length ?? 0) > 0 },
              { tool: 'Upgrades', enabled: true },
              { tool: 'Ticket Resale', enabled: true },
            ]}
          />
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

function SectionContainer({ name, quantity, href, data }: ISectionContainer) {
  return (
    <div className='w-full flex flex-col py-0'>
      <div className='w-full flex items-center justify-between border-b border-gray-100 py-3 px-1'>
        <p className='font-sf-pro-display font-bold text-sm leading-[100%] text-charcoal capitalize tracking-tight'>
          {name}
        </p>

        <div className='flex items-center gap-2'>
          {quantity !== undefined && quantity > 0 && (
            <p className='size-4 rounded-full flex items-center justify-center bg-[#CB342C] text-white text-[9px] font-bold leading-[100%] font-sf-pro-rounded'>
              {quantity}
            </p>
          )}
          <ActionPopover href={href} />
        </div>
      </div>

      <div className='flex flex-col'>
        {data.map((item) => (
          <div
            key={item.tool}
            className='flex items-center justify-between border-b border-gray-50 py-2.5 px-2 hover:bg-gray-50/50 transition-colors'>
            <p className='text-[13px] font-sf-pro-display leading-[100%] capitalize text-charcoal/80'>
              {item.tool}
            </p>
            {name === 'Advanced Tools' && (
              <p
                className={cn('text-[10px] font-sf-pro-rounded leading-[100%] capitalize font-semibold', {
                  'text-[#34C759]': item.enabled,
                  'text-deep-red': !item.enabled,
                })}>
                {item.enabled ? 'Enabled' : 'Disabled'}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

function ActionPopover({ href }: { href: string }) {
  return (
    <BasePopover
      trigger={
        <Button variant='ghost' className='hover:bg-black/10'>
          <Ellipsis width={3} height={15} color='#1E1E1E' />
        </Button>
      }
      content={
        <Button variant='ghost' asChild>
          <Link to={href}>Edit</Link>
        </Button>
      }
    />
  )
}

interface ISectionContainer {
  name: string
  quantity?: number
  data: { tool: string; enabled: boolean }[]
  href: string
}
