import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { cn } from '@/lib/utils'
import type { ControllerRenderProps } from 'react-hook-form'

export function BaseRadioGroup({
  data,
  value,
  onChange,
}: {
  data: IRadioGroupProps[]
} & Partial<ControllerRenderProps>) {
  return (
    <RadioGroup
      value={value}
      onValueChange={onChange}
      className='w-full grid grid-cols-1 md:grid-cols-3 gap-6'>
      {data.map((item) => (
        <div key={item.value} className='w-full flex items-center'>
          <RadioGroupItem value={item.value} id={item.value} className='hidden' />
          <Label
            htmlFor={item.value}
            className={cn(
              'w-full h-auto min-h-[200px] rounded-[16px] flex flex-col items-start gap-4 transition-all duration-200 p-3 shadow-sm bg-[#5c5c5c] hover:bg-[#4a4a4a] cursor-pointer ring-offset-2',
              {
                'ring-2 ring-primary border-transparent': value === item.value,
                'border border-transparent hover:border-gray-500': value !== item.value,
              },
            )}>
            <p className='text-white text-xs font-bold font-inter-tight uppercase tracking-wide leading-[100%] ml-1'>
              {item.label}
            </p>
            <div className='w-full aspect-[2/1] rounded-[8px] overflow-hidden bg-black/20'>
              <img src={item.src} alt={item.alt} className='w-full h-full object-cover' />
            </div>
          </Label>
        </div>
      ))}
    </RadioGroup>
  )
}

export interface IRadioGroupProps {
  value: string
  label: string
  src: string
  alt: string
}
