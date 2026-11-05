import { CategoryUsage } from "@/types/guestlist";
export function GuestLimitCard({ used, total, category, categoryUsage }: { used: number; total: number; category?: string; categoryUsage?: CategoryUsage }) {
  const isCategoryView = Boolean(category && categoryUsage)
  const limit = isCategoryView ? categoryUsage?.totalGuests ?? total : total
  const remaining = isCategoryView ? categoryUsage?.remainingGuests ?? 0 : Math.max(total - used, 0)
  const displayedUsed = isCategoryView ? Math.max(limit - remaining, 0) : used
  const percentUsed = limit > 0 ? Math.min((displayedUsed / limit) * 100, 100) : 0

  return (
    <div className='pointer-events-none sticky bottom-6 flex w-full justify-end px-5 lg:px-10'>
      <div className='pointer-events-auto w-full max-w-[280px] flex flex-col gap-2 rounded-xl bg-white p-4 shadow-[0px_4px_16px_0px_#00000014]'>
        <p className='font-work-sans text-sm text-mid-dark-gray'>
          <span className='text-base font-bold text-black'>{displayedUsed}</span> / {limit}
        </p>

        <div
          role='progressbar'
          aria-valuenow={displayedUsed}
          aria-valuemin={0}
          aria-valuemax={limit}
          className='h-1.5 w-full overflow-hidden rounded-full bg-black/10'>
          <div className='h-full rounded-full bg-deep-red' style={{ width: `${percentUsed}%` }} />
        </div>
        <p className='font-work-sans text-xs text-mid-dark-gray'>
          {isCategoryView ? `In the ${category} category, you have ${remaining} spaces left.` : `${remaining} spaces left. The limit covers your whole account.`}
        </p>
        
      </div>
    </div>
  )
}
