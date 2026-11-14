import BaseModal from '@/components/reusable/base-modal'
import { Button } from '@/components/ui/button'
import { getRoutePath } from '@/config/get-route-path'
import { formatNaira } from '@/lib/format-price'
import { cn } from '@/lib/utils'
import { ChevronRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { EventDetailData } from '@/types'

// Helper to format date like "Wed Oct 5 at 11am WAT"
function formatEventDateTime(dateStr: string, timeStr: string) {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  if (isNaN(date.getTime())) return `${dateStr} at ${timeStr}`

  // "Wed Oct 5"
  const dayMonth = date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
  // " at 11am WAT" (assuming timeStr is like "11:00 AM", stripping minutes if 00)
  return `${dayMonth} at ${timeStr} WAT`
}

export default function StandAloneModal({ event }: { event: EventDetailData }) {
  return (
    <BaseModal
      removeCancel
      className='min-w-[700px] w-[750px] py-6 px-6 rounded-[12px] bg-white shadow-lg'
      trigger={
        <Button
          variant='ghost'
          className='flex w-full h-9 items-center justify-start bg-transparent rounded-none border-b border-gray-100 text-xs text-black/80 font-inter-tight px-3 hover:bg-gray-50'>
          <span>Event Summary</span>
        </Button>
      }>
      <div className='flex flex-col gap-6 w-full'>
        <StandAloneModalHeader event={event} />

        <div className='grid grid-cols-5 gap-4 w-full h-[380px]'>
          {/* Top Row: Sales Summary (3 cols) & Vendor Summary (2 cols) */}
          <div className='col-span-3 h-[180px]'>
            <SummarySection event={event} />
          </div>
          <div className='col-span-2 h-[180px]'>
            <VendorSummarySection />
          </div>

          {/* Bottom Row: Attendee Overview (2.5 cols -> using 2 or 3) & Entry Management */}
          {/* Design shows 2 cards at bottom too. Let's make them split fittingly. */}
          {/* The design grid looks like 2 rows. Top row has Sales (large) and Vendor. Bottom has Attendee and Entry. */}
          <div className='col-span-2 h-[180px]'>
            <AttendeeOverviewSection />
          </div>
          <div className='col-span-3 h-[180px]'>
            <EntryManagementSection />
          </div>
        </div>
      </div>
    </BaseModal>
  )
}

function StandAloneModalHeader({ event }: { event: EventDetailData }) {
  return (
    <div className='w-full flex items-start justify-between border-b border-gray-100 pb-2 mb-2'>
      <div className='flex flex-col gap-1 font-inter-tight max-w-[400px]'>
        <p className='font-bold text-[18px] text-black leading-tight'>{event.eventName}</p>
        <p className='text-[13px] text-gray-500 font-medium'>{event.venue}</p>
        <p className='text-[13px] text-gray-500 font-medium'>
          {formatEventDateTime(event.eventDate.startDate, event.eventDate.startTime)}
        </p>
      </div>

      <div className='flex items-center gap-3'>
        <Button
          asChild
          variant="outline"
          className='w-[130px] h-9 rounded-[6px] bg-white border border-gray-200 text-xs font-medium text-black font-inter-tight hover:bg-gray-50 shadow-sm'>
          {/* The fan page looks events up by custom URL, like every other link to it. */}
          <Link to={getRoutePath('individual_event', { eventId: event.customUrl })}>
            View Event Page
          </Link>
        </Button>
        <Button
          asChild
          className='w-[110px] h-9 rounded-[6px] bg-deep-red hover:bg-deep-red/80 text-xs font-medium text-white font-inter-tight shadow-sm'>
          <Link to={getRoutePath('edit_event', { eventId: event.eventId })}>Edit Event</Link>
        </Button>
      </div>
    </div>
  )
}

function SummarySection({ event }: { event: EventDetailData }) {
  return (
    <SectionContainer className='w-full h-full flex flex-col justify-between'>
      <p className='text-[16px] font-bold text-black capitalize font-inter-tight'>Sales Summary</p>

      <div className='grid grid-cols-2 gap-x-8 gap-y-6 mt-2'>
        <StatItem name='Total Tickets Sold' value={event.eventStat.ticketSold.toString()} />
        <StatItem name='Total Revenue' value={formatNaira(event.eventStat.netProfit)} />
        <StatItem name='Total Tickets' value={event.eventStat.totalTicket.toString()} />
        <StatItem name='Promo Codes' value={event.eventStat.activePromoCodes.toString()} />
      </div>
    </SectionContainer>
  )
}

function StatItem({ name, value }: { name: string, value: string }) {
  return (
    <div className='flex flex-col gap-1'>
      <p className='text-[12px] text-gray-500 font-medium'>{name}</p>
      <p className='text-[15px] font-bold text-black'>{value}</p>
    </div>
  )
}

function VendorSummarySection() {
  return (
    <SectionContainer className='w-full h-full flex flex-col'>
      <p className='text-[15px] font-bold text-black capitalize mb-4 font-inter-tight'>Vendor Summary</p>

      <div className='flex flex-col flex-1 justify-center gap-0'>
        <SectionRow name='Confirmed Vendors' figure={8} />
        <SectionRow name='Pending Requests' figure={3} />
      </div>
    </SectionContainer>
  )
}

function AttendeeOverviewSection() {
  return (
    <SectionContainer className='w-full h-full flex flex-col'>
      <p className='text-[15px] font-bold text-black capitalize mb-4 font-inter-tight'>Attendee Overview</p>

      <div className='flex flex-col flex-1 justify-center gap-0'>
        <SectionRow name='Resale Activity' figure={45} />
        <SectionRow name='Checked In' figure='-' />
      </div>
    </SectionContainer>
  )
}

function EntryManagementSection() {
  return (
    <SectionContainer className='w-full h-full flex flex-col'>
      <p className='text-[15px] font-bold text-black capitalize mb-4 font-inter-tight'>Entry Management</p>

      <div className='flex flex-col flex-1 justify-center gap-0'>
        <SectionRow name='Entry Staff' figure={12} />

        <div className='flex items-center justify-between py-3 border-b border-gray-100 last:border-0 cursor-pointer hover:bg-gray-50 -mx-1 px-1 rounded-sm'>
          <p className='text-[13px] font-medium text-black capitalize'>Access Control</p>
          <ChevronRight size={14} className='text-black' />
        </div>
      </div>
    </SectionContainer>
  )
}

function SectionRow({
  name,
  figure,
}: {
  name: string
  figure?: string | number
}) {
  return (
    <div className='flex items-center justify-between py-3 border-b border-gray-100 last:border-0'>
      <p className='text-[13px] font-medium text-black capitalize'>{name}</p>
      <p className='text-[13px] font-bold text-black'>{figure}</p>
    </div>
  )
}

function SectionContainer({
  className,
  children,
}: {
  className?: string
  children: React.ReactNode
}) {
  return (
    <div
      className={cn(
        'bg-[#F9F9F9] rounded-[12px] p-5 border border-transparent', // Using specific light gray bg
        className,
      )}>
      {children}
    </div>
  )
}
