import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { cn } from '@/lib/utils'
import { FIELD_LABEL_ON_DARK_CLASS } from '@/components/shared/field-label'
import { useId, useState, type InputHTMLAttributes, type ReactNode } from 'react'
import { RiEyeLine, RiEyeOffLine } from 'react-icons/ri'

// The box every field draws; its label sits above it, as in every other form.
const FIELD_BOX = 'h-11 w-full rounded-lg border border-white/80 bg-transparent px-4 font-inter-tight text-sm text-white transition-colors'

/** A labelled input (the Account tab). `hideLabel` keeps the label for screen readers only, for a field a row label already names. */
export function ProfileInput({
  label,
  hint,
  hideLabel = false,
  className,
  ...props
}: { label: string; hint?: string; hideLabel?: boolean } & InputHTMLAttributes<HTMLInputElement>) {
  const generatedId = useId()
  const id = props.id ?? generatedId

  return (
    <div className={cn('flex w-full flex-col gap-1', className)}>
      <label htmlFor={id} className={cn(FIELD_LABEL_ON_DARK_CLASS, 'flex items-center justify-between', hideLabel && 'sr-only')}>
        {label}
        {hint && <span className='normal-case text-white/60'>{hint}</span>}
      </label>
      <input
        {...props}
        id={id}
        className={cn(
          FIELD_BOX,
          'outline-none placeholder:text-white/30 focus:border-white disabled:border-transparent disabled:bg-[#4A4A4A] disabled:text-white/50',
        )}
      />
    </div>
  )
}

export function ProfilePasswordInput({ label, ...props }: { label: string } & InputHTMLAttributes<HTMLInputElement>) {
  const [isVisible, setIsVisible] = useState(false)
  const generatedId = useId()
  const id = props.id ?? generatedId

  return (
    <div className='flex w-full flex-col gap-1'>
      <label htmlFor={id} className={FIELD_LABEL_ON_DARK_CLASS}>
        {label}
      </label>
      <div className={cn(FIELD_BOX, 'flex items-center gap-3 focus-within:border-white')}>
        <input
          {...props}
          id={id}
          type={isVisible ? 'text' : 'password'}
          className='w-full bg-transparent font-inter-tight text-sm text-white outline-none placeholder:text-white/30'
        />
        <button
          type='button'
          aria-label={isVisible ? `Hide ${label.toLowerCase()}` : `Show ${label.toLowerCase()}`}
          onClick={() => setIsVisible((prev) => !prev)}
          className='text-white/90 hover:text-white'>
          {isVisible ? <RiEyeOffLine className='size-4' /> : <RiEyeLine className='size-4' />}
        </button>
      </div>
    </div>
  )
}

/** A labelled select with the dark list from the design. `hideLabel` as on ProfileInput. */
export function ProfileSelect({
  label,
  value,
  onChange,
  items,
  placeholder = 'Select',
  hideLabel = false,
  className,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  items: { value: string; label: string }[]
  placeholder?: string
  hideLabel?: boolean
  className?: string
}) {
  const id = useId()

  return (
    <div className={cn('flex w-full flex-col gap-1', className)}>
      <label htmlFor={id} className={cn(FIELD_LABEL_ON_DARK_CLASS, hideLabel && 'sr-only')}>
        {label}
      </label>
      <Select value={value || undefined} onValueChange={onChange}>
        <SelectTrigger
          id={id}
          className={cn(
            FIELD_BOX,
            '!h-11 shadow-none focus:ring-0 focus-visible:ring-0 data-[placeholder]:text-white/50 [&>svg]:text-white [&>svg]:opacity-100',
          )}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent className='max-h-[320px] rounded-lg border-none bg-[#2A2A2A] p-1 text-white shadow-xl'>
          {items.map((item) => (
            <SelectItem
              key={item.value}
              value={item.value}
              className='rounded-none border-b border-white/80 font-inter-tight text-sm text-white last:border-none focus:bg-white/10 focus:text-white'>
              {item.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

/** A label with an icon above a rounded input (the Profile tab's contact details). */
export function IconInput({ icon, label, ...props }: { icon: ReactNode; label: string } & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className='flex flex-col gap-1'>
      <span className={cn(FIELD_LABEL_ON_DARK_CLASS, 'flex items-center gap-2')}>
        {icon}
        {label}
      </span>
      <input
        {...props}
        className='h-[38px] w-full rounded-lg border border-white bg-transparent px-3 font-inter-tight text-sm text-white outline-none placeholder:text-white/40 focus:border-tech-blue disabled:cursor-not-allowed disabled:border-transparent disabled:bg-[#4A4A4A] disabled:text-white/50'
      />
    </label>
  )
}

export function SaveButton({ disabled, isSaving, onClick }: { disabled: boolean; isSaving: boolean; onClick: () => void }) {
  return (
    <button
      type='button'
      onClick={onClick}
      disabled={disabled || isSaving}
      className='h-10 w-full rounded-md bg-white font-inter-tight text-base font-semibold text-light-red transition-colors hover:bg-white/90 disabled:cursor-not-allowed disabled:bg-[#ABABAB] disabled:text-[#7A1A1A]'>
      {isSaving ? 'Saving...' : 'Save'}
    </button>
  )
}
