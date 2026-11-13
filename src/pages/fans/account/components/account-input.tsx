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
      labelClassName='text-white text-xs md:text-sm font-inter-tight mb-1'
      className='w-full flex flex-col gap-1 px-4 py-3 rounded-md border border-white/20 bg-transparent text-white font-inter-tight focus-within:border-white/40 transition-all duration-200 min-h-[60px] justify-center'>
      <Input
        type={type}
        className='border-none bg-transparent p-0 text-base md:text-lg text-white placeholder:text-white/40 focus-visible:ring-0 focus-visible:outline-none h-auto'
      />
    </FormField>
  )
}

interface IAccountInputProps<T extends FieldValues> {
  name: Path<T>
  label: string
  type?: HTMLInputTypeAttribute
}
