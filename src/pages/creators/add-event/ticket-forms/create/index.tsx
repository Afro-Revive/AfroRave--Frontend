import { Badge } from '@/components/ui/badge'
import {
  useCreateTicket,
  useDeleteTicket,
  useGetEventTickets,
  useUpdateTicket,
} from '@/hooks/use-event-mutations'
// import { FakeDataGenerator } from '@/lib/fake-data-generator'
import { cn } from '@/lib/utils'
import { useEventStore } from '@/stores'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { TabContainer } from '../../component/tab-ctn'
import { AnimatedShowIf } from '../../component/animated-show-if'
import {
  defaultUnifiedTicketValues,
  unifiedTicketFormSchema,
  type UnifiedTicketForm as TForm,
} from '../../schemas/ticket-schema'
import {
  type SavedTicket,
  type TicketType,
  addTicket,
  createTicket,
  handleCancelEdit,
  handleDeleteTicket,
  handleEditTicket,
  onSubmit,
  transformTicketsResponse,
  updateTicket,
} from './helper'
import { TicketForm } from './ticket-form'
import { TicketModal } from './ticket-modal'
import { ActionPopover } from '../../component/action-popover'
import { ContinueButton } from '../../component/continue-button'
import { Ticket2 } from 'iconsax-react'

export default function CreateTicketForm({
  handleFormChange,
  showError,
}: {
  handleFormChange: (form: string) => void
  showError: () => void
}) {
  const [editingTicketId, setEditingTicketId] = useState<string | null>(null)
  const [currentTicketType, setCurrentTicketType] = useState<TicketType | null>(null)

  const { eventId } = useEventStore()

  const createTicketMutation = useCreateTicket(eventId || '')
  const updateTicketMutation = useUpdateTicket(eventId || '')
  const deleteTicketMutation = useDeleteTicket(eventId || '')
  const { data: ticketsResponse } = useGetEventTickets(
    eventId || undefined,
  )

  const savedTickets: SavedTicket[] = transformTicketsResponse(ticketsResponse)

  const form = useForm<TForm>({
    resolver: zodResolver(unifiedTicketFormSchema),
    defaultValues: defaultUnifiedTicketValues as TForm,
  })

  const handleCreateTicket = (values: TForm) =>
    createTicket(
      values,
      eventId,
      form,
      createTicketMutation,
      setEditingTicketId,
      setCurrentTicketType,
    )

  const handleUpdateTicket = (value: TForm) =>
    updateTicket(
      value,
      eventId,
      editingTicketId,
      form,
      updateTicketMutation,
      setEditingTicketId,
      setCurrentTicketType,
    )

  const handleAddTicket = (selectedType: TicketType) =>
    addTicket(selectedType, form, setEditingTicketId, setCurrentTicketType)

  const handleEditTicketWrapper = (ticket: SavedTicket) =>
    handleEditTicket(ticket, form, setEditingTicketId, setCurrentTicketType)

  const handleDeleteTicketWrapper = (ticketId: string) =>
    handleDeleteTicket(ticketId, deleteTicketMutation)

  const handleCancelEditWrapper = () =>
    handleCancelEdit(form, setEditingTicketId, setCurrentTicketType)

  // const handleFillSampleData = () => fillCurrentFormWithSampleData(currentTicketType, form)

  const handleSubmit = () => onSubmit(eventId, handleFormChange)

  return (
    <div className='w-full flex flex-col gap-8'>
      <TabContainer<TForm>
        heading='TICKETS'
        className='max-w-[560px] w-full flex flex-col'
        form={form}
        onSubmit={handleSubmit}
        actionOnError={showError}>
        {/* {currentTicketType && (
          <FakeDataGenerator
            type='tickets'
            onGenerate={handleFillSampleData}
            buttonText='🎲 Fill with sample data'
            variant='outline'
            className='mb-4'
          />
        )} */}

        <AnimatedShowIf condition={savedTickets.length > 0}>
          <div className='w-full flex flex-col gap-3 mb-6'>
            {savedTickets.map((ticket: SavedTicket, idx: number) => (
              <CreatedTicketCard
                key={`created-${ticket.ticketId}-${idx}`}
                ticket={ticket}
                onEdit={() => handleEditTicketWrapper(ticket)}
                onDelete={() => handleDeleteTicketWrapper(ticket.ticketId)}
                isUpdating={updateTicketMutation.isPending}
                isDeleting={deleteTicketMutation.isPending}
              />
            ))}
          </div>
        </AnimatedShowIf>

        <AnimatedShowIf condition={!!currentTicketType}>
          <div className='w-full flex flex-col gap-8'>
            {currentTicketType && (
              <TicketForm
                form={form}
                type={currentTicketType}
                onSubmit={
                  editingTicketId
                    ? form.handleSubmit(handleUpdateTicket)
                    : form.handleSubmit(handleCreateTicket)
                }
                isLoading={
                  editingTicketId ? updateTicketMutation.isPending : createTicketMutation.isPending
                }
                isEditMode={!!editingTicketId}
                onCancel={handleCancelEditWrapper}
              />
            )}
          </div>
        </AnimatedShowIf>

        <AnimatedShowIf condition={!currentTicketType}>
          <TicketModal onContinue={handleAddTicket} />
        </AnimatedShowIf>


      </TabContainer>

      {/* <ConfirmationMailForm /> */}

      <ContinueButton
        disabled={savedTickets.length === 0}
        onClick={() => handleFormChange('promocode')}
      />
    </div>
  )
}

function CreatedTicketCard({
  ticket,
  onEdit,
  onDelete,
  isUpdating,
  isDeleting,
}: ICreatedTicketCard) {
  console.log('ticket', ticket)
  return (
    <div className='w-full flex flex-col'>
      <div className='w-full flex items-center justify-between border border-mid-dark-gray/30 px-3 py-[11px] shadow-[0px_2px_10px_2px_#0000001A] rounded-[5px]'>
      <div className='flex flex-row gap-1 items-center'>
        {
          /**
           * Change ticket icon 
           */
        }
        <Ticket2 size={20} color='#00AD2E' variant='Bold' />
        <p className='uppercase text-sm font-normal font-sf-pro-text leading-[100%] text-charcoal'>
          {ticket.ticketName}
        </p>
      </div>
     
        <div className='flex items-center gap-3'>
          <CustomBadge text={ticket.ticketType.replace('_', ' ')} />
          {ticket.invite_only && <CustomBadge type='invite-only' />}
          <ActionPopover
            isDeleting={isDeleting}
            isUpdating={isUpdating}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        </div>
      </div>
      {ticket.invite_only && (
        <p className='p-2.5 text-xs leading-[100%] font-sf-pro-display uppercase text-deep-red/70'>
          access the invite link in your dashboard
        </p>
      )}
    </div>
  )
}

function CustomBadge({
  type = 'default',
  text = 'invite only',
}: { type?: 'default' | 'invite-only'; text?: string }) {
  return (
    <Badge
      className={cn('py-1.5 px-2 rounded-[6px] text-xs font-sf-pro-rounded leading-[100%]', {
        'bg-[#00AD2E4D] text-[#00AD2E]': type === 'default',
        'bg-deep-red/30 text-deep-red': type === 'invite-only',
      })}>
      {text}
    </Badge>
  )
}

interface ICreatedTicketCard {
  ticket: SavedTicket
  onEdit: () => void
  onDelete: () => void
  isUpdating: boolean
  isDeleting: boolean
}
