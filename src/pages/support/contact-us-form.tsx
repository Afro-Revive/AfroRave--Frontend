import { FormBase, FormField } from '@/components/reusable'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

const supportContactSchema = z.object({
  email: z
    .string()
    .nonempty({ message: 'Email is required' })
    .email({ message: 'Invalid email address' }),
  message: z
    .string()
    .nonempty({ message: 'Please tell us how we can help' })
    .min(10, { message: 'Message must be at least 10 characters' })
    .max(1000, { message: 'Message must be at most 1000 characters' }),
})

const defaultSupportContactValue: z.infer<typeof supportContactSchema> = {
  email: '',
  message: '',
}

// Matches the settings page's fields, which sit on the same radial backdrop.
const fieldClass = 'w-full bg-transparent border border-white rounded-sm px-3 h-fit'

const labelClass = 'text-white pt-3 font-sf-pro-display md:text-sm text-xs text-white'

export default function ContactUsForm() {
  const form = useForm<z.infer<typeof supportContactSchema>>({
    resolver: zodResolver(supportContactSchema),
    defaultValues: defaultSupportContactValue,
  })

  // TODO: there is no support endpoint yet, so the message is acknowledged but
  function onSubmit() {
    toast.success('Thanks — we will get back to you shortly.')
    form.reset()
  }

  return (
    <FormBase form={form} onSubmit={onSubmit} className='w-full flex flex-col gap-8'>
      <p className='font-inter-tight text-2xl font-bold text-white'>Contact Us</p>

      <div className='w-full flex flex-col gap-6'>
        <FormField
          form={form}
          name='email'
          label='Email'
          showMessage
          labelClassName={labelClass}
          className={fieldClass}>
          <Input
            type='email'
            className='w-full px-0 py-5 border-none text-white placeholder:text-white/40'
          />
        </FormField>
        <FormField
          form={form}
          name='message'
          label='How Can We Help?'
          showMessage
          labelClassName={labelClass}
          className={cn(fieldClass, 'pb-5')}>
          <Textarea
            className='h-[240px] w-full px-0 bg-transparent border-none resize-none text-white placeholder:text-white/40 focus-visible:ring-0'
          />
        </FormField>
      </div>

      <Button
        type='submit'
        variant='default'
        className='w-full h-11 bg-white text-deep-red rounded-md font-inter-tight text-sm font-semibold'>
        Submit
      </Button>
    </FormBase>
  )
}
