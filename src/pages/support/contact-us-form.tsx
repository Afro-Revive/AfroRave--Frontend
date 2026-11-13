import { FormBase, FormField } from '@/components/reusable'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useSendSupportMessage } from '@/hooks/use-support-mutations'
import { cn } from '@/lib/utils'
import { useAfroStore } from '@/stores'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
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

type SupportContactValues = z.infer<typeof supportContactSchema>

/** What the support team sees it's about; the creators' Contact Us has the same category. */
const FAN_SUPPORT_CATEGORY = 'Platform support'

// Matches the settings page's fields, which sit on the same radial backdrop.
const fieldClass = 'w-full bg-transparent border border-white rounded-sm px-3 h-fit'

const labelClass = 'text-white pt-3 font-inter-tight md:text-sm text-xs text-white'

export default function ContactUsForm() {
  const user = useAfroStore((state) => state.user)
  const sendMessage = useSendSupportMessage()

  // A signed-in fan's email is filled in; the page is open to everyone, as old
  // /fans/support links land here.
  const defaultValues: SupportContactValues = { email: user?.email ?? '', message: '' }

  const form = useForm<SupportContactValues>({
    resolver: zodResolver(supportContactSchema),
    defaultValues,
  })

  function onSubmit(values: SupportContactValues) {
    const name = [user?.profile?.firstName, user?.profile?.lastName].filter(Boolean).join(' ')

    sendMessage.mutate(
      {
        // The form asks for no name: the profile's, or the email for a visitor.
        name: name || values.email,
        email: values.email,
        category: FAN_SUPPORT_CATEGORY,
        subject: FAN_SUPPORT_CATEGORY,
        message: values.message,
        phoneNumber: user?.profile?.phoneNumber || undefined,
      },
      // Cleared only once it's sent, so a failed send keeps what they wrote.
      { onSuccess: () => form.reset(defaultValues) },
    )
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
            autoComplete='email'
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
        disabled={sendMessage.isPending}
        className='w-full h-11 bg-white text-deep-red rounded-md font-inter-tight text-sm font-semibold disabled:opacity-60'>
        {sendMessage.isPending ? 'Sending...' : 'Submit'}
      </Button>
    </FormBase>
  )
}
