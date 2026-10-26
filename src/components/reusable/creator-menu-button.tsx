import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { getRoutePath } from '@/config/get-route-path'
import { getUserInitials } from '@/lib/utils'
import { useLogout } from '@/hooks/use-auth'
import type { User } from '@/types/auth'
import { useNavigate, useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { CreatorSettingsModal } from '@/pages/creators/standalone/components/creator-settings-modal'

interface CreatorMenuButtonProps {
  user: User | null
  variant?: 'dark' | 'light'
  onSettingsClick?: () => void
}

export function CreatorMenuButton({ user, variant = 'light', onSettingsClick }: CreatorMenuButtonProps) {
  const navigate = useNavigate()
  const location = useLocation()
  const logoutMutation = useLogout()
  const [settingsOpen, setSettingsOpen] = useState(false)

  // Auto-open settings modal when navigated here with { state: { openSettings: true } }
  useEffect(() => {
    if (location.state?.openSettings) {
      setSettingsOpen(true)
      navigate(location.pathname, { replace: true, state: {} })
    }
  }, [location.state?.openSettings])

  const handleLogout = () => {
    logoutMutation.mutate()
  }

  const handleDashboardClick = () => {
    if (!user) return

    switch (user.accountType) {
      case 'Organizer':
        navigate(getRoutePath('standalone'))
        break
      case 'Vendor':
        navigate(getRoutePath('vendor_profile'))
        break
      default:
        navigate(getRoutePath('home'))
    }
  }

  return (
    <>
      {/* Non-modal: a modal menu locks the page (pointer-events: none on the
          body), and opening the Settings dialog from it could leave that lock
          behind, so the avatar stopped opening the menu again. */}
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button
            className={`py-2 px-3 h-10 w-10 transition-colors border flex items-center justify-center gap-[5px] rounded-full group ${
              variant === 'dark'
                ? 'border-white text-white hover:bg-white/20 bg-black'
                : 'border-black text-black hover:bg-black/10 bg-white'
            }`}>
            <span
              className={`font-sf-pro-text text-[14px] uppercase ${
                variant === 'dark'
                  ? 'text-white group-hover:text-white'
                  : 'text-black group-hover:text-black'
              }`}>
              {getUserInitials(user)}
            </span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className='w-56' align='end'>
          <DropdownMenuLabel className='font-normal'>
            <div className='flex flex-col space-y-1'>
              <p className='text-sm font-medium leading-none'>
                {user?.profile?.firstName} {user?.profile?.lastName}
              </p>
              <p className='text-xs leading-none text-muted-foreground'>{user?.email}</p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onSelect={handleDashboardClick}>Dashboard</DropdownMenuItem>
          <DropdownMenuItem onSelect={() => onSettingsClick ? onSettingsClick() : setSettingsOpen(true)}>Settings</DropdownMenuItem>
          <DropdownMenuItem onSelect={handleLogout}>Log out</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Settings modal rendered outside dropdown to avoid Radix nesting issues */}
      <CreatorSettingsModal open={settingsOpen} onOpenChange={setSettingsOpen} />
    </>
  )
}
