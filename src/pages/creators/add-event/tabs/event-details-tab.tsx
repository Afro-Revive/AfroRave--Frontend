import { CustomFormField as FormField, CustomInput as Input } from '@/components/shared/custom-form'
import { DateForm } from '@/components/shared/date-form'
import { FormFieldWithAbsoluteText } from '@/components/shared/field-with-absolute-text'
import { FormFieldWithCounter } from '@/components/shared/field-with-counter'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { useCreateEvent } from '@/hooks/use-event-mutations'
import { OnlyShowIf } from '@/lib/environment'
import { transformEventDetailsToCreateRequest } from '@/lib/event-transforms'
import { FakeDataGenerator } from '@/lib/fake-data-generator'
import { frequencyOptions } from '@/pages/creators/add-event/constant'
import { africanTimezones, ageRatings, eventCategories } from '@/pages/creators/edit-event/constant'
import { EditEventDetailsSchema, type EventDetailsSchema } from '@/schema/edit-event-details'
import { useEventStore } from '@/stores'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { SelectField } from '../component/select-field'
import { ContinueButton } from '../component/continue-button'
import { TabContainer } from '../component/tab-ctn'
import { cn } from '@/lib/utils'

interface IEventDetailsTab {
  setStep: (step: number) => void
  setActiveTabState: (tab: string) => void
}

export default function EventDetailsTab({ setStep, setActiveTabState }: IEventDetailsTab) {
  const [eventType, setEventType] = useState<'standalone' | 'season'>('standalone')

  const { setEventId, setEventData } = useEventStore()

  const createEventMutation = useCreateEvent()

  const form = useForm<EventDetailsSchema>({
    resolver: zodResolver(EditEventDetailsSchema),
    defaultValues: {
      name: '',
      age_rating: 'PG',
      category: 'festival',
      venue: '',
      description: '',
      terms_refund_policy: '',
      event_type: 'standalone',
      occurrence: 1,
      start_date: {
        date: new Date(),
        hour: '12',
        minute: '00',
        period: 'AM',
      },
      end_date: {
        date: new Date(),
        hour: '12',
        minute: '00',
        period: 'AM',
      },
      email: '',
      website_url: '',
      socials: {
        instagram: '',
        tiktok: '',
        x: '',
      },
    },
  })

  // Update form values when event type changes
  useEffect(() => {
    setStep(1)

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
    console.log(eventData)

    await createEventMutation.mutateAsync(eventData, {
      onSuccess: (data) => {
        setEventId(data.eventId)
        setActiveTabState('tickets')
      },
    })

    setEventData(eventData)
  }

  return (
    <TabContainer<EventDetailsSchema>
      heading='EVENT DETAILS'
      className='max-w-[560px] w-full flex flex-col gap-8 space-y-0'
      form={form}
      onSubmit={onSubmit}>
      <FakeDataGenerator
        type='eventDetails'
        onGenerate={form.reset}
        buttonText='🎲 Fill with sample data'
        variant='outline'
        className='mb-4'
      />
      <FormFieldWithCounter
        name='EVENT NAME'
        field_name='name'
        form={form}
        className='font-normal'
        maxLength={85}>
        {(field) => (
          <Input
            placeholder='Enter event name.'
            className='uppercase'
            {...field}
            value={field.value == null ? '' : String(field.value)}
          />
        )}
      </FormFieldWithCounter>

      <div className='grid grid-cols-1 sm:grid-cols-2 gap-8'>
        <SelectField
          form={form}
          name='age_rating'
          label='AGE RATING'
          placeholder="WHAT'S THE AGE RATING OF YOUR EVENT?"
          data={ageRatings}
          triggerClassName='w-full'
        />

        <SelectField
          form={form}
          name='category'
          label='EVENT CATEGORY'
          data={eventCategories}
          placeholder='CHOOSE AN APPLICABLE CATEGORY'
          triggerClassName='w-full'
        />
      </div>

      <FormField form={form} name='venue' label='Venue'>
        {(field) => (
          <Input
            placeholder='Enter event venue.'
            className='uppercase'
            {...field}
            value={field.value == null ? '' : String(field.value)}
          />
        )}
      </FormField>

      <FormFieldWithCounter name='DESCRIPTION' field_name='description' form={form} maxLength={950}>
        {(field) => (
          <Textarea
            placeholder='Enter event description.'
            className='w-full h-[272px] text-black bg-white px-3 py-[11px] rounded-[4px] border border-mid-dark-gray/50 text-sm font-sf-pro-display'
            {...field}
            value={field.value == null ? '' : String(field.value)}
          />
        )}
      </FormFieldWithCounter>

      <FormFieldWithCounter
        name='TERMS(REFUND POLICY)'
        field_name='terms_refund_policy'
        form={form}
        maxLength={250}>
        {(field) => (
          <Textarea
            placeholder='Enter your terms and refund policy.'
            className='w-full h-[272px] text-black bg-white px-3 py-[11px] rounded-[4px] border border-mid-dark-gray/50 text-sm font-sf-pro-display'
            {...field}
            value={field.value == null ? '' : String(field.value)}
          />
        )}
      </FormFieldWithCounter>

      <FormFieldWithAbsoluteText
        form={form}
        name='custom_url'
        label='CUSTOM URL'
        text='afrorevive/events/'>
        {(field) => (
          <Input
            placeholder='Enter custom URL.'
            className='border-none h-9 text-xs'
            {...field}
            value={field.value == null ? '' : String(field.value)}
          />
        )}
      </FormFieldWithAbsoluteText>

      <div className='w-full flex flex-col gap-5'>
        <div className='flex flex-col gap-3'>
          <p className='text-xl font-bold text-black font-sf-pro-display'>EVENT DATE</p>
          <p className='font-sf-pro-text text-xs font-light text-black'>
            Select the date of your event
          </p>
          <div className='flex gap-2'>
            {[
              { name: 'Standalone', action: () => setEventType('standalone') },
              { name: 'Season', action: () => setEventType('season') },
            ].map((item) => {
              const isActive = eventType === item.name.toLocaleLowerCase()

              return (
                <Button
                  key={item.name}
                  variant={eventType === item.name.toLocaleLowerCase() ? 'destructive' : 'default'}
                  type='button'
                  onClick={item.action}
                  className={cn('w-[146px] h-10 rounded-[4px] text-sm font-sf-pro-text', {
                    'opacity-70 bg-[#ACACAC] text-charcoal hover:bg-[#ACACAC] hover:opacity-80':
                      !isActive,
                  })}>
                  {item.name}
                </Button>
              )
            })}
          </div>
        </div>

        <SelectField
          form={form}
          name='time_zone'
          label='SELECT TIME ZONE'
          data={africanTimezones}
          placeholder='Select a time zone.'
          triggerClassName='w-full'
        />

        <OnlyShowIf condition={eventType === 'season'}>
          <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
            <SelectField
              form={form}
              name='frequency'
              label='Frequency'
              data={frequencyOptions}
              placeholder='Select frequency.'
              triggerClassName='w-full'
            />

            <FormField form={form} name='occurrence' label='Occurrence'>
              {(field) => (
                <Input
                  type='number'
                  max={365}
                  min={1}
                  placeholder='Enter number of occurrences.'
                  className='h-9'
                  {...field}
                  value={
                    field.value === undefined || field.value === null ? '' : String(field.value)
                  }
                  onChange={field.onChange}
                />
              )}
            </FormField>
          </div>
        </OnlyShowIf>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-5'>
        <DateForm
          form={form}
          name='START DATE'
          input_name='start_date.date'
          hour_name='start_date.hour'
          minute_name='start_date.minute'
          period_name='start_date.period'
          date_label='START DATE'
          time_label='START TIME'
        />

        <DateForm
          form={form}
          name='END DATE'
          input_name='end_date.date'
          hour_name='end_date.hour'
          minute_name='end_date.minute'
          period_name='end_date.period'
          date_label='END DATE'
          time_label='END TIME'
        />
      </div>

      <div className='w-full flex flex-col gap-7'>
        <div className='min-w-full flex flex-col gap-5'>
          <p className='uppercase text-xl text-black font-bold font-sf-pro-display'>
            CONTACT DETAILS
          </p>

          <div className='w-full flex flex-col gap-6'>
            <FormField form={form} name='email' label='Email'>
              {(field) => (
                <Input
                  placeholder='Enter email address.'
                  {...field}
                  value={field.value == null ? '' : String(field.value)}
                />
              )}
            </FormField>

            <FormField form={form} name='website_url' label='Website URL'>
              {(field) => (
                <Input
                  placeholder='Enter your website URL.'
                  {...field}
                  value={field.value == null ? '' : String(field.value)}
                />
              )}
            </FormField>
          </div>
        </div>

        <div className='flex flex-col gap-5'>
          <p className='uppercase text-xl text-black font-bold font-sf-pro-display'>SOCIALS</p>

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
                    className='text-[#0033A0]'
                    {...field}
                    value={field.value == null ? '' : String(field.value)}
                  />
                )}
              </FormField>
            ))}
          </div>
        </div>
      </div>

      <ContinueButton isLoading={createEventMutation.isPending} />
    </TabContainer>
  )
}
