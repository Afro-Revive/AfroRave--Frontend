/**
 * The account's guest allowance, pinned bottom-right. The sentence is derived
 * from the numbers so the two can't contradict each other.
 */
export function GuestLimitCard({ used, total }: { used: number; total: number }) {
  const remaining = Math.max(total - used, 0)
  const percentUsed = total > 0 ? Math.min((used / total) * 100, 100) : 0

  return (
    <div className='pointer-events-none sticky bottom-6 flex w-full justify-end px-5 lg:px-10'>
      <div className='pointer-events-auto w-full max-w-[280px] flex flex-col gap-2 rounded-xl bg-white p-4 shadow-[0px_4px_16px_0px_#00000014]'>
        <p className='font-work-sans text-sm text-mid-dark-gray'>
          <span className='text-base font-bold text-black'>{used}</span> / {total}
        </p>

        <div
          role='progressbar'
          aria-valuenow={used}
          aria-valuemin={0}
          aria-valuemax={total}
          className='h-1.5 w-full overflow-hidden rounded-full bg-black/10'>
          <div className='h-full rounded-full bg-deep-red' style={{ width: `${percentUsed}%` }} />
        </div>

        <p className='font-work-sans text-xs text-mid-dark-gray'>
          {remaining} spaces left. The limit covers your whole account.
        </p>
      </div>
    </div>
  )
}
