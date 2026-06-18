import type { ReactNode } from 'react'
import { useState } from 'react'
import { X } from 'lucide-react'
import { VisuallyHidden } from '@radix-ui/react-visually-hidden'
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '../ui/dialog'
import { Button } from '../ui/button'
import { cn } from '@/lib/utils'

const sizeClasses = {
  small: 'sm:max-w-[415px]',
  large: 'sm:max-w-[864px]',
  full: ' h-full w-full max-w-full',
}

interface CustomModalProps {
  trigger?: ReactNode
  title?: string | React.ReactNode
  description?: string | React.ReactNode
  children: ReactNode
  className?: string
  open?: boolean
  onClose?: (open: boolean) => void
  size?: keyof typeof sizeClasses
  removeCancel?: boolean
  floatingCancel?: boolean
  hasFooter?: boolean
  footerContent?: ReactNode
  disableOverlayClick?: boolean
  cancelOnOverlay?: boolean
  overlayClassName?: string
  /** Show a confirmation overlay on top of the modal when close is clicked */
  confirmClose?: boolean
  /** Header title of the confirmation overlay */
  confirmCloseTitle?: string
  /** Description shown in the confirmation overlay */
  confirmCloseMessage?: string
  /** Label for the "leave" button */
  confirmCloseConfirmText?: string
  /** Label for the "stay" button */
  confirmCloseCancelText?: string
}

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
  confirmClose = false,
  confirmCloseTitle = 'Are you sure?',
  confirmCloseMessage = 'Your progress will be lost if you leave.',
  confirmCloseConfirmText = 'Go Back',
  confirmCloseCancelText = 'Return to Cart',
}: CustomModalProps) {
  const [showConfirm, setShowConfirm] = useState(false)

  function handleOpenChange(nextOpen: boolean) {
    if (!nextOpen) {
      if (confirmClose) {
        setShowConfirm(true)
        return
      }
      onClose?.(nextOpen)
    }
  }

  function handleConfirmClose() {
    setShowConfirm(false)
    onClose?.(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
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
          if (disableOverlayClick || confirmClose) {
            e.preventDefault()
            if (confirmClose) setShowConfirm(true)
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

        {hasFooter && <div className='absolute bottom-0 right-0 z-10'>{footerContent}</div>}

        {/* Confirmation overlay rendered on top of modal content */}
        {showConfirm && (
          <div className='absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/80 rounded-lg'>
            <div className='relative bg-white pt-12 pb-6 rounded-2xl flex flex-col items-center gap-4 px-8 w-full max-w-[350px]'>
              <button
                type='button'
                className='absolute top-3 right-3 text-[#1E1E1E] hover:text-black'
                onClick={() => setShowConfirm(false)}>
                <X size={24} />
              </button>
              <p className='text-black text-center text-xl font-semibold font-sf-pro-display'>
                {confirmCloseTitle}
              </p>
              <p className='text-[#1E1E1E] text-sm font-inter '>
                {confirmCloseMessage}
              </p>
              <div className='flex gap-4 mt-4'>
                <Button
                  variant='link'
                  className='bg-[#EBC8C8] text-[#AE2323] font-sf-pro-display px-8'
                  onClick={handleConfirmClose}>
                  {confirmCloseConfirmText}
                </Button>
                <Button
                  variant='default'
                  className='font-sf-pro-display px-8'
                  onClick={() => setShowConfirm(false)}>
                  {confirmCloseCancelText}
                </Button>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

export default BaseModal
