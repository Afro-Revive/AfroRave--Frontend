import { useState, type CSSProperties } from 'react'
import { addYears, endOfYear, format, isBefore, startOfDay, startOfMonth } from 'date-fns'
import { CalendarIcon, Minus, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import type { FormDateTime } from '@/lib/helper-func'
import { cn } from '@/lib/utils'

/** The date may be unset until one is picked; the time always has a value. */
export type DateTimeValue = Omit<FormDateTime, 'date'> & { date?: Date }

/**
 * The popover's colours: light for white screens, dark for dark ones. `bg` is
 * the popover, `box` the controls on it (arrows, dropdowns, time).
 */
const TONES = {
  light: {
    bg: '#f5f5f5',
    box: '#ffffff',
    fg: '#1e1e1e',
    muted: 'rgb(0 0 0 / 0.5)',
    faint: 'rgb(0 0 0 / 0.25)',
    line: 'rgb(0 0 0 / 0.1)',
    hover: 'rgb(0 0 0 / 0.06)',
    active: 'rgb(0 0 0 / 0.1)',
  },
  dark: {
    bg: '#141414',
    box: '#1f1f1f',
    fg: '#ffffff',
    muted: 'rgb(255 255 255 / 0.6)',
    faint: 'rgb(255 255 255 / 0.25)',
    line: 'rgb(255 255 255 / 0.12)',
    hover: 'rgb(255 255 255 / 0.1)',
    active: 'rgb(255 255 255 / 0.16)',
  },
}

export type DateTimePickerTone = keyof typeof TONES

/** A tone as the --dtp-* variables the popover's classes read. */
const toVars = (colors: Record<string, string>) =>
  Object.fromEntries(
    Object.entries(colors).map(([key, color]) => [`--dtp-${key}`, color]),
  ) as CSSProperties

const TONE_VARS: Record<DateTimePickerTone, CSSProperties> = {
  light: toVars(TONES.light),
  dark: toVars(TONES.dark),
}

/** The field that opens it sits on the screen itself, so it follows the tone too. */
const TRIGGER = {
  light: {
    field: 'border-mid-dark-gray/50 bg-white text-black hover:bg-black/10',
    muted: 'text-mid-dark-gray',
  },
  dark: {
    field: 'border-white/20 bg-white/5 text-white hover:bg-white/10 hover:text-white',
    muted: 'text-white/60',
  },
}

/**
 * A date and a 12-hour time picked in one popover. The value has the shape the
 * forms already store ({ date, hour, minute, period }), so it goes through
 * toApiDateTime unchanged.
 */
export function DateTimePicker({
  label,
  value,
  onChange,
  onBlur,
  minDate,
  placeholder = 'Pick a date and time',
  tone = 'light',
  className,
}: {
  /** Heads the popover: 'START DATE', 'CLOSING DATE'. */
  label: string
  value: DateTimeValue
  onChange: (value: DateTimeValue) => void
  onBlur?: () => void
  /** Days before this can't be picked. Today by default. */
  minDate?: Date
  placeholder?: string
  /** Light for white screens, dark for dark ones. */
  tone?: DateTimePickerTone
  className?: string
}) {
  const trigger = TRIGGER[tone]
  const earliest = minDate ?? startOfDay(new Date())
  const { date, hour, minute, period } = value
  const time = `${hour.padStart(2, '0')}:${minute.padStart(2, '0')} ${period}`

  // A saved date from the past still has to be reachable in the dropdowns.
  const startMonth = startOfMonth(date && isBefore(date, earliest) ? date : earliest)
  const endMonth = endOfYear(addYears(new Date(), 5))

  return (
    <Popover onOpenChange={(open) => !open && onBlur?.()}>
      <PopoverTrigger asChild>
        <Button
          type='button'
          variant='outline'
          className={cn(
            'w-full min-h-10 justify-start gap-2 rounded-[4px] text-left font-sf-pro-display font-normal',
            trigger.field,
            className,
          )}>
          <CalendarIcon className={cn('size-4', trigger.muted)} />
          {date ? (
            <span>
              {format(date, 'EEE, MMM d, yyyy')} <span className={trigger.muted}>at</span> {time}
            </span>
          ) : (
            <span className={trigger.muted}>{placeholder}</span>
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent
        align='start'
        collisionPadding={16}
        style={TONE_VARS[tone]}
        className='w-72 max-w-[calc(100vw-32px)] rounded-xl border-(--dtp-line) bg-(--dtp-bg) p-0 font-sf-pro-display text-(--dtp-fg) shadow-xl z-[10000000000]'>
        <div className='flex flex-col gap-1 px-4 pt-4 pb-3'>
          <p className='text-[10px] uppercase tracking-[0.2em] text-(--dtp-muted)'>{label}</p>

          <div className='flex items-baseline justify-between gap-3'>
            <p className='text-base font-semibold'>
              {date ? format(date, 'EEE, MMM d, yyyy') : 'Pick a date'}
            </p>
            <p className='whitespace-nowrap text-base font-semibold text-deep-red'>{time}</p>
          </div>
        </div>

        <div className='mx-4 border-t border-(--dtp-line)' />

        <Calendar
          mode='single'
          required
          selected={date}
          onSelect={(next) => onChange({ ...value, date: next })}
          defaultMonth={date ?? earliest}
          disabled={{ before: earliest }}
          captionLayout='dropdown'
          startMonth={startMonth}
          endMonth={endMonth}
          className='w-full bg-transparent px-4 pt-3 pb-2 [--cell-size:--spacing(9)]'
          classNames={{
            root: 'w-full',
            button_previous:
              'inline-flex size-8 items-center justify-center rounded-md border border-(--dtp-line) bg-(--dtp-box) text-(--dtp-fg) outline-none hover:shadow-[inset_0_0_0_99px_var(--dtp-hover)] focus-visible:ring-2 focus-visible:ring-(--dtp-muted) aria-disabled:opacity-40',
            button_next:
              'inline-flex size-8 items-center justify-center rounded-md border border-(--dtp-line) bg-(--dtp-box) text-(--dtp-fg) outline-none hover:shadow-[inset_0_0_0_99px_var(--dtp-hover)] focus-visible:ring-2 focus-visible:ring-(--dtp-muted) aria-disabled:opacity-40',
            dropdowns: 'flex h-8 w-full items-center justify-center gap-1.5',
            dropdown_root:
              'relative rounded-md border border-(--dtp-line) bg-(--dtp-box) has-focus:border-(--dtp-muted)',
            dropdown: 'absolute inset-0 bg-(--dtp-box) text-(--dtp-fg) opacity-0',
            caption_label:
              'flex h-8 select-none items-center gap-1 pl-2.5 pr-1.5 text-xs font-medium text-(--dtp-fg) [&>svg]:size-3 [&>svg]:text-(--dtp-muted)',
            weekday: 'flex-1 select-none text-xs font-normal text-(--dtp-muted)',
            week: 'mt-0.5 flex w-full',
            day_button:
              'rounded-md font-sf-pro-display text-sm font-medium hover:bg-(--dtp-hover) hover:text-(--dtp-fg) data-[selected-single=true]:bg-deep-red data-[selected-single=true]:text-white',
            today: 'text-(--dtp-fg)',
            outside: 'text-(--dtp-fg)',
            disabled: 'text-(--dtp-faint)',
          }}
        />

        <div className='flex items-center gap-1 px-4 pb-4'>
          <TimeStepper
            label='hour'
            value={hour}
            min={1}
            max={12}
            step={1}
            onChange={(next) => onChange({ ...value, hour: next })}
          />

          <span className='text-(--dtp-muted)'>:</span>

          <TimeStepper
            label='minute'
            value={minute}
            min={0}
            max={59}
            step={5}
            onChange={(next) => onChange({ ...value, minute: next })}
          />

          <div
            role='radiogroup'
            aria-label='AM or PM'
            className='flex h-9 shrink-0 items-center rounded-md border border-(--dtp-line) bg-(--dtp-box) p-0.5'>
            {(['AM', 'PM'] as const).map((option) => (
              <button
                key={option}
                type='button'
                role='radio'
                aria-checked={period === option}
                onClick={() => onChange({ ...value, period: option })}
                className={cn(
                  'h-full rounded-[5px] px-2.5 text-xs font-medium transition-colors',
                  period === option
                    ? 'bg-(--dtp-active) text-(--dtp-fg)'
                    : 'text-(--dtp-muted) hover:text-(--dtp-fg)',
                )}>
                {option}
              </button>
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}

/**
 * − value +, wrapping at the ends (12 → 1, 55 → 00). Minutes step by five and
 * snap to the grid; the number can also be typed for an exact one.
 */
function TimeStepper({
  label,
  value,
  min,
  max,
  step,
  onChange,
}: {
  label: string
  value: string
  min: number
  max: number
  step: number
  onChange: (value: string) => void
}) {
  // What's being typed, until it's committed on blur.
  const [draft, setDraft] = useState<string | null>(null)
  const current = Number(value) || min
  const size = max - min + 1

  const stepBy = (direction: 1 | -1) => {
    const offset = current - min
    const next =
      direction > 0
        ? Math.floor(offset / step) * step + step
        : Math.ceil(offset / step) * step - step

    onChange(String((((next % size) + size) % size) + min).padStart(2, '0'))
  }

  const commit = () => {
    if (draft === null) return
    const typed = Number(draft)

    if (draft !== '' && Number.isInteger(typed) && typed >= min && typed <= max) {
      onChange(String(typed).padStart(2, '0'))
    }
    setDraft(null)
  }

  return (
    <div className='flex h-9 min-w-0 flex-1 items-center rounded-md border border-(--dtp-line) bg-(--dtp-box) px-0.5'>
      <button
        type='button'
        aria-label={`Earlier ${label}`}
        onClick={() => stepBy(-1)}
        className='inline-flex size-6 shrink-0 items-center justify-center rounded text-(--dtp-muted) hover:bg-(--dtp-hover) hover:text-(--dtp-fg)'>
        <Minus className='size-3.5' />
      </button>

      <input
        aria-label={label}
        inputMode='numeric'
        maxLength={2}
        value={draft ?? value.padStart(2, '0')}
        onFocus={(event) => event.target.select()}
        onChange={(event) => setDraft(event.target.value.replace(/\D/g, ''))}
        onBlur={commit}
        onKeyDown={(event) => event.key === 'Enter' && event.currentTarget.blur()}
        className='w-full min-w-0 flex-1 bg-transparent text-center text-sm font-medium tabular-nums outline-none'
      />

      <button
        type='button'
        aria-label={`Later ${label}`}
        onClick={() => stepBy(1)}
        className='inline-flex size-6 shrink-0 items-center justify-center rounded text-(--dtp-muted) hover:bg-(--dtp-hover) hover:text-(--dtp-fg)'>
        <Plus className='size-3.5' />
      </button>
    </div>
  )
}
