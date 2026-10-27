import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { getRoutePath } from "@/config/get-route-path";
import { useVendorSlotsByType } from "@/hooks/use-vendor-mutation";
import type { PaginatedResponse } from "@/types";
import type { VendorSlot, VendorSlotsResponse } from "@/types/vendor";
import BaseModal from "@/components/reusable/base-modal";
import { BaseSelect } from "@/components/reusable/base-select";
import { FormBase } from "@/components/reusable/base-form";
import {
  CustomFormField as FormField,
  CustomInput as Input,
} from "@/components/shared/custom-form";
import { FormFieldWithCounter } from "@/components/shared/field-with-counter";
import {
  QuantityIncreaseBtn,
  QuantityDecreaseButton,
} from "@/pages/creators/add-event/component/quantity-buttons";
import { RichTextEditor } from "@/components/reusable/rich-text-editor";
import { richTextLength } from "@/lib/rich-text";
import { Button } from "@/components/ui/button";
import { RiAddLine } from "react-icons/ri";
import { useCreateVendor, useUpdateVendor } from "@/hooks/use-event-mutations";
import { useEventSelectorStore } from "@/stores";
import {
  africanCountryCodes,
  serviceVendorCategoryOptions,
  revenueVendorCategoryOptions
} from "@/pages/creators/add-event/constant";
import type { CreateVendorRequest } from "@/types/event";
import { PriceField } from "@/pages/creators/add-event/component/price-field";
import { TimeForm } from "@/components/shared/time-form";
import {
  BUDGET_MAX,
  EMPTY_VENDOR_FORM,
  FormValues,
  buildSchema,
  deadlineToApi,
  slotToFormValues,
} from "./vendor-schema";
import { OnlyShowIf } from "@/lib/environment";
import { BaseBooleanCheckbox } from "@/components/reusable/base-boolean-checkbox";
import { SelectField } from "@/pages/creators/add-event/component/select-field";
import { DateForm } from "@/components/shared/date-form";
import { Slider } from "@/components/ui/slider";
import { formatNaira } from "@/lib/format-price";

const BUDGET_STEP = 5_000;

function formatTime(
  time: { hour?: string; minute?: string; period?: string } | undefined
): string | null {
  if (!time?.hour || !time.minute || !time.period) return null;
  return `${time.hour}:${time.minute} ${time.period}`;
}

/** The slots in a vendor slots response, as useVendorSlotsByType reads them. */
function slotsFrom(response: VendorSlotsResponse | undefined): VendorSlot[] {
  const paginated = response?.data as PaginatedResponse<VendorSlot[]> | undefined;
  return (paginated?.items as VendorSlot[] | undefined) ?? [];
}

interface CreateVendorSlotProps {
  type: "Revenue" | "Service";
  /** Render the form open on the page, with no button or modal around it. */
  inline?: boolean;
  /** An existing slot to edit: the form opens filled in and saves changes to it. */
  slot?: VendorSlot;
}

export default function CreateVendorSlot({
  type,
  inline = false,
  slot,
}: CreateVendorSlotProps) {
  const [open, setOpen] = useState(false);
  const { selectedEventId } = useEventSelectorStore();
  const createVendorMutation = useCreateVendor();
  const updateVendorMutation = useUpdateVendor();
  const isEditing = !!slot;
  const isSaving = isEditing
    ? updateVendorMutation.isPending
    : createVendorMutation.isPending;
  const navigate = useNavigate();
  // The event's slots, so a new one can be found after create (see onSubmit).
  const { slots, refetch: refetchSlots } = useVendorSlotsByType(
    selectedEventId ?? "",
  );
  const isRevenue = type === "Revenue";
  const label = isRevenue ? "Stall" : "Offer";

  const form = useForm<FormValues>({
    resolver: zodResolver(buildSchema(type)),
    defaultValues: slot ? slotToFormValues(slot, isRevenue) : EMPTY_VENDOR_FORM,
  });

  // defaultValues only apply on mount; the slot arrives from a query and is
  // refetched after a save, so refill whenever it changes.
  useEffect(() => {
    if (slot) form.reset(slotToFormValues(slot, isRevenue));
  }, [slot, isRevenue, form]);

  const [formError, setFormError] = useState<string | null>(null);

  function handleClose(nextOpen: boolean) {
    setOpen(nextOpen);
    if (!nextOpen) {
      // Back to blank for create; back to the saved slot for edit.
      form.reset(slot ? slotToFormValues(slot, isRevenue) : EMPTY_VENDOR_FORM);
      setFormError(null);
    }
  }

  function increaseSlotNumber() {
    const current = Number(form.getValues("slotNumber")) || 0;
    form.setValue("slotNumber", String(current + 1));
  }

  function decreaseSlotNumber() {
    const current = Number(form.getValues("slotNumber")) || 0;
    form.setValue("slotNumber", String(Math.max(current - 1, 0)));
  }

  const category = useWatch({ control: form.control, name: "category" });
  const categoryOptions = isRevenue
    ? revenueVendorCategoryOptions
    : serviceVendorCategoryOptions;
  const selectedCategory = categoryOptions.find(
    (option) => option.value === category
  );

  const price = useWatch({ control: form.control, name: "price" });
  const minBudget = useWatch({ control: form.control, name: "minBudget" });
  const maxBudget = useWatch({ control: form.control, name: "maxBudget" });
  const budgetRange: [number, number] = [
    minBudget ? Number(minBudget) : 0,
    maxBudget ? Number(maxBudget) : BUDGET_MAX,
  ];

  function handleBudgetRangeChange(values: number[]) {
    form.setValue("minBudget", String(values[0]));
    form.setValue("maxBudget", String(values[1]));
  }

  useEffect(() => {
    const base = Number(price) || 0;
    const noOfSlots = Number(form.getValues("slotNumber")) || 0;
    form.setValue("totalPrice", base ? String((base * noOfSlots)) : "");
  }, [price, form]);

  function onSubmit(values: FormValues) {
    setFormError(null);

    // An edit keeps the slot on its own event, falling back to the picker only
    // if the slot somehow has none.
    const eventId = slot?.eventId || selectedEventId;
    if (!eventId) {
      toast.error("Select an event first.");
      return;
    }

    const deadline = deadlineToApi(values);

    const data: CreateVendorRequest = {
      vendorType: type,
      category: values.category,
      description: values.description,
      eventId,
      vendorDetails: {
        slotData: {
          slotName: isRevenue ? (values.slotName ?? null) : null,
          slotNumber:
            isRevenue && values.slotNumber ? Number(values.slotNumber) : null,
          price: isRevenue && values.price ? Number(values.price) : null,
          applicationDeadline: isRevenue ? deadline : null,
        },
        serviceData: {
          serviceName: isRevenue ? null : (values.serviceName ?? null),
          hasBudgetRange: !isRevenue && !!(values.minBudget || values.maxBudget),
          minBudget:
            !isRevenue && values.minBudget ? Number(values.minBudget) : null,
          maxBudget:
            !isRevenue && values.maxBudget ? Number(values.maxBudget) : null,
          startTime: isRevenue ? null : formatTime(values.startTime),
          stopTime: isRevenue ? null : formatTime(values.stopTime),
          startDate: isRevenue ? null : values.startDate || null,
          endDate: isRevenue ? null : values.endDate || null,
          applicationDeadline: isRevenue ? null : deadline,
        },
        contact: {
          useDifferentContactDetails: values.useDifferentContact || false,
          email: values.email || null,
          phoneNumbers: values.phone?.number
            ? [`${values.phone.countryCode ?? ""}${values.phone.number}`]
            : null,
        },
      },
      hideSocialLinks: values.hideSocialLinks || false,
      // Sent back by edit only; a new slot gets its status from the server.
      status: slot?.status,
      applicationDeadline: deadline ?? "",
    };

    if (slot) {
      // Editing stays on the page the user is already looking at.
      updateVendorMutation.mutate(
        { vendorId: slot.vendorId, data },
        { onSuccess: () => handleClose(false) },
      );
      return;
    }

    // Stop-gap: the create response's id isn't one GET /api/Event/vendor/{id}
    // takes, so the new slot is found in the refetched list instead: the one of
    // this type that wasn't there before, preferring the name just typed.
    // Drop this once create returns the slot's vendorId.
    const existingIds = new Set(slots.map((slot) => slot.vendorId));
    const name = (isRevenue ? values.slotName : values.serviceName) ?? "";

    createVendorMutation.mutate(data, {
      onSuccess: async () => {
        handleClose(false);

        const { data: fresh } = await refetchSlots();
        const created = slotsFrom(fresh).filter(
          (slot) => slot.vendorType === type && !existingIds.has(slot.vendorId),
        );
        const vendorId = (
          created.find(
            (slot) => slot.vendorName?.toLowerCase() === name.toLowerCase(),
          ) ?? created[0]
        )?.vendorId;

        navigate(
          vendorId
            ? getRoutePath(
                isRevenue ? "revenue_vendor_slot" : "service_vendor_slot",
                { slotId: vendorId },
              )
            : // No id came back — land on the list, where the new slot still shows.
              getRoutePath(isRevenue ? "revenue_vendor" : "service_vendor"),
        );
      },
    });
  }

  // Revenue puts this under the stall name; service puts it beside the service name.
  const categoryField = (
    <div className="w-full flex flex-col gap-2">
      <FormField form={form} name="category" label="CATEGORY" showMessage>
        <BaseSelect
          type="auth"
          items={categoryOptions}
          placeholder="Choose An Applicable category"
          triggerClassName="w-full text-black !bg-white px-3 rounded-[4px] border border-mid-dark-gray/50 text-sm font-inter-tight uppercase"
        />
      </FormField>
      {selectedCategory && (
        <p className="text-xs normal-case leading-[130%] text-mid-dark-gray font-inter-tight">
          {selectedCategory.description}
        </p>
      )}
    </div>
  );

  const content = (
    <div
      className={
        inline ? "w-full bg-white rounded-xl px-4 pb-8" : "max-h-[80vh] overflow-y-auto px-4 md:px-8"
      }
    >
      <div className="flex flex-col gap-1 py-10">
        <p className="font-bold font-inter-tight text-black md:text-2xl text-xl">
          {isEditing
            ? `Edit Vendor ${isRevenue ? "Stall" : "Offer"}`
            : isRevenue
              ? "Add Vendor Stall"
              : "Create Vendor Offer"}
        </p>
        <p className="font-inter-tight text-sm text-system-black ">
          {isEditing
            ? "Update this listing's details. Vendors who already applied keep their applications."
            : "Open your event to marketplace sellers and reach out for professional event services."}
        </p>
      </div>

      <FormBase
        form={form}
        onSubmit={onSubmit}
        onError={() =>
          setFormError("Please fix the highlighted fields above.")
        }
        className="w-full flex flex-col gap-5 mb-5"
      >
        {isRevenue ? (
          <p className="font-inter uppercase text-base font-medium text-system-black">
            Stall Details
          </p>
        ) : (
          <p className="font-inter uppercase text-base font-medium text-system-black">
            Service Details
          </p>
        )}

        {isRevenue ? (
          <>
            <FormFieldWithCounter
              form={form}
              field_name="slotName"
              name="STALL NAME"
              maxLength={40}
              showMessage
            >
              {(field) => (
                <Input
                  className="uppercase"
                  {...field}
                  value={String(field.value ?? "")}
                />
              )}
            </FormFieldWithCounter>

            {/* Category and number of stalls share a row, at the same width. */}
            <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-5 items-start">
              {categoryField}

              <FormField
                form={form}
                name="slotNumber"
                label="NUMBER OF STALLS"
                showMessage
              >
                {(field) => (
                  <div className="flex h-10 w-full border rounded-[4px] border-mid-dark-gray/50">
                    <Input
                      type="number"
                      className=""
                      {...field}
                      value={String(field.value ?? "")}
                    />
                    <div className="flex w-10 h-10 flex-col items-center justify-between rounded-r-[4px] border-l border-mid-dark-gray/50">
                      <QuantityIncreaseBtn action={increaseSlotNumber} />
                      <QuantityDecreaseButton action={decreaseSlotNumber} />
                    </div>
                  </div>
                )}
              </FormField>
            </div>
            <div className="w-full py-2 grid grid-cols-2 gap-5">
              <PriceField
                form={form}
                name="price"
                label="PRICE PER STALL"
                className="w-full"
                description="There will be an 8% fee added to your slot price"
                showMessage
              />
              <PriceField
                form={form}
                name="totalPrice"
                className="w-full"
                label="TOTAL PRICE"
                readOnly
              />
            </div>
          </>
        ) : (
          <>
            {/* Service name and category share a row, at the same width. */}
            <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-5 items-start">
              <FormFieldWithCounter
                form={form}
                field_name="serviceName"
                name="SERVICE NAME"
                maxLength={40}
                showMessage
              >
                {(field) => (
                  <Input
                    className=""
                    {...field}
                    value={String(field.value ?? "")}
                  />
                )}
              </FormFieldWithCounter>
              {categoryField}
            </div>
            <div className="flex flex-col gap-3 py-2">
              <div className="flex items-center justify-between">
                <p className="uppercase text-sm font-medium font-work-sans leading-[100%] text-system-black">
                  Budget Range
                </p>
                <p className="text-sm text-muted-foreground">
                  (Optional)
                </p>
              </div>
              <Slider
                value={budgetRange}
                onValueChange={handleBudgetRangeChange}
                min={0}
                max={BUDGET_MAX}
                step={BUDGET_STEP}
                minStepsBetweenThumbs={1}
                showInputs
                formatInputValue={(amount) => formatNaira(amount)}
              />
            </div>
          </>
        )}

        <FormFieldWithCounter
          form={form}
          field_name="description"
          name="DESCRIPTION"
          maxLength={450}
          count={(value) => richTextLength(value as string)}
          showMessage
        >
          {(field) => (
            <RichTextEditor
              id="description"
              placeholder={
                isRevenue
                  ? "e.g, Power supply included booth size..."
                  : "e.g., Bring your own setup"
              }
              value={field.value as string}
              onChange={field.onChange}
              onBlur={field.onBlur}
              className="bg-transparent"
            />
          )}
        </FormFieldWithCounter>

        {isRevenue ? null : (
          <div>
            <div className="flex flex-row justify-between items-center mb-4">
              <p className="font-inter uppercase text-base font-medium text-system-black">
                Work Duration
              </p>
              <p className="text-sm text-muted-foreground">(Optional)</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <TimeForm
                form={form}
                label="START TIME"
                hour_name="startTime.hour"
                minute_name="startTime.minute"
                period_name="startTime.period"
              />
              <TimeForm
                form={form}
                label="STOP TIME"
                hour_name="stopTime.hour"
                minute_name="stopTime.minute"
                period_name="stopTime.period"
              />
            </div>
          </div>
        )}

        <div>
          <p className="font-inter uppercase text-base font-medium text-system-black">
            Application Deadline
          </p>

          <div className="py-4">
            <DateForm
              form={form}
              name="APPLICATION DEADLINE"
              date_label="END DATE"
              input_name="applicationDeadline"
              hour_name="deadlineTime.hour"
              minute_name="deadlineTime.minute"
              period_name="deadlineTime.period"
            />
          </div>

          <FormField form={form} name="useDifferentContact" className="">
            {(field) => (
              <BaseBooleanCheckbox
                data={{
                  items: {
                    label: "Use Different Contact Details",
                    id: "useDifferentContact",
                  },
                }}
                {...field}
              />
            )}
          </FormField>
          <OnlyShowIf
            condition={form.getValues("useDifferentContact") === true}
          >
            <div className="grid md:grid-cols-2 gap-5 my-3">
              <FormField
                form={form}
                name="email"
                label="EMAIL"
                showMessage
              >
                <Input />
              </FormField>
              <div className="flex items-end gap-3">
                <SelectField
                  form={form}
                  name={`phone.countryCode`}
                  label="PHONE NUMBER"
                  placeholder="+234"
                  className="w-fit"
                  triggerClassName="!h-10"
                  data={africanCountryCodes}
                  showMessage
                />

                <FormField
                  form={form}
                  name={`phone.number`}
                  className="mb-2"
                  showMessage
                >
                  <Input className="h-10" />
                </FormField>
              </div>
            </div>
          </OnlyShowIf>
          <p className="text-xs font-inter-tight font-light text-mid-dark-gray mt-1">
            Your contact details will remain hidden until a revenue vendor
            successfully pays for a slot. This ensures privacy and secure
            vendor interactions.
          </p>
          <FormField form={form} name="hideSocialLinks" className="">
            {(field) => (
              <BaseBooleanCheckbox
                data={{
                  items: {
                    label: "Hide Social Links",
                    id: "hideSocialLinks",
                  },
                }}
                {...field}
              />
            )}
          </FormField>
        </div>

        {formError && (
          <p className="text-center text-xs font-work-sans text-deep-red">
            {formError}
          </p>
        )}

        <div className="flex w-full justify-center gap-3">
          {/* Only the modal has a draft to close; open on the page, it's create only. */}
          {!inline && (
            <Button
              type="button"
              variant="destructive"
              onClick={() => handleClose(false)}
              className="w-1/2 font-work-sans font-semibold rounded-full uppercase text-xs"
            >
              Save Draft
            </Button>
          )}
          <Button
            type="submit"
            disabled={isSaving}
            className="w-1/2 h-8 px-6 rounded-full text-xs font-semibold font-work-sans uppercase text-white bg-black hover:bg-black/90 disabled:opacity-50"
          >
            {isEditing
              ? isSaving
                ? "Saving..."
                : "Save Changes"
              : isSaving
                ? `Creating ${label}...`
                : `Create ${label}`}
          </Button>
        </div>
      </FormBase>
    </div>
  );

  if (inline) return content;

  return (
    <>
      <Button
        type="button"
        onClick={() => setOpen(true)}
        className="h-9 gap-1.5 rounded-lg bg-green px-4 font-inter-tight text-sm text-white hover:bg-green/90"
      >
        <RiAddLine className="size-4" />
        {isRevenue ? "Create Stall" : "Create Offer"}
      </Button>
      <div className="flex flex-col max-w-[560px] ">
        <BaseModal
          open={open}
          onClose={handleClose}
          size="small"
          floatingCancel
          cancelClassName="text-black bg-transparent hover:bg-transparent backdrop-blur-none"
          className="bg-white sm:max-w-[650px]"
        >
          {content}
        </BaseModal>
      </div>
    </>
  );
}
