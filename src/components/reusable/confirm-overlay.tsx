import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { X } from 'lucide-react'

/**
 * The "are you sure?" card. BaseModal shows it over a modal; the cart and
 * checkout pages show it over the whole screen with `fixed`.
 */
export function ConfirmOverlay({
  title,
  message,
  confirmText = 'Go Back',
  cancelText,
  onConfirm,
  onCancel,
  fixed = false,
}: {
  title: string
  message: string
  confirmText?: string
  cancelText: string
  onConfirm: () => void
  onCancel: () => void
  /** Cover the viewport instead of the nearest positioned parent. */
  fixed?: boolean
}) {
  return (
    <div
      role='alertdialog'
      aria-modal='true'
      aria-label={title}
      className={cn(
        'inset-0 z-50 flex flex-col items-center justify-center bg-black/80 rounded-lg',
        fixed ? 'fixed z-[1000000] rounded-none' : 'absolute',
      )}>
      <div className='relative bg-white pt-12 pb-6 rounded-2xl flex flex-col items-center gap-4 px-8 w-full max-w-[350px]'>
        <button
          type='button'
          aria-label='Close'
          className='absolute top-3 right-3 text-[#1E1E1E] hover:text-black'
          onClick={onCancel}>
          <X size={24} />
        </button>
        <p className='text-black text-center text-xl font-semibold font-sf-pro-display'>{title}</p>
        <p className='text-[#1E1E1E] text-sm font-inter '>{message}</p>
        <div className='flex gap-4 mt-4'>
          <Button
            variant='link'
            className='bg-[#EBC8C8] text-[#AE2323] font-sf-pro-display px-8'
            onClick={onConfirm}>
            {confirmText}
          </Button>
          <Button variant='default' className='font-sf-pro-display px-8' onClick={onCancel}>
            {cancelText}
          </Button>
        </div>
      </div>
    </div>
  )
}
