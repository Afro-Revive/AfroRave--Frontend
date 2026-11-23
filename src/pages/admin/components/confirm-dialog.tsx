import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { cn } from '@/lib/utils'

/**
 * Asks before an admin action. It stays open while the request runs, so a
 * second click can't send a toggle twice and undo the first.
 */
export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel,
  tone = 'danger',
  isPending,
  onConfirm,
  onClose,
}: {
  open: boolean
  title: string
  description: React.ReactNode
  confirmLabel: string
  tone?: 'danger' | 'neutral'
  isPending: boolean
  onConfirm: () => void
  onClose: () => void
}) {
  return (
    <AlertDialog open={open} onOpenChange={(next) => !next && !isPending && onClose()}>
      <AlertDialogContent className='border-white/10 bg-[#1a1a1a] font-inter-tight text-white'>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription asChild>
            <div className='flex flex-col gap-2 text-sm text-white/70'>{description}</div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className='gap-2'>
          <button
            type='button'
            onClick={onClose}
            disabled={isPending}
            className='h-9 rounded-lg border border-white/15 px-4 text-sm text-white hover:bg-white/10 disabled:opacity-50'>
            Cancel
          </button>
          <button
            type='button'
            onClick={onConfirm}
            disabled={isPending}
            className={cn(
              'h-9 rounded-lg px-4 text-sm font-semibold disabled:opacity-60',
              tone === 'danger' ? 'bg-deep-red text-white hover:bg-deep-red/90' : 'bg-white text-system-black hover:bg-white/90',
            )}>
            {isPending ? 'Working…' : confirmLabel}
          </button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
