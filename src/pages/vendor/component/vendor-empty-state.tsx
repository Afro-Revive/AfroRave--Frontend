import { cn } from '@/lib/utils'
import type { ReactNode } from 'react'
import { RiStore2Line } from 'react-icons/ri'

export function VendorEmptyState({
  title,
  description,
  action,
  className,
}: {
  title: string
  description?: string
  action?: ReactNode
  className?: string
}) {
  return (
    <div className={cn('flex w-full flex-col items-center justify-center gap-2 px-4 py-24 text-center', className)}>
      <span className='mb-1 flex size-10 items-center justify-center rounded-full bg-[#3A3A3A] text-[#9A9A9A]'>
        <RiStore2Line className='size-5' />
      </span>
      <p className='font-inter-tight text-lg font-bold text-[#9A9A9A]'>{title}</p>
      {description && (
        <p className='max-w-[300px] font-sf-pro-text text-sm leading-snug text-[#9A9A9A]'>{description}</p>
      )}
      {action && <div className='mt-2'>{action}</div>}
    </div>
  )
}
