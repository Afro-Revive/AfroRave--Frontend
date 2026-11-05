import { LoadingFallback } from '@/components/loading-fallback'
import { useDebouncedValue } from '@/hooks/use-debounced-value'
import { useGetEvent } from '@/hooks/use-event-mutations'
import {
  useBatchUpdateAccessRequests,
  useGetAccessRequests,
  useGetViewerAccessStatus,
  useUpdateApplicationStatus,
} from '@/hooks/use-private-event-mutations'
import { toVisibility } from '@/lib/helper-func'
import type { EventDetailData } from '@/types'
import { Lock } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { CreatorPageContainer } from '../_components/selected-event-page'
import { NoticeCard } from '../tickets/components/ticket-notice'
import { AccessRequestsCard } from './components/access-requests-card'
import { AudienceHeader } from './components/audience-header'
import { ACCESS_REQUESTS_PAGE_SIZE, AUDIENCE_NOTES, type AudienceTab } from './constant'

export default function AudiencePage() {
  const { eventId = '' } = useParams()
  const { data: response, isPending } = useGetEvent(eventId)
  const event = response?.data as EventDetailData | undefined

  if (isPending) return <LoadingFallback />

  if (!event) return <AudienceMessage>No event found.</AudienceMessage>

  // Reached by URL as well as the sidebar, which only links private events.
  if (toVisibility(event.accessType) !== 'private') {
    return <AudienceMessage>Audience is only available for private events.</AudienceMessage>
  }

  return <EventAudience eventId={event.eventId} />
}

function EventAudience({ eventId }: { eventId: string }) {
  const [tab, setTab] = useState<AudienceTab>('Pending')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [selectedIds, setSelectedIds] = useState<string[]>([])

  const debouncedSearch = useDebouncedValue(search)

  // A new tab or search is a new result set, so the old page means nothing.
  useEffect(() => setPage(1), [tab, debouncedSearch])

  const { data, isPending: isLoading, isFetching } = useGetAccessRequests(eventId, {
    status: tab,
    pageNumber: page,
    pageSize: ACCESS_REQUESTS_PAGE_SIZE,
    search: debouncedSearch || undefined,
  })

  // One row each, fetched for their totalCount: the pills count everyone,
  // whatever the search or page below.
  const { data: pendingTotals } = useGetAccessRequests(eventId, {
    status: 'Pending',
    pageNumber: 1,
    pageSize: 1,
  })
  const { data: approvedTotals } = useGetAccessRequests(eventId, {
    status: 'Approved',
    pageNumber: 1,
    pageSize: 1,
  })

  // Paused and ended are the event's, not the viewer's, so the organizer reads
  // them from the same status the fan's page uses.
  const { data: access } = useGetViewerAccessStatus(eventId)
  const updateApplicationStatus = useUpdateApplicationStatus(eventId)
  const batchUpdate = useBatchUpdateAccessRequests(eventId)

  const requests = data?.requests ?? []
  const totalPages = data?.totalPages ?? 1
  const isPaused = access?.isApplicationPaused ?? false

  // Approving the last rows of the last page leaves it empty — step back.
  useEffect(() => {
    if (page > totalPages && totalPages >= 1) setPage(totalPages)
  }, [page, totalPages])

  function changeTab(next: AudienceTab) {
    setTab(next)
    // Approved fans can't be selected, and a pending pick shouldn't follow you back.
    setSelectedIds([])
  }

  function toggleRequest(requestId: string) {
    setSelectedIds((ids) =>
      ids.includes(requestId) ? ids.filter((id) => id !== requestId) : [...ids, requestId],
    )
  }

  function toggleAll() {
    const pageIds = requests.map((request) => request.requestId)
    const isAllSelected = pageIds.every((id) => selectedIds.includes(id))

    setSelectedIds((ids) =>
      isAllSelected
        ? ids.filter((id) => !pageIds.includes(id))
        : Array.from(new Set([...ids, ...pageIds])),
    )
  }

  function approveSelected() {
    batchUpdate.mutate(
      { requestIds: selectedIds, decision: 'Approved' },
      { onSuccess: () => setSelectedIds([]) },
    )
  }

  return (
    <CreatorPageContainer>
      <AudienceHeader
        tab={tab}
        onTabChange={changeTab}
        counts={{
          Pending: pendingTotals?.totalCount ?? 0,
          Approved: approvedTotals?.totalCount ?? 0,
        }}
        isPaused={isPaused}
        isEnded={access?.isApplicationEnded ?? false}
        isUpdatingRequests={updateApplicationStatus.isPending}
        onTogglePause={() => updateApplicationStatus.mutate(!isPaused)}
      />

      <div className='w-full flex flex-col gap-6 px-5 md:px-14 py-6 md:py-8'>
        <NoticeCard icon={Lock} title='This is a private event' notes={AUDIENCE_NOTES} />

        <AccessRequestsCard
          tab={tab}
          requests={requests}
          isLoading={isLoading}
          isFetching={isFetching}
          selectedIds={selectedIds}
          onToggleRequest={toggleRequest}
          onToggleAll={toggleAll}
          onApproveSelected={approveSelected}
          isApproving={batchUpdate.isPending}
          search={search}
          onSearchChange={setSearch}
          page={page}
          totalPages={totalPages}
          totalCount={data?.totalCount ?? 0}
          onPageChange={setPage}
        />
      </div>
    </CreatorPageContainer>
  )
}

function AudienceMessage({ children }: { children: React.ReactNode }) {
  return (
    <div className='w-full flex justify-center py-16'>
      <p className='font-sf-pro-display text-xl font-bold text-black'>{children}</p>
    </div>
  )
}
