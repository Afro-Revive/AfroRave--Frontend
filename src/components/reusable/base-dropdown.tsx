/**
 * A reusable dropdown menu component built on top of shadcn/ui DropdownMenu.
 * Supports navigation links, click actions, icons, and custom positioning.
 * Automatically handles route changes and cleanup.
 *
 * @example
 * ```tsx
 * <BaseDropdown
 *   trigger={<Button>Menu</Button>}
 *   items={[
 *     { label: 'Profile', to: '/profile', icon: <UserIcon /> },
 *     { label: 'Settings', onClick: () => handleSettings(), icon: <SettingsIcon /> },
 *     { label: 'Logout', onClick: () => handleLogout(), icon: <LogoutIcon /> }
 *   ]}
 *   align="end"
 *   side="bottom"
 *   header={<UserInfo />}
 * />
 * ```
 */
'use client'

import { type ReactNode, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu'

interface DropdownItemProps {
  /** Optional route path for navigation items */
  to?: string
  /** Click handler for action items */
  onClick?: () => void
  /** Optional icon to display before the label */
  icon?: ReactNode
  /** Display text for the menu item */
  label: string
}

interface CustomDropdownProps {
  /** The trigger element that opens the dropdown (usually a button) */
  trigger: ReactNode
  /** Array of menu items to display */
  items: DropdownItemProps[]
  /** Additional CSS classes for the dropdown content */
  className?: string
  /** Horizontal alignment of the dropdown relative to the trigger */
  align?: 'start' | 'center' | 'end'
  /** Position of the dropdown relative to the trigger */
  side?: 'top' | 'right' | 'bottom' | 'left'
  /** Optional header content to display above the menu items */
  header?: ReactNode
}

function BaseDropdown({
  trigger,
  items,
  className = '',
  align = 'end',
  side = 'bottom',
  header,
}: CustomDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      setIsOpen(false)
    }
  }, [])

  // Handle route changes
  useEffect(() => {
    const handleRouteChange = () => {
      setIsOpen(false)
    }

    window.addEventListener('popstate', handleRouteChange)
    return () => window.removeEventListener('popstate', handleRouteChange)
  }, [])

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>{trigger}</DropdownMenuTrigger>
      <DropdownMenuContent
        className={` py-2 rounded-lg w-fit font-sf-pro-display bg-[#595959]/50 text-white border-none ${className}`}
        align={align}
        side={side}
        onCloseAutoFocus={(event) => {
          event.preventDefault()
        }}>
        {header && (
          <div className='flex flex-col justify-center items-center px-4 pb-4'>{header}</div>
        )}

        {items.map((item, index) => (
          <DropdownMenuItem
            key={item.label}
            className={`cursor-pointer w-fit font-sf-pro-display text-white min-w-[150px] rounded-none ${
              index !== items.length - 1 ? 'border-b border-white' : ''
            }`}
            onSelect={(event) => {
              event.preventDefault()
              setIsOpen(false)
              if (item.onClick) {
                item.onClick()
              }
            }}>
            {item.to ? (
              <Link
                to={item.to}
                className='flex items-center text-base font-input-mono  font-light'
                onClick={(e) => {
                  e.stopPropagation()
                  setIsOpen(false)
                }}>
                {item.icon && <span className='mr-3'>{item.icon}</span>}
                {item.label}
              </Link>
            ) : (
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setIsOpen(false)
                  item.onClick?.()
                }}
                className='flex items-center w-full text-base font-sf-pro-text font-light'
                type='button'>
                {item.icon && <span className='mr-3'>{item.icon}</span>}
                {item.label}
              </button>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default BaseDropdown
