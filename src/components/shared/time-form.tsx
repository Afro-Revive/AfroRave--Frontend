import type { FieldValues, UseFormReturn, Path } from 'react-hook-form'
import { FormField } from '../reusable'
import { Button } from '../ui/button'
import { Clock, ChevronDown, ChevronUp, type LucideIcon } from 'lucide-react'
import { Input } from '../ui/input'
import type { HTMLInputTypeAttribute } from 'react'
import { cn } from '@/lib/utils'

export function TimeForm<T extends FieldValues>({
  form,
  hour_name,
  minute_name,
  period_name,
  label,
  className,
}: ITimeFormProps<T>) {
  const togglePeriod = () => {
    const currentPeriod = form.getValues(period_name)
    const newPeriod = currentPeriod === 'AM' ? 'PM' : 'AM'
    form.setValue(period_name, newPeriod as any)
  }

  return (
    <div className='w-full min-w-0 flex flex-col gap-2'>
      {label && (
        <p className='text-sm font-sf-pro-text leading-[100%] text-system-black uppercase font-medium'>
          {label}
        </p>
      )}
      <div className='relative h-10 flex flex-row gap-1 items-center'>
        <div className={cn('h-10 flex items-center bg-white justify-between border border-mid-dark-gray/50 w-full rounded-l-[4px] px-3 py-2', className)}>
          <Clock className='h-[18px] min-w-4 mr-2 text-muted-foreground' />

          <TimeInput form={form} name={hour_name} />

          <span className='px-1 text-black'>:</span>

          <TimeInput form={form} name={minute_name} />
        </div>

        <div className='ml-auto flex flex-col items-center justify-center'>
          <ToggleBtn action={togglePeriod} Icon={ChevronUp} />

          <TimeInput form={form} name={period_name} type='text' />

          <ToggleBtn action={togglePeriod} Icon={ChevronDown} />
        </div>
      </div>
    </div>
  )
}

function TimeInput<T extends FieldValues>({
  form,
  name,
  type = 'number',
}: {
  form: ITimeFormProps<T>['form']
  name: ITimeFormProps<T>['minute_name']
  type?: HTMLInputTypeAttribute
}) {
  return (
    <FormField
      form={form}
      name={name}
      className={cn('w-fit text-xs uppercase font-sf-pro-text text-black flex flex-col gap-1', {
        'border border-mid-dark-gray/50 rounded-r-[4px]': type !== 'number',
      })}>
      {(field) => (
        <Input
          type={type}
          {...field}
          maxLength={2}
          className='w-10 h-9 text-center border-0 shadow-none p-0 focus-visible:ring-0'
        />
      )}
    </FormField>
  )
}

function ToggleBtn({ action, Icon }: { action: () => void; Icon: LucideIcon }) {
  return (
    <Button
      type='button'
      variant='ghost'
      size='icon'
      onClick={action}
      className='h-3 w-8 p-0 hover:bg-black/10'>
      <Icon className='h-3 w-1.5' color='#000000' />
    </Button>
  )
}

interface ITimeFormProps<T extends FieldValues> {
  form: UseFormReturn<T>
  hour_name: Path<T>
  minute_name: Path<T>
  period_name: Path<T>
  label?: string
  className?: string
}
