import {
  CustomFormField as FormField,
  CustomInput as Input,
} from "@/components/shared/custom-form";
import { DateForm } from "@/components/shared/date-form";
import { FormFieldWithAbsoluteText } from "@/components/shared/field-with-absolute-text";
import { FormFieldWithCounter } from "@/components/shared/field-with-counter";
import { Textarea } from "@/components/ui/textarea";
import { useCreateEvent } from "@/hooks/use-event-mutations";
import { toDashCase } from "@/lib/helper-func";
import { transformEventDetailsToCreateRequest } from "@/lib/event-transforms";
import {
  africanTimezones,
  ageRatings,
  eventCategories,
} from "@/pages/creators/edit-event/constant";
import {
  EditEventDetailsSchema,
  type EventDetailsSchema,
} from "@/schema/edit-event-details";
import { useEventStore } from "@/stores";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { PosterUploadField } from "../component/poster-upload-field";
import { VisibilityField } from "../component/visibility-field";
import { SelectField } from "../component/select-field";
import { ContinueButton } from "../component/continue-button";
import { TabContainer } from "../component/tab-ctn";

interface IEventDetailsTab {
  setStep: (step: number) => void;
  setActiveTabState: (tab: string) => void;
}

export default function EventDetailsTab({
  setStep,
  setActiveTabState,
}: IEventDetailsTab) {
  const { setEventId, setEventData, setVisibility } = useEventStore();

  const createEventMutation = useCreateEvent();

  const form = useForm<EventDetailsSchema>({
    resolver: zodResolver(EditEventDetailsSchema),
    defaultValues: {
      name: "",
      visibility: "public",
      age_rating: "PG",
      category: "festival",
      venue: "",
      description: "",
      terms_refund_policy: "",
      poster_url: "",
      event_type: "standalone",
      start_date: {
        date: new Date(),
        hour: "12",
        minute: "00",
        period: "AM",
      },
      end_date: {
        date: new Date(),
        hour: "12",
        minute: "00",
        period: "AM",
      },
      email: "",
      website_url: "",
      socials: {
        instagram: "",
        tiktok: "",
        x: "",
      },
    },
  });

  useEffect(() => {
    setStep(1);
  }, [setStep]);

  // The custom URL is derived from the event name
  const eventName = form.watch("name");
  useEffect(() => {
    form.setValue("custom_url", toDashCase(eventName ?? ""), {
      shouldValidate: true,
    });
  }, [eventName, form]);

  async function onSubmit(values: EventDetailsSchema) {
    const eventData = transformEventDetailsToCreateRequest(values);

    // Before the mutation: its onSuccess switches to the tickets tab, which
    // reads this to decide whether group tickets are on offer. Setting it
    // afterwards let that tab mount with a stale null.
    setVisibility(values.visibility ?? "public");

    await createEventMutation.mutateAsync(eventData, {
      onSuccess: (data) => {
        setEventId(data.eventId);
        setActiveTabState("tickets");
      },
    });

    setEventData(eventData);
  }

  return (
    <TabContainer<EventDetailsSchema>
      className="w-full  flex flex-col lg:flex-row items-start gap-24 xl:gap-48 space-y-0"
      form={form}
      onSubmit={onSubmit}
    >
      <div className="shrink-0 max-lg:self-center lg:sticky lg:top-6">
        <PosterUploadField form={form} name="poster_url" />
      </div>

      {/* min-w-0 so the long fields can shrink instead of widening the row. */}
      <div className="w-full xl:max-w-300 flex flex-col gap-8">
        {/* <FakeDataGenerator
        type='eventDetails'
        onGenerate={form.reset}
        buttonText='🎲 Fill with sample data'
        variant='outline'
        className='mb-4'
      /> */}
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <h2 className="font-inter-tight font-bold text-2xl text-black uppercase">
              Visibility
            </h2>
            <p className="font-inter-tight font-medium text-sm text-[#464444]">
              Control how guests access tickets for this event. Public events
              can be switched to private one time only.
            </p>
          </div>

          <VisibilityField form={form} name="visibility" />
        </div>

        <div className="flex flex-col gap-1">
          <h2 className="font-inter-tight font-bold text-2xl text-black uppercase">
            Basic Info
          </h2>
        </div>

        <FormFieldWithCounter
          name="EVENT NAME"
          field_name="name"
          form={form}
          className="font-normal"
          maxLength={85}
        >
          {(field) => (
            <Input
              placeholder="Enter event name."
              className="uppercase"
              {...field}
              value={field.value == null ? "" : String(field.value)}
            />
          )}
        </FormFieldWithCounter>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          <SelectField
            form={form}
            name="age_rating"
            label="AGE RATING"
            placeholder="WHAT'S THE AGE RATING OF YOUR EVENT?"
            data={ageRatings}
            triggerClassName="w-full"
          />

          <SelectField
            form={form}
            name="category"
            label="EVENT CATEGORY"
            data={eventCategories}
            placeholder="CHOOSE AN APPLICABLE CATEGORY"
            triggerClassName="w-full"
          />
        </div>

        <FormField form={form} name="venue" label="Venue">
          {(field) => (
            <Input
              placeholder="Enter event venue."
              {...field}
              value={field.value == null ? "" : String(field.value)}
            />
          )}
        </FormField>

        <FormFieldWithCounter
          name="DESCRIPTION"
          field_name="description"
          form={form}
          maxLength={2000}
        >
          {(field) => (
            <Textarea
              placeholder="Enter event description."
              className="w-full h-[272px] text-black bg-white px-3 py-[11px] rounded-[4px] border border-mid-dark-gray/50 text-sm font-sf-pro-display"
              {...field}
              value={field.value == null ? "" : String(field.value)}
            />
          )}
        </FormFieldWithCounter>

        <FormFieldWithCounter
          name="TERMS(REFUND POLICY)"
          field_name="terms_refund_policy"
          form={form}
          maxLength={250}
        >
          {(field) => (
            <Textarea
              placeholder="Enter your terms and refund policy."
              className="w-full h-[272px] text-black bg-white px-3 py-[11px] rounded-[4px] border border-mid-dark-gray/50 text-sm font-sf-pro-display"
              {...field}
              value={field.value == null ? "" : String(field.value)}
            />
          )}
        </FormFieldWithCounter>

        <FormFieldWithAbsoluteText
          form={form}
          name="custom_url"
          label="CUSTOM URL"
          text="afrorevive/events/"
        >
          {(field) => (
            <Input
              readOnly
              tabIndex={-1}
              placeholder="Generated from the event name."
              className="border-none h-9 text-xs cursor-default text-mid-dark-gray focus-visible:ring-0"
              {...field}
              value={field.value == null ? "" : String(field.value)}
            />
          )}
        </FormFieldWithAbsoluteText>

        <div className="w-full flex flex-col gap-5">
          <div className="flex flex-col gap-1">
            <p className="text-xl font-bold text-black font-inter-tight uppercase">
              Date & Time
            </p>
            <p className="font-inter-tight lg:text-sm text-xs font-medium text-[#464444]">
              Update your event's date and time. Ticket holders will be notified
              of any changes.
            </p>
          </div>

          <SelectField
            form={form}
            name="time_zone"
            label="SELECT TIME ZONE"
            data={africanTimezones}
            placeholder="Select a time zone."
            triggerClassName="w-full bg-[#1E1E1E]/50"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-5">
          <DateForm
            form={form}
            name="START DATE"
            input_name="start_date.date"
            hour_name="start_date.hour"
            minute_name="start_date.minute"
            period_name="start_date.period"
            date_label="START DATE"
            time_label="START TIME"
          />

          <DateForm
            form={form}
            name="END DATE"
            input_name="end_date.date"
            hour_name="end_date.hour"
            minute_name="end_date.minute"
            period_name="end_date.period"
            date_label="END DATE"
            time_label="END TIME"
          />
        </div>

        <div className="w-full flex flex-col gap-7">
          <div className="min-w-full flex flex-col gap-5">
            <div className="flex flex-col gap-1">
              <p className="text-xl font-bold text-black font-inter-tight uppercase">
                CONTACT DETAILS
              </p>
              <p className="font-inter-tight lg:text-sm text-xs font-medium text-[#464444]">
                Update your event's date and time. Ticket holders will be
                notified of any changes.
              </p>
            </div>

            <div className="w-full flex flex-col gap-6">
              <FormField form={form} name="email" label="Email">
                {(field) => (
                  <Input
                    placeholder="Enter email address."
                    {...field}
                    value={field.value == null ? "" : String(field.value)}
                  />
                )}
              </FormField>

              <FormField form={form} name="website_url" label="Website URL">
                {(field) => (
                  <Input
                    placeholder="Enter your website URL."
                    {...field}
                    value={field.value == null ? "" : String(field.value)}
                  />
                )}
              </FormField>
            </div>
          </div>

          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-1">
              <p className="text-xl font-bold text-black font-inter-tight uppercase">
                Socials
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-x-8 gap-y-5">
              {[
                { name: "socials.instagram" as const, label: "Instagram" },
                { name: "socials.x" as const, label: "X" },
                { name: "socials.tiktok" as const, label: "Tiktok" },
                { name: "socials.facebook" as const, label: "Facebook" },
              ].map((item) => (
                <FormField
                  key={item.name}
                  form={form}
                  name={item.name}
                  label={item.label}
                >
                  {(field) => (
                    <Input
                      placeholder={`Enter your ${item.label} Link.`}
                      className="text-[#0033A0]"
                      {...field}
                      value={field.value == null ? "" : String(field.value)}
                    />
                  )}
                </FormField>
              ))}
            </div>
          </div>
        </div>

        <ContinueButton isLoading={createEventMutation.isPending} />
      </div>
    </TabContainer>
  );
}
