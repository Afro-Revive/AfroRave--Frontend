import { BasePopover } from '@/components/reusable'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { Ellipsis } from 'lucide-react'

export function ActionPopover({
  isDeleting,
  isUpdating,
  onDelete,
  onEdit,
  editLabel = 'Edit',
  extraActions,
}: IActionPopover) {
  const isBusy = isUpdating || isDeleting

  return (
    <BasePopover
    className='bg-white'
      trigger={
        <Button variant='ghost' className='hover:bg-black/10' disabled={isBusy}>
          <Ellipsis width={3} height={15} color='#1E1E1E' />
        </Button>
      }
      content={
        <>
          {extraActions}

          {/* Omitted where there's nothing to edit — the edit-event tab lists
              saved tickets it can only delete. */}
          {onEdit && (
            <ActionPopoverItem onClick={onEdit} disabled={isBusy}>
              {isUpdating ? 'Updating...' : editLabel}
            </ActionPopoverItem>
          )}

          <ActionPopoverItem onClick={onDelete} disabled={isBusy} destructive>
            {isDeleting ? 'Deleting...' : 'Delete'}
          </ActionPopoverItem>
        </>
      }
    />
  )
}

/** Exported so callers filling `extraActions` match the built-in entries. */
export function ActionPopoverItem({
  onClick,
  disabled,
  destructive = false,
  children,
}: {
  onClick: () => void
  disabled?: boolean
  destructive?: boolean
  children: React.ReactNode
}) {
  return (
    <Button
      variant='ghost'
      onClick={onClick}
      disabled={disabled}
      className={cn('font-inter', destructive && 'text-deep-red hover:text-deep-red/80')}>
      {children}
    </Button>
  )
}

interface IActionPopover {
  isDeleting: boolean
  isUpdating: boolean
  onEdit?: () => void
  onDelete: () => void
  /** Defaults to 'Edit' — ticket cards say 'Edit Ticket'. */
  editLabel?: string
  /** Rendered above Edit, for actions only some callers have. */
  extraActions?: React.ReactNode
}
