import type { FieldValues, Path, PathValue, UseFormReturn } from 'react-hook-form'
import { Eye, Lock } from 'lucide-react'
import { CustomFormField as FormField } from '@/components/shared/custom-form'
import { cn } from '@/lib/utils'

const VISIBILITY_OPTIONS = [
  {
    value: 'public',
    label: 'Public',
    icon: Eye,
    description: 'Anyone can discover this event and buy tickets',
  },
  {
    value: 'private',
    label: 'Private',
    icon: Lock,
    description:
      'Visible in event discovery. Ticket purchases are restricted to attendees you approve.',
  },
] as const

export function VisibilityField<T extends FieldValues>({
  form,
  name,
}: {
  form: UseFormReturn<T>
  name: Path<T>
}) {
  return (
    <FormField form={form} name={name} showMessage>
      {(field) => (
        <div role='radiogroup' className='grid grid-cols-1 md:grid-cols-2 gap-5'>
          {VISIBILITY_OPTIONS.map(({ value, label, icon: Icon, description }) => {
            const isSelected = field.value === value

            return (
              <button
                key={value}
                type='button'
                role='radio'
                aria-checked={isSelected}
                onClick={() => field.onChange(value as PathValue<T, Path<T>>)}
                className={cn(
                  'flex flex-col gap-2 rounded-xl border p-5 text-left transition-colors',
                  isSelected
                    ? 'border-deep-red bg-deep-red/8'
                    : 'border-soft-gray bg-white hover:border-soft-gray/40',
                )}>
                <span className='flex items-center gap-2'>
                  <Icon
                    size={14}
                    className={isSelected ? 'text-deep-red' : 'text-black'}
                  />
                  {/* normal-case: CustomFormField uppercases the whole field. */}
                  <span className='font-inter-tight text-base font-bold normal-case text-black'>
                    {label}
                  </span>
                </span>

                <span className='font-inter-tight text-sm normal-case text-black'>
                  {description}
                </span>
              </button>
            )
          })}
        </div>
      )}
    </FormField>
  )
}
