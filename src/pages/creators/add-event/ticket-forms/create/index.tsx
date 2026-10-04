import {
  useCreateTicket,
  useDeleteTicket,
  useGetEventTickets,
  useUpdateTicket,
} from "@/hooks/use-event-mutations";
// import { FakeDataGenerator } from '@/lib/fake-data-generator'
import { useEventStore } from "@/stores";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { TabContainer } from "../../component/tab-ctn";
import { AnimatedShowIf } from "../../component/animated-show-if";
import {
  defaultUnifiedTicketValues,
  unifiedTicketFormSchema,
  type UnifiedTicketForm as TForm,
} from "../../schemas/ticket-schema";
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
} from "./helper";
import { TicketSummaryCard } from "@/components/shared/ticket-summary-card";
import { TicketForm } from "./ticket-form";
import { TicketFormatPicker, type TicketFormat } from "./ticket-format-picker";
import { ContinueButton } from "../../component/continue-button";

export default function CreateTicketForm({
  handleFormChange,
  showError,
}: {
  handleFormChange: (form: string) => void;
  showError: () => void;
}) {
  const [editingTicketId, setEditingTicketId] = useState<string | null>(null);
  const [currentTicketType, setCurrentTicketType] = useState<TicketType | null>(
    null,
  );
  // Tracked separately from currentTicketType because invite-only and single
  // both resolve to 'single_ticket' — this is what the picker highlights.
  const [selectedFormat, setSelectedFormat] = useState<TicketFormat | null>(
    null,
  );

  const { eventId, visibility } = useEventStore();

  const createTicketMutation = useCreateTicket(eventId || "");
  const updateTicketMutation = useUpdateTicket(eventId || "");
  const deleteTicketMutation = useDeleteTicket(eventId || "");
  const { data: ticketsResponse } = useGetEventTickets(eventId || undefined);

  const savedTickets: SavedTicket[] = transformTicketsResponse(ticketsResponse);

  const form = useForm<TForm>({
    resolver: zodResolver(unifiedTicketFormSchema),
    defaultValues: defaultUnifiedTicketValues as TForm,
  });

  const setTicketType = (type: TicketType | null) => {
    setCurrentTicketType(type);
    if (!type) setSelectedFormat(null);
  };

  const handleCreateTicket = (values: TForm) =>
    createTicket(
      values,
      eventId,
      form,
      createTicketMutation,
      setEditingTicketId,
      setTicketType,
    );

  const handleUpdateTicket = (value: TForm) =>
    updateTicket(
      value,
      eventId,
      editingTicketId,
      form,
      updateTicketMutation,
      setEditingTicketId,
      setTicketType,
    );

  /**
   * Invite-only isn't a ticketType — it's a single ticket with the invite_only
   * flag set, matching how the API splits ticketType from accessType.
   */
  const handleSelectFormat = (format: TicketFormat) => {
    setSelectedFormat(format);

    addTicket(
      format === "group_ticket" ? "group_ticket" : "single_ticket",
      form,
      setEditingTicketId,
      setCurrentTicketType,
    );

    // addTicket resets the form with invite_only: false, so this has to follow.
    if (format === "invite_only") {
      form.setValue("ticket.invite_only", true, { shouldDirty: true });
    }
  };

  const handleEditTicketWrapper = (ticket: SavedTicket) =>
    handleEditTicket(ticket, form, setEditingTicketId, setCurrentTicketType);

  const handleDeleteTicketWrapper = (ticketId: string) =>
    handleDeleteTicket(ticketId, deleteTicketMutation);

  const handleCancelEditWrapper = () =>
    handleCancelEdit(form, setEditingTicketId, setTicketType);

  // const handleFillSampleData = () => fillCurrentFormWithSampleData(currentTicketType, form)

  const handleSubmit = () => onSubmit(eventId, handleFormChange);

  return (
    <div className="w-full flex flex-col gap-8">
      <TabContainer<TForm>
        className="max-w-[560px] w-full flex flex-col"
        form={form}
        onSubmit={handleSubmit}
        actionOnError={showError}
      >
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
          <div className="w-full flex flex-col gap-3 mb-6">
            {savedTickets.map((ticket: SavedTicket, idx: number) => (
              <TicketSummaryCard
                key={`created-${ticket.ticketId}-${idx}`}
                name={ticket.ticketName}
                price={ticket.price}
                typeLabel={ticket.ticketType.replace("_", " ")}
                isInviteOnly={ticket.invite_only}
                onEdit={() => handleEditTicketWrapper(ticket)}
                onDelete={() => handleDeleteTicketWrapper(ticket.ticketId)}
                isUpdating={updateTicketMutation.isPending}
                isDeleting={deleteTicketMutation.isPending}
              />
            ))}
          </div>
        </AnimatedShowIf>

        <AnimatedShowIf condition={!!currentTicketType}>
          <div className="w-full flex flex-col gap-8">
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
                  editingTicketId
                    ? updateTicketMutation.isPending
                    : createTicketMutation.isPending
                }
                isEditMode={!!editingTicketId}
                onCancel={handleCancelEditWrapper}
              />
            )}
          </div>
        </AnimatedShowIf>

        {/* Hidden the moment a format is chosen — currentTicketType is set both
            when adding and when editing a saved ticket, so the picker and the
            form are never on screen together. */}
        <AnimatedShowIf condition={!currentTicketType}>
          <TicketFormatPicker
            selected={selectedFormat}
            onSelect={handleSelectFormat}
            hiddenFormats={visibility === "private" ? ["group_ticket"] : []}
          />
        </AnimatedShowIf>

        <ContinueButton
          disabled={savedTickets.length === 0}
          onClick={() => handleFormChange("promocode")}
        />
      </TabContainer>

      {/* <ConfirmationMailForm /> */}
    </div>
  );
}

