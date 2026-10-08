import { FormBase, FormField } from '@/components/reusable'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const addGuestSchema = z.object({
  name: z.string().min(2, { message: 'Name is too short.' }),
  email: z.string().email({ message: 'Enter a valid email address.' }),
})

export type AddGuestCardValues = z.infer<typeof addGuestSchema>

/** Creates a guest outright, as opposed to importing one already saved. */
export function AddGuestCard({
  onSubmit,
  isSubmitting = false,
}: {
  onSubmit: (values: AddGuestCardValues) => void
  isSubmitting?: boolean
}) {
  const form = useForm<AddGuestCardValues>({
    resolver: zodResolver(addGuestSchema),
    defaultValues: { name: '', email: '' },
  })

  function handleSubmit(values: AddGuestCardValues) {
    onSubmit(values)
    form.reset()
  }

  // Watched rather than validated: the button turns black as soon as both
  // fields have something in them, without waiting for a valid email.
  const [name, email] = form.watch(['name', 'email'])
  const isReady = Boolean(name?.trim() && email?.trim())

  return (
    <FormBase
      form={form}
      onSubmit={handleSubmit}
      className='w-full flex flex-col gap-4 rounded-xl bg-white p-5'>
      <div className='flex items-start justify-between gap-4'>
        <div className='flex flex-col gap-1'>
          <p className='font-inter-tight text-xl font-bold text-black'>Add Guest</p>
          <p className='font-inter-tight text-xs font-medium text-mid-dark-gray'>
            Saved to your guestlist and added to this event.
          </p>
        </div>

        <Button
          type='submit'
          disabled={isSubmitting}
          className={cn(
            'h-9 shrink-0 rounded-md px-4 font-inter-tight text-sm font-semibold text-white transition-colors',
            isReady
              ? 'bg-[#1A1A1A] hover:bg-[#1A1A1A]/90'
              : 'bg-mid-dark-gray hover:bg-mid-dark-gray/90',
          )}>
          {isSubmitting ? 'Adding...' : 'Add Guest'}
        </Button>
      </div>

      <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 w-full'>
        <FormField form={form} name='name' showMessage>
          {(field) => (
            <div className='flex flex-col gap-2 w-full'>
              <p className='font-inter-tight text-sm font-bold text-black'>Name</p>
              <Input
                placeholder='name of guest'
                className='h-11 rounded-lg w-full border border-[#595959]/50 font-inter-tight'
                {...field}
                value={field.value == null ? '' : String(field.value)}
              />
            </div>
          )}
        </FormField>

        <FormField form={form} name='email' showMessage>
          {(field) => (
            <div className='flex flex-col gap-2 w-full'>
              <p className='font-inter-tight text-sm font-bold text-black'>Email</p>
              <Input
                type='email'
                placeholder='guest@example.com'
                className='h-11 rounded-lg border border-[#595959]/50 font-inter-tight'
                {...field}
                value={field.value == null ? '' : String(field.value)}
              />
            </div>
          )}
        </FormField>
      </div>
    </FormBase>
  )
}
