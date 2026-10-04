import { DateForm } from "@/components/shared/date-form";
import { FormFieldWithCounter } from "@/components/shared/field-with-counter";
import { FormField } from "@/components/reusable";
import { CustomFormField } from "@/components/shared/custom-form";
import { BaseBooleanCheckbox } from "@/components/reusable/base-boolean-checkbox";
import { BaseCheckbox } from "@/components/reusable/base-checkbox";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { OnlyShowIf } from "@/lib/environment";
import { ChevronDown } from "lucide-react";
import { BsInfoCircle } from "react-icons/bs";
import { useEffect, useState } from "react";
import type { UseFormReturn } from "react-hook-form";
import type { z } from "zod";
import { PriceField } from "../../component/price-field";
import { SalesChannelField } from "../../component/sales-channel-field";
import { SelectField } from "../../component/select-field";
import type { unifiedTicketFormSchema } from "../../schemas/ticket-schema";

export function TicketForm({
  form,
  type,
  onSubmit,
  isLoading,
  isEditMode = false,
  onCancel,
}: ITicketFormProps) {
  const [openAdvancedOptions, setOpenAdvancedOptions] = useState(false);
  const availabilityValue = form.watch("ticket.quantity.availability");
  const isInviteOnly = form.watch("ticket.invite_only");
  const isGroupTicket = type === "group_ticket";

  const formatCopy = TICKET_FORMAT_COPY[isInviteOnly ? "invite_only" : type];

  useEffect(() => {
    if (isInviteOnly) {
      form.setValue("ticket.quantity.availability", "unlimited");
      form.setValue("ticket.purchase_limit", "1");
    }

    // Resell is unavailable to both, so it can't be left switched on.
    if (isInviteOnly || isGroupTicket) {
      form.setValue("allow_ticket_resell", false);
    }
  }, [isInviteOnly, isGroupTicket, form]);

  return (
    <>
      <div className="flex flex-col gap-1">
        <h2 className="font-inter-tight font-bold text-2xl text-black uppercase">
          {formatCopy.title}
        </h2>
        <p className="font-inter-tight font-medium text-sm text-[#464444]">
          {formatCopy.description}
        </p>
      </div>

      <div className="flex flex-col gap-3">
        <FormFieldWithCounter
          name="TICKET NAME"
          field_name="ticket.ticketName"
          form={form}
          showMessage
          className="font-normal"
          maxLength={65}
        >
          {(field) => (
            <Input
              placeholder="Enter name"
              className="border-mid-dark-gray/50"
              {...field}
              value={field.value == null ? "" : String(field.value)}
            />
          )}
        </FormFieldWithCounter>

        <FormField form={form} name="ticket.type">
          {(field) => (
            <BaseCheckbox
              data={{
                items: [
                  { label: "PAID", id: "paid" },
                  { label: "FREE", id: "free" },
                ],
              }}
              {...field}
              labelClassName="text-xs font-work-sans"
              descriptionClassName="max-w-[255px]"
            />
          )}
        </FormField>

        {/* <FormField form={form} name='ticket.invite_only'>
          {(field) => (
            <BaseBooleanCheckbox
              data={{ items: { label: 'INVITE ONLY', id: 'invite-only' } }}
              showCheckbox={false}
              labelClassName='text-[12px] flex justify-center rounded-[5px] opacity-70 bg-white px-4 py-2 shadow-[0px_2px_10px_2px_#0000001A]'
              checkedClassName='border border-red-800 bg-blue-900'
              {...field}
            />
          )}
        </FormField> */}
      </div>

      {/* An invitation decides its own channel and admits one guest, so neither
          sales type nor ticket type is a choice here. */}
      <OnlyShowIf condition={!isInviteOnly}>
        <SalesChannelField form={form} name="ticket.salesType" />
      </OnlyShowIf>

      <div className="w-full flex flex-col">
        {/* Group tickets price further down, so quantity takes the whole row
            here instead of leaving an empty column beside it. */}
        <div
          className={
            isGroupTicket
              ? "grid grid-cols-1 gap-8"
              : "grid grid-cols-1 sm:grid-cols-2 gap-8"
          }
        >
          {isInviteOnly ? (
            <ReadOnlyValue label="QUANTITY" value="UNLIMITED" />
          ) : (
            <div className="w-full flex gap-3">
              <SelectField
                form={form}
                name="ticket.quantity.availability"
                label="QUANTITY"
                className="max-w-fit"
                showMessage
                data={availability}
                placeholder="Select availability."
                triggerClassName="h-9"
              />

              {availabilityValue === "limited" && (
                <CustomFormField
                  form={form}
                  name="ticket.quantity.amount"
                  label="TICKET QUANTITY"
                  showMessage
                >
                  {(field) => (
                    <Input
                      className="w-full h-9 rounded-sm border border-mid-dark-gray/50 text-sm font-sf-pro-display"
                      type="number"
                      {...field}
                      value={field.value == null ? "" : String(field.value)}
                    />
                  )}
                </CustomFormField>
              )}
            </div>
          )}

          {!isGroupTicket && (
            <div className="w-full">
              <PriceField
                form={form}
                name="ticket.price"
                ticketTypeName="ticket.type"
                // A single ticket admits one guest, so "per ticket" says nothing.
                label={type === "single_ticket" ? "PRICE" : "PRICE PER TICKET"}
                showMessage
              />
            </div>
          )}
        </div>

        {isInviteOnly && (
          <p className="font-inter-tight text-sm text-[#464444] mt-2">
            Availability is determined by the number of invitations you send.
          </p>
        )}
      </div>

    <OnlyShowIf condition={type === "group_ticket"}>
        <SelectField
          form={form}
          name="ticket.group_size"
          label="GROUP SIZE"
          className="w-full"
          data={groupSizeOptions}
          showMessage
          placeholder="SELECT"
          triggerClassName="w-full"
        />
      </OnlyShowIf>

      {!isInviteOnly && (
        <SelectField
          form={form}
          name="ticket.purchase_limit"
          label="PURCHASE LIMIT"
          className="w-full"
          data={purchaseLimitOptions}
          showMessage
          placeholder="SELECT"
          triggerClassName="w-full"
        />
      )}

      {/* Sits after purchase limit because the per-person figure only makes
          sense once group size, just above, has been chosen. */}
      {isGroupTicket && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          <PriceField
            form={form}
            name="ticket.price"
            ticketTypeName="ticket.type"
            label="PRICE PER GROUP"
            showMessage
          />

          <PricePerPersonField form={form} />
        </div>
      )}



      <OnlyShowIf condition={type === "multi_day"}>
        <SelectField
          form={form}
          name="ticket.days_valid"
          label="DAYS VALID"
          showMessage
          className="w-full"
          data={daysValidOptions}
          placeholder="SELECT"
          triggerClassName="w-full"
        />
      </OnlyShowIf>

      <FormFieldWithCounter
        name="Description"
        field_name="ticket.description"
        showMessage
        form={form}
        maxLength={2000}
      >
        {(field) => (
          <Textarea
            placeholder={`KEEP DESCRIPTIONS SHORT BUT EXCITING.
BULLET POINTS WORK BETTER THAN LONG PARAGRAPHS.
ALWAYS INCLUDE DATE AND VENUE SOMEWHERE INSIDE THE DESCRIPTION FOR CLARITY.
DESCRIBE WHAT THIS TICKET INCLUDES.`}
            className="w-full h-[272px] text-black bg-white px-3 py-[11px] rounded-[4px] border border-mid-dark-gray/50 text-sm font-sf-pro-display"
            {...field}
            value={field.value == null ? "" : String(field.value)}
          />
        )}
      </FormFieldWithCounter>

      <div className="w-full flex flex-col gap-5">
        <Button
          variant="ghost"
          type="button"
          onClick={() => setOpenAdvancedOptions(!openAdvancedOptions)}
          className="w-fit flex items-center gap-1 !px-1 text-charcoal hover:bg-transparent"
        >
          <ChevronDown width={28} height={17} />
          <span className="font-bold font-sf-pro-display leading-[100%] uppercase">
            Advanced Options
          </span>
        </Button>

        <OnlyShowIf condition={openAdvancedOptions && isInviteOnly}>
          <div className="flex flex-col gap-[18px]">
            <UnavailableNote
              label="When Should Ticket Sales Start?"
              reason="invite_only"
            />
            <UnavailableNote label="Allow Ticket Resell" reason="invite_only" />
          </div>
        </OnlyShowIf>

        <OnlyShowIf condition={openAdvancedOptions && !isInviteOnly}>
          <div className="flex flex-col gap-[18px]">
            <p className="font-work-sans font-medium text-sm uppercase text-[#464444] leading-none">
              When Should Ticket Sales Start?
            </p>

            <FormField form={form} name="whenToStart">
              {(field) => (
                <BaseCheckbox
                  orientation="vertical"
                  data={whenToStartOptions[0]}
                  {...field}
                  labelClassName="font-work-sans font-normal text-[14px] uppercase text-[#1E1E1E] leading-none"
                  descriptionClassName="font-inter-tight font-normal text-[13px] lowercase text-[#1E1E1E] leading-snug mt-0.5"
                />
              )}
            </FormField>

            {isGroupTicket ? (
              <UnavailableNote
                label="Allow Ticket Resell"
                reason="group_ticket"
              />
            ) : (
              <FormField form={form} name="allow_ticket_resell">
                {(field) => (
                  <BaseBooleanCheckbox
                    data={{
                      items: {
                        label: "ALLOW TICKET RESELL",
                        id: "allow-ticket-resell",
                      },
                    }}
                    showCheckbox={true}
                    labelClassName="font-work-sans font-medium text-sm uppercase text-[#464444] leading-none"
                    checkedClassName="border border-red-800"
                    {...field}
                  />
                )}
              </FormField>
            )}
            <p className="font-inter-tight font-normal text-sm lowercase text-[#1E1E1E] leading-snug -mt-3">
              This option allows attendees to resell their tickets to other
              fans.
            </p>
          </div>
          <OnlyShowIf
            condition={form.getValues("whenToStart") === "at-a-scheduled-date"}
          >
            <DateForm
              form={form}
              name="START DATE"
              input_name="scheduledDate.date"
              hour_name="scheduledDate.hour"
              minute_name="scheduledDate.minute"
              period_name="scheduledDate.period"
              flow="row"
            />
          </OnlyShowIf>
        </OnlyShowIf>
      </div>

      {isInviteOnly && (
        <div className="bg-[#ACACAC]/20 rounded-md py-3 px-4 inline-flex">
          <BsInfoCircle size={28} className="text-[#464444] mr-2" />
          <p className="font-inter-tight font-semibold text-xs text-[#464444]">
            You'll send invitations after creating this ticket. Invitations sent
            before the event is published are delivered once it’s published.
          </p>
        </div>
      )}

      <div className="flex gap-3">
        <Button
          type="button"
          onClick={onCancel}
          className="w-[155px] h-8 rounded-full text-xs font-semibold font-sf-pro-text text-white bg-deep-red hover:bg-deep-red/90 uppercase"
        >
          REMOVE TICKET
        </Button>

        {onSubmit && (
          <Button
            type="button"
            onClick={onSubmit}
            className="w-[155px] h-8 rounded-full text-xs font-semibold font-sf-pro-text text-white bg-black hover:bg-black/90 uppercase"
          >
            {isLoading
              ? isEditMode
                ? "UPDATING..."
                : "CREATING..."
              : isEditMode
                ? "UPDATE TICKET"
                : "CREATE TICKET"}
          </Button>
        )}
      </div>
    </>
  );
}

/**
 * Read-only, and not a form field — the per-person figure is derived from the
 * group price and size, so storing it would let the two drift apart.
 */
function PricePerPersonField({ form }: { form: ITicketFormProps["form"] }) {
  const price = form.watch("ticket.price");
  const groupSize = form.watch("ticket.group_size" as "ticket.price");

  const amount = Number(price);
  const size = Number(groupSize);
  const perPerson =
    Number.isFinite(amount) && Number.isFinite(size) && size > 0 && amount > 0
      ? (amount / size).toLocaleString("en-NG", { maximumFractionDigits: 2 })
      : "";

  return (
    <div className="w-full flex flex-col gap-1 text-black text-xs uppercase font-work-sans">
      <p className="text-[#1E1E1E]">Price Per Person</p>

      <div className="w-full h-9 flex items-center gap-3">
        <p className="py-[11px] w-14 h-full flex items-center justify-center bg-[#acacac] rounded-[5px]">
          ₦
        </p>

        <Input
          readOnly
          tabIndex={-1}
          value={perPerson}
          className="w-full h-9 bg-gray-100 text-mid-dark-gray"
        />
      </div>

      <p className="mt-1 normal-case text-[10px] font-inter-tight text-mid-dark-gray">
        price equivalent of each attendee
      </p>
    </div>
  );
}

/** A settled value shown as a field, so the form reads consistently. */
function ReadOnlyValue({ label, value }: { label: string; value: string }) {
  return (
    <div className="w-full flex flex-col gap-3">
      <p className="text-sm text-charcoal leading-[100%] font-work-sans">
        {label}
      </p>

      <p className="w-full h-9 flex items-center justify-center text-sm font-sf-pro-display leading-[100%] text-[#686868] rounded-[5px] border border-mid-dark-gray/50 bg-[#D9D9D9]">
        {value}
      </p>
    </div>
  );
}

const UNAVAILABLE_REASON = {
  invite_only:
    "Unavailable for invite-only tickets. Each invitation is tied to the invited guest.",
  group_ticket:
    "Unavailable for group tickets. Each group ticket stays with the original buyer.",
} as const;

/** Keeps a disabled control's heading in place so the form doesn't lose its shape. */
function UnavailableNote({
  label,
  reason,
}: {
  label: string;
  reason: keyof typeof UNAVAILABLE_REASON;
}) {
  return (
    <div className="w-full flex flex-col gap-2">
      <p className="uppercase font-medium font-work-sans text-sm text-black">
        {label}
      </p>

      <p className="font-inter-tight font-normal text-[13px] text-[#686868] leading-snug">
        {UNAVAILABLE_REASON[reason]}
      </p>
    </div>
  );
}

/** The header shown above the form, naming the format being created. */
const TICKET_FORMAT_COPY = {
  single_ticket: {
    title: "Single Ticket",
    description: "Admits only one individual",
  },
  invite_only: {
    title: "Invite-only Ticket",
    description:
      "A single-admission ticket issued by invitation. Guests receive it through invitations sent from your guestlist.",
  },
  group_ticket: {
    title: "Group Ticket",
    description:
      "A multi-admission ticket purchased as one order. One buyer secures entry for a fixed number of guests.",
  },
  multi_day: {
    title: "Multi Day Ticket",
    description: "Grants access on multiple event dates.",
  },
} as const;

const availability: { value: string; label: string }[] = [
  { value: "limited", label: "Limited" },
  { value: "unlimited", label: "Unlimited" },
];

const purchaseLimitOptions: { value: string; label: string }[] = [
  { value: "1", label: "1" },
  { value: "2", label: "2" },
  { value: "3", label: "3" },
  { value: "4", label: "4" },
  { value: "5", label: "5" },
  { value: "10", label: "10" },
  { value: "20", label: "20" },
  { value: "50", label: "50" },
];

const groupSizeOptions: { value: string; label: string }[] = [
  { value: "2", label: "2" },
  { value: "3", label: "3" },
  { value: "4", label: "4" },
  { value: "5", label: "5" },
  { value: "6", label: "6" },
  { value: "8", label: "8" },
  { value: "10", label: "10" },
];

const daysValidOptions: { value: string; label: string }[] = [
  { value: "1", label: "1 Day" },
  { value: "2", label: "2 Days" },
  { value: "3", label: "3 Days" },
  { value: "5", label: "5 Days" },
  { value: "7", label: "1 Week" },
  { value: "14", label: "2 Weeks" },
  { value: "30", label: "1 Month" },
];

const whenToStartOptions = [
  {
    items: [
      {
        label: "START SALES IMMEDIATELY",
        id: "immediately",
        description: "Tickets go on sale as soon as your event is live",
      },
      {
        label: "SCHEDULE SALES START",
        id: "at-a-scheduled-date",
        description:
          "Pick a date/time to open sales after your event page is live",
      },
    ],
  },
];

interface ITicketFormProps {
  form: UseFormReturn<z.infer<typeof unifiedTicketFormSchema>>;
  type: "single_ticket" | "group_ticket" | "multi_day";
  onSubmit?: () => void;
  isLoading?: boolean;
  isEditMode?: boolean;
  onCancel?: () => void;
}
