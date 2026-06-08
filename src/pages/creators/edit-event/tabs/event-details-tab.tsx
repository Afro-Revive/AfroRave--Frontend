import { CustomFormField as FormField, CustomInput as Input } from '@/components/shared/custom-form'
import { DateForm } from '@/components/shared/date-form'
import { FormFieldWithAbsoluteText } from '@/components/shared/field-with-absolute-text'
import { FormFieldWithCounter } from '@/components/shared/field-with-counter'
import { FormBase } from '@/components/reusable'
import { BaseSelect } from '@/components/reusable'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { useUpdateEvent } from '@/hooks/use-event-mutations'
import { OnlyShowIf } from '@/lib/environment'
import { EditEventDetailsSchema, type EventDetailsSchema } from '@/schema/edit-event-details'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useState } from 'react'
import { useForm, type UseFormReturn } from 'react-hook-form'
import { africanTimezones, ageRatings, eventCategories, frequencyOptions } from '../constant'
import type { EventDetailData } from '@/types'
import { transformEventToSchema } from '../helper'
import { SelectField } from '../../add-event/component/select-field'
import { transformEventDetailsToCreateRequest } from '@/lib/event-transforms'
import { TabChildrenContainer } from '../component/edit-tab-children-container'

export default function EventDetailsTab({ event, setActiveTab, handleBackClick }: IEventDetailsTab) {
  const eventDate = event.eventDate
  const eventId = event.eventId

  const [eventType, setEventType] = useState<'standalone' | 'season'>(
    eventDate.occurance === 0 || eventDate.occurance === null || eventDate.frequency === ''
      ? 'standalone'
      : 'season',
  )

  const updateEventMutation = useUpdateEvent()

  const { isPending, mutate } = updateEventMutation

  const form = useForm<EventDetailsSchema>({
    resolver: zodResolver(EditEventDetailsSchema),
    defaultValues: transformEventToSchema(event, eventType),
  })

  // const { isDirty } = form.formState

  useEffect(() => {
    form.setValue('event_type', eventType)
    if (eventType === 'standalone') {
      form.setValue('frequency', undefined)
      form.setValue('occurrence', undefined)
    } else {
      form.setValue('frequency', 'Weekly')
      form.setValue('occurrence', 1)
    }
  }, [eventType, form])

  async function onSubmit(values: EventDetailsSchema) {
    const eventData = transformEventDetailsToCreateRequest(values)

    await mutate(
      { eventId, data: eventData },
      {
        onSuccess: () => {
          setActiveTab('tickets')
        },
      },
    )
  }

  return (
    <TabChildrenContainer
      handleSaveEvent={() => form.handleSubmit(onSubmit)()}
      handleBackClick={handleBackClick}
      isLoading={isPending}
      currentTab='event-details'
      onChange={setActiveTab}>
      <div className='w-full flex flex-col items-center p-0 md:p-14 gap-2.5'>
        <div className='flex flex-col gap-4 w-full md:min-w-[560px] max-w-[800px]'>
          <p className='uppercase font-sf-pro-display font-black text-black text-xl'>
            Event Details
          </p>

          <EventDetailsForm
            form={form}
            onSubmit={onSubmit}
            setEventType={setEventType}
            eventType={eventType}
          />
        </div>
      </div>
    </TabChildrenContainer>
  )
}

function EventDetailsForm({ form, onSubmit, setEventType, eventType }: IEventDetailsForm) {
  const selectClassname =
    '!bg-transparent w-full !h-10 text-black bg-white px-3 py-[11px] rounded-[4px] border border-mid-dark-gray/50 text-sm font-sf-pro-display'

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

      <FormFieldWithCounter name='DESCRIPTION' field_name='description' form={form} maxLength={950}>
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
          <div className='flex gap-2'>
            <Button
              variant={eventType === 'standalone' ? 'destructive' : 'outline'}
              type='button'
              onClick={() => setEventType('standalone')}
              className='w-[160px] h-10 rounded-4px text-sm font-sf-pro-text'>
              Standalone
            </Button>
            <Button
              variant={eventType === 'season' ? 'destructive' : 'outline'}
              type='button'
              onClick={() => setEventType('season')}
              className='w-[160px] h-10 rounded-4px text-sm font-sf-pro-text'>
              Season
            </Button>
          </div>
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

        <OnlyShowIf condition={eventType === 'season'}>
          <div className='grid grid-cols-2 gap-4'>
            <FormField form={form} name='frequency' label='Frequency'>
              {(field) => (
                <BaseSelect
                  type='auth'
                  items={frequencyOptions}
                  placeholder='Select frequency.'
                  triggerClassName={selectClassname}
                  value={field.value as string}
                  onChange={field.onChange}
                />
              )}
            </FormField>

            <FormField form={form} name='occurrence' label='Occurrence'>
              {(field) => (
                <Input
                  type='number'
                  placeholder='Enter number of occurrences.'
                  className='bg-transparent'
                  {...field}
                  value={field.value == null ? '' : String(field.value)}
                  onChange={(e) => {
                    const value = Number.parseInt(e.target.value, 10)
                    if (value >= 1 && value <= 365) {
                      field.onChange(value)
                    }
                  }}
                />
              )}
            </FormField>
          </div>
        </OnlyShowIf>
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
  setEventType: (type: 'season' | 'standalone') => void
  eventType: 'standalone' | 'season'
}
