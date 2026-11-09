import { useWatch, type FieldValues, type Path, type PathValue, type UseFormReturn } from 'react-hook-form'
import { FormField } from '../reusable'
import { DateTimePicker, type DateTimePickerTone } from './date-time-picker'

/**
 * A date and time field. The picker is one control, but the form keeps the
 * four values it always has (date, hour, minute, period), so schemas and
 * toApiDateTime don't change.
 */
export function DateForm<T extends FieldValues>({
  form,
  name,
  input_name,
  hour_name,
  minute_name,
  period_name,
  date_label,
  tone,
}: IDateFormProps<T>) {
  const [hour, minute, period] = useWatch({
    control: form.control,
    name: [hour_name, minute_name, period_name],
  })

  const setTimePart = (path: Path<T>, value: string) =>
    form.setValue(path, value as PathValue<T, Path<T>>, {
      shouldDirty: true,
      shouldValidate: form.formState.isSubmitted,
    })

  return (
    <FormField
      form={form}
      name={input_name}
      label={date_label}
      className='w-full flex flex-col gap-1 text-black text-xs uppercase font-sf-pro-text'>
      {(field) => (
        <DateTimePicker
          label={name}
          value={{
            date: field.value as Date | undefined,
            hour: hour ?? '12',
            minute: minute ?? '00',
            period: period ?? 'AM',
          }}
          onChange={(next) => {
            field.onChange(next.date)
            setTimePart(hour_name, next.hour)
            setTimePart(minute_name, next.minute)
            setTimePart(period_name, next.period)
          }}
          onBlur={field.onBlur}
          tone={tone}
        />
      )}
    </FormField>
  )
}

interface IDateFormProps<T extends FieldValues> {
  /** Heads the picker's popover: 'START DATE'. */
  name: string
  input_name: Path<T>
  form: UseFormReturn<T>
  hour_name: Path<T>
  minute_name: Path<T>
  period_name: Path<T>
  /** The label above the field, if it has one. */
  date_label?: string
  /** Light (the default) for white screens, dark for dark ones. */
  tone?: DateTimePickerTone
}
