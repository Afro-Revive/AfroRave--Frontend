import { Button } from '@/components/ui/button'
import { ChevronLeft } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export function TabChildrenContainer({
  handleBackClick,
  isLoading,
  handleSaveEvent,
  currentTab,
  children,
  buttonText,
  onChange,
}: ITabChildrenProps) {
  return (
    <div className='w-full h-fit flex flex-col items-center'>
      <div className='w-full flex items-center justify-between py-3 px-5 md:px-8 bg-white border-l border-[#e9e9e9]'>
        <Button
          variant='ghost'
          className='w-fit h-fit hover:bg-black/10 !p-1 flex items-center gap-3'
          onClick={handleBackClick}
          disabled={!handleBackClick}>
          <ChevronLeft color='#000000' className='min-w-1.5 min-h-3' />
          <span className='text-sm font-medium leading-[100%] font-sf-pro-display text-[#0D0D0D]'>
            {buttonText}
          </span>
        </Button>

        <div className='flex items-center gap-8'>
          <Select value={currentTab} onValueChange={onChange}>
            <SelectTrigger className='w-[122px] h-8 bg-black !text-white rounded-[6px] !px-2 text-sm font-regular [&_svg]:!text-white [&_svg]:!opacity-100'>
              <SelectValue placeholder='Tabs' />
            </SelectTrigger>
            <SelectContent>
              {[
                { label: 'Event Details', value: 'event-details' },
                { label: 'Tickets', value: 'tickets' },
                { label: 'Theme', value: 'theme' },
                { label: 'Settings', value: 'settings' },
              ].map((item) => (
                <SelectItem key={item.value} value={item.value}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button
            variant='destructive'
            className='h-8 w-24 text-xs font-sf-pro-text font-black rounded-[5px]'
            onClick={handleSaveEvent}
            disabled={isLoading}>
            {isLoading ? 'SAVING...' : 'SAVE'}
          </Button>
        </div>
      </div>

      <div className='container w-full h-fit flex flex-col items-center'>{children}</div>
    </div>
  )
}

interface ITabChildrenProps {
  handleBackClick?: () => void
  isLoading?: boolean
  handleSaveEvent: () => void
  currentTab: string
  onChange: (tab: string) => void
  children: React.ReactNode
  buttonText?: string
}
