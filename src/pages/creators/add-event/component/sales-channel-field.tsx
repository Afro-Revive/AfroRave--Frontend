import type { FieldValues, Path, PathValue, UseFormReturn } from 'react-hook-form'
import { Globe } from 'lucide-react'
import { BsDoorClosed } from 'react-icons/bs'
import { CustomFormField as FormField } from '@/components/shared/custom-form'
import { cn } from '@/lib/utils'


const SALES_CHANNEL_OPTIONS = [
  {
    value: 'online',
    label: 'Online',
    icon: Globe,
    description:
      'Listed on your event page and purchased through AfroRevive checkout.',
  },
  {
    value: 'door',
    label: 'Door',
    icon: BsDoorClosed,
    description:
      'Sold on-site and recorded by your team in the AfroRevive app. Not listed on your event page.',
  },
] as const

export function SalesChannelField<T extends FieldValues>({
  form,
  name,
}: {
  form: UseFormReturn<T>
  name: Path<T>
}) {
  return (
    <div className='w-full flex flex-col gap-4'>
      <div className='flex flex-col gap-1'>
        <h2 className='font-inter-tight font-bold text-2xl text-black uppercase'>
          Sales Channel
        </h2>
        <p className='font-inter-tight font-medium text-sm text-[#464444]'>
          Choose where this ticket is sold.
        </p>
      </div>

      <FormField form={form} name={name} showMessage>
        {(field) => (
          <div role='radiogroup' className='grid grid-cols-1 md:grid-cols-2 gap-5'>
            {SALES_CHANNEL_OPTIONS.map(({ value, label, icon: Icon, description }) => {
              const isSelected = field.value === value

              return (
                <button
                  key={value}
                  type='button'
                  role='radio'
                  aria-checked={isSelected}
                  onClick={() => field.onChange(value as PathValue<T, Path<T>>)}
                  className={cn(
                    'flex flex-col gap-2 rounded-xl border px-3 py-4 text-left transition-colors',
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

                  <span className='font-inter-tight text-xs normal-case text-black'>
                    {description}
                  </span>
                </button>
              )
            })}
          </div>
        )}
      </FormField>
    </div>
  )
}
