import { useVendorProfile } from '@/hooks/use-profile-mutations'
import { useVendorProfileComplete, useVendorSummary } from '@/hooks/use-vendor'
import { VendorEditProfileModal } from '@/pages/vendor/profile/edit-profile-modal'
import { useAfroStore } from '@/stores'
import type { VendorProfileData } from '@/types/profile'
import { vendorCategoryLabel } from '@/types/vendor'
import { RiEditBoxLine, RiInformationLine } from 'react-icons/ri'

export function VendorProfileCard() {
  const { user } = useAfroStore()
  const { data: profileResponse } = useVendorProfile()
  const { data: summary } = useVendorSummary()
  const isProfileComplete = useVendorProfileComplete()

  const profile = profileResponse?.data as VendorProfileData | undefined
  const name = profile?.businessName || user?.profile.businessName || user?.profile.companyName || 'Your business'
  const category = vendorCategoryLabel(
    profile?.category || profile?.vendorCategory || profile?.businessCategory || user?.profile.vendorType,
  )
  const phone = profile?.contactPhone || user?.profile.phoneNumber
  const email = profile?.contactEmail || user?.email
  const picture =
    profile?.businessData?.profilePicture || profile?.profilePicture || user?.profile.businessData?.profilePicture

  return (
    <section className='flex flex-col gap-5 rounded-[20px] bg-[#2A2A2A] p-[18px] pt-9'>
      <div className='flex items-center gap-3'>
        <div className='flex size-[54px] shrink-0 items-center justify-center overflow-hidden rounded-full bg-black'>
          {picture ? (
            <img src={picture} alt={name} className='size-full object-cover' />
          ) : (
            <img src='/assets/landing-page/AR.png' alt='' className='w-9' />
          )}
        </div>
        <div className='flex min-w-0 flex-col gap-1'>
          <p className='font-inter-tight text-xl leading-tight font-black break-words text-white uppercase'>
            {name}
          </p>
          {category && <p className='font-inter-tight text-sm text-white'>{category}</p>}
        </div>
      </div>

      <dl className='grid grid-cols-[auto_1fr] gap-x-6 gap-y-2 rounded-md bg-[#4A4A4A] px-3 py-2.5 font-inter-tight text-xs text-white'>
        <dt className='font-bold'>Phone Number</dt>
        <dd className='truncate text-sm'>{phone || '—'}</dd>
        <dt className='font-bold'>Email</dt>
        <dd className='truncate text-sm'>{email || '—'}</dd>
      </dl>

      <div className='flex flex-col px-1'>
        <p className='mb-2 font-inter-tight text-base font-bold text-white'>Summary</p>
        <SummaryRow name='Saved Events' value={summary?.savedEvents} />
        <SummaryRow name='Total Slots Secured' value={summary?.acquiredSlots} />
      </div>

      <div className='flex flex-col gap-4'>
        <VendorEditProfileModal
          customTrigger={
            <button
              type='button'
              className='flex h-7 w-full items-center justify-center gap-1.5 rounded-md bg-[#4A4A4A] font-inter text-xs font-semibold text-white transition-colors hover:bg-[#555]'>
              <RiEditBoxLine className='size-3.5' />
              Edit profile
            </button>
          }
        />

        {!isProfileComplete && (
          <VendorEditProfileModal
            customTrigger={
              <button
                type='button'
                className='flex h-6 w-full items-center gap-2 rounded-md bg-[#3A3A3A] px-3 font-inter text-xs text-[#9A9A9A] transition-colors hover:text-white'>
                <RiInformationLine className='size-3.5' />
                Finish setting up your profile
              </button>
            }
          />
        )}
      </div>
    </section>
  )
}

function SummaryRow({ name, value }: { name: string; value?: number }) {
  return (
    <div className='flex h-[37px] items-center justify-between border-t border-[#3D3D3D] font-sf-pro-display text-sm text-white'>
      <span>{name}</span>
      <span className='text-xs'>{value ?? '—'}</span>
    </div>
  )
}
