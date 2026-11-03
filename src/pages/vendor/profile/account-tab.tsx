import { nigerianStates } from '@/pages/creators/add-event/constant'
import { useAfroStore } from '@/stores'
import { VENDOR_CATEGORIES } from '@/types/vendor'
import { COUNTRIES, DAYS, GENDERS, MONTHS, PHONE_CODES, YEARS } from './profile-draft'
import { InsetInput, InsetSelect, SaveButton } from './profile-fields'
import type { ITab } from './profile-tab'

export function AccountTab({ draft, update, onSave, isDirty, isSaving }: ITab) {
  const { user } = useAfroStore()

  return (
    <div className='flex flex-col gap-8'>
      <section className='flex flex-col gap-3.5'>
        <h3 className='font-inter-tight text-base font-bold text-white'>Business Details</h3>
        <InsetInput
          label='BUSINESS NAME'
          value={draft.businessName}
          onChange={(e) => update({ businessName: e.target.value })}
          maxLength={85}
        />
        <InsetInput
          label='WEB URL'
          hint='(optional)'
          type='url'
          value={draft.webUrl}
          onChange={(e) => update({ webUrl: e.target.value })}
        />
        <InsetSelect
          label='Category'
          inlineLabel
          value={draft.category}
          onChange={(category) => update({ category })}
          items={VENDOR_CATEGORIES}
        />
      </section>

      <section className='flex flex-col gap-3.5'>
        <h3 className='font-inter-tight text-xl font-bold text-white'>User Information</h3>
        <InsetInput label='First Name' value={draft.firstName} onChange={(e) => update({ firstName: e.target.value })} maxLength={75} />
        <InsetInput label='Last Name' value={draft.lastName} onChange={(e) => update({ lastName: e.target.value })} maxLength={75} />
        {/* Read only: it's the vendor's sign-in email. */}
        <InsetInput label='Email' type='email' value={draft.email} disabled readOnly />
        {/* Changed in Settings; shown so the vendor knows where their sign-in lives. */}
        <InsetInput label='Password' type='password' value={user ? '*************' : ''} disabled readOnly />

        <InsetSelect label='Gender' value={draft.gender} onChange={(gender) => update({ gender })} items={GENDERS} className='mt-4' />

        <div className='grid grid-cols-2 gap-1.5 sm:grid-cols-4'>
          <div className='col-span-2 flex min-h-[76px] items-center rounded-lg border border-white/80 px-4 font-inter-tight text-sm text-white sm:col-span-1'>
            Birthday
          </div>
          <InsetSelect label='Month' value={draft.birthMonth} onChange={(birthMonth) => update({ birthMonth })} items={MONTHS} placeholder='' />
          <InsetSelect label='Day' value={draft.birthDay} onChange={(birthDay) => update({ birthDay })} items={DAYS} placeholder='' />
          <InsetSelect
            label='Year'
            value={draft.birthYear}
            onChange={(birthYear) => update({ birthYear })}
            items={YEARS}
            placeholder=''
            className='max-sm:col-span-2'
          />
        </div>

        <div className='grid gap-3.5 sm:grid-cols-2'>
          <InsetSelect
            label='Country'
            value={draft.country}
            // A state from the old country wouldn't belong to the new one.
            onChange={(country) => update(country === draft.country ? { country } : { country, state: '' })}
            items={COUNTRIES}
          />
          {draft.country === 'nigeria' ? (
            <InsetSelect label='State' value={draft.state} onChange={(state) => update({ state })} items={nigerianStates} />
          ) : (
            <InsetInput label='State' value={draft.state} onChange={(e) => update({ state: e.target.value })} placeholder='...' />
          )}
        </div>

        <div className='grid grid-cols-[120px_1fr] gap-1.5'>
          <InsetSelect
            label='Country code'
            inlineLabel
            value={draft.phoneCode}
            onChange={(phoneCode) => update({ phoneCode })}
            items={PHONE_CODES}
            className='min-h-[82px] [&>span]:text-lg [&>span]:font-normal'
          />
          <InsetInput
            label='Phone Number'
            type='tel'
            inputMode='tel'
            value={draft.phoneDigits}
            onChange={(e) => update({ phoneDigits: e.target.value.replace(/[^\d]/g, '') })}
            placeholder='...'
          />
        </div>
      </section>

      <SaveButton disabled={!isDirty} isSaving={isSaving} onClick={onSave} />
    </div>
  )
}
