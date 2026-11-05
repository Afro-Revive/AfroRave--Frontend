import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { formatShortDate, formatTimeLong, parseApiDate } from '@/lib/helper-func'
import type { PromoCodeData, TicketData } from '@/types'
import { PartnershipTag } from './partnership-tag'

const COLUMNS = ['Promo Code', 'Tickets', 'Date Applied']

/**
 * Each promo code once: the tickets it's set to apply to, and the date it
 * starts applying. A code with no tickets picked applies to all of them.
 */
export function AppliedPromoCodesTable({
  promocodes,
  tickets,
}: {
  promocodes: PromoCodeData[]
  tickets: TicketData[]
}) {
  console.log(promocodes)
  console.log(tickets)
  const ticketNames = new Map(tickets.map((ticket) => [ticket.ticketId, ticket.ticketName]))

  return (
    <div className='w-full flex flex-col gap-5 rounded-xl bg-white p-5'>
      <div className='flex flex-col gap-1'>
        <p className='font-inter-tight text-xl font-semibold text-black'>Applied Promo Codes</p>
        <p className='font-inter-tight text-xs xl:text-sm font-medium text-mid-dark-gray'>
          All promo codes applied to this event’s tickets.
        </p>
      </div>

      <div className='w-full overflow-x-auto'>
        <Table className='w-full'>
          <TableCaption className='sr-only'>Promo codes and the tickets they apply to</TableCaption>

          <TableHeader>
            <TableRow className='hover:bg-transparent'>
              {COLUMNS.map((label) => (
                <TableHead
                  key={label}
                  className='font-inter-tight text-xs xl:text-sm font-medium text-[#0A0A0A]'>
                  {label}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>

          <TableBody>
            {promocodes.map((promocode) => {
              const ticketIds = promocode.promoDetails?.tickets?.map((ticket) => ticket.id) ?? []

              return (
                <TableRow
                  key={promocode.promocodeId}
                  className='font-inter-tight text-sm text-black align-top'>
                  <TableCell className='font-inter-tight text-sm text-green'>
                    <span className='flex flex-col gap-1'>
                      {promocode.promoCode}
                      {/* Grey here so it reads as a note under the green code. */}
                      {promocode.promoDetails?.isPartnership && (
                        <PartnershipTag className='text-mid-dark-gray' />
                      )}
                    </span>
                  </TableCell>

                  {/* One line per ticket; none picked means every ticket. */}
                  <TableCell>
                    {ticketIds.length === 0 ? (
                      <span className='text-mid-dark-gray'>All tickets</span>
                    ) : (
                      <span className='flex flex-col gap-0.5'>
                        {ticketIds.map((id) => (
                          <span key={id} className='whitespace-nowrap'>
                            {/* A ticket deleted since the code was made has no name left. */}
                            {ticketNames.get(id) ?? 'Removed ticket'}
                          </span>
                        ))}
                      </span>
                    )}
                  </TableCell>

                  <TableCell className='whitespace-nowrap'>{formatAppliedDate(promocode.startDate)}</TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

/**
 * Saved in UTC; shown on the organizer's local day and 12-hour time, with the
 * same helpers as the rest of the app, e.g. "October 24, 2026, 12:30AM".
 */
function formatAppliedDate(value: string) {
  if (!value || Number.isNaN(parseApiDate(value).getTime())) return '—'

  return `${formatShortDate(value)}, ${formatTimeLong(value)}`
}
