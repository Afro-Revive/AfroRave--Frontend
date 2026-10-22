import { useSendSupportMessage } from '@/hooks/use-support-mutations'
import { cn } from '@/lib/utils'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, type FieldError } from 'react-hook-form'
import { RiArrowDownSLine } from 'react-icons/ri'
import {
  SERVICE_CATEGORIES,
  defaultGetInTouchValues,
  getInTouchSchema,
  type GetInTouchValues,
} from '../get-in-touch-schema'

/** "Get in touch": what the inbox is for, and a form that sends to the support team. */
export default function GetInTouchSection() {
  const sendMessage = useSendSupportMessage()
  const form = useForm<GetInTouchValues>({
    resolver: zodResolver(getInTouchSchema),
    defaultValues: defaultGetInTouchValues,
  })
  const { errors } = form.formState

  function onSubmit(values: GetInTouchValues) {
    sendMessage.mutate(
      {
        name: `${values.firstName} ${values.lastName}`,
        email: values.email,
        category: values.category,
        subject: values.category,
        message: values.message,
      },
      // Cleared only once it's sent, so a failed send keeps what they wrote.
      { onSuccess: () => form.reset(defaultGetInTouchValues) },
    )
  }

  return (
    // flex-1: on a tall screen the black fills down to the footer.
    <section className='w-full flex-1 bg-[#0B0B0B] text-white'>
      <div className='w-full max-w-[1400px] mx-auto grid grid-cols-1 gap-12 px-6 pt-28 pb-16 md:grid-cols-[minmax(0,600px)_600px] md:justify-between md:gap-16  md:pt-[148px] md:pb-20'>
        <div className='flex flex-col gap-6 font-work-sans text-base md:text-xl'>
          <h1 className='text-2xl font-black uppercase'>Get in touch</h1>
          <p>Have a question, or request? Our inbox is open 24/7.</p>
          <p className='leading-snug'>
            Reach out for promotional opportunities, LED screen rentals, partnerships, general
            enquiries, or support with any issues you experience while using the platform. Our team
            is here to help you find the right solution and keep things moving.
          </p>
        </div>

        <form
          onSubmit={form.handleSubmit(onSubmit)}
          noValidate
          className='flex w-full flex-col items-center gap-6'>
          <Field label='First Name' error={errors.firstName}>
            {(id) => (
              <input
                id={id}
                autoComplete='given-name'
                className={INPUT_CLASS}
                {...form.register('firstName')}
              />
            )}
          </Field>

          <Field label='Last Name' error={errors.lastName}>
            {(id) => (
              <input
                id={id}
                autoComplete='family-name'
                className={INPUT_CLASS}
                {...form.register('lastName')}
              />
            )}
          </Field>

          <Field label='Email' error={errors.email}>
            {(id) => (
              <input
                id={id}
                type='email'
                autoComplete='email'
                className={INPUT_CLASS}
                {...form.register('email')}
              />
            )}
          </Field>

          <Field label='Service Category' error={errors.category}>
            {(id) => (
              <div className='relative'>
                <select
                  id={id}
                  className={cn(INPUT_CLASS, 'appearance-none pr-8 cursor-pointer')}
                  {...form.register('category')}>
                  <option value='' disabled hidden />
                  {SERVICE_CATEGORIES.map((category) => (
                    <option key={category} value={category} className='bg-black text-white'>
                      {category}
                    </option>
                  ))}
                </select>
                <RiArrowDownSLine
                  aria-hidden
                  className='pointer-events-none absolute right-0 top-1/2 size-5 -translate-y-1/2'
                />
              </div>
            )}
          </Field>

          <Field label='How can we help?' error={errors.message}>
            {(id) => (
              <textarea
                id={id}
                rows={9}
                className={cn(INPUT_CLASS, 'resize-none')}
                {...form.register('message')}
              />
            )}
          </Field>

          <button
            type='submit'
            disabled={sendMessage.isPending}
            className='h-10 min-w-[120px] rounded-full bg-[#1E1E1E] px-8 font-inter-tight text-xs font-bold uppercase text-white transition-colors hover:bg-[#2A2A2A] disabled:opacity-60'>
            {sendMessage.isPending ? 'Sending...' : 'Submit'}
          </button>
        </form>
      </div>
    </section>
  )
}

const INPUT_CLASS = 'w-full bg-transparent font-inter-tight text-base text-white outline-none'

/** A white-bordered box with its label inside at the top, and the error under it. */
function Field({
  label,
  error,
  children,
}: {
  label: string
  error?: FieldError
  children: (id: string) => React.ReactNode
}) {
  const id = `get-in-touch-${label.toLowerCase().replace(/[^a-z]+/g, '-')}`

  return (
    <div className='flex w-full flex-col gap-1'>
      <div
        className={cn(
          'flex flex-col gap-1 rounded-[5px] border px-3 pt-2.5 pb-2 transition-colors focus-within:ring-1 focus-within:ring-white/40',
          error ? 'border-red-400' : 'border-white',
        )}>
        <label htmlFor={id} className='font-inter-tight text-[12px]'>
          {label}
        </label>
        {children(id)}
      </div>

      {error?.message && (
        <p role='alert' className='font-inter-tight text-xs text-red-400'>
          {error.message}
        </p>
      )}
    </div>
  )
}
