import { CustomFormField as FormField } from '@/components/shared/custom-form'
import type { FieldValues, UseFormReturn, Path } from 'react-hook-form'
import { BaseSelect } from '@/components/reusable'
import type { ICustomSelectProps } from '@/components/reusable/base-select'
import { cn } from '@/lib/utils'

export function SelectField<T extends FieldValues>({
  form,
  name,
  placeholder,
  data,
  label,
  className,
  triggerClassName,
  showMessage,
}: {
  form: UseFormReturn<T>
  name: Path<T>
  data: ICustomSelectProps['items']
  placeholder: string
  label?: string
  className?: string
  triggerClassName?: string
  showMessage?: boolean
}) {
  return (
    <FormField
      form={form}
      name={name}
      label={label}
      className={className}
      showMessage={showMessage}
    >
      {(field) => (
        <BaseSelect
          type='auth'
          items={data}
          placeholder={placeholder}
          triggerClassName={cn(
            'w-[120px] text-black !bg-white px-3 rounded-[4px] border border-mid-dark-gray/50 text-sm font-sf-pro-display',
            triggerClassName,
          )}
          value={field.value as string}
          onChange={field.onChange}
        />
      )}
    </FormField>
  )
}
