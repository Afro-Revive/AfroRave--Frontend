import { useAfroStore } from "@/stores";
import { Link } from "react-router-dom";
import { getRoutePath } from "@/config/get-route-path";
import { getUserInitials } from '@/lib/utils'
import { useLogout } from '@/hooks/use-auth'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { VendorEditProfileModal } from '@/pages/vendor/profile/edit-profile-modal'
import type { User } from '@/types/auth'
import { RiMenuLine } from 'react-icons/ri'

function VendorMenuButton({ user }: { user: User | null }) {
  const logoutMutation = useLogout()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          aria-label="Account menu"
          className="flex size-9 items-center justify-center rounded-full border-[1.5px] border-white font-inter-tight text-[13px] font-bold text-white transition-colors hover:bg-white/10"
        >
          {getUserInitials(user)}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='w-56' align='end' forceMount>
        <DropdownMenuLabel className='font-normal'>
          <div className='flex flex-col space-y-1'>
            <p className='text-sm font-medium leading-none'>
              {user?.profile?.firstName} {user?.profile?.lastName}
            </p>
            <p className='text-xs leading-none text-muted-foreground'>{user?.email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <VendorEditProfileModal
          defaultTab='settings'
          customTrigger={
            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
              Settings
            </DropdownMenuItem>
          }
        />
        <DropdownMenuItem onClick={() => logoutMutation.mutate()}>Log out</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default function VendorDashboardHeader({ onMenuClick }: { onMenuClick: () => void }) {
  const { user } = useAfroStore();

  return (
    <header className="sticky top-0 z-30 h-[58px] w-full border-b border-[#2A2A2A] bg-[#1E1E1E]">
      <nav className="flex h-full w-full items-center justify-between px-4 md:px-8">
        <div className="flex items-center gap-3">
          <button
            type="button"
            aria-label="Open menu"
            onClick={onMenuClick}
            className="-ml-1 flex size-9 items-center justify-center rounded-md text-white hover:bg-white/10 lg:hidden"
          >
            <RiMenuLine className="size-5" />
          </button>

          <Link to={getRoutePath("vendor_discover")}>
            <img src="/assets/landing-page/AR.png" alt="AfroRevive" width={64} height={20} className="h-5 w-auto" />
          </Link>
        </div>

        <VendorMenuButton user={user} />
      </nav>
    </header>
  );
}
