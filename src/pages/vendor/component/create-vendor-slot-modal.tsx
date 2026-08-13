import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { getRoutePath } from "@/config/get-route-path";
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
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { DestructiveAddBtn } from "@/pages/creators/_components/destructive-add-btn";
import { useCreateVendor } from "@/hooks/use-event-mutations";
import { useEventSelectorStore } from "@/stores";
import {
  africanCountryCodes,
  serviceVendorCategoryOptions,
  revenueVendorCategoryOptions
} from "@/pages/creators/add-event/constant";
import type { CreateVendorRequest } from "@/types/event";
import { PriceField } from "@/pages/creators/add-event/component/price-field";
import { TimeForm } from "@/components/shared/time-form";
import { FormValues, buildSchema } from "./vendor-schema";
import { OnlyShowIf } from "@/lib/environment";
import { BaseBooleanCheckbox } from "@/components/reusable/base-boolean-checkbox";
import { SelectField } from "@/pages/creators/add-event/component/select-field";
import { BaseDatePicker } from "@/components/reusable/base-date-picker";
import { Slider } from "@/components/ui/slider";
import { formatNaira } from "@/lib/format-price";

const BUDGET_MAX = 1_000_000;
const BUDGET_STEP = 5_000;

interface CreateVendorSlotProps {
  type: "Revenue" | "Service";
}

export default function CreateVendorSlot({ type }: CreateVendorSlotProps) {
  const [open, setOpen] = useState(false);
  const { selectedEventId } = useEventSelectorStore();
  const createVendorMutation = useCreateVendor();
  const navigate = useNavigate();
  const isRevenue = type === "Revenue";
  const label = isRevenue ? "Slot" : "Offer";

  const form = useForm<FormValues>({
    resolver: zodResolver(buildSchema(type)),
    defaultValues: {
      category: "",
      description: "",
      slotName: "",
      slotNumber: "",
      price: "",
      totalPrice: "",
      serviceName: "",
      minBudget: "",
      maxBudget: "",
      startDate: "",
      startTime: {
        hour: "9",
        minute: "30",
        period: "AM",
      },
      stopTime: {
        hour: "5",
        minute: "30",
        period: "PM",
      },
      endDate: "",
      email: "",
      phone: {
        countryCode: "+234",
        number: "",
      },
      hideSocialLinks: false,
      useDifferentContact: false,
    },
  });

  const [formError, setFormError] = useState<string | null>(null);

  function handleClose(nextOpen: boolean) {
    setOpen(nextOpen);
    if (!nextOpen) {
      form.reset();
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

    if (!selectedEventId) {
      toast.error("Select an event first.");
      return;
    }

    const data: CreateVendorRequest = {
      vendorType: type,
      category: values.category,
      description: values.description,
      eventId: selectedEventId,
      vendorDetails: {
        slotData: {
          slotName: isRevenue ? (values.slotName ?? null) : null,
          slotNumber:
            isRevenue && values.slotNumber ? Number(values.slotNumber) : null,
          price: isRevenue && values.price ? Number(values.price) : null,
        },
        serviceData: {
          serviceName: isRevenue ? null : (values.serviceName ?? null),
          minBudget:
            !isRevenue && values.minBudget ? Number(values.minBudget) : null,
          maxBudget:
            !isRevenue && values.maxBudget ? Number(values.maxBudget) : null,
          startDate: isRevenue ? null : values.startDate || null,
          endDate: isRevenue ? null : values.endDate || null,
        },
        contact: {
          useDifferentContactDetails: values.useDifferentContact || false,
          email: values.email || null,
          phoneNumbers: values.phone?.number ? [values.phone.number] : null,
        },
      },
      hideSocialLinks: values.hideSocialLinks || false,
      applicationDeadline: values.applicationDeadline
        ? values.applicationDeadline.toISOString()
        : "",
    };

    createVendorMutation.mutate(data, {
      onSuccess: (response) => {
        handleClose(false);

        const createdVendor = response.data as { vendorId?: string } | undefined;
        if (createdVendor?.vendorId) {
          navigate(
            getRoutePath(
              isRevenue ? "revenue_vendor_slot" : "service_vendor_slot",
              { slotId: createdVendor.vendorId }
            )
          );
        }
      },
    });
  }

  return (
    <>
      <DestructiveAddBtn
        name={isRevenue ? "Create Slot" : "Create Offer"}
        special
        onClick={() => setOpen(true)}
      />
      <div className="flex flex-col max-w-[560px] ">
        <BaseModal
          open={open}
          onClose={handleClose}
          size="small"
          floatingCancel
          className="bg-white sm:max-w-[650px]"
        >
          <div className="max-h-[80vh] overflow-y-auto px-4 md:px-8">
            <div className="flex flex-col gap-1 py-10">
              <p className="font-black font-sf-pro-display text-black md:text-2xl text-xl uppercase">
                Add Vendors
              </p>
              <p className="font-sf-pro-display text-sm text-system-black ">
                Open your event to marketplace sellers and reach out for
                professional event services.
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
              <div className="flex flex-col gap-2 font-sf-pro-text">
                <p className="uppercase text-sm font-medium font-sf-pro-text leading-[100%] text-system-black">
                  Select Vendor Type
                </p>
                <div className="w-full flex flex-col items-center gap-1 bg-[#FAFAFA] rounded-[5px] px-3 py-4 border border-[#E5E5E5]">
                  <p className="text-charcoal uppercase text-sm leading-[100%] font-sf-pro-text">
                    {isRevenue ? "Revenue Vendor" : "Service Vendor"}
                  </p>
                  <p className="text-[13px] text-center leading-[130%] text-[#8E8E93] font-sf-pro-display max-w-[400px]">
                    {isRevenue
                      ? "Vendors who purchase a slot to sell goods or products at your event. A commission is applied to each confirmed slot."
                      : "Vendors who offer professional services required for event execution. Applications are submitted for your review and approval; no slot fee is charged."}
                  </p>
                </div>
              </div>

              <FormField
                form={form}
                name="category"
                label="CATEGORY"
                showMessage
              >
                <BaseSelect
                  type="auth"
                  items={categoryOptions}
                  placeholder="Choose An Applicable category"
                  triggerClassName="w-full text-black !bg-white px-3 rounded-[4px] border border-mid-dark-gray/50 text-sm font-sf-pro-display uppercase"
                />
              </FormField>
              {selectedCategory && (
                <p className="text-xs normal-case leading-[130%] text-mid-dark-gray font-sf-pro-display -mt-3">
                  {selectedCategory.description}
                </p>
              )}

              {isRevenue ? (
                <p className="font-inter uppercase text-base font-medium text-system-black">
                  Slot Details
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
                    name="SLOT NAME"
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

                  <FormField
                    form={form}
                    name="slotNumber"
                    label="NUMBER OF SLOTS"
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
                  <div className="w-full py-2 grid grid-cols-2 gap-5">
                    <PriceField
                      form={form}
                      name="price"
                      label="PRICE PER SLOT"
                      className="w-full"
                      description="There will be a 10% fee added to your slot price"
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
                  <div className="flex flex-col gap-3 py-2">
                    <div className="flex items-center justify-between">
                      <p className="uppercase text-sm font-medium font-sf-pro-text leading-[100%] text-system-black">
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
                    />
                    <div className="flex items-center mt-2 justify-between text-xs font-sf-pro-display text-mid-dark-gray">
                      <span className="border border-mid-gray px-10 py-2">{formatNaira(budgetRange[0])}</span>
                      <span className="border border-mid-gray px-10 py-2">{formatNaira(budgetRange[1])}</span>
                    </div>
                  </div>
                </>
              )}

              <FormFieldWithCounter
                form={form}
                field_name="description"
                name="DESCRIPTION"
                maxLength={450}
                showMessage
              >
                {(field) => (
                  <Textarea
                    placeholder={
                      isRevenue
                        ? "e.g, Power supply included booth size..."
                        : "e.g., Bring your own setup"
                    }
                    className="min-h-[220px] bg-white border  border-mid-dark-gray/50 text-black text-sm font-sf-pro-display"
                    {...field}
                    value={String(field.value ?? "")}
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

                <FormField
                  form={form}
                  name="applicationDeadline"
                  label="DATE"
                  className="py-4"
                  showMessage
                >
                  {(field) => {
                    const { value, ...rest } = field;
                    return (
                      <BaseDatePicker
                        {...rest}
                        value={value as Date | undefined}
                        className="w-full font-inter hover:bg-white"
                      />
                    );
                  }}
                </FormField>

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
                <p className="text-xs font-sf-pro-display font-light text-mid-dark-gray mt-1">
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
                <p className="text-center text-xs font-sf-pro-text text-deep-red">
                  {formError}
                </p>
              )}

              <div className="flex w-full justify-center gap-3">
                <Button
                  type="button"
                  variant="destructive"
                  onClick={() => handleClose(false)}
                  className="w-1/2 font-sf-pro-text font-semibold rounded-full uppercase text-xs"
                >
                  Save Draft
                </Button>
                <Button
                  type="submit"
                  disabled={createVendorMutation.isPending}
                  className="w-1/2 h-8 px-6 rounded-full text-xs font-semibold font-sf-pro-text uppercase text-white bg-black hover:bg-black/90 disabled:opacity-50"
                >
                  {createVendorMutation.isPending
                    ? `Creating ${label}...`
                    : `Create ${label}`}
                </Button>
              </div>
            </FormBase>
          </div>
        </BaseModal>
      </div>
    </>
  );
}
