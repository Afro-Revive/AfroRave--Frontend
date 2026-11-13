import { FIELD_LABEL_CLASS } from '@/components/shared/field-label'
import { cn } from '@/lib/utils'
import React from 'react'
import type { FieldValues } from 'react-hook-form'
import { FormField as BaseFormField, type FormFieldProps } from '../reusable/base-form'
import { type InputProps, Input as ShadcnInput } from '../ui/input'

export function CustomFormField<T extends FieldValues>({
  name,
  children,
  form,
  label,
  className,
  labelClassName,
  showMessage,
}: FormFieldProps<T>) {
  return (
    <BaseFormField
      form={form}
      name={name}
      label={label}
      labelClassName={cn(FIELD_LABEL_CLASS, labelClassName)}
      showMessage={showMessage}
      className={cn(
        // Only the label is Work Sans capitals; the field and its message
        // inherit Inter Tight from here.
        'w-full flex flex-col gap-1 text-black text-xs font-inter-tight',
        className,
      )}>
      {children}
    </BaseFormField>
  )
}

export const CustomInput = React.forwardRef<
  HTMLInputElement,
  { placeholder?: string; className?: string } & Omit<InputProps, 'ref'>
>(({ placeholder, className, ...props }, ref) => {
  return (
    <ShadcnInput
      ref={ref}
      placeholder={placeholder}
      className={cn(
        'w-full h-10 text-black px-3 py-[11px] rounded-[4px] bg-white border border-mid-dark-gray/50 text-sm font-inter-tight',
        className,
      )}
      {...props}
    />
  )
})

CustomInput.displayName = 'CustomInput'
