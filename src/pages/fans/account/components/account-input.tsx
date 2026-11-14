import { FIELD_LABEL_ON_DARK_CLASS } from '@/components/shared/field-label'
import { FormField } from '@/components/reusable'
import { Input } from '@/components/ui/input'
import type { HTMLInputTypeAttribute } from 'react'
import type { FieldValues, Path, UseFormReturn } from 'react-hook-form'

export function AccountInput<T extends FieldValues>({
  name,
  label,
  form,
  type = 'text',
}: IAccountInputProps<T> & { form: UseFormReturn<T> }) {
  return (
    <FormField
      name={name}
      label={label}
      form={form}
      labelClassName={FIELD_LABEL_ON_DARK_CLASS}
      className='w-full flex flex-col gap-1 text-white font-inter-tight'>
      <Input
        type={type}
        className='h-11 rounded-md border border-white/20 bg-transparent px-4 text-sm text-white placeholder:text-white/40 focus:border-white/40 focus-visible:ring-0 focus-visible:outline-none'
      />
    </FormField>
  )
}

interface IAccountInputProps<T extends FieldValues> {
  name: Path<T>
  label: string
  type?: HTMLInputTypeAttribute
}
