import { FIELD_LABEL_ON_DARK_CLASS } from '@/components/shared/field-label'
import { FormBase, FormField } from '@/components/reusable'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { SupportSchema } from '@/schema/support-schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import type { z } from 'zod'

export default function SupportTab() {
  const form = useForm<z.infer<typeof SupportSchema>>({
    resolver: zodResolver(SupportSchema),
    defaultValues: {
      email: '',
      message: '',
    },
  })

  function onSubmit(values: z.infer<typeof SupportSchema>) {
    console.log(values)
    // TODO: Implement support form submission
  }

  return (
    <div className='w-full flex flex-col items-center gap-8 pb-[100px] px-4 md:px-0'>
      {/* Title */}
      <h2 className='text-white text-xl md:text-2xl font-inter-tight font-semibold'>
        CONTACT US
      </h2>

      <FormBase
        form={form}
        onSubmit={onSubmit}
        className='w-full flex flex-col items-center gap-6 font-inter-tight'>
        {/* Email Field */}
        <FormField
          form={form}
          name='email'
          className='w-full flex flex-col gap-1'
          label='Email'
          labelClassName={FIELD_LABEL_ON_DARK_CLASS}>
          <Input
            className='w-full h-14 bg-transparent border border-white/20 rounded-md px-4 text-white placeholder:text-white/40 focus:border-white/40'
          />
        </FormField>

        {/* Message Field */}
        <FormField
          name='message'
          form={form}
          className='w-full flex flex-col gap-1'
          label='How can we help?'
          labelClassName={FIELD_LABEL_ON_DARK_CLASS}>
          <Textarea
            className='w-full bg-transparent border border-white/20 text-white h-[291px] px-6 py-6 placeholder:text-white/40 rounded-md resize-none focus:border-white/40'
          />
        </FormField>

        {/* Submit Button */}
        <Button
          type='submit'
          className='w-[200px] h-12 bg-white hover:bg-white/90 text-deep-red font-inter-tight font-semibold rounded-lg transition-colors'>
          SUBMIT
        </Button>
      </FormBase>
    </div>
  )
}
