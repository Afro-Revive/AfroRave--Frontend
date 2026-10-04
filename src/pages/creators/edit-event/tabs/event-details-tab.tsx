import {
  CustomFormField as FormField,
  CustomInput as Input,
} from "@/components/shared/custom-form";
import { DateForm } from "@/components/shared/date-form";
import { FormFieldWithAbsoluteText } from "@/components/shared/field-with-absolute-text";
import { FormFieldWithCounter } from "@/components/shared/field-with-counter";
import { FormBase } from "@/components/reusable";
import { BaseSelect } from "@/components/reusable";
import { Textarea } from "@/components/ui/textarea";
import { useUpdateEvent, usePublishEvent } from "@/hooks/use-event-mutations";
import {
  EditEventDetailsSchema,
  type EventDetailsSchema,
} from "@/schema/edit-event-details";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { useForm, type UseFormReturn } from "react-hook-form";
import { getRoutePath } from "@/config/get-route-path";
import { africanTimezones, ageRatings, eventCategories } from "../constant";
import type { EventDetailData } from "@/types";
import { transformEventToSchema } from "../helper";
import { toVisibility } from "@/lib/helper-func";
import { SelectField } from "../../add-event/component/select-field";
import { VisibilityField } from "../../add-event/component/visibility-field";
import { PosterImageField } from "../component/poster-image-field";
import { transformEventDetailsToCreateRequest } from "@/lib/event-transforms";
import { TabChildrenContainer } from "../component/edit-tab-children-container";

export default function EventDetailsTab({
  event,
  setActiveTab,
  handleBackClick,
}: IEventDetailsTab) {
  const navigate = useNavigate();
  const eventId = event.eventId;

  const updateEventMutation = useUpdateEvent();
  const publishEventMutation = usePublishEvent();
  const { isPending: isPublishing, mutate: publishEvent } =
    publishEventMutation;

  const { isPending, mutate } = updateEventMutation;

  const form = useForm<EventDetailsSchema>({
    resolver: zodResolver(EditEventDetailsSchema),
    defaultValues: transformEventToSchema(event),
  });

  console.log(event); // Log the form values for debugging

  // const { isDirty } = form.formState

  const isAlreadyPublic = toVisibility(event.accessType) === "public";

  function onSubmit(values: EventDetailsSchema) {
    const eventData = transformEventDetailsToCreateRequest({
      ...values,
      // The picker already locks this, but the rule is worth enforcing where
      // the request is actually built rather than trusting the UI alone.
      visibility: isAlreadyPublic ? "public" : values.visibility,
    });

    mutate(
      { eventId, data: eventData },
      {
        onSuccess: () => {
          setActiveTab("tickets");
        },
      },
    );
  }

  function onPublish() {
    publishEvent(eventId, {
      onSuccess: () => {
        navigate(getRoutePath("standalone"));
      },
    });
  }

  return (
    <TabChildrenContainer
      handleSaveEvent={() => form.handleSubmit(onSubmit)()}
      handlePublishEvent={onPublish}
      handleBackClick={handleBackClick}
      isPublished={event.isPublished}
      isLoading={isPending}
      buttonText={event.eventName}
      isPublishing={isPublishing}
    >
      <div className="w-full flex flex-col items-center p-0 md:p-14 gap-2.5">
        <div className="flex flex-col gap-4 w-full md:min-w-[560px] max-w-[800px]">
          <EventDetailsForm
            form={form}
            onSubmit={onSubmit}
            isAlreadyPublic={isAlreadyPublic}
          />
        </div>
      </div>
    </TabChildrenContainer>
  );
}

function EventDetailsForm({
  form,
  onSubmit,
  isAlreadyPublic,
}: IEventDetailsForm) {
  const selectClassname =
    "w-full text-black !bg-white px-3 py-2 rounded-[4px] border border-mid-dark-gray/50 text-sm font-work-sans";

  return (
    <FormBase
      form={form}
      onSubmit={onSubmit}
      className="w-full flex flex-col space-y-5 md:space-y-8"
    >
      <div className="flex flex-col gap-5">
        <SectionHeader name="VISIBILITY" />

        {/* Going public is one-way: tickets may already be in the wild by the
            time anyone reverses it, so the option is locked out once set. */}
        <VisibilityField
          form={form}
          name="visibility"
          disabledValues={isAlreadyPublic ? ["private"] : []}
          note={
            isAlreadyPublic
              ? "This event is already public, so it cannot be made private. A private event can be switched to public at any time."
              : undefined
          }
          description="Switching to public is permanent. Public events can't be made private again"
        />
        <PosterImageField form={form} name="poster_url" />
      </div>

      <div className="mb-4">
        <SectionHeader name="Basic Info" />
      </div>

      <FormFieldWithCounter
        name="NAME"
        field_name="name"
        form={form}
        maxLength={85}
      >
        {(field) => (
          <Input
            placeholder="Enter event name."
            className="uppercase bg-transparent"
            {...field}
            value={field.value == null ? "" : String(field.value)}
          />
        )}
      </FormFieldWithCounter>

      <div className="w-full grid grid-cols-2 gap-5 md:gap-8">
        <SelectField
          form={form}
          name="age_rating"
          label="Age Rating"
          data={ageRatings}
          placeholder="Select an age rating."
          triggerClassName={selectClassname}
        />

        <FormField form={form} name="category" label="Event Category">
          {(field) => (
            <BaseSelect
              type="auth"
              items={eventCategories}
              placeholder="Select a Category."
              triggerClassName={selectClassname}
              value={field.value as string}
              onChange={field.onChange}
            />
          )}
        </FormField>
      </div>

      <FormField form={form} name="venue" label="Venue">
        {(field) => (
          <Input
            placeholder="Enter event venue."
            className="uppercase bg-transparent"
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
            className="w-full h-[272px] text-black bg-transparent px-3 py-[11px] rounded-[4px] border border-mid-dark-gray/50 text-sm font-sf-pro-display"
            {...field}
            value={field.value == null ? "" : String(field.value)}
          />
        )}
      </FormFieldWithCounter>

      <FormFieldWithAbsoluteText
        form={form}
        name="custom_url"
        label="Custom URL"
        text="afrorevive/events/"
      >
        {(field) => (
          <Input
            placeholder="Enter custom URL."
            className="uppercase border-none h-9"
            {...field}
            value={field.value == null ? "" : String(field.value)}
          />
        )}
      </FormFieldWithAbsoluteText>

      <div className="w-full flex flex-col gap-5">
        <div className="flex flex-col gap-1">
          <p className="text-base font-semibold text-black font-inter-tight">
            Date & Time
          </p>
          <p className="font-inter-tight text-xs font-medium text-[#949494]">
            Update your event's date and time. Ticket holders will be notified
            of any changes.
          </p>
        </div>

        <FormField form={form} name="time_zone" label="Timezone">
          {(field) => (
            <BaseSelect
              type="auth"
              items={africanTimezones}
              placeholder="Select a time zone."
              triggerClassName={selectClassname}
              value={field.value as string}
              onChange={field.onChange}
            />
          )}
        </FormField>
      </div>

      <div className="grid grid-cols-2 md:gap-4">
        <DateForm
          form={form}
          name="START DATE"
          date_label="START DATE"
          input_name="start_date.date"
          hour_name="start_date.hour"
          minute_name="start_date.minute"
          period_name="start_date.period"
        />

        <DateForm
          form={form}
          name="END DATE"
          date_label="END DATE"
          input_name="end_date.date"
          hour_name="end_date.hour"
          minute_name="end_date.minute"
          period_name="end_date.period"
        />
      </div>

      {/**Contact */}
      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-3">
          <SectionHeader name="CONTACT DETAILS" />
          <p className="font-inter-tight text-xs font-medium text-[#949494]">
            Shown on your event page so attendees can reach you.
          </p>
        </div>

        <div className="w-full flex flex-col gap-6">
          <FormField form={form} name="email" label="Email">
            {(field) => (
              <Input
                placeholder="Enter email address."
                className="bg-transparent"
                {...field}
                value={field.value == null ? "" : String(field.value)}
              />
            )}
          </FormField>

          <FormField form={form} name="website_url" label="Website URL">
            {(field) => (
              <Input
                placeholder="Enter your website URL."
                className="bg-transparent"
                {...field}
                value={field.value == null ? "" : String(field.value)}
              />
            )}
          </FormField>
        </div>
      </div>

      {/**Socials */}
      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-3">
          <SectionHeader name="SOCIALS" />
          <p className="font-inter-tight text-xs font-medium text-[#949494]">
            Link your social profiles to help attendees connect with you.
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
                  className="text-[#0033A0] bg-transparent"
                  {...field}
                  value={field.value == null ? "" : String(field.value)}
                />
              )}
            </FormField>
          ))}
        </div>
      </div>
    </FormBase>
  );
}

function SectionHeader({ name }: { name: string }) {
  return (
    <p className="text-xl font-bold font-inter-tight text-black -mb-3 ">
      {name}
    </p>
  );
}

interface IEventDetailsTab {
  event: EventDetailData;
  setActiveTab: (tab: string) => void;
  handleBackClick?: () => void;
}

interface IEventDetailsForm {
  form: UseFormReturn<EventDetailsSchema>;
  onSubmit: (data: EventDetailsSchema) => void;
  /** Locks out the private option — public is a one-way change. */
  isAlreadyPublic: boolean;
}
