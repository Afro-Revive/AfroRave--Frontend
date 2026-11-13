import { Button } from '@/components/ui/button'
import { AddFilterBUtton } from '@/pages/creators/standalone/components/add-filter-btn'
import { Download, Plus } from 'lucide-react'

export function VendorHeader({
  type = 'revenue',
}: {
  type?: 'service' | 'revenue' | 'access-control'
}) {
  return (
    <div className='w-full flex items-center justify-between bg-white h-14 px-8 border-l border-light-gray'>
      <AddFilterBUtton />

      <div className='flex items-center gap-8'>
        <Button
          variant='ghost'
          disabled={type === 'revenue'}
          className='gap-1 py-0.5 px-1.5 hover:bg-black/10'>
          <Download color='#000000' size={16} />
          <span className='font-medium text-xs font-inter-tight text-black'>Download</span>
        </Button>

        <Button variant='ghost' className='gap-2 py-0.5 px-1.5 hover:bg-black/10'>
          <span className='font-medium text-xs font-inter-tight text-black'>
            {RenderBtnName(type)}
          </span>
          <img src='/assets/dashboard/creator/live.png' alt='Chevron Down' width={20} height={18} />
        </Button>

        <Button variant='destructive' className='p-3 rounded-[6px] gap-8'>
          <Plus color='#ffffff' size={12} />
          <span className='font-inter-tight text-xs'>Add {RenderText(type)}</span>
        </Button>
      </div>
    </div>
  )
}

function RenderBtnName(text: 'service' | 'revenue' | 'access-control') {
  if (text === 'revenue' || text === 'service') return ' Blackmarket Flea'
  if (text === 'access-control') return 'Afro Fest'
}

function RenderText(text: 'service' | 'revenue' | 'access-control') {
  if (text === 'revenue') return 'Slot'
  if (text === 'service') return 'Offer'
  if (text === 'access-control') return 'Staff'
}
