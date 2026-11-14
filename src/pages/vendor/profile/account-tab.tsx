import { nigerianStates } from '@/pages/creators/add-event/constant'
import { useAfroStore } from '@/stores'
import { VENDOR_CATEGORIES } from '@/types/vendor'
import { COUNTRIES, DAYS, GENDERS, MONTHS, PHONE_CODES, YEARS } from './profile-draft'
import { ProfileInput, ProfileSelect, SaveButton } from './profile-fields'
import { FIELD_LABEL_ON_DARK_CLASS } from '@/components/shared/field-label'
import type { ITab } from './profile-tab'

export function AccountTab({ draft, update, onSave, isDirty, isSaving }: ITab) {
  const { user } = useAfroStore()

  return (
    <div className='flex flex-col gap-8'>
      <section className='flex flex-col gap-3.5'>
        <h3 className='font-inter-tight text-base font-bold text-white'>Business Details</h3>
        {/* Read only: set at sign-up. */}
        <ProfileInput label='BUSINESS NAME' value={draft.businessName} disabled readOnly />
        <ProfileInput
          label='WEB URL'
          hint='(optional)'
          type='url'
          value={draft.webUrl}
          onChange={(e) => update({ webUrl: e.target.value })}
        />
        <ProfileSelect
          label='Category'
          value={draft.category}
          onChange={(category) => update({ category })}
          items={VENDOR_CATEGORIES}
        />
      </section>

      <section className='flex flex-col gap-3.5'>
        <h3 className='font-inter-tight text-xl font-bold text-white'>User Information</h3>
        <ProfileInput label='First Name' value={draft.firstName} onChange={(e) => update({ firstName: e.target.value })} maxLength={75} />
        <ProfileInput label='Last Name' value={draft.lastName} onChange={(e) => update({ lastName: e.target.value })} maxLength={75} />
        {/* Read only: it's the vendor's sign-in email. */}
        <ProfileInput label='Email' type='email' value={draft.email} disabled readOnly />
        {/* Changed in Settings; shown so the vendor knows where their sign-in lives. */}
        <ProfileInput label='Password' type='password' value={user ? '*************' : ''} disabled readOnly />

        <ProfileSelect label='Gender' value={draft.gender} onChange={(gender) => update({ gender })} items={GENDERS} className='mt-4' />

        {/* One label over the three selects; each says what it is until it's picked. */}
        <div className='flex flex-col gap-1'>
          <p className={FIELD_LABEL_ON_DARK_CLASS}>Birthday</p>
          <div className='grid grid-cols-3 gap-1.5'>
            <ProfileSelect label='Birth month' hideLabel value={draft.birthMonth} onChange={(birthMonth) => update({ birthMonth })} items={MONTHS} placeholder='Month' />
            <ProfileSelect label='Birth day' hideLabel value={draft.birthDay} onChange={(birthDay) => update({ birthDay })} items={DAYS} placeholder='Day' />
            <ProfileSelect label='Birth year' hideLabel value={draft.birthYear} onChange={(birthYear) => update({ birthYear })} items={YEARS} placeholder='Year' />
          </div>
        </div>

        <div className='grid gap-3.5 sm:grid-cols-2'>
          <ProfileSelect
            label='Country'
            value={draft.country}
            // A state from the old country wouldn't belong to the new one.
            onChange={(country) => update(country === draft.country ? { country } : { country, state: '' })}
            items={COUNTRIES}
          />
          {draft.country === 'nigeria' ? (
            <ProfileSelect label='State' value={draft.state} onChange={(state) => update({ state })} items={nigerianStates} />
          ) : (
            <ProfileInput label='State' value={draft.state} onChange={(e) => update({ state: e.target.value })} placeholder='...' />
          )}
        </div>

        {/* One label over the code and the number. */}
        <div className='flex flex-col gap-1'>
          <p className={FIELD_LABEL_ON_DARK_CLASS}>Phone Number</p>
          <div className='grid grid-cols-[120px_1fr] gap-1.5'>
            <ProfileSelect
              label='Country code'
              hideLabel
              value={draft.phoneCode}
              onChange={(phoneCode) => update({ phoneCode })}
              items={PHONE_CODES}
              placeholder='+234'
            />
            <ProfileInput
              label='Phone number'
              hideLabel
              type='tel'
              inputMode='tel'
              value={draft.phoneDigits}
              onChange={(e) => update({ phoneDigits: e.target.value.replace(/[^\d]/g, '') })}
              placeholder='...'
            />
          </div>
        </div>
      </section>

      <SaveButton disabled={!isDirty} isSaving={isSaving} onClick={onSave} />
    </div>
  )
}
