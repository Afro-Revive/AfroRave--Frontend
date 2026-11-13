import { FormSectionHeading } from '@/components/shared/form-section-heading'
import { CustomInput as Input } from '@/components/shared/custom-form'
import { FormFieldWithCounter } from '@/components/shared/field-with-counter'
import { FormBase, FormField } from '@/components/reusable'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useFormState } from 'react-hook-form'
import type { z } from 'zod'
import { confirmationMailSchema } from '../../schemas/ticket-schema'

export function ConfirmationMailForm() {
  const form = useForm<z.infer<typeof confirmationMailSchema>>({
    resolver: zodResolver(confirmationMailSchema),
  })

  const { errors } = useFormState({ control: form.control, name: 'email' })

  function onSubmit(values: z.infer<typeof confirmationMailSchema>) {
    console.log(values)
  }

  return (
    <FormBase
      form={form}
      onSubmit={onSubmit}
      className='max-w-[560px] w-full self-center flex flex-col space-y-0 gap-4'>
      <div className='flex flex-col gap-1 font-inter-tight text-black'>
        <div className='flex items-center justify-between'>
          <FormSectionHeading as="p">CUSTOMIZE YOUR CONFIRMATION EMAIL</FormSectionHeading>
          <p className='text-xs leading-[100%] font-inter-tight text-mid-dark-gray'>(OPTIONAL)</p>
        </div>
        <p className='text-sm font-light text-charcoal leading-[100%]'>
          Add a personal touch to the confirmation email your ticket buyers receive after purchase
        </p>
      </div>

      <div className='flex flex-col gap-4'>
        <FormFieldWithCounter
          name='confirmation email'
          field_name='confirmationEmail'
          form={form}
          maxLength={250}
          description='optional'>
          {(field) => (
            <Textarea
              placeholder='NICE ONE! YOU’RE LOCKED IN'
              className='w-full h-[272px] text-black bg-white px-3 py-[11px] rounded-[4px] border border-mid-dark-gray/50 text-sm font-inter-tight'
              {...field}
              value={field.value == null ? '' : String(field.value)}
            />
          )}
        </FormFieldWithCounter>
        <div className='w-full flex flex-col gap-4'>
          <div className='flex items-end gap-2 md:gap-6'>
            <FormField form={form} name='email' label='Email' className='w-full'>
              {(field) => (
                <Input
                  {...field}
                  autoComplete='off'
                  style={{ backgroundColor: 'white', color: 'black' }}
                  className='!bg-white !text-black placeholder:text-mid-dark-gray border-mid-dark-gray/50'
                  value={field.value == null ? '' : String(field.value)}
                />
              )}
            </FormField>

            <Button className='w-[100px] md:w-[160px] h-10 bg-black hover:bg-black/90 rounded-[4px]'>
              SEND TEST
            </Button>
          </div>
          <p className='text-deep-red text-sm leading-[100%] font-inter-tight'>
            {errors.email?.message}
          </p>
        </div>
      </div>
    </FormBase>
  )
}
