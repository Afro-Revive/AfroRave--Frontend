import { FormBase, FormField } from '@/components/reusable'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import type { CategoryData } from '@/types/guestlist'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const newInviteSchema = z.object({
  name: z.string().min(2, { message: 'Name is too short.' }),
  email: z.string().email({ message: 'Enter a valid email address.' }),
  // No .default([]) — it splits zod's input and output types, which the
  // resolver rejects. defaultValues supplies the empty array instead.
  categoryIds: z.array(z.string()),
})

export type NewInviteValues = z.infer<typeof newInviteSchema>

/**
 * Saves someone new to the guestlist and invites them. The modal's footer
 * button submits it, so the form carries an id for that button to point at.
 */
export function InviteNewGuestTab({
  formId,
  categories,
  onSubmit,
}: {
  formId: string
  categories: CategoryData[]
  onSubmit: (values: NewInviteValues) => void
}) {
  const form = useForm<NewInviteValues>({
    resolver: zodResolver(newInviteSchema),
    defaultValues: { name: '', email: '', categoryIds: [] },
  })

  return (
    <FormBase form={form} onSubmit={onSubmit} id={formId} className='flex w-full flex-col gap-4'>
      {/* w-full on each wrapper: FormField's item is items-start, which would
          otherwise shrink every field to the width of its content. */}
      <FormField form={form} name='name' showMessage className='w-full'>
        {(field) => (
          <div className='flex w-full flex-col gap-2'>
            <p className='font-inter-tight text-sm font-bold text-black'>Full Name</p>
            <Input
              autoFocus
              placeholder='name of guest'
              className='h-11 w-full rounded-lg border border-[#595959]/50 font-inter-tight'
              {...field}
              value={field.value == null ? '' : String(field.value)}
            />
          </div>
        )}
      </FormField>

      <FormField form={form} name='email' showMessage className='w-full'>
        {(field) => (
          <div className='flex w-full flex-col gap-2'>
            <p className='font-inter-tight text-sm font-bold text-black'>Email Address</p>
            <Input
              type='email'
              placeholder='guest@example.com'
              className='h-11 w-full rounded-lg border border-[#595959]/50 font-inter-tight'
              {...field}
              value={field.value == null ? '' : String(field.value)}
            />
            <p className='font-inter-tight text-xs font-medium text-soft-gray'>
              Invitations are tied to this email address. The guest must authenticate with it to
              accept, so verify it before sending.
            </p>
          </div>
        )}
      </FormField>

      {categories.length > 0 && (
        <FormField form={form} name='categoryIds' className='w-full'>
          {(field) => {
            const selected = (field.value as string[] | undefined) ?? []

            const toggle = (categoryId: string) =>
              field.onChange(
                selected.includes(categoryId)
                  ? selected.filter((id) => id !== categoryId)
                  : [...selected, categoryId],
              )

            return (
              <div className='flex w-full flex-col gap-2'>
                <p className='font-inter-tight text-sm font-bold text-black'>
                  Add to Category <span className='font-normal text-mid-dark-gray'>(optional)</span>
                </p>

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
                </div>

                <p className='font-inter-tight text-xs font-medium text-soft-gray'>
                 Choose one or more categories. 
                </p>
              </div>
            )
          }}
        </FormField>
      )}
    </FormBase>
  )
}
