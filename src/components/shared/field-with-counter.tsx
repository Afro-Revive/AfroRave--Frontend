import type { ControllerRenderProps, FieldValues, Path, UseFormReturn } from 'react-hook-form'
import { FormField } from '../reusable'
import { Label } from '../ui/label'

export function FormFieldWithCounter<T extends FieldValues>({
  form,
  field_name,
  name,
  children,
  className,
  maxLength,
  description,
  showMessage,
  count = (value) => String(value || '').length,
}: {
  form: UseFormReturn<T>
  field_name: Path<T>
  name: string
  children: (field: ControllerRenderProps<T, Path<T>>) => React.ReactNode
  className?: string
  maxLength: number
  description?: string
  showMessage?: boolean
  /** How many characters the value counts as. Rich text counts its text, not its tags. */
  count?: (value: unknown) => number
}) {
  return (
    <FormField
      form={form}
      name={field_name}
      className='w-full flex flex-col gap-1 text-black text-xs uppercase font-sf-pro-text'
      description={description}
      showMessage={showMessage}>
      {(field) => (
        <>
          <div className='w-full flex items-center justify-between text-black text-xs uppercase font-work-sans'>
            <Label htmlFor={field_name} className={className}>
              {name}
            </Label>
            <p className='font-light'>
              {count(field.value)}/{maxLength}
            </p>
          </div>
          {children(field)}
        </>
      )}
    </FormField>
  )
}
