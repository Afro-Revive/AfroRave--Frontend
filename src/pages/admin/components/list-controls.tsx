import { cn } from '@/lib/utils'
import { RiSearchLine } from 'react-icons/ri'

export function SearchBox({
  value,
  onChange,
  placeholder,
}: {
  value: string
  onChange: (value: string) => void
  placeholder: string
}) {
  return (
    <label className='relative flex w-full items-center sm:w-72'>
      <span className='sr-only'>{placeholder}</span>
      <RiSearchLine className='pointer-events-none absolute left-3 size-4 text-white/40' aria-hidden />
      <input
        type='search'
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className='h-9 w-full rounded-lg border border-white/10 bg-white/5 pl-9 pr-3 text-sm text-white placeholder:text-white/40 focus:border-white/30 focus:outline-none'
      />
    </label>
  )
}

/** A row of filter chips: All, then each option. */
export function FilterTabs<T extends string>({
  value,
  options,
  onChange,
  label,
}: {
  value: T | ''
  options: { value: T | ''; label: string }[]
  onChange: (value: T | '') => void
  label: string
}) {
  return (
    <div role='group' aria-label={label} className='flex flex-wrap gap-1 rounded-lg bg-white/5 p-1'>
      {options.map((option) => (
        <button
          key={option.value || 'all'}
          type='button'
          aria-pressed={value === option.value}
          onClick={() => onChange(option.value)}
          className={cn(
            'rounded-md px-3 py-1 text-xs font-medium transition-colors',
            value === option.value ? 'bg-white text-system-black' : 'text-white/70 hover:text-white',
          )}>
          {option.label}
        </button>
      ))}
    </div>
  )
}

/** A small action button for a table row. */
export function RowAction({
  tone = 'neutral',
  disabled,
  onClick,
  children,
}: {
  tone?: 'neutral' | 'danger' | 'success'
  disabled?: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type='button'
      disabled={disabled}
      onClick={onClick}
      className={cn(
        'whitespace-nowrap rounded-md border px-2.5 py-1 text-xs font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-40',
        tone === 'danger' && 'border-red-500/40 text-red-300 hover:bg-red-500/10',
        tone === 'success' && 'border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/10',
        tone === 'neutral' && 'border-white/15 text-white/80 hover:bg-white/10',
      )}>
      {children}
    </button>
  )
}
