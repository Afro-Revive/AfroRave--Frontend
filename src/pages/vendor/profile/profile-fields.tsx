import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { cn } from '@/lib/utils'
import { useState, type InputHTMLAttributes, type ReactNode } from 'react'
import { RiEyeLine, RiEyeOffLine } from 'react-icons/ri'

const BOX = 'relative flex flex-col justify-center rounded-lg border border-white/80 px-4 transition-colors focus-within:border-white'

/** A bordered box with its label inside, above the value (the Account and Settings tabs). */
export function InsetInput({ label, hint, className, ...props }: { label: string; hint?: string } & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className={cn(BOX, 'min-h-[76px] gap-1.5 py-3', props.disabled && 'border-transparent bg-[#4A4A4A]', className)}>
      <span className='flex items-center justify-between font-inter-tight text-xs text-white/90'>
        {label}
        {hint && <span className='text-xs text-white/60'>{hint}</span>}
      </span>
      <input
        {...props}
        className='w-full bg-transparent font-inter-tight text-sm text-white outline-none placeholder:text-white/30 disabled:text-white/50'
      />
    </label>
  )
}

export function InsetPasswordInput({ label, ...props }: { label: string } & InputHTMLAttributes<HTMLInputElement>) {
  const [isVisible, setIsVisible] = useState(false)
  return (
    <div className={cn(BOX, 'min-h-[68px] gap-1 py-3')}>
      <label htmlFor={props.id} className='font-inter-tight text-xs text-white'>
        {label}
      </label>
      <div className='flex items-center gap-3'>
        <input
          {...props}
          type={isVisible ? 'text' : 'password'}
          className='w-full bg-transparent font-inter-tight text-sm text-white outline-none placeholder:text-white/30'
        />
        <button
          type='button'
          aria-label={isVisible ? 'Hide password' : 'Show password'}
          onClick={() => setIsVisible((prev) => !prev)}
          className='text-white/90 hover:text-white'>
          {isVisible ? <RiEyeOffLine className='size-4' /> : <RiEyeLine className='size-4' />}
        </button>
      </div>
    </div>
  )
}

/** A select in the same box, with the dark list from the design. */
export function InsetSelect({
  label,
  value,
  onChange,
  items,
  placeholder = '...',
  className,
  inlineLabel = false,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  items: { value: string; label: string }[]
  placeholder?: string
  className?: string
  /** Label and chevron on one line, like Category, instead of the label above the value. */
  inlineLabel?: boolean
}) {
  return (
    <Select value={value || undefined} onValueChange={onChange}>
      <SelectTrigger
        aria-label={label}
        className={cn(
          'group !h-auto w-full rounded-lg border border-white/80 bg-transparent px-4 text-left text-white shadow-none focus:ring-0 focus-visible:ring-0 data-[placeholder]:text-white/50 [&>svg]:text-white [&>svg]:opacity-100',
          inlineLabel ? 'min-h-[54px] py-3' : 'min-h-[76px] items-end py-3',
          className,
        )}>
        {inlineLabel ? (
          <span className='font-inter-tight text-sm font-semibold text-white'>
            {value ? items.find((item) => item.value === value)?.label ?? value : label}
          </span>
        ) : (
          <span className='flex min-w-0 flex-col gap-1.5'>
            <span className='font-inter-tight text-sm text-white/90'>{label}</span>
            {/* min-h holds the value's line when it's empty, so the label stays on top. */}
            <span className='min-h-6 truncate font-inter-tight text-base text-white'>
              <SelectValue placeholder={placeholder} />
            </span>
          </span>
        )}
      </SelectTrigger>
      <SelectContent className='max-h-[320px] rounded-lg border-none bg-[#2A2A2A] p-1 text-white shadow-xl'>
        {items.map((item) => (
          <SelectItem
            key={item.value}
            value={item.value}
            className='rounded-none border-b border-white/80 font-sf-pro-text text-sm text-white last:border-none focus:bg-white/10 focus:text-white'>
            {item.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

/** A label with an icon above a rounded input (the Profile tab's contact details). */
export function IconInput({ icon, label, ...props }: { icon: ReactNode; label: string } & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className='flex flex-col gap-2'>
      <span className='flex items-center gap-2 font-inter-tight text-sm text-white'>
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
