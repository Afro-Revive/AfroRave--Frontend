import { transformTicketsToCreateRequest } from '@/lib/event-transforms'
import { defaultUnifiedTicketValues, type UnifiedTicketForm } from '../../schemas/ticket-schema'
import type { UseFormReturn } from 'react-hook-form'
import type { useCreateTicket, useUpdateTicket, useDeleteTicket } from '@/hooks/use-event-mutations'
import type { EventTicketsResponse, PaginatedResponse } from '@/types'

interface ITicketHelper {
  form: UseFormReturn<UnifiedTicketForm>
  ticket: UnifiedTicketForm
  setEditingTicketId: (id: string | null) => void
  setCurrentTicketType: (type: TicketType | null) => void
}

export interface SavedTicket {
  ticketId: string
  ticketName: string
  ticketType: string
  invite_only?: boolean
  price: number
  quantity?: number
  description?: string
}

export type TicketType = 'single_ticket' | 'group_ticket' | 'multi_day'

export function createTicket(
  ticket: ITicketHelper['ticket'],
  eventId: string | null,
  form: ITicketHelper['form'],
  createTicketMutation: ReturnType<typeof useCreateTicket>,
  setEditingTicketId: ITicketHelper['setEditingTicketId'],
  setCurrentTicketType: ITicketHelper['setCurrentTicketType'],
) {
  if (!eventId) return

  const ticketRequests = transformTicketsToCreateRequest(ticket, eventId)

  createTicketMutation.mutateAsync(ticketRequests[0], {
    onSuccess: () => {
      form.reset(defaultUnifiedTicketValues)
      setEditingTicketId(null)
      setCurrentTicketType(null)
    },
  })
}

export function updateTicket(
  ticket: ITicketHelper['ticket'],
  eventId: string | null,
  editingTicketId: string | null,
  form: ITicketHelper['form'],
  updateTicketMutation: ReturnType<typeof useUpdateTicket>,
  setEditingTicketId: ITicketHelper['setEditingTicketId'],
  setCurrentTicketType: ITicketHelper['setCurrentTicketType'],
) {
  if (!eventId || !editingTicketId) return

  const ticketRequests = transformTicketsToCreateRequest(ticket, eventId)

  updateTicketMutation.mutateAsync(
    {
      ticketId: editingTicketId,
      data: ticketRequests[0],
    },
    {
      onSuccess: () => {
        form.reset(defaultUnifiedTicketValues)
        setEditingTicketId(null)
        setCurrentTicketType(null)
      },
    },
  )
}

export function addTicket(
  selectedType: TicketType,
  form: ITicketHelper['form'],
  setEditingTicketId: ITicketHelper['setEditingTicketId'],
  setCurrentTicketType: ITicketHelper['setCurrentTicketType'],
) {
  form.reset(defaultUnifiedTicketValues)
  setEditingTicketId(null)

  const base = {
    ticketType: selectedType,
    ticketName: '',
    type: 'paid' as const,
    invite_only: false,
    salesType: 'online' as const,
    quantity: { availability: 'limited' as const, amount: '' },
    price: '',
    purchase_limit: '',
    description: '',
  }
  const withTypeFields =
    selectedType === 'group_ticket'
      ? { ...base, group_size: '' }
      : selectedType === 'multi_day'
        ? { ...base, days_valid: '' }
        : base

  form.setValue('whenToStart', 'at-a-scheduled-date', { shouldDirty: true })
  form.setValue(
    'scheduledDate',
    {
      date: new Date(),
      hour: '12',
      minute: '00',
      period: 'AM' as const,
    },
    { shouldDirty: true },
  )

  form.setValue('ticket', withTypeFields, { shouldDirty: true })
  setCurrentTicketType(selectedType)
}

export function handleEditTicket(
  ticket: SavedTicket,
  form: ITicketHelper['form'],
  setEditingTicketId: ITicketHelper['setEditingTicketId'],
  setCurrentTicketType: ITicketHelper['setCurrentTicketType'],
) {
  const formTicket = {
    ticketType: ticket.ticketType as TicketType,
    ticketName: ticket.ticketName || '',
    type: 'paid' as const,
    invite_only: ticket.invite_only || false,
    salesType: 'online' as const,
    quantity: {
      availability: 'limited' as const,
      amount: ticket.quantity?.toString() || '100',
    },
    price: ticket.price?.toString() || '1000',
    purchase_limit: '5',
    description: ticket.description || 'Sample ticket description',
    ...(ticket.ticketType === 'group_ticket' && { group_size: '4' }),
    ...(ticket.ticketType === 'multi_day' && { days_valid: '3' }),
  }

  form.reset(defaultUnifiedTicketValues)

  form.setValue('whenToStart', 'at-a-scheduled-date', { shouldDirty: true })
  form.setValue(
    'scheduledDate',
    {
      date: new Date(),
      hour: '12',
      minute: '00',
      period: 'AM' as const,
    },
    { shouldDirty: true },
  )

  form.setValue('ticket', formTicket, { shouldDirty: true })
  setEditingTicketId(ticket.ticketId)
  setCurrentTicketType(ticket.ticketType as TicketType)
}

export function handleDeleteTicket(
  ticketId: string,
  deleteTicketMutation: ReturnType<typeof useDeleteTicket>,
) {
  deleteTicketMutation.mutateAsync(ticketId)
}

export function handleCancelEdit(
  form: ITicketHelper['form'],
  setEditingTicketId: ITicketHelper['setEditingTicketId'],
  setCurrentTicketType: ITicketHelper['setCurrentTicketType'],
) {
  form.reset(defaultUnifiedTicketValues)
  setEditingTicketId(null)
  setCurrentTicketType(null)
}

export function fillCurrentFormWithSampleData(
  currentTicketType: TicketType | null,
  form: ITicketHelper['form'],
) {
  if (!currentTicketType) return

  const sampleTicket = {
    ticketName: `Sample ${currentTicketType.replace('_', ' ')}`,
    type: 'paid' as const,
    invite_only: false,
    salesType: 'online' as const,
    ticketType: currentTicketType,
    quantity: {
      availability: 'limited' as const,
      amount: '100',
    },
    price: '5000',
    purchase_limit: '5',
    description: 'This is a sample ticket description for testing purposes.',
    ...(currentTicketType === 'group_ticket' && { group_size: '4' }),
    ...(currentTicketType === 'multi_day' && { days_valid: '3' }),
  }

  form.reset(defaultUnifiedTicketValues)

  form.setValue('whenToStart', 'at-a-scheduled-date', { shouldDirty: true })
  form.setValue(
    'scheduledDate',
    {
      date: new Date(),
      hour: '12',
      minute: '00',
      period: 'AM' as const,
    },
    { shouldDirty: true },
  )

  form.setValue('ticket', sampleTicket, { shouldDirty: true })
}

export function onSubmit(eventId: string | null, handleFormChange: (form: string) => void) {
  if (!eventId) return
  handleFormChange('promocode')
}

export function transformTicketsResponse(
  ticketsResponse: EventTicketsResponse | undefined,
): SavedTicket[] {
  console.log('ticketsResponse', ticketsResponse)
  const ticketInformation = ticketsResponse?.data as PaginatedResponse<SavedTicket> | undefined
  if (!ticketInformation) return []
  return (ticketInformation.items).map((ticket) => ({
    ticketId: ticket.ticketId,
    ticketName: ticket.ticketName,
    ticketType: 'single_ticket',
    invite_only: false,
    price: ticket.price,
    quantity: ticket.quantity,
    description: ticket.description,
  }))
}
