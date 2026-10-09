import { FormBase, FormField } from '@/components/reusable'
import BaseModal from '@/components/reusable/base-modal'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import type { CategoryData } from '@/types/guestlist'
import { zodResolver } from '@hookform/resolvers/zod'
import { Plus, X } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const addGuestSchema = z.object({
  name: z.string().min(2, { message: 'Name is too short.' }),
  email: z.string().email({ message: 'Enter a valid email address.' }),
  // No .default([]) — it makes zod's input and output types diverge, which the
  // resolver rejects. defaultValues supplies the empty array instead.
  categoryIds: z.array(z.string()),
})

export type AddGuestValues = z.infer<typeof addGuestSchema>

export function AddGuestModal({
  open,
  onClose,
  onSubmit,
  onNewCategory,
  categories,
  isSubmitting = false,
}: {
  open: boolean
  onClose: () => void
  onSubmit: (values: AddGuestValues) => void
  /** Opens the create-category flow without losing what's been typed here. */
  onNewCategory: () => void
  categories: CategoryData[]
  isSubmitting?: boolean
}) {
  const form = useForm<AddGuestValues>({
    resolver: zodResolver(addGuestSchema),
    defaultValues: { name: '', email: '', categoryIds: [] },
  })

  function handleClose() {
    form.reset()
    onClose()
  }

  function handleSubmit(values: AddGuestValues) {
    onSubmit(values)
    form.reset()
  }

  return (
    <BaseModal
      open={open}
      onClose={handleClose}
      size='small'
      title='Add Guest'
      description='Saved guests can be added to any of your events.'
      titleClassName='sr-only'
      removeCancel
      className='sm:max-w-[560px]'>
      <div className='flex flex-col gap-6 px-6 py-6 md:px-8'>
        <div className='flex items-start justify-between gap-4'>
          <div className='flex flex-col gap-1'>
            <p className='font-inter-tight text-2xl font-bold text-black'>Add Guest</p>
            <p className='font-inter-tight text-sm text-mid-dark-gray'>
              Saved guests can be added to any of your events.
            </p>
          </div>

          <button
            type='button'
            onClick={handleClose}
            aria-label='Close'
            className='flex size-9 shrink-0 items-center justify-center rounded-full bg-black/5 text-black transition-colors hover:bg-black/10'>
            <X className='size-4' />
          </button>
        </div>

        <FormBase form={form} onSubmit={handleSubmit} className='flex w-full flex-col gap-5'>
          <FormField form={form} name='name' showMessage>
            {(field) => (
              <Field label='Full Name'>
                <Input
                  placeholder='Name Of Guest'
                  className='h-11 font-inter-tight border border-[#595959]/50 rounded-lg'
                  {...field}
                  value={field.value == null ? '' : String(field.value)}
                />
              </Field>
            )}
          </FormField>

          <FormField form={form} name='email' showMessage>
            {(field) => (
              <Field
                label='Email Address'
                hint='Each email can appear only once in your guestlist.'>
                <Input
                  type='email'
                  placeholder='guest@example.com'
                  className='h-11 font-inter-tight border border-[#595959]/50 rounded-lg'
                  {...field}
                  value={field.value == null ? '' : String(field.value)}
                />
              </Field>
            )}
          </FormField>

          <FormField form={form} name='categoryIds'>
            {(field) => {
              const selected = (field.value as string[] | undefined) ?? []

              const toggle = (categoryId: string) =>
                field.onChange(
                  selected.includes(categoryId)
                    ? selected.filter((id) => id !== categoryId)
                    : [...selected, categoryId],
                )

              return (
                <Field label='Categories' optional hint='Choose one or more categories.'>
                  <div className='flex flex-wrap items-center gap-2'>
                    {categories.map((category) => {
                      const isSelected = selected.includes(category.id)

                      return (
                        <button
                          key={category.id}
                          type='button'
                          aria-pressed={isSelected}
                          onClick={() => toggle(category.id)}
                          className={cn(
                            'rounded-full border px-4 py-1.5 font-inter-tight text-sm transition-colors',
                            isSelected
                              ? 'border-deep-red text-deep-red'
                              : 'border-black/20 text-black hover:border-black/40',
                          )}>
                          {category.name}
                        </button>
                      )
                    })}

                    <button
                      type='button'
                      onClick={onNewCategory}
                      className='flex items-center gap-1 rounded-full border border-dashed border-black/30 px-4 py-1.5 font-inter-tight text-sm text-black transition-colors hover:border-black/50'>
                      <Plus className='size-4' />
                      New Category
                    </button>
                  </div>
                </Field>
              )
            }}
          </FormField>

          <div className='flex items-center gap-4 pt-1'>
            <Button
              type='button'
              onClick={handleClose}
              className='h-10 flex-1 rounded-lg bg-[#1A1A1A] font-inter-tight text-sm font-semibold text-white hover:bg-[#1A1A1A]/90'>
              Cancel
            </Button>

            <Button
              type='submit'
              disabled={isSubmitting}
              className='h-10 flex-1 rounded-lg bg-[#00AD2E] font-inter-tight text-sm font-semibold text-white hover:bg-[#00AD2E]/90'>
              {isSubmitting ? 'Adding...' : 'Add Guest'}
            </Button>
          </div>
        </FormBase>
      </div>
    </BaseModal>
  )
}

function Field({
  label,
  optional = false,
  hint,
  children,
}: {
  label: string
  optional?: boolean
  hint?: string
  children: React.ReactNode
}) {
  return (
    <div className='flex w-full flex-col gap-2'>
      <p className='font-inter-tight text-sm font-bold text-black'>
        {label}
        {optional && <span className='font-normal text-mid-dark-gray'> (optional)</span>}
      </p>

      {children}

      {hint && <p className='font-inter-tight text-xs font-medium text-mid-dark-gray'>{hint}</p>}
    </div>
  )
}
