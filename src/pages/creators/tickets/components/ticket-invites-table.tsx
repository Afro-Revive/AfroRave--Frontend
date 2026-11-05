import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useGetTicketInvites } from '@/hooks/use-invite-ticket-mutations'
import { cn } from '@/lib/utils'
import type { TicketData } from '@/types'
import { LoaderCircle } from 'lucide-react'
import { formatShortDate } from '../helper'

const INVITE_COLUMNS = ['Name', 'Status', 'Date Sent']

/** Everyone invited to one invite-only ticket, and where each invite stands. */
export function TicketInvitesTable({
  ticket,
  onClear,
}: {
  ticket: Pick<TicketData, 'ticketId' | 'ticketName'>
  /** Deselects the ticket, going back to the event's orders. */
  onClear: () => void
}) {
  // Same key as the card's count and the Send Invites modal, so this is
  // usually served from cache, and sending invites refreshes it.
  const { data: invites = [], isPending, isError } = useGetTicketInvites(ticket.ticketId)

  return (
    <div className='w-full flex flex-col gap-5 rounded-xl bg-white p-5'>
      <div className='flex items-start justify-between gap-4 flex-wrap'>
        <div className='flex flex-col gap-1'>
          <p className='font-inter-tight text-xl font-semibold text-black'>
           <span className='capitalize'>{ticket.ticketName}</span>
          </p>
          <p className='font-inter-tight text-xs xl:text-sm font-medium text-mid-dark-gray'>
           Invitation list for this ticket.
          </p>
        </div>

        <Button
          type='button'
          variant='outline'
          onClick={onClear}
          className='h-9 shrink-0 rounded-md px-4 font-inter-tight text-sm'>
          View all orders
        </Button>
      </div>

      {isPending ? (
        <div className='flex justify-center py-10'>
          <LoaderCircle className='size-6 animate-spin text-deep-red' />
        </div>
      ) : isError ? (
        <p className='py-10 text-center font-inter-tight text-sm text-mid-dark-gray'>
          Couldn’t load invites. Please try again.
        </p>
      ) : invites.length === 0 ? (
        <p className='py-10 text-center font-inter-tight text-sm text-mid-dark-gray'>
          No invites sent for this ticket yet.
        </p>
      ) : (
        <div className='w-full overflow-x-auto'>
          <Table className='w-full'>
            <TableCaption className='sr-only'>Invites for {ticket.ticketName}</TableCaption>

            <TableHeader>
              <TableRow className='hover:bg-transparent'>
                {INVITE_COLUMNS.map((label) => (
                  <TableHead
                    key={label}
                    className='font-inter-tight text-xs xl:text-sm font-medium text-[#0A0A0A]'>
                    {label}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>

            <TableBody>
              {invites.map((invite) => (
                <TableRow key={invite.inviteId} className='font-inter-tight text-sm text-black'>
                  <TableCell>
                    <span className='flex flex-col'>
                      <span>{invite.name}</span>
                      <span className='text-xs text-mid-dark-gray'>{invite.email}</span>
                    </span>
                  </TableCell>

                  <TableCell>
                    <StatusPill status={invite.status} />
                  </TableCell>

                  <TableCell className='whitespace-nowrap'>
                    {formatShortDate(invite.sentAt)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
}

/**
 * Coloured by what the status means rather than a fixed list — the API's exact
 * values aren't documented, so anything unrecognised falls back to neutral.
 */
function StatusPill({ status }: { status?: string }) {
  const value = status?.trim().toLowerCase() ?? ''

  const tone = /accept|paid|confirm|complete/.test(value)
    ? 'positive'
    : /expire|declin|reject|cancel|revok/.test(value)
      ? 'negative'
      : 'neutral'

  return (
    <span
      className={cn('rounded-full px-2.5 py-1 text-xs font-medium capitalize', {
        'bg-[#00AD2E]/15 text-[#00AD2E]': tone === 'positive',
        'bg-deep-red/10 text-deep-red': tone === 'negative',
        'bg-black/5 text-mid-dark-gray': tone === 'neutral',
      })}>
      {value || 'Unknown'}
    </span>
  )
}
