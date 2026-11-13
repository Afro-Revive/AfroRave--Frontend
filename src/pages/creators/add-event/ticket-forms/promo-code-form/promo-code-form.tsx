import {
  CustomFormField as FormField,
  CustomInput as Input,
} from "@/components/shared/custom-form";
import { DateForm } from "@/components/shared/date-form";
import { FormFieldWithCounter } from "@/components/shared/field-with-counter";
import type { IBaseCheckbox } from "@/components/reusable/base-boolean-checkbox";
import { BaseBooleanCheckbox } from "@/components/reusable/base-boolean-checkbox";
import { BaseCheckbox } from "@/components/reusable/base-checkbox";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { TicketData } from "@/types";
import { useState } from "react";
import { useWatch, type UseFormReturn } from "react-hook-form";
import { RiArrowUpSLine } from "react-icons/ri";
import { PriceField } from "../../component/price-field";
import type { TPromoCodeSchema } from "../../schemas/promo-code-schema";

/**
 * `onSubmit` adds the Remove and Create buttons under the fields, for when the
 * form sits on the page itself rather than behind a Save button.
 */
export function PromoCodeFormFields({
  form,
  eventTickets,
  onSubmit,
  onRemove,
  isSubmitting = false,
}: IPromoCodeFormFields) {
  const [
    spendMinimum,
    ticketsMinimum,
    isPartnership,
    hasCommission,
  ] = useWatch({
    control: form.control,
    name: [
      "promoCodes.conditions.spend.minimum",
      "promoCodes.conditions.tickets.minimum",
      "promoCodes.partnership.partnershipCode",
      "promoCodes.partnership.comission",
    ],
  });
  // Open from the start when editing a code that already uses any of them.
  const [showAdvanced, setShowAdvanced] = useState(
    () =>
      !!(spendMinimum || ticketsMinimum || isPartnership),
  );

  return (
    <div className="flex flex-col gap-6">
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

      <div className="grid md:grid-cols-2 gap-5 items-start">
        <div className="flex flex-col gap-2">
          <p className="text-sm font-sf-pro-text font-medium text-system-black uppercase">
            Discount value
          </p>
          <div className="grid grid-cols-2 gap-3">
            <FieldText text="% OFF" />

            <FormField form={form} name="promoCodes.discount" showMessage>
              {(field) => (
                <Input
                  type="number"
                  className="w-full text-center"
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
          showMessage
        >
          {(field) => (
            <Input
              type="number"
              className="w-full"
              {...field}
              value={field.value == null ? "" : String(field.value)}
            />
          )}
        </FormField>
      </div>

      {/* None picked means the code works on every ticket. */}
      <FormField
        form={form}
        name="promoCodes.tickets"
        label="APPLY TO"
        showMessage
      >
        {(field) => (
          <>
            {eventTickets?.map((item) => (
              <BaseCheckbox
                key={item.ticketId}
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

      <FormField form={form} name="promoCodes.onePerCustomer">
        {(field) => <BaseBooleanCheckbox data={checkboxData.onePerCustomer} {...field} />}
      </FormField>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
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

      <div className="flex flex-col gap-5">
        <button
          type="button"
          aria-expanded={showAdvanced}
          onClick={() => setShowAdvanced((open) => !open)}
          className="flex w-fit items-center gap-2 font-sf-pro-text text-sm font-bold uppercase text-system-black"
        >
          <span className="flex size-6 items-center justify-center rounded-full bg-light-red/10 text-light-red">
            <RiArrowUpSLine
              className={cn("size-5 transition-transform", !showAdvanced && "rotate-180")}
            />
          </span>
          Advanced options
        </button>

        {showAdvanced && (
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-3">
              <FormField form={form} name="promoCodes.conditions.spend.minimum">
                {(field) => <BaseBooleanCheckbox data={checkboxData.spendMinimum} {...field} />}
              </FormField>

              {spendMinimum && (
                <PriceField
                  form={form}
                  name="promoCodes.conditions.spend.amount"
                  label="PRICE"
                  showMessage
                />
              )}
            </div>

            <div className="flex flex-col gap-3">
              <FormField form={form} name="promoCodes.conditions.tickets.minimum">
                {(field) => <BaseBooleanCheckbox data={checkboxData.ticketsMinimum} {...field} />}
              </FormField>

              {ticketsMinimum && (
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
              )}
            </div>

            <div className="flex flex-col gap-5">
              <FormField form={form} name="promoCodes.partnership.partnershipCode">
                {(field) => <BaseBooleanCheckbox data={checkboxData.partnershipCode} {...field} />}
              </FormField>

              {isPartnership && (
                <>
                  <FormFieldWithCounter
                    form={form}
                    field_name="promoCodes.partnership.name"
                    name="NAME"
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

                  <div className="flex flex-col gap-3">
                    <FormField form={form} name="promoCodes.partnership.comission">
                      {(field) => <BaseBooleanCheckbox data={checkboxData.comission} {...field} />}
                    </FormField>

                    {hasCommission && (
                      <div className="w-full grid grid-cols-2 gap-3">
                        <FieldText text="% AFTER SALES" />

                        <FormField
                          form={form}
                          name="promoCodes.partnership.comissionRate"
                          showMessage
                        >
                          {(field) => (
                            <Input
                              type="number"
                              className="w-full text-center border-mid-dark-gray/50"
                              {...field}
                              value={field.value == null ? "" : String(field.value)}
                            />
                          )}
                        </FormField>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>

      {onSubmit && (
        <div className="flex flex-wrap gap-3">
          {onRemove && (
            <Button
              type="button"
              variant="destructive"
              onClick={onRemove}
              disabled={isSubmitting}
              className="h-8 w-fit rounded-full px-4 text-xs font-bold font-inter-tight uppercase"
            >
             Cancel
            </Button>
          )}

          <Button
            type="button"
            onClick={onSubmit}
            disabled={isSubmitting}
            className="h-8 w-fit rounded-full bg-black px-4 text-xs font-bold font-inter-tight uppercase text-white hover:bg-black/90"
          >
            {isSubmitting ? "Creating promocode..." : "Create promocode"}
          </Button>
        </div>
      )}
    </div>
  );
}

function FieldText({ text }: { text: string }) {
  return (
    <p className="w-full h-10 flex items-center justify-center bg-[#E6E6E6] rounded-[4px] border border-mid-dark-gray/50 text-xs font-sf-pro-display text-[#686868] uppercase">
      {text}
    </p>
  );
}

const checkboxData: Record<string, IBaseCheckbox> = {
  onePerCustomer: {
    description: "only 1 use per customer",
    items: { label: "limit per customer", id: "onePerCustomer" },
  },
  spendMinimum: {
    description: "Only allow use if cart total exceeds this",
    items: { label: "minimum spend", id: "spendMinimum" },
  },
  ticketsMinimum: {
    description: "Only allow use if tickets total exceeds this",
    items: { label: "minimum tickets", id: "purchasedMinimum" },
  },
  partnershipCode: {
    description: "Link this code to a partner or influencer for sales tracking.",
    items: { label: "partnership code?", id: "partnershipCode" },
  },
  comission: {
    items: { label: "commission", id: "comission" },
  },
};

interface IPromoCodeFormFields {
  form: UseFormReturn<{ promoCodes: TPromoCodeSchema }>;
  eventTickets?: TicketData[];
  /** Shows the buttons under the fields; Create runs this. */
  onSubmit?: () => void;
  /** Remove clears the form. */
  onRemove?: () => void;
  isSubmitting?: boolean;
}
