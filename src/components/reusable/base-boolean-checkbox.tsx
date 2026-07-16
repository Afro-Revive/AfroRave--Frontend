import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import type { ControllerRenderProps } from 'react-hook-form'
import { cn } from '@/lib/utils'

export function BaseBooleanCheckbox({
  data,
  value,
  onChange,
  labelClassName,
  descriptionClassName,
  defaultChecked,
  orientation = 'horizontal',
  showCheckbox = true,
  checkedClassName,
}: IBaseBooleanCheckbox & Partial<ControllerRenderProps>) {
  return (
    <div className='flex flex-col gap-0.5'>
      <div
        className={cn('flex', {
          'flex-col gap-5': orientation === 'vertical',
          'flex-row items-center gap-3': orientation === 'horizontal',
        })}>
        <div className='flex flex-col gap-1'>
          <div className='flex items-center gap-1'>
            {showCheckbox && (
              <Checkbox
                defaultChecked={defaultChecked ? defaultChecked : false}
                name={data.items.id}
                checked={value}
                onCheckedChange={(checked) => {
                  onChange?.(checked === true)
                }}
                className='size-4'
              />
            )}

            <Label
              htmlFor={data.items.id}
              className={cn(
                'flex items-center justify-center text-sm text-charcoal uppercase font-sf-pro-text rounded-md px-2 py-1',
                labelClassName,
                value && checkedClassName, // only applied when checked
              )}>
              {data.items.label}
            </Label>
          </div>
          {data.items.description && (
            <p className='text-sm font-light font-sf-pro-display text-charcoal'>
              {data.items.description}
            </p>
          )}
        </div>
      </div>

      {data.description && (
        <p className={cn('text-xs font-light font-sf-pro-display', descriptionClassName)}>
          {data.description}
        </p>
      )}
    </div>
  )
}

export interface IBaseCheckbox {
  description?: string
  items: { label: string; id: string; description?: string }
}

interface IBaseBooleanCheckbox {
  data: IBaseCheckbox
  labelClassName?: string
  descriptionClassName?: string
  defaultChecked?: boolean
  orientation?: 'horizontal' | 'vertical'
  showCheckbox?: boolean
  checkedClassName?: string
}
