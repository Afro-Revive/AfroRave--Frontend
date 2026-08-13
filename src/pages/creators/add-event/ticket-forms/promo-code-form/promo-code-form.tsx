import {
  CustomFormField as FormField,
  CustomInput as Input,
} from "@/components/shared/custom-form";
import { DateForm } from "@/components/shared/date-form";
import { FormFieldWithCounter } from "@/components/shared/field-with-counter";
import type { IBaseCheckbox } from "@/components/reusable/base-boolean-checkbox";
import { BaseBooleanCheckbox } from "@/components/reusable/base-boolean-checkbox";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { PriceField } from "../../component/price-field";
import { TabContainer } from "../../component/tab-ctn";
import {
  defaultPromoCodeValues,
  promoCodeSchema,
  type TPromoCodeSchema,
} from "../../schemas/promo-code-schema";
import {
  addPromoCode,
  createPromoCode,
  handleCancelEdit,
  handleDeletePromoCode,
  handleEditPromoCode,
  onSubmit,
  updatePromoCode,
} from "./helper";
import type {
  PaginatedResponse,
  PromoCodeData,
  PromoCodeWithDetailsResponse,
  TicketData,
} from "@/types";
import { useEventStore } from "@/stores";
import {
  useGetEventPromoCodes,
  useGetEventTickets,
  useGetPromoCode,
} from "@/hooks/use-event-mutations";
import { BaseCheckbox } from "@/components/reusable/base-checkbox";
import {
  useCreatePromoCode,
  useUpdatePromoCode,
} from "@/hooks/use-event-mutations";
import { OnlyShowIf } from "@/lib/environment";
import { AnimatedShowIf } from "../../component/animated-show-if";
import { ActionPopover } from "../../component/action-popover";
import { useDeletePromoCode } from "@/hooks/use-event-mutations";
import { AddButton } from "../../component/add-btn";
import { FakeDataGenerator } from "@/lib/fake-data-generator";

export default function PromoCodeForm({
  handleFormChange,
}: {
  handleFormChange: (form: string) => void;
}) {
  const [editingPromoId, setEditingPromoId] = useState<string | null>(null);
  const [currentPromoCode, setCurrentPromoCode] = useState<boolean>(false);

  const { eventId } = useEventStore();
  const createPromoCodeMutation = useCreatePromoCode(eventId || "");
  const updatePromoCodeMutation = useUpdatePromoCode(eventId || "");
  const deletePromoCodeMutation = useDeletePromoCode(eventId || "");
  const eventTickets = useGetEventTickets(eventId || "").data?.data;
  const { data: createdPromoCodes } = useGetEventPromoCodes(eventId || "");
  const { data: promoCodeDetails } = useGetPromoCode(editingPromoId || "");

  const promoCodeDetailsData = promoCodeDetails?.data as
    | PromoCodeWithDetailsResponse
    | undefined;
  const createdPromoCodesData = createdPromoCodes?.data as
    | PaginatedResponse<PromoCodeData>
    | undefined;
  const eventTicketsData = eventTickets as
    | PaginatedResponse<TicketData>
    | undefined;

  const form = useForm<{ promoCodes: TPromoCodeSchema }>({
    resolver: zodResolver(z.object({ promoCodes: promoCodeSchema })),
    defaultValues: { promoCodes: defaultPromoCodeValues },
  });

  useEffect(() => {
    if (promoCodeDetailsData && editingPromoId) {
      console.log("Promo code details loaded:", promoCodeDetailsData);
      handleEditPromoCode(
        promoCodeDetailsData,
        form,
        setEditingPromoId,
        setCurrentPromoCode,
      );
    }
  }, [promoCodeDetailsData, editingPromoId]);

  const handleCreatePromoCode = () =>
    createPromoCode(
      form,
      setCurrentPromoCode,
      setEditingPromoId,
      eventId,
      createPromoCodeMutation,
    );

  const handleUpdatePromoCode = () =>
    updatePromoCode(
      form,
      editingPromoId,
      setCurrentPromoCode,
      setEditingPromoId,
      updatePromoCodeMutation,
    );

  const handleAddPromoCode = () =>
    addPromoCode(form, setEditingPromoId, setCurrentPromoCode);

  const handleEditPromoCodeWrapper = (promoCode: PromoCodeData) => {
    setEditingPromoId(promoCode.promocodeId);
    setCurrentPromoCode(true);
  };

  const handleDeletePromoCodeWrapper = (promoId: string) =>
    handleDeletePromoCode(promoId, deletePromoCodeMutation);

  const handleCancelEditWrapper = () =>
    handleCancelEdit(form, setEditingPromoId, setCurrentPromoCode);

  const handleSubmit = () => onSubmit(handleFormChange);

  const handleFillSampleData = (data: any) => {
    if (!data) return;

    form.setValue("promoCodes.code", data.code);
    form.setValue("promoCodes.discount", data.discount);
    form.setValue("promoCodes.usageLimit", data.usageLimit);
    form.setValue("promoCodes.onePerCustomer", data.onePerCustomer);

    // Set dates
    form.setValue("promoCodes.startDate", data.startDate);
    form.setValue("promoCodes.endDate", data.endDate);

    form.setValue("promoCodes.conditions", data.conditions);
    form.setValue(
      "promoCodes.tickets",
      (data.tickets || []) as { id: string }[],
    );
    form.setValue("promoCodes.notes", data.notes);

    // Partnership data
    form.setValue("promoCodes.partnership", data.partnership);
  };

  return (
    <div className="w-full flex flex-col gap-6">
      <TabContainer<{ promoCodes: TPromoCodeSchema }>
        heading="CREATE PROMO CODES"
        description="CODE NAMES MUST BE UNIQUE PER EVENT"
        className="max-w-[560px] w-full flex flex-col"
        form={form}
        onSubmit={handleSubmit}
      >
        {createdPromoCodesData?.items &&
          createdPromoCodesData.items.length > 0 && (
            <div className="w-full flex flex-col gap-3 mb-6">
              {createdPromoCodesData.items.map((promoCode) => (
                <CreatedPromoCard
                  key={promoCode.promoCode}
                  promoCode={promoCode}
                  onEdit={() => handleEditPromoCodeWrapper(promoCode)}
                  onDelete={() =>
                    handleDeletePromoCodeWrapper(promoCode.promocodeId)
                  }
                  isUpdating={updatePromoCodeMutation.isPending}
                  isDeleting={deletePromoCodeMutation.isPending}
                />
              ))}
            </div>
          )}

        {/* Only show form when there's a promo code to create/edit */}
        <AnimatedShowIf condition={currentPromoCode}>
          <div className="w-full flex flex-col gap-8">
            <FakeDataGenerator
              type="promoCodes"
              onGenerate={handleFillSampleData}
              buttonText="🎲 Fill with sample data"
              variant="outline"
              className="mb-2 self-end"
            />
            <PromoCodeFormFields
              form={form}
              eventTickets={eventTicketsData?.items || []}
              onSubmit={
                editingPromoId
                  ? form.handleSubmit(handleUpdatePromoCode)
                  : form.handleSubmit(handleCreatePromoCode)
              }
              isEditMode={!!editingPromoId}
              onCancel={editingPromoId ? handleCancelEditWrapper : undefined}
              isCreating={createPromoCodeMutation.isPending}
              isEditing={updatePromoCodeMutation.isPending}
            />
          </div>
        </AnimatedShowIf>

        {/* Only show add promo code button when no form is active */}
        <AnimatedShowIf condition={!currentPromoCode}>
          <AddButton onClick={handleAddPromoCode} name="ADD PROMO CODE" />
        </AnimatedShowIf>
      </TabContainer>

      <div className="flex flex-col md:flex-row items-center gap-3 md:gap-8 justify-center py-8">
        <Button
          type="button"
          onClick={() => handleFormChange("upgrades")}
          className="w-full md:w-[240px] h-10 rounded-[8px] text-xs font-sf-pro-text uppercase bg-black hover:bg-black/90 text-white"
        >
          SKIP
        </Button>
        <Button
          type="button"
          variant="destructive"
          onClick={() => handleFormChange("upgrades")}
          className="w-full md:w-[240px] h-10 rounded-[8px] text-xs font-sf-pro-text uppercase"
        >
          CONTINUE
        </Button>
      </div>
    </div>
  );
}

export function PromoCodeFormFields({
  form,
  onSubmit,
  isEditMode = false,
  onCancel,
  eventTickets,
  isCreating = false,
  isEditing = false,
}: IPromoCodeFormFields) {
  return (
    <>
      <div className="flex flex-col gap-1 py-4">
        <p className="font-black font-sf-pro-display text-black md:text-2xl text-xl uppercase">
          CREATE PROMO CODES
        </p>
        <p className="font-sf-pro-display text-sm text-mid-dark-gray/50 uppercase">
          Code names must be unique per event
        </p>
      </div>
      <div className="flex flex-col gap-5 mb-5">
        <FormFieldWithCounter
          name="promo code"
          field_name="promoCodes.code"
          form={form}
          className="font-normal"
          maxLength={20}
          showMessage
        >
          {(field) => (
            <Input
              className="uppercase"
              {...field}
              value={field.value == null ? "" : String(field.value)}
            />
          )}
        </FormFieldWithCounter>

        <FormField form={form} name="promoCodes.tickets" label="APPLY TO" showMessage>
          {(field) => (
            <>
              {eventTickets?.map((item) => (
                <BaseCheckbox
                  key={item.eventName}
                  data={{
                    items: [{ label: item.ticketName, id: item.ticketId }],
                  }}
                  multiSelect={true}
                  {...field}
                />
              ))}
            </>
          )}
        </FormField>
      </div>

      <div className="grid md:grid-cols-2 gap-5 items-end">
        <div className="flex flex-col gap-2">
          <p className="text-sm font-sf-pro-text font-medium text-system-black">
            DISCOUNT VALUE
          </p>
          <div className="grid grid-cols-2 gap-3">
            <FieldText text="OFF" />

            <FormField form={form} name="promoCodes.discount" className="mb-2" showMessage>
              {(field) => (
                <Input
                  type="number"
                  className="w-full h-9"
                  {...field}
                  value={field.value == null ? "" : String(field.value)}
                />
              )}
            </FormField>
          </div>
        </div>

        <FormField
          form={form}
          name="promoCodes.usageLimit"
          label="usage limit"
          className="mb-2"
          showMessage
        >
          {(field) => (
            <Input
              type="number"
              className="w-full h-9"
              {...field}
              value={field.value == null ? "" : String(field.value)}
            />
          )}
        </FormField>
      </div>

      <div className="flex flex-col my-5">
        <FormField form={form} name="promoCodes.onePerCustomer">
          {(field) => <BaseBooleanCheckbox data={checkboxData[0]} {...field} />}
        </FormField>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
        <DateForm
          form={form}
          name="START DATE"
          input_name="promoCodes.startDate.date"
          hour_name="promoCodes.startDate.hour"
          minute_name="promoCodes.startDate.minute"
          period_name="promoCodes.startDate.period"
          date_label="START DATE"
        />

        <DateForm
          form={form}
          name="END DATE"
          input_name="promoCodes.endDate.date"
          hour_name="promoCodes.endDate.hour"
          minute_name="promoCodes.endDate.minute"
          period_name="promoCodes.endDate.period"
          date_label="END DATE"
        />
      </div>

      <div className="flex flex-col gap-4">
        <FormField
          form={form}
          name="promoCodes.conditions.spend.minimum"
          className=""
        >
          {(field) => <BaseBooleanCheckbox data={checkboxData[1]} {...field} />}
        </FormField>

        <div className="mb-2">
          <OnlyShowIf
            condition={
              form.getValues("promoCodes.conditions.spend.minimum") || false
            }
          >
            <PriceField form={form} name="promoCodes.conditions.spend.amount" />
          </OnlyShowIf>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <FormField form={form} name="promoCodes.conditions.tickets.minimum">
          {(field) => <BaseBooleanCheckbox data={checkboxData[2]} {...field} />}
        </FormField>

        <div className="mb-2">
          <OnlyShowIf
            condition={
              form.getValues("promoCodes.conditions.tickets.minimum") || false
            }
          >
            <FormField
              form={form}
              name="promoCodes.conditions.tickets.quantity"
              showMessage
              label="TICKET QUANTITY"
            >
              {(field) => (
                <Input
                  className="w-full"
                  type="number"
                  {...field}
                  value={field.value == null ? "" : String(field.value)}
                />
              )}
            </FormField>
          </OnlyShowIf>
        </div>
      </div>

      <FormFieldWithCounter
        name="NOTES"
        field_name="promoCodes.notes"
        form={form}
        maxLength={250}
        description="Optional"
        showMessage
      >
        {(field) => (
          <Textarea
            placeholder="Add private notes to help you track the purpose or audience for this code (only you can see this)"
            className="w-full h-[272px] text-black bg-white px-3 py-[11px] rounded-[4px] border border-mid-dark-gray/50 text-sm font-sf-pro-display"
            {...field}
            value={field.value == null ? "" : String(field.value)}
          />
        )}
      </FormFieldWithCounter>

      <div className="flex flex-col mb-5">
        <FormField form={form} name="promoCodes.partnership.partnershipCode">
          {(field) => <BaseBooleanCheckbox data={checkboxData[4]} {...field} />}
        </FormField>
      </div>

      <div className="flex flex-col gap-5">
        <OnlyShowIf
          condition={
            form.getValues("promoCodes.partnership.partnershipCode") || false
          }
        >
          <FormFieldWithCounter
            form={form}
            field_name="promoCodes.partnership.name"
            name="NAME"
            className=""
            maxLength={20}
            showMessage
          >
            {(field) => (
              <Input
                className="w-full uppercase border-mid-dark-gray/50"
                {...field}
                value={field.value == null ? "" : String(field.value)}
              />
            )}
          </FormFieldWithCounter>

          <div className="flex flex-col gap-1 mb-10">
            <FormField
              form={form}
              name="promoCodes.partnership.comission"
              className=""
            >
              {(field) => (
                <BaseBooleanCheckbox data={checkboxData[5]} {...field} />
              )}
            </FormField>

            <div className="mb-5">
              <OnlyShowIf
                condition={
                  form.getValues("promoCodes.partnership.comission") || false
                }
              >
                <div className="w-full grid grid-cols-2 gap-3">
                  <div className="w-full h-9 flex items-center justify-center bg-[#E6E6E6] rounded-[4px] border border-mid-dark-gray/50 text-xs font-sf-pro-display text-[#686868]">
                    % AFTER SALES
                  </div>

                  <FormField
                    form={form}
                    name="promoCodes.partnership.comissionRate"
                    showMessage
                  >
                    {(field) => (
                      <Input
                        type="number"
                        className="w-full h-9 border-mid-dark-gray/50"
                        {...field}
                        value={field.value == null ? "" : String(field.value)}
                      />
                    )}
                  </FormField>
                </div>
              </OnlyShowIf>
            </div>
          </div>
        </OnlyShowIf>
      </div>

      <div className="flex gap-3">
        {onSubmit && (
          <Button
            type="button"
            onClick={onSubmit}
            className="w-fit h-8 px-4 rounded-full text-xs font-semibold font-sf-pro-text text-white bg-black hover:bg-black/90"
            disabled={isCreating || isEditing}
          >
            {isEditMode
              ? isEditing
                ? "UPDATING PROMOCODE..."
                : "UPDATE PROMO CODE"
              : isCreating
                ? "CREATING PROMOCODE..."
                : "CREATE PROMO CODE"}
          </Button>
        )}

        {isEditMode && onCancel && (
          <Button
            type="button"
            variant="destructive"
            onClick={onCancel}
            className="w-[120px] h-8 rounded-full text-xs font-semibold font-sf-pro-text text-charcoal border-mid-dark-gray/50"
          >
            CANCEL
          </Button>
        )}
      </div>
    </>
  );
}

function CreatedPromoCard({
  promoCode,
  onEdit,
  onDelete,
  isDeleting,
  isUpdating,
}: ICreatedPromoCode) {
  console.log("Rendering CreatedPromoCard for promoCode:", promoCode);
  return (
    <div className="w-full flex flex-col">
      <div className="w-full border border-mid-dark-gray/30 px-4 py-3 shadow-sm rounded-lg bg-white flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <p className="uppercase text-sm font-bold font-sf-pro-text text-charcoal">
            {promoCode.promoCode}
          </p>
          <div className="flex items-center gap-2 text-[10px] font-medium text-[#686868] font-sf-pro-display uppercase">
            <p>
              {promoCode.discountType === "Percentage"
                ? `${promoCode.discountValue}% OFF`
                : `$${promoCode.discountValue} OFF`}
            </p>
            <span className="w-1 h-1 rounded-full bg-[#686868]" />
            <p>Usage: {promoCode.discountUsage}</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <CustomBadge
            type={
              promoCode.discountType === "percentage" ? "percentage" : "default"
            }
            text={promoCode.discountType}
          />
          <ActionPopover
            onEdit={onEdit}
            onDelete={onDelete}
            isDeleting={isDeleting}
            isUpdating={isUpdating}
          />
        </div>
      </div>
    </div>
  );
}

function CustomBadge({ type = "default", text = "default" }: ICustomBadge) {
  return (
    <Badge
      className={cn(
        "py-1 px-3 rounded text-[10px] font-medium font-sf-pro-text uppercase leading-[100%]",
        {
          "bg-[#E6F7EB] text-[#00AD2E]":
            type === "percentage" || type === "default",
          "bg-[#FFF5CC] text-[#FFB800]": type === "partnership",
          "bg-deep-red/10 text-deep-red": type === "private",
        },
      )}
    >
      {text}
    </Badge>
  );
}

function FieldText({ text }: { text: string }) {
  return (
    <p className="py-[11px] w-full h-9 flex items-center justify-center bg-[#acacac] rounded-[5px] border border-mid-dark-gray text-xs text-system-black font-sf-pro-text">
      % {text}
    </p>
  );
}

const checkboxData: IBaseCheckbox[] = [
  {
    description: "only 1 use per customer",
    items: { label: "limit per customer", id: "onePerCustomer" },
  },
  {
    description: "Only allow use if cart total exceeds this",
    items: { label: "minimum spend", id: "spendMinimum" },
  },
  {
    description: "Only allow use if tickets total exceeds this",
    items: { label: "minimum tickets", id: "purchasedMinimum" },
  },
  {
    description: "Promo code won't be displayed on the event page",
    items: { label: "private", id: "private" },
  },
  {
    description:
      "Link this code to a partner or influencer for sales tracking.",
    items: { label: "partnership code?", id: "partnershipCode" },
  },
  {
    items: { label: "commission", id: "comission" },
  },
];

interface IPromoCodeFormFields {
  form: ReturnType<typeof useForm<{ promoCodes: TPromoCodeSchema }>>;
  onSubmit?: () => void;
  isEditMode?: boolean;
  onCancel?: () => void;
  eventTickets?: TicketData[];
  isCreating?: boolean;
  isEditing?: boolean;
}

interface ICreatedPromoCode {
  promoCode: PromoCodeData;
  onEdit: () => void;
  onDelete: () => void;
  isUpdating: boolean;
  isDeleting: boolean;
}

interface ICustomBadge {
  type?: "default" | "private" | "percentage" | "partnership";
  text?: string;
}
