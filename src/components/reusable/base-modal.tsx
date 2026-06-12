/**
 * A reusable modal component built on top of shadcn/ui Dialog.
 * Provides a flexible way to display content in a modal dialog with various customization options.
 * Supports different sizes, footer content, and overlay behaviors.
 *
 * @example
 * ```tsx
 * <BaseModal
 *   trigger={<Button>Open Modal</Button>}
 *   title="Modal Title"
 *   description="Modal description"
 *   size="large"
 *   hasFooter
 *   footerContent={<Button>Close</Button>}
 * >
 *   <div>Modal content goes here</div>
 * </BaseModal>
 * ```
 */
import type { ReactNode } from 'react'
import { VisuallyHidden } from '@radix-ui/react-visually-hidden'
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '../ui/dialog'
import { cn } from '@/lib/utils'

/** Available modal size options */
const sizeClasses = {
  /** Small modal (415px max width) */
  small: 'sm:max-w-[415px]',
  /** Large modal (864px max width) */
  large: 'sm:max-w-[864px]',
  /** Full height modal with vertical scrolling */
  full: ' h-full w-full max-w-full',
}

interface CustomModalProps {
  /** Trigger element that opens the modal (usually a button) */
  trigger?: ReactNode
  /** Modal title (visually hidden by default) */
  title?: string | React.ReactNode
  /** Modal description (visually hidden by default) */
  description?: string | React.ReactNode
  /** Modal content */
  children: ReactNode
  /** Additional CSS classes for the modal */
  className?: string
  /** Controlled open state */
  open?: boolean
  /** Callback when modal closes */
  onClose?: (open: boolean) => void
  /** Modal size variant */
  size?: keyof typeof sizeClasses
  /** Whether to remove the default cancel button */
  removeCancel?: boolean
  /** Whether to show a floating cancel button */
  floatingCancel?: boolean
  /** Whether to show the footer section */
  hasFooter?: boolean
  /** Footer content (usually buttons) */
  footerContent?: ReactNode
  /** Whether to disable closing on overlay click */
  disableOverlayClick?: boolean
  /** Whether to cancel on overlay click */
  cancelOnOverlay?: boolean
  /** Additional CSS classes for the overlay */
  overlayClassName?: string
}

/**
 * Base modal component that provides a consistent way to display content in a modal dialog.
 * Supports various customization options including size, footer, and overlay behaviors.
 */
function BaseModal({
  trigger,
  title,
  description,
  children,
  open,
  onClose,
  size = 'small',
  removeCancel = false,
  floatingCancel = false,
  hasFooter = false,
  footerContent,
  className,
  disableOverlayClick = false,
  cancelOnOverlay = false,
  overlayClassName,
}: CustomModalProps) {
  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        if (!open) {
          onClose?.(open)
        }
      }}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent
        className={cn(
          ` ${sizeClasses[size]} p-0 rounded-[8px] flex flex-col gap-0 w-[90%] sm:w-full`,
          'transition-all duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)]',
          className,
        )}
        overlayClassName={overlayClassName}
        noCancel={removeCancel}
        floatingCancel={floatingCancel}
        onClick={(e) => e.stopPropagation()}
        onInteractOutside={(e) => {
          if (disableOverlayClick) {
            e.preventDefault()
          }
        }}
        cancelOnOverlay={cancelOnOverlay}>
        <DialogHeader className='w-full flex flex-col items-center justify-center font-input-mono'>
          <DialogTitle>
            {title || <VisuallyHidden>{title || 'Modal Dialog'}</VisuallyHidden>}
          </DialogTitle>
          <DialogDescription>
            {description || <VisuallyHidden>Modal content</VisuallyHidden>}
          </DialogDescription>
        </DialogHeader>

        <div className='flex flex-col transition-all duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)]'>{children}</div>

        {hasFooter && <div className='absolute  bottom-0  right-0 z-10'>{footerContent}</div>}
      </DialogContent>
    </Dialog>
  )
}

export default BaseModal
