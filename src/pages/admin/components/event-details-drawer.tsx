import { getRoutePath } from '@/config/get-route-path'
import { useAdminEventDetails } from '@/hooks/use-admin'
import { mainSiteOrigin } from '@/lib/admin-host'
import { formatNaira } from '@/lib/format-price'
import { RICH_TEXT_CLASSES, sanitizeRichText, toRichText } from '@/lib/rich-text'
import { cn } from '@/lib/utils'
import type { AdminEventDetails } from '@/types/admin'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import { RiCloseLine, RiErrorWarningLine, RiExternalLinkLine } from 'react-icons/ri'
import { formatDateTime, formatDay, fullName } from './format'
import { RowAction } from './list-controls'
import { StatusPill } from './status-pill'

/**
 * The event's page on the fan site. Fan pages load events by their custom URL
 * (handle), not their id, and from the admin site the link has to leave for the
 * fan site.
 */
function publicEventUrl(customUrl: string): string {
  return `${mainSiteOrigin()}${getRoutePath('individual_event', { eventId: customUrl })}`
}

/** 20:00:00 → 8:00 PM. Empty when the event has no time set. */
function formatClock(value?: string | null): string {
  const match = value?.match(/^(\d{1,2}):(\d{2})/)
  if (!match) return ''
  const date = new Date(2000, 0, 1, Number(match[1]), Number(match[2]))
  return date.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' })
}

/** +1 → UTC+1; a name like Africa/Lagos stays as it is. */
function formatTimezone(value?: string | null): string {
  if (!value) return ''
  return /^[+-]\d/.test(value) ? `UTC${value}` : value
}

/**
 * Everything an admin can see about one event, drafts and suspended ones
 * included: schedule, organizer contact, tickets and vendor slots.
 */
export function EventDetailsDrawer({
  eventId,
  onClose,
  onSuspend,
}: {
  eventId?: string
  onClose: () => void
  /** Opens the suspend or unsuspend confirmation for this event. */
  onSuspend: (event: AdminEventDetails) => void
}) {
  const { data, isLoading, isError } = useAdminEventDetails(eventId)
  const event = data?.data

  return (
    <DialogPrimitive.Root open={!!eventId} onOpenChange={(open) => !open && onClose()}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className='fixed inset-0 z-40 bg-black/60 data-[state=open]:animate-in data-[state=open]:fade-in-0' />
        <DialogPrimitive.Content className='fixed inset-y-0 right-0 z-50 flex w-full max-w-xl flex-col border-l border-white/10 bg-[#141414] font-inter-tight text-white shadow-2xl data-[state=open]:animate-in data-[state=open]:slide-in-from-right'>
          <div className='flex items-start justify-between gap-3 border-b border-white/10 px-5 py-4'>
            <div className='flex min-w-0 flex-col gap-1'>
              <DialogPrimitive.Title className='text-lg font-bold'>
                {event?.eventName ?? (isLoading ? 'Loading event…' : 'Event')}
              </DialogPrimitive.Title>
              <DialogPrimitive.Description className='text-xs text-white/50'>
                {event ? `${event.category ?? 'No category'} · ${event.accessType}` : 'Event details'}
              </DialogPrimitive.Description>
            </div>
            <DialogPrimitive.Close
              aria-label='Close'
              className='rounded-md p-1.5 text-white/60 hover:bg-white/10 hover:text-white'>
              <RiCloseLine className='size-5' aria-hidden />
            </DialogPrimitive.Close>
          </div>

          <div className='flex-1 overflow-y-auto px-5 py-5'>
            {isLoading && (
              <div className='flex flex-col gap-3'>
                {Array.from({ length: 5 }, (_, index) => (
                  <div key={index} className='h-16 animate-pulse rounded-lg bg-white/5' />
                ))}
              </div>
            )}
            {isError && (
              <p className='flex items-center gap-2 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-200'>
                <RiErrorWarningLine className='size-5 shrink-0' aria-hidden />
                Couldn&rsquo;t load this event.
              </p>
            )}
            {event && <Details event={event} onSuspend={() => onSuspend(event)} />}
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  )
}

function Details({ event, onSuspend }: { event: AdminEventDetails; onSuspend: () => void }) {
  const { organizer, dates } = event
  const organizerName = fullName(organizer.firstName, organizer.lastName)
  const startTime = formatClock(dates?.startTime)
  const endTime = formatClock(dates?.endTime)

  return (
    <div className='flex flex-col gap-6 text-sm'>
      <div className='flex flex-wrap items-center gap-2'>
        {event.isSuspended ? (
          <StatusPill tone='red'>Suspended</StatusPill>
        ) : event.published ? (
          <StatusPill tone='green'>Published</StatusPill>
        ) : (
          <StatusPill tone='gray'>Draft</StatusPill>
        )}
        {event.isApplicationEnded && <StatusPill tone='gray'>Vendor applications ended</StatusPill>}
        {!event.isApplicationEnded && event.isApplicationPaused && (
          <StatusPill tone='amber'>Vendor applications paused</StatusPill>
        )}
        <div className='ml-auto flex items-center gap-2'>
          {event.published && event.customUrl && (
            <a
              href={publicEventUrl(event.customUrl)}
              target='_blank'
              rel='noopener noreferrer'
              className='flex items-center gap-1 rounded-md border border-white/15 px-2.5 py-1 text-xs text-white/80 hover:bg-white/10'>
              Public page
              <RiExternalLinkLine className='size-3.5' aria-hidden />
            </a>
          )}
          <RowAction tone={event.isSuspended ? 'success' : 'danger'} onClick={onSuspend}>
            {event.isSuspended ? 'Unsuspend' : 'Suspend'}
          </RowAction>
        </div>
      </div>

      <Section title='When and where'>
        <Fields
          rows={[
            [
              'Dates',
              dates
                ? dates.startDate === dates.endDate
                  ? formatDay(dates.startDate)
                  : `${formatDay(dates.startDate)} – ${formatDay(dates.endDate)}`
                : '—',
            ],
            ['Time', startTime ? `${startTime}${endTime ? ` – ${endTime}` : ''}` : 'Not set'],
            ['Timezone', formatTimezone(dates?.timezone) || '—'],
            ['Repeats', dates?.frequency || '—'],
            ['Venue', event.venue || '—'],
            ['Age rating', event.ageRating || '—'],
            ['Access deadline', event.accessDeadline ? formatDateTime(event.accessDeadline) : '—'],
          ]}
        />
      </Section>

      <Section title='Organizer'>
        <Fields
          rows={[
            ['Name', organizerName || '—'],
            ['Company', organizer.companyName || '—'],
            [
              'Email',
              organizer.email ? (
                <a href={`mailto:${organizer.email}`} className='break-all underline underline-offset-2'>
                  {organizer.email}
                </a>
              ) : (
                '—'
              ),
            ],
            [
              'Phone',
              organizer.phoneNumber ? (
                <a href={`tel:${organizer.phoneNumber}`} className='underline underline-offset-2'>
                  {organizer.phoneNumber}
                </a>
              ) : (
                '—'
              ),
            ],
            ['Website', organizer.website || '—'],
          ]}
        />
      </Section>

      <Section title={`Tickets (${event.tickets.length})`}>
        {event.tickets.length === 0 ? (
          <p className='text-white/50'>No tickets set up.</p>
        ) : (
          <ul className='flex flex-col gap-2'>
            {event.tickets.map((ticket) => (
              <li key={ticket.ticketId} className='flex flex-col gap-1 rounded-lg bg-white/5 px-3 py-2.5'>
                <div className='flex items-baseline justify-between gap-3'>
                  <span className='font-medium'>{ticket.ticketName}</span>
                  <span className='whitespace-nowrap font-medium tabular-nums'>
                    {formatNaira(ticket.price ?? 0, { free: true })}
                  </span>
                </div>
                <div className='flex flex-wrap gap-x-3 gap-y-0.5 text-xs text-white/50'>
                  <span>
                    {(ticket.usedQuantity ?? 0).toLocaleString()} sold
                    {ticket.quantity ? ` of ${ticket.quantity.toLocaleString()}` : ''}
                  </span>
                  {[ticket.ticketType, ticket.salesType, ticket.accessType]
                    .filter(Boolean)
                    .map((label) => (
                      <span key={label}>{label}</span>
                    ))}
                  {ticket.groupSize ? <span>Group of {ticket.groupSize}</span> : null}
                  <span>Limit {ticket.purchaseLimit} per order</span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Section>

      <Section title={`Vendor slots (${event.vendorSlots.length})`}>
        {event.vendorSlots.length === 0 ? (
          <p className='text-white/50'>No vendor slots.</p>
        ) : (
          <ul className='flex flex-col gap-2'>
            {event.vendorSlots.map((vendor) => (
              <li key={vendor.id} className='flex flex-col gap-1 rounded-lg bg-white/5 px-3 py-2.5'>
                <div className='flex items-baseline justify-between gap-3'>
                  <span className='font-medium'>
                    {vendor.slot?.slotName || vendor.service?.serviceName || vendor.category}
                  </span>
                  <span className='whitespace-nowrap text-xs text-white/60'>
                    {vendor.slot?.price != null
                      ? formatNaira(vendor.slot.price)
                      : vendor.service?.hasBudgetRange
                        ? `${formatNaira(vendor.service.minBudget ?? 0)} – ${formatNaira(vendor.service.maxBudget ?? 0)}`
                        : ''}
                  </span>
                </div>
                <div className='flex flex-wrap gap-x-3 gap-y-0.5 text-xs text-white/50'>
                  <span>{vendor.vendorType}</span>
                  <span className='capitalize'>{vendor.category}</span>
                  {vendor.slot?.slotNumber ? <span>{vendor.slot.slotNumber} slots</span> : null}
                  {vendor.status && <span>{vendor.status}</span>}
                  {vendor.applicationDeadline && <span>Apply by {formatDay(vendor.applicationDeadline)}</span>}
                </div>
              </li>
            ))}
          </ul>
        )}
      </Section>

      {event.description && (
        <Section title='Description'>
          <div
            className={cn('text-white/80', RICH_TEXT_CLASSES)}
            dangerouslySetInnerHTML={{ __html: sanitizeRichText(toRichText(event.description)) }}
          />
        </Section>
      )}

      <p className='text-xs text-white/40'>
        Created {formatDateTime(event.createdDate)} · Updated {formatDateTime(event.updatedDate)}
      </p>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className='flex flex-col gap-2'>
      <h3 className='text-xs font-semibold uppercase tracking-wide text-white/50'>{title}</h3>
      {children}
    </section>
  )
}

function Fields({ rows }: { rows: [string, React.ReactNode][] }) {
  return (
    <dl className='grid grid-cols-[minmax(0,8rem)_minmax(0,1fr)] gap-x-4 gap-y-2'>
      {rows.map(([label, value]) => (
        <div key={label} className='contents'>
          <dt className='text-white/50'>{label}</dt>
          <dd className='min-w-0 text-white/90'>{value}</dd>
        </div>
      ))}
    </dl>
  )
}
