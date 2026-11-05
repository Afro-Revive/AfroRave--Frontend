import { BaseSheet } from '@/components/reusable'
import { Button } from '@/components/ui/button'
import SideBarMenu from '@/layouts/root-layout/header/sidebar-menu'
import { getUserInitials } from '@/lib/utils'
import type { User } from '@/types/auth'
import { useState } from 'react'

interface UserMenuButtonProps {
  user: User | null
}

export function UserMenuButton({ user }: UserMenuButtonProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <>
      <Button
        variant='outline'
        type='button'
        aria-label='Open menu'
        onClick={() => setIsMenuOpen(true)}
        className='p-2 hover:bg-black/70 transition-colors flex items-center gap-[5px] py-2 px-3 rounded-full w-fit h-fit group bg-transparent'>
        <span className='font-sf-pro-text text-[14px] uppercase group-hover:text-white'>
          {getUserInitials(user)}
        </span>
      </Button>
      <BaseSheet
        side='right'
        size='sm'
        title='Menu'
        circleCancel
        open={isMenuOpen}
        setOpen={setIsMenuOpen}
        contentClassName='bg-pure-black text-white px-3'>
        <SideBarMenu onClose={() => setIsMenuOpen(false)} />
      </BaseSheet>
    </>
  )
}
