import { Badge } from '@/components/ui/badge'
import { type AccessControlItem, accessControlList } from '@/data/staff'
import { cn } from '@/lib/utils'
import { SearchData } from '@/pages/vendor/component/search-data'
import { VendorHeader } from '@/pages/vendor/component/vendor-header'
import { Info } from 'lucide-react'

export default function AccessControlPage() {
  return (
    <section className='w-full h-full flex flex-col items-center'>
      <VendorHeader type='access-control' />

      <div className='w-full h-full flex flex-col pt-10 pb-14 px-5 md:px-8'>
        <div className='w-full h-full bg-white flex flex-col gap-2.5 rounded-[4px]'>
          <SearchData />

          <div className='flex flex-col'>
            {accessControlList.map((item) => (
              <AccessControlList key={item.name} {...item} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function AccessControlList({ name, action, status }: AccessControlItem) {
  return (
    <div className='flex items-center justify-between px-8 py-5 border-t border-mid-dark-gray/30 last:border-y hover:bg-black/5'>
      <div className='flex flex-col gap-0.5'>
        <p className='font-inter-tight text-sm text-black'>{name}</p>
        <p className='font-inter-tight text-xs text-black'>{action}</p>
      </div>

      <div className='flex items-center gap-8'>
        <Badge
          className={cn('font-inter-tight text-xs capitalize p-0 bg-transparent', {
            'text-bright-mint': status === 'Active' || status === 'Complete',
            'text-deep-red': status === 'Rejected' || status === 'Pending',
          })}>
          {status}
        </Badge>

        <Info size={20} color='#000000' />
      </div>
    </div>
  )
}
