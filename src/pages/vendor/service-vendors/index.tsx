import { SearchData } from '../component/search-data'
import { slots } from '@/data/slots'
import { VendorItem } from '../component/vendor-item'
import { AddFilterBUtton } from '@/pages/creators/standalone/components/add-filter-btn'
import { ExportButton } from '../component/export-btn'
import VendorSelect from '@/components/shared/vendor-select'
import CreateVendorSlot from '../component/create-vendor-slot-modal'

export default function ServiceVendorPage() {
  return (
    <section className='w-full h-full flex flex-col items-center'>
      <div className='w-full flex flex-wrap items-center justify-between bg-white h-36 md:h-14 px-8 border-l border-light-gray'>
        <AddFilterBUtton />

        <div className='flex items-center gap-2 md:gap-8'>
          <ExportButton />
          <VendorSelect />
          <CreateVendorSlot type='Service' />
        </div>
      </div>

      <div className='w-full h-full flex flex-col pt-10 pb-14 px-5'>
        <div className='w-full h-full bg-white flex flex-col gap-2.5 rounded-[4px]'>
          <SearchData />

          <div className='w-full flex flex-col'>
            {slots.map((item) => (
              <VendorItem key={item.id} {...item} type='service' />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
