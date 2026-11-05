import { Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { useVendorProfile } from '@/hooks/use-profile-mutations'
import { useUpdateVendorProfile } from '@/hooks/use-vendor'
import { cn } from '@/lib/utils'
import { useAfroStore } from '@/stores'
import type { VendorProfileData } from '@/types/profile'
import { useState, type ReactNode } from 'react'
import { RiCloseLine } from 'react-icons/ri'
import { AccountTab } from './account-tab'
import { applyDraftToUser, toDraft, toUpdateRequest, type VendorProfileDraft } from './profile-draft'
import { ProfileTab } from './profile-tab'
import { SettingsTab } from './settings-tab'

export type VendorProfileTab = 'profile' | 'account' | 'settings'

const TABS: { value: VendorProfileTab; label: string }[] = [
  { value: 'profile', label: 'Profile' },
  { value: 'account', label: 'Account' },
  { value: 'settings', label: 'Settings' },
]

/**
 * The vendor's Profile / Account / Settings modal, opened from the sidebar's Edit profile
 * and the avatar menu's Settings. The draft is built when it opens and dropped when it closes.
 */
export function VendorEditProfileModal({ customTrigger, defaultTab = 'profile' }: { customTrigger: ReactNode; defaultTab?: VendorProfileTab }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{customTrigger}</DialogTrigger>
      <DialogContent
        noCancel
        className='flex max-h-[92vh] w-[95vw] max-w-[760px] flex-col gap-0 overflow-hidden rounded-[28px] border-none bg-[#1C1C1C] p-0 text-white sm:max-w-[760px]'>
        {isOpen && <ProfileModalBody defaultTab={defaultTab} />}
      </DialogContent>
    </Dialog>
  )
}

function ProfileModalBody({ defaultTab }: { defaultTab: VendorProfileTab }) {
  const [tab, setTab] = useState(defaultTab)
  const { user, updateUser } = useAfroStore()
  const { data: profileResponse, isPending } = useVendorProfile()
  const profile = profileResponse?.data as VendorProfileData | undefined
  const updateProfile = useUpdateVendorProfile()

  // The saved values, and what the vendor has changed since. Rebuilt once the profile loads.
  const [loadedFor, setLoadedFor] = useState<VendorProfileData | undefined>(undefined)
  const [saved, setSaved] = useState(() => toDraft(profile, user))
  const [draft, setDraft] = useState(saved)
  if (profile && profile !== loadedFor) {
    const fresh = toDraft(profile, user)
    setLoadedFor(profile)
    setSaved(fresh)
    setDraft(fresh)
  }

  const isDirty = JSON.stringify(draft) !== JSON.stringify(saved)
  const update = (patch: Partial<VendorProfileDraft>) => setDraft((prev) => ({ ...prev, ...patch }))

  function handleSave() {
    const request = toUpdateRequest(draft, profile)
    updateProfile.mutate(request, {
      onSuccess: () => {
        setSaved(draft)
        if (user) updateUser(applyDraftToUser(user, draft, request))
      },
    })
  }

  const tabProps = { draft, update, onSave: handleSave, isDirty, isSaving: updateProfile.isPending }

  return (
    <>
      <DialogTitle className='sr-only'>Your vendor profile</DialogTitle>
      <DialogDescription className='sr-only'>Edit your profile, account details and settings.</DialogDescription>

      <div className='flex shrink-0 items-center justify-between border-b border-white/15 px-6 py-5 md:px-10'>
        <div role='tablist' className='flex gap-8 md:gap-10'>
          {TABS.map((item) => (
            <button
              key={item.value}
              type='button'
              role='tab'
              aria-selected={tab === item.value}
              onClick={() => setTab(item.value)}
              className={cn(
                'font-inter-tight text-sm font-extrabold transition-colors md:text-base',
                tab === item.value ? 'text-white' : 'text-white/25 hover:text-white/50',
              )}>
              {item.label}
            </button>
          ))}
        </div>
        <DialogClose className='text-white transition-opacity hover:opacity-70' aria-label='Close'>
          <RiCloseLine className='size-8' />
        </DialogClose>
      </div>

      <div role='tabpanel' className='overflow-y-auto px-6 py-8 [scrollbar-width:thin] md:px-14'>
        {tab === 'settings' ? (
          <SettingsTab />
        ) : isPending && !profile ? (
          <div className='flex flex-col gap-4'>
            <div className='mx-auto size-[86px] animate-pulse rounded-full bg-[#2A2A2A]' />
            <div className='h-60 animate-pulse rounded-lg bg-[#2A2A2A]' />
          </div>
        ) : tab === 'profile' ? (
          <ProfileTab {...tabProps} />
        ) : (
          <AccountTab {...tabProps} />
        )}
      </div>
    </>
  )
}
