import { slots } from '@/data/slots'
import { SearchData } from '../component/search-data'
import { VendorItem } from '../component/vendor-item'
import { Button } from '@/components/ui/button'
import VendorSelect from '@/components/shared/vendor-select'
import { Upload } from 'lucide-react'
import { AddFilterBUtton } from '@/pages/creators/standalone/components/add-filter-btn'
import CreateVendorSlot from '../component/create-vendor-slot-modal'
import { cn } from '@/lib/utils'

export default function RevenueVendorPage() {
  return (
    <section className='w-full h-full flex flex-col items-center'>
      <div className='w-full flex flex-wrap items-center justify-between bg-white h-36 md:h-14 px-8 border-l border-light-gray'>
        <AddFilterBUtton />

        <div className='flex items-center gap-2 md:gap-8'>
          <SectionMapBtn type='upload' />
          <SectionMapBtn type='edit' />

          <VendorSelect />

          <CreateVendorSlot type='Revenue' />
        </div>
      </div>

      <div className='w-full h-full flex flex-col pt-10 pb-14 px-5'>
        <div className='w-full h-full bg-white flex flex-col gap-2.5 rounded-[4px]'>
          <SearchData />

          <div className='w-full h-full flex flex-col'>
            {slots.map((item) => (
              <VendorItem key={item.id} {...item} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function SectionMapBtn({ type }: { type: 'edit' | 'upload' }) {
  return (
    <Button
      variant='ghost'
      className={cn('h-8 flex items-center gap-1 hover:bg-black/10', {
        'text-[#00AD2E]': type === 'edit',
        'text-deep-red': type === 'upload',
      })}>
      <Upload size={18} />
      <span className='text-xs font-sf-pro-display'>Upload Section Map</span>
    </Button>
  )
}
