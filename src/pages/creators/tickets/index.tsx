import { FormBase } from '@/components/reusable'
import { getRoutePath } from '@/config/get-route-path'
import {
  useCreateTicket,
  useDeleteTicket,
  useGetEventTickets,
  useUpdateTicket,
} from '@/hooks/use-event-mutations'
import { transformTicketsToCreateRequest } from '@/lib/event-transforms'
import { toVisibility } from '@/lib/helper-func'
import type { TicketData } from '@/types'
import type { PaginatedResponse } from '@/types/api'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import {
  type UnifiedTicketForm,
  defaultUnifiedTicketValues,
  unifiedTicketFormSchema,
} from '../add-event/schemas/ticket-schema'
import type { TicketType } from '../add-event/ticket-forms/create/helper'
import { TicketForm } from '../add-event/ticket-forms/create/ticket-form'
import {
  TicketFormatPicker,
  type TicketFormat,
} from '../add-event/ticket-forms/create/ticket-format-picker'
import {
  CreatorPageContainer,
  SelectedEventGate,
} from '../_components/selected-event-page'
import { TicketCard } from './components/ticket-card'
import {
  ErrorState,
  LoadingState,
  NoMatchesState,
} from './components/ticket-list-states'
import { TicketNotice } from './components/ticket-notice'
import { SummaryCard, TicketSales } from './components/ticket-summary'
import { TicketsHeader } from './components/tickets-header'
import type { TicketFilter } from './constant'
import { toTicketFormValues, toTicketType } from './helper'
import { OnlyShowIf } from '@/lib/environment'
import { useNavigate } from 'react-router-dom'

export default function TicketsPage() {
  return (
    <SelectedEventGate>
      {(event) => <EventTickets eventId={event.eventId} accessType={event.accessType} />}
    </SelectedEventGate>
  )
}

function EventTickets({ eventId, accessType }: IEventTickets) {
  // Only an explicit 'private' hides group tickets — an unrecognised or missing
  // accessType leaves them available rather than silently removing an option.
  const isPrivateEvent = toVisibility(accessType) === 'private'

  const navigate = useNavigate()

  const [selectedType, setSelectedType] = useState<TicketType>()
  const [editingTicketId, setEditingTicketId] = useState<string>()
  const [filter, setFilter] = useState<TicketFilter>('all')

  const { data: ticketsResponse, isLoading, error, refetch } = useGetEventTickets(eventId)
  const { mutate: createTicketMutation, isPending: isCreatingTIcket } = useCreateTicket(eventId)
  const { mutate: updateTicketMutation, isPending: isUpdatingTicket } = useUpdateTicket(eventId)

  const deleteTicketMutation = useDeleteTicket(eventId)

  const tickets = ticketsResponse?.data as PaginatedResponse<TicketData> | undefined

  const visibleTickets = useMemo(() => {
    const items = tickets?.items ?? []

    if (filter === 'invite_only') return items.filter((t) => t.accessType === 'Invite')
    if (filter === 'door') return items.filter((t) => t.salesType === 'Door')

    return items
  }, [tickets?.items, filter])

  const ticketForm = useForm<UnifiedTicketForm>({
    resolver: zodResolver(unifiedTicketFormSchema),
    defaultValues: {
      ...defaultUnifiedTicketValues,
      whenToStart: 'immediately',
      scheduledDate: undefined,
    },
  })

  function closeComposer() {
    setSelectedType(undefined)
    setEditingTicketId(undefined)
    ticketForm.reset()
  }

  function handleCreateTicket(values: UnifiedTicketForm) {
    const ticketReuest = transformTicketsToCreateRequest(values, eventId)

    createTicketMutation(ticketReuest[0], { onSuccess: closeComposer })
  }

  function handleUpdateTicket(values: UnifiedTicketForm) {
    if (!editingTicketId) return

    const [data] = transformTicketsToCreateRequest(values, eventId)

    updateTicketMutation({ ticketId: editingTicketId, data }, { onSuccess: closeComposer })
  }

  /** Loads the ticket into the same inline composer used for creating one. */
  function handleEditTicket(ticket: TicketData) {
    ticketForm.reset(toTicketFormValues(ticket))
    setEditingTicketId(ticket.ticketId)
    setSelectedType(toTicketType(ticket.ticketType))
  }

  async function handleDeleteTicket(id: string) {
    deleteTicketMutation.mutateAsync(id, { onSuccess: () => refetch() })
  }

  /**
   * Invite-only isn't a ticketType — it's a single ticket carrying the
   * invite_only flag, matching how the API splits ticketType from accessType.
   */
  function handleSelectFormat(format: TicketFormat) {
    const ticketType: TicketType =
      format === 'group_ticket' ? 'group_ticket' : 'single_ticket'

    ticketForm.setValue('ticket.ticketType', ticketType)
    ticketForm.setValue('ticket.invite_only', format === 'invite_only')
    setEditingTicketId(undefined)
    setSelectedType(ticketType)
  }

  return (
    <CreatorPageContainer>
      <TicketsHeader filter={filter} onFilterChange={setFilter} />

      <div className='w-full flex flex-col gap-6 px-5 md:px-14 py-6 md:py-8'>
        <TicketNotice filter={filter} isPrivateEvent={isPrivateEvent} />

        <SummaryCard />

        <div className='flex flex-col gap-[13px]'>
          {(() => {
            if (isLoading) return <LoadingState />

            if (error) return <ErrorState onClick={refetch} />

            // Only the filtered views get an empty state. On 'all' the format
            // list below is always on screen, so it already says what to do.
            if (visibleTickets.length === 0 && filter !== 'all') {
              return <NoMatchesState filter={filter} />
            }

            return visibleTickets.map((ticket) => (
              <TicketCard
                key={ticket.ticketId}
                ticket={ticket}
                onDelete={() => handleDeleteTicket(ticket.ticketId)}
                onEdit={() => handleEditTicket(ticket)}
                // Invites are issued from the audience list, which is where the
                // guests for this event live.
                onSendInvite={() => navigate(getRoutePath('audience', { eventId }))}
                isLoading={deleteTicketMutation.isPending}
                isUpdating={isUpdatingTicket && editingTicketId === ticket.ticketId}
              />
            ))
          })()}
        </div>

        {/* Inline composer, same shape as the create-event flow: the format
            list stands by default and the form replaces it once one is picked.
            No modal in either direction. */}
        <OnlyShowIf condition={!isLoading && !error}>
          {selectedType ? (
            <FormBase form={ticketForm} onSubmit={() => {}} className='flex flex-col gap-5'>
              <TicketForm
                form={ticketForm}
                type={selectedType}
                isEditMode={!!editingTicketId}
                onSubmit={() =>
                  ticketForm.handleSubmit(
                    editingTicketId ? handleUpdateTicket : handleCreateTicket,
                    (errors) => console.log('Ticket validation errors:', errors),
                  )()
                }
                isLoading={editingTicketId ? isUpdatingTicket : isCreatingTIcket}
                onCancel={closeComposer}
              />
            </FormBase>
          ) : (
            <TicketFormatPicker
              selected={null}
              onSelect={handleSelectFormat}
              header='Add Tickets'
              description='Create Tickets for your event'
              hiddenFormats={isPrivateEvent ? ['group_ticket'] : []}
            />
          )}
        </OnlyShowIf>

        {(tickets?.items?.length ?? 0) > 0 ? <TicketSales tickets={tickets!.items} /> : null}
      </div>
    </CreatorPageContainer>
  )
}

interface IEventTickets {
  eventId: string
  /** The event's 'Public' | 'Private' flag, used to gate group tickets. */
  accessType?: string
}
