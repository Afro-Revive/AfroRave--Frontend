import { DateForm } from '@/components/shared/date-form'
import { FormFieldWithCounter } from '@/components/shared/field-with-counter'
import { FormField } from '@/components/reusable'
import { BaseBooleanCheckbox } from '@/components/reusable/base-boolean-checkbox'
import { BaseCheckbox } from '@/components/reusable/base-checkbox'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { OnlyShowIf } from '@/lib/environment'
import { ChevronDown } from 'lucide-react'
import { useState } from 'react'
import type { UseFormReturn } from 'react-hook-form'
import type { z } from 'zod'
import { PriceField } from '../../component/price-field'
import { SelectField } from '../../component/select-field'
import type { unifiedTicketFormSchema } from '../../schemas/ticket-schema'
import { Label } from '@radix-ui/react-dropdown-menu'

export function TicketForm({
  form,
  type,
  onSubmit,
  isLoading,
  isEditMode = false,
  onCancel,
}: ITicketFormProps) {
  const [openAdvancedOptions, setOpenAdvancedOptions] = useState(false)
  const availabilityValue = form.watch('ticket.quantity.availability')

  return (
    <>
      <div className='flex flex-col gap-3'>
        <FormFieldWithCounter
          name='TICKET NAME'
          field_name='ticket.ticketName'
          form={form}
          className='font-normal'
          maxLength={65}>
          {(field) => (
            <Input
              placeholder='Enter name'
              className='border-mid-dark-gray/50'
              {...field}
              value={field.value == null ? '' : String(field.value)}
            />
          )}
        </FormFieldWithCounter>

        <FormField form={form} name='ticket.type'>
          {(field) => (
            <BaseCheckbox
              data={{
                items: [
                  { label: 'PAID', id: 'paid' },
                  { label: 'FREE', id: 'free' },
                ],
              }}
              {...field}
              labelClassName='text-xs'
              descriptionClassName='max-w-[255px]'
            />
          )}
        </FormField>

        <FormField form={form} name='ticket.invite_only'>
          {(field) => (
            <BaseBooleanCheckbox
              data={{ items: { label: 'INVITE ONLY', id: 'invite-only' } }}
              showCheckbox={false}
              labelClassName='text-[12px] flex justify-center rounded-[5px] opacity-70 bg-white px-4 py-2 shadow-[0px_2px_10px_2px_#0000001A]'
              checkedClassName='border border-red-800 bg-blue-900'
              {...field}
            />
          )}
        </FormField>
      </div>

      <div className='grid grid-cols-1 sm:grid-cols-2 gap-8'>
        <SelectField
          form={form}
          name='ticket.salesType'
          label='SALES TYPE'
          data={salesTypeItems}
          placeholder='CHOOSE YOUR SALES CHANNEL'
          triggerClassName='w-full'
        />

        <TicketType type={type} />
      </div>

      <div className='grid grid-cols-1 sm:grid-cols-2 gap-8 items-end'>
        <div className='flex items-end gap-3'>
          <SelectField
            form={form}
            name='ticket.quantity.availability'
            label='QUANTITY'
            className='max-w-fit'
            data={availability}
            placeholder='Select availability.'
          />

          {availabilityValue === 'limited' && (
            <FormField form={form} name='ticket.quantity.amount' className='mb-2'>
              {(field) => (
                <div className='flex flex-col gap-3'>
                  <Label className='text-sm text-black leading-none font-medium font-sf-pro-text'>
                    TICKET QUANTITY
                  </Label>
                  <Input
                  className='w-full rounded-sm border border-mid-dark-gray/50 text-sm font-sf-pro-display'
                  type='number'
                  {...field}
                  value={field.value == null ? '' : String(field.value)}
                />
                </div>
              )}
            </FormField>
          )}
        </div>

        <div className='w-full mb-2'>
          <PriceField form={form} name='ticket.price' ticketTypeName='ticket.type' />
        </div>
      </div>

      <SelectField
        form={form}
        name='ticket.purchase_limit'
        label='PURCHASE LIMIT'
        className='w-full'
        data={purchaseLimitOptions}
        placeholder='SELECT'
        triggerClassName='w-full'
      />

      <OnlyShowIf condition={type === 'group_ticket'}>
        <SelectField
          form={form}
          name='ticket.group_size'
          label='GROUP SIZE'
          className='w-full'
          data={groupSizeOptions}
          placeholder='SELECT'
          triggerClassName='w-full'
        />
      </OnlyShowIf>

      <OnlyShowIf condition={type === 'multi_day'}>
        <SelectField
          form={form}
          name='ticket.days_valid'
          label='DAYS VALID'
          className='w-full'
          data={daysValidOptions}
          placeholder='SELECT'
          triggerClassName='w-full'
        />
      </OnlyShowIf>

      <FormFieldWithCounter
        name='Description'
        field_name='ticket.description'
        form={form}
        maxLength={450}>
        {(field) => (
          <Textarea
            placeholder={`KEEP DESCRIPTIONS SHORT BUT EXCITING.
BULLET POINTS WORK BETTER THAN LONG PARAGRAPHS.
ALWAYS INCLUDE DATE AND VENUE SOMEWHERE INSIDE THE DESCRIPTION FOR CLARITY.
DESCRIBE WHAT THIS TICKET INCLUDES.`}
            className='w-full h-[272px] text-black bg-white px-3 py-[11px] rounded-[4px] border border-mid-dark-gray/50 text-sm font-sf-pro-display'
            {...field}
            value={field.value == null ? '' : String(field.value)}
          />
        )}
      </FormFieldWithCounter>

      <div className='w-full flex flex-col gap-5'>
        <Button
          variant='ghost'
          type='button'
          onClick={() => setOpenAdvancedOptions(!openAdvancedOptions)}
          className='w-fit flex items-center gap-1 !px-1 text-charcoal hover:bg-transparent'>
          <ChevronDown width={28} height={17} />
          <span className='font-bold font-sf-pro-display leading-[100%] uppercase'>
            Advanced Options
          </span>
        </Button>

        <OnlyShowIf condition={openAdvancedOptions}>
          <div className='flex flex-col gap-[18px]'>
            <p className='uppercase font-bold font-sf-pro-display text-black'>
              When Should Ticket Sales Start?
            </p>

            <FormField form={form} name='whenToStart'>
              {(field) => (
                <BaseCheckbox
                  orientation='vertical'
                  data={whenToStartOptions[0]}
                  {...field}
                  labelClassName='font-sf-pro-display font-normal text-[14px] uppercase text-[#1E1E1E] leading-none'
                  descriptionClassName='font-sf-pro-display font-normal text-[13px] lowercase text-[#1E1E1E] leading-snug mt-0.5'
                />
              )}
            </FormField>

            <FormField form={form} name='allow_ticket_resell'>
              {(field) => (
                <BaseBooleanCheckbox
                  data={{ items: { label: 'ALLOW TICKET RESELL', id: 'allow-ticket-resell' } }}
                  showCheckbox={true}
                  labelClassName='font-sf-pro-display font-normal text-[14px] uppercase text-[#1E1E1E] leading-none'
                  checkedClassName='border border-red-800'
                  {...field}
                />
              )}
            </FormField>
            <p className='font-sf-pro-display font-normal text-[13px] lowercase text-[#1E1E1E] leading-snug -mt-3'>
              This option allows attendees to resell their tickets to other fans.
            </p>
          </div>
          <OnlyShowIf condition={form.getValues('whenToStart') === 'at-a-scheduled-date'}>
            <DateForm
              form={form}
              name='START DATE'
              input_name='scheduledDate.date'
              hour_name='scheduledDate.hour'
              minute_name='scheduledDate.minute'
              period_name='scheduledDate.period'
              flow='row'
            />
          </OnlyShowIf>
        </OnlyShowIf>
      </div>

      <div className='flex gap-3'>
        <Button
          type='button'
          onClick={onCancel}
          className='w-[155px] h-8 rounded-full text-xs font-semibold font-sf-pro-text text-white bg-deep-red hover:bg-deep-red/90 uppercase'>
          REMOVE TICKET
        </Button>

        {onSubmit && (
          <Button
            type='button'
            onClick={onSubmit}
            className='w-[155px] h-8 rounded-full text-xs font-semibold font-sf-pro-text text-white bg-black hover:bg-black/90 uppercase'>
            {isLoading
              ? isEditMode
                ? 'UPDATING...'
                : 'CREATING...'
              : isEditMode
                ? 'UPDATE TICKET'
                : 'CREATE TICKET'}
          </Button>
        )}
      </div>
    </>
  )
}

function TicketType({ type }: { type: ITicketFormProps['type'] }) {
  const labels = {
    single_ticket: 'SINGLE TICKET',
    group_ticket: 'GROUP TICKET',
    multi_day: 'MULTI DAY',
  } as const

  return (
    <div className='w-full flex flex-col gap-3'>
      <p className='text-sm text-charcoal leading-[100%] font-sf-pro-text'>TICKET TYPE</p>

      <p className='w-full h-9 flex items-center justify-center text-sm font-sf-pro-display leading-[100%] text-[#686868] rounded-[5px] border border-mid-dark-gray/50 bg-[#D9D9D9]'>
        {labels[type]}
      </p>
    </div>
  )
}

const salesTypeItems: { value: string; label: string }[] = [
  { value: 'online', label: 'Online' },
  { value: 'door', label: 'Door' },
]

const availability: { value: string; label: string }[] = [
  { value: 'limited', label: 'Limited' },
  { value: 'unlimited', label: 'Unlimited' },
]

const purchaseLimitOptions: { value: string; label: string }[] = [
  { value: '1', label: '1' },
  { value: '2', label: '2' },
  { value: '3', label: '3' },
  { value: '4', label: '4' },
  { value: '5', label: '5' },
  { value: '10', label: '10' },
  { value: '20', label: '20' },
  { value: '50', label: '50' },
]

const groupSizeOptions: { value: string; label: string }[] = [
  { value: '2', label: '2' },
  { value: '3', label: '3' },
  { value: '4', label: '4' },
  { value: '5', label: '5' },
  { value: '6', label: '6' },
  { value: '8', label: '8' },
  { value: '10', label: '10' },
]

const daysValidOptions: { value: string; label: string }[] = [
  { value: '1', label: '1 Day' },
  { value: '2', label: '2 Days' },
  { value: '3', label: '3 Days' },
  { value: '5', label: '5 Days' },
  { value: '7', label: '1 Week' },
  { value: '14', label: '2 Weeks' },
  { value: '30', label: '1 Month' },
]

const whenToStartOptions = [
  {
    items: [
      {
        label: 'START SALES IMMEDIATELY',
        id: 'immediately',
        description: 'Tickets go on sale as soon as your event is live',
      },
      {
        label: 'SCHEDULE SALES START',
        id: 'at-a-scheduled-date',
        description: 'Pick a date/time to open sales after your event page is live',
      },
    ],
  },
]

interface ITicketFormProps {
  form: UseFormReturn<z.infer<typeof unifiedTicketFormSchema>>
  type: 'single_ticket' | 'group_ticket' | 'multi_day'
  onSubmit?: () => void
  isLoading?: boolean
  isEditMode?: boolean
  onCancel?: () => void
}
