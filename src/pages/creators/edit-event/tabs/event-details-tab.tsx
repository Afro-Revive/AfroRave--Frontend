import { CustomFormField as FormField, CustomInput as Input } from '@/components/shared/custom-form'
import { DateForm } from '@/components/shared/date-form'
import { FormFieldWithAbsoluteText } from '@/components/shared/field-with-absolute-text'
import { FormFieldWithCounter } from '@/components/shared/field-with-counter'
import { FormBase } from '@/components/reusable'
import { BaseSelect } from '@/components/reusable'
import { Textarea } from '@/components/ui/textarea'
import { useUpdateEvent, usePublishEvent } from '@/hooks/use-event-mutations'
import { EditEventDetailsSchema, type EventDetailsSchema } from '@/schema/edit-event-details'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from 'react-router-dom'
import { useForm, type UseFormReturn } from 'react-hook-form'
import { getRoutePath } from '@/config/get-route-path'
import { africanTimezones, ageRatings, eventCategories } from '../constant'
import type { EventDetailData } from '@/types'
import { transformEventToSchema } from '../helper'
import { SelectField } from '../../add-event/component/select-field'
import { transformEventDetailsToCreateRequest } from '@/lib/event-transforms'
import { TabChildrenContainer } from '../component/edit-tab-children-container'

export default function EventDetailsTab({ event, setActiveTab, handleBackClick }: IEventDetailsTab) {
  const navigate = useNavigate()
  const eventId = event.eventId

  const updateEventMutation = useUpdateEvent()
  const publishEventMutation = usePublishEvent()
  const { isPending: isPublishing, mutate: publishEvent } = publishEventMutation

  const { isPending, mutate } = updateEventMutation

  const form = useForm<EventDetailsSchema>({
    resolver: zodResolver(EditEventDetailsSchema),
    defaultValues: transformEventToSchema(event),
  })

  console.log(event) // Log the form values for debugging

  // const { isDirty } = form.formState

  function onSubmit(values: EventDetailsSchema) {
    const eventData = transformEventDetailsToCreateRequest(values)

    mutate(
      { eventId, data: eventData },
      {
        onSuccess: () => {
          setActiveTab('tickets')
        },
      },
    )
  }

  function onPublish() {

    publishEvent(eventId, {
      onSuccess: () => {
        navigate(getRoutePath('standalone'))
      },
    })
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
      currentTab='event-details'
      onChange={setActiveTab}>
      <div className='w-full flex flex-col items-center p-0 md:p-14 gap-2.5'>
        <div className='flex flex-col gap-4 w-full md:min-w-[560px] max-w-[800px]'>
          <p className='uppercase font-sf-pro-display font-black text-black text-xl'>
            Event Details
          </p>

          <EventDetailsForm form={form} onSubmit={onSubmit} />
        </div>
      </div>
    </TabChildrenContainer>
  )
}

function EventDetailsForm({ form, onSubmit }: IEventDetailsForm) {
  const selectClassname =
    'w-full text-black !bg-white px-3 py-2 rounded-[4px] border border-mid-dark-gray/50 text-sm font-sf-pro-display'

  return (
    <FormBase
      form={form}
      onSubmit={onSubmit}
      className='w-full flex flex-col space-y-5 md:space-y-8'>
      <FormFieldWithCounter name='NAME' field_name='name' form={form} maxLength={85}>
        {(field) => (
          <Input
            placeholder='Enter event name.'
            className='uppercase bg-transparent'
            {...field}
            value={field.value == null ? '' : String(field.value)}
          />
        )}
      </FormFieldWithCounter>

      <div className='w-full grid grid-cols-2 gap-5 md:gap-8'>
        <SelectField
          form={form}
          name='age_rating'
          label='Age Rating'
          data={ageRatings}
          placeholder='Select an age rating.'
          triggerClassName={selectClassname}
        />

        <FormField form={form} name='category' label='Event Category'>
          {(field) => (
            <BaseSelect
              type='auth'
              items={eventCategories}
              placeholder='Select a Category.'
              triggerClassName={selectClassname}
              value={field.value as string}
              onChange={field.onChange}
            />
          )}
        </FormField>
      </div>

      <FormField form={form} name='venue' label='Venue'>
        {(field) => (
          <Input
            placeholder='Enter event venue.'
            className='uppercase bg-transparent'
            {...field}
            value={field.value == null ? '' : String(field.value)}
          />
        )}
      </FormField>

      <FormFieldWithCounter name='DESCRIPTION' field_name='description' form={form} maxLength={2000}>
        {(field) => (
          <Textarea
            placeholder='Enter event description.'
            className='w-full h-[272px] text-black bg-transparent px-3 py-[11px] rounded-[4px] border border-mid-dark-gray/50 text-sm font-sf-pro-display'
            {...field}
            value={field.value == null ? '' : String(field.value)}
          />
        )}
      </FormFieldWithCounter>

      <FormFieldWithAbsoluteText
        form={form}
        name='custom_url'
        label='Custom URL'
        text='afrorevive/events/'>
        {(field) => (
          <Input
            placeholder='Enter custom URL.'
            className='uppercase border-none h-9'
            {...field}
            value={field.value == null ? '' : String(field.value)}
          />
        )}
      </FormFieldWithAbsoluteText>

      <div className='w-full flex flex-col gap-5'>
        <div className='flex flex-col gap-3'>
          <p className='text-xl font-bold text-black font-sf-pro-display'>EVENT DATE</p>
          <p className='font-sf-pro-text text-xs font-light text-black'>
            Select all the dates of your event
          </p>
        </div>

        <FormField form={form} name='time_zone' label='Timezone'>
          {(field) => (
            <BaseSelect
              type='auth'
              items={africanTimezones}
              placeholder='Select a time zone.'
              triggerClassName={selectClassname}
              value={field.value as string}
              onChange={field.onChange}
            />
          )}
        </FormField>

      </div>

      <div className='grid grid-cols-2 md:gap-4'>
        <DateForm
          form={form}
          name='START DATE'
          date_label='START DATE'
          input_name='start_date.date'
          hour_name='start_date.hour'
          minute_name='start_date.minute'
          period_name='start_date.period'
        />

        <DateForm
          form={form}
          name='END DATE'
          date_label='END DATE'
          input_name='end_date.date'
          hour_name='end_date.hour'
          minute_name='end_date.minute'
          period_name='end_date.period'
        />
      </div>

      {/**Contact */}
      <div className='flex flex-col gap-5'>
        <SectionHeader name='CONTACT DETAILS' />

        <div className='w-full flex flex-col gap-6'>
          <FormField form={form} name='email' label='Email'>
            {(field) => (
              <Input
                placeholder='Enter email address.'
                className='bg-transparent'
                {...field}
                value={field.value == null ? '' : String(field.value)}
              />
            )}
          </FormField>

          <FormField form={form} name='website_url' label='Website URL'>
            {(field) => (
              <Input
                placeholder='Enter your website URL.'
                className='bg-transparent'
                {...field}
                value={field.value == null ? '' : String(field.value)}
              />
            )}
          </FormField>
        </div>
      </div>

      {/**Socials */}
      <div className='flex flex-col gap-5'>
        <SectionHeader name='SOCIALS' />

        <div className='grid md:grid-cols-2 gap-x-8 gap-y-5'>
          {[
            { name: 'socials.instagram' as const, label: 'Instagram' },
            { name: 'socials.x' as const, label: 'X' },
            { name: 'socials.tiktok' as const, label: 'Tiktok' },
            { name: 'socials.facebook' as const, label: 'Facebook' },
          ].map((item) => (
            <FormField key={item.name} form={form} name={item.name} label={item.label}>
              {(field) => (
                <Input
                  placeholder={`Enter your ${item.label} Link.`}
                  className='text-[#0033A0] bg-transparent'
                  {...field}
                  value={field.value == null ? '' : String(field.value)}
                />
              )}
            </FormField>
          ))}
        </div>
      </div>
    </FormBase>
  )
}

function SectionHeader({ name }: { name: string }) {
  return <p className='text-xl font-medium font-sf-pro-text text-black -mb-3'>{name}</p>
}

interface IEventDetailsTab {
  event: EventDetailData
  setActiveTab: (tab: string) => void
  handleBackClick?: () => void
}

interface IEventDetailsForm {
  form: UseFormReturn<EventDetailsSchema>
  onSubmit: (data: EventDetailsSchema) => void
}
