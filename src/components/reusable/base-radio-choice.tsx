import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { cn } from '@/lib/utils'
import type { ControllerRenderProps } from 'react-hook-form'
import { forwardRef } from 'react'
import type { IBaseCheckbox } from './base-checkbox'

/**
 * Pick exactly one option, for choices like Paid / Free. Radio buttons rather
 * than checkboxes: checkboxes say "tick any number", and screen readers
 * announce them as separate toggles. Takes the same `data` as BaseCheckbox.
 */
export const BaseRadioChoice = forwardRef<
  HTMLDivElement,
  {
    data: IBaseCheckbox
    labelClassName?: string
    descriptionClassName?: string
    orientation?: 'horizontal' | 'vertical'
  } & Partial<ControllerRenderProps>
>(function BaseRadioChoice({
  data,
  value,
  onChange,
  name,
  labelClassName,
  descriptionClassName,
  orientation = 'horizontal',
}, ref) {
  return (
    <RadioGroup
      ref={ref}
      name={name}
      value={typeof value === 'string' ? value : undefined}
      onValueChange={(next) => onChange?.(next)}
      className={cn('flex', {
        'flex-col gap-5': orientation === 'vertical',
        'flex-row items-center gap-3': orientation === 'horizontal',
      })}>
      {data.items.map((item) => (
        <div key={item.id} className='flex flex-col gap-1'>
          <div className='flex items-center gap-1.5'>
            <RadioGroupItem
              id={item.id}
              value={item.id}
              className='border-secondary/30 data-[state=checked]:border-light-red [&_svg]:fill-light-red [&_svg]:stroke-light-red'
            />
            <Label
              htmlFor={item.id}
              className={cn('cursor-pointer text-sm uppercase font-inter-tight', labelClassName)}>
              {item.label}
            </Label>
          </div>
          {item.description && (
            <p className={cn('text-xs font-light font-inter-tight text-black', descriptionClassName)}>
              {item.description}
            </p>
          )}
        </div>
      ))}
    </RadioGroup>
  )
})
