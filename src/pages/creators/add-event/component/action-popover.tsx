import { BasePopover } from '@/components/reusable'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { Ellipsis } from 'lucide-react'
import { createContext, useContext, useRef, useState } from 'react'

/** Lets any item, including ones a caller passes in, close the menu it sits in. */
const CloseMenuContext = createContext<() => void>(() => {})

export function ActionPopover({
  isDeleting,
  isUpdating,
  onDelete,
  onEdit,
  editLabel = 'Edit',
  extraActions,
}: IActionPopover) {
  const isBusy = isUpdating || isDeleting
  // Controlled, so picking an option closes the menu instead of leaving it open
  // over the form it just opened.
  const [open, setOpen] = useState(false)
  // Set when an option closes the menu. Focus then stays put instead of going
  // back to the ⋮, which would scroll the page to it and away from whatever
  // the option opened (Edit Ticket's form, at the top). Escape and clicking
  // outside still return focus to the ⋮.
  const pickedRef = useRef(false)

  function closeAfterPick() {
    pickedRef.current = true
    setOpen(false)
  }

  return (
    <CloseMenuContext.Provider value={closeAfterPick}>
      <BasePopover
        open={open}
        onOpenChange={setOpen}
        side='left'
        align='center'
        collisionPadding={16}
        onCloseAutoFocus={(event) => {
          if (pickedRef.current) event.preventDefault()
          pickedRef.current = false
        }}
        className='bg-white'
        trigger={
          <Button variant='ghost' aria-label='Ticket options' className='hover:bg-black/10' disabled={isBusy}>
            <Ellipsis width={3} height={15} color='#1E1E1E' className='rotate-90' />
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
    </CloseMenuContext.Provider>
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
  const closeMenu = useContext(CloseMenuContext)

  return (
    <Button
      variant='ghost'
      onClick={() => {
        closeMenu()
        onClick()
      }}
      disabled={disabled}
      className={cn('font-inter-tight', destructive && 'text-deep-red hover:text-deep-red/80')}>
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
