import { useAdminEvents, useSetEventSuspension } from '@/hooks/use-admin'
import type { AdminEvent, AdminEventStatus } from '@/types/admin'
import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { ConfirmDialog } from './components/confirm-dialog'
import { DataTable, type Column } from './components/data-table'
import { EventDetailsDrawer } from './components/event-details-drawer'
import { formatDay } from './components/format'
import { FilterTabs, RowAction, SearchBox } from './components/list-controls'
import { PageHeader } from './components/page-header'
import { StatusPill } from './components/status-pill'
import { useListParams } from './components/use-list-params'

const STATUS_FILTERS: { value: AdminEventStatus | ''; label: string }[] = [
  { value: '', label: 'All' },
  { value: 'published', label: 'Published' },
  { value: 'draft', label: 'Drafts' },
  { value: 'suspended', label: 'Suspended' },
]

/** What the suspend dialog needs, from a list row or the details drawer. */
type SuspendTarget = Pick<AdminEvent, 'eventId' | 'eventName' | 'isSuspended'>

function EventStatus({ event }: { event: AdminEvent }) {
  if (event.isSuspended) return <StatusPill tone='red'>Suspended</StatusPill>
  if (event.published) return <StatusPill tone='green'>Published</StatusPill>
  return <StatusPill tone='gray'>Draft</StatusPill>
}

function dateRange(event: AdminEvent) {
  const start = formatDay(event.startDate)
  const end = formatDay(event.endDate)
  return start === end ? start : `${start} – ${end}`
}

export default function AdminEventsPage() {
  const list = useListParams<AdminEventStatus>('status')
  const { data, isLoading, isFetching, isError } = useAdminEvents({
    pageNumber: list.pageNumber,
    pageSize: list.pageSize,
    searchQuery: list.searchQuery,
    status: list.filter || undefined,
  })
  const setSuspension = useSetEventSuspension()
  const [pending, setPending] = useState<SuspendTarget | null>(null)

  // The open event is in the address (?event=), so a link opens it too.
  const [searchParams, setSearchParams] = useSearchParams()
  const openEventId = searchParams.get('event') ?? undefined
  const showEvent = (eventId?: string) =>
    setSearchParams(
      (current) => {
        const next = new URLSearchParams(current)
        if (eventId) next.set('event', eventId)
        else next.delete('event')
        return next
      },
      { replace: true },
    )

  const columns: Column<AdminEvent>[] = [
    {
      header: 'Event',
      cell: (event) => (
        <button
          type='button'
          onClick={() => showEvent(event.eventId)}
          className='flex min-w-[180px] flex-col gap-0.5 text-left hover:underline'>
          <span className='font-medium'>{event.eventName}</span>
          <span className='text-xs capitalize text-white/50'>{event.category || 'No category'}</span>
        </button>
      ),
    },
    { header: 'Venue', cell: (event) => event.venue || '—', className: 'min-w-[140px] text-white/80' },
    {
      header: 'Organizer',
      cell: (event) => <span className='whitespace-nowrap text-white/80'>{event.organizerEmail || '—'}</span>,
    },
    { header: 'Dates', cell: dateRange, className: 'whitespace-nowrap' },
    { header: 'Status', cell: (event) => <EventStatus event={event} /> },
    // The public page link is in the drawer: the list has no custom URL to build it from.
    {
      header: 'Actions',
      className: 'text-right',
      cell: (event) => (
        <div className='flex items-center justify-end gap-2'>
          <RowAction onClick={() => showEvent(event.eventId)}>View</RowAction>
          <RowAction tone={event.isSuspended ? 'success' : 'danger'} onClick={() => setPending(event)}>
            {event.isSuspended ? 'Unsuspend' : 'Suspend'}
          </RowAction>
        </div>
      ),
    },
  ]

  const closeDialog = () => setPending(null)

  return (
    <>
      <PageHeader title='Events' description='Every event on the platform, drafts included, newest first.'>
        <SearchBox
          value={list.searchText}
          onChange={list.setSearchText}
          placeholder='Search name, venue or organizer'
        />
      </PageHeader>

      <FilterTabs label='Event status' value={list.filter} options={STATUS_FILTERS} onChange={list.setFilter} />

      <DataTable
        columns={columns}
        page={data?.data}
        rowKey={(event) => event.eventId}
        isLoading={isLoading}
        isFetching={isFetching}
        isError={isError}
        emptyMessage={list.searchQuery ? 'No events match that search.' : 'No events here.'}
        onPageChange={list.setPage}
      />

      <EventDetailsDrawer eventId={openEventId} onClose={() => showEvent()} onSuspend={setPending} />

      {pending && (
        <ConfirmDialog
          open
          title={pending.isSuspended ? `Unsuspend ${pending.eventName}?` : `Suspend ${pending.eventName}?`}
          description={
            pending.isSuspended ? (
              <p>
                It won&rsquo;t go live again by itself: it stays a draft until the organizer publishes it.
              </p>
            ) : (
              <p>
                This takes it down: it&rsquo;s unpublished, hidden from discovery, and stops selling tickets.
              </p>
            )
          }
          confirmLabel={pending.isSuspended ? 'Unsuspend' : 'Suspend event'}
          tone={pending.isSuspended ? 'neutral' : 'danger'}
          isPending={setSuspension.isPending}
          onClose={closeDialog}
          onConfirm={() =>
            setSuspension.mutate(
              { eventId: pending.eventId, isSuspended: !pending.isSuspended },
              { onSettled: closeDialog },
            )
          }
        />
      )}
    </>
  )
}
