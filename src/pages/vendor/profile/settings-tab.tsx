import { useLogout } from '@/hooks/use-auth'
import { useChangeVendorPassword } from '@/hooks/use-vendor'
import { useState } from 'react'
import { RiCheckLine, RiLogoutBoxLine } from 'react-icons/ri'
import { ProfilePasswordInput } from './profile-fields'

const MIN_PASSWORD_LENGTH = 8

export function SettingsTab() {
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  // Not saved yet: the API has no notification preference.
  const [emailNotifications, setEmailNotifications] = useState(true)
  const changePassword = useChangeVendorPassword()
  const logout = useLogout()

  const isTooShort = newPassword.length > 0 && newPassword.length < MIN_PASSWORD_LENGTH
  const isSame = newPassword.length > 0 && newPassword === currentPassword
  const isMismatch = confirmPassword.length > 0 && confirmPassword !== newPassword
  const canSubmit =
    !!currentPassword && newPassword.length >= MIN_PASSWORD_LENGTH && !isSame && confirmPassword === newPassword

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!canSubmit) return
    changePassword.mutate(
      { currentPassword, oldPassword: currentPassword, newPassword, confirmNewPassword: confirmPassword },
      {
        onSuccess: () => {
          setCurrentPassword('')
          setNewPassword('')
          setConfirmPassword('')
        },
      },
    )
  }

  return (
    <div className='flex flex-col gap-7'>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        <h3 className='font-inter-tight text-base font-bold text-white'>Change Password</h3>
        <ProfilePasswordInput
          id='vendor-current-password'
          label='Current Password'
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          placeholder='Enter Current Password'
          autoComplete='current-password'
        />
        <div className='flex flex-col gap-1.5'>
          <ProfilePasswordInput
            id='vendor-new-password'
            label='New Password'
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder='Enter New Password'
            autoComplete='new-password'
          />
          {(isTooShort || isSame) && (
            <p className='font-inter-tight text-xs text-[#FF6B6B]'>
              {isTooShort ? `Use at least ${MIN_PASSWORD_LENGTH} characters.` : 'Choose a password you haven’t used here.'}
            </p>
          )}
        </div>
        <div className='flex flex-col gap-1.5'>
          <ProfilePasswordInput
            id='vendor-confirm-password'
            label='Confirm New Password'
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder='Enter New Password Again'
            autoComplete='new-password'
          />
          {isMismatch && <p className='font-inter-tight text-xs text-[#FF6B6B]'>Passwords don’t match.</p>}
        </div>
        <button
          type='submit'
          disabled={!canSubmit || changePassword.isPending}
          className='h-10 rounded-lg bg-white font-inter-tight text-sm font-semibold text-light-red transition-colors hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-60'>
          {changePassword.isPending ? 'Updating...' : 'Update Password'}
        </button>
      </form>

      <section className='flex flex-col gap-3'>
        <h3 className='font-inter-tight text-base font-bold text-white'>Notifications</h3>
        <label className='flex cursor-pointer items-start justify-between gap-4'>
          <span className='flex flex-col gap-1 font-inter-tight'>
            <span className='text-sm text-white/50'>Email Notifications</span>
            <span className='text-xs text-white/70'>Receive updates about your slots and new events</span>
          </span>
          <input
            type='checkbox'
            checked={emailNotifications}
            onChange={(e) => setEmailNotifications(e.target.checked)}
            className='peer sr-only'
          />
          <span
            aria-hidden
            className='mt-0.5 flex size-[18px] shrink-0 items-center justify-center rounded border border-white/40 text-white peer-checked:border-light-red peer-checked:bg-light-red peer-focus-visible:outline-2 peer-focus-visible:outline-white'>
            {emailNotifications && <RiCheckLine className='size-3' />}
          </span>
        </label>
      </section>

      <button
        type='button'
        onClick={() => logout.mutate()}
        disabled={logout.isPending}
        className='flex w-fit items-center gap-3 font-inter-tight text-sm text-white transition-opacity hover:opacity-80 disabled:opacity-60'>
        <RiLogoutBoxLine className='size-5 -scale-x-100 text-light-red' />
        Log Out
      </button>
    </div>
  )
}
