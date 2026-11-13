import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import type { ControllerRenderProps } from 'react-hook-form'

export function BaseCheckbox({
  data,
  value,
  onChange,
  labelClassName,
  descriptionClassName,
  defaultChecked,
  orientation = 'horizontal',
  multiSelect = false,
}: TBaseCheckbox & Partial<ControllerRenderProps>) {
  const isChecked = (itemId: string) => {
    if (multiSelect) {
      if (Array.isArray(value)) {
        return value.some((item: ItemProps) => item.id === itemId)
      }
      return false
    }
    return value === itemId
  }

  const handleCheckChange = (itemId: string, checked: boolean) => {
    if (multiSelect) {
      const currentValues = Array.isArray(value) ? value : []
      let newValues: ItemProps[]

      if (checked) {
        const exists = currentValues.some((item: ItemProps) => item.id === itemId)
        newValues = exists ? currentValues : [...currentValues, { id: itemId }]
      } else {
        newValues = currentValues.filter((item: ItemProps) => item.id !== itemId)
      }

      onChange?.(newValues)
    } else {
      onChange?.(checked ? itemId : undefined)
    }
  }

  return (
    <div className='flex items-center gap-4'>
      <div className='flex flex-col items-start gap-2'>
        <div
          className={cn('flex', {
            'flex-col gap-5': orientation === 'vertical',
            'flex-row items-center gap-3': orientation === 'horizontal',
          })}>
          {data.items.map((item) => (
            <div key={item.id} className='flex flex-col gap-1'>
              <div className='flex items-center gap-1'>
                <Checkbox
                  defaultChecked={defaultChecked ? defaultChecked : false}
                  id={item.id}
                  checked={isChecked(item.id)}
                  onCheckedChange={(checked) => {
                    handleCheckChange(item.id, checked as boolean)
                  }}
                  className='size-4'
                />

                <Label
                  htmlFor={item.id}
                  className={cn('text-sm uppercase font-inter-tight', labelClassName)}>
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
        </div>

        {data.description && (
          <p className={cn('text-xs font-light font-inter-tight', descriptionClassName)}>
            {data.description}
          </p>
        )}
      </div>
    </div>
  )
}

type TBaseCheckbox = {
  data: IBaseCheckbox
  labelClassName?: string
  descriptionClassName?: string
  defaultChecked?: boolean
  orientation?: 'horizontal' | 'vertical'
  multiSelect?: boolean
}

interface ItemProps {
  label: string
  id: string
  description?: string
}

export interface IBaseCheckbox {
  description?: string
  items: ItemProps[]
}
