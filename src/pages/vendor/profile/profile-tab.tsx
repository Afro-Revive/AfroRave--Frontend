import { useUploadImage } from '@/hooks/useCloudinaryUpload'
import { useRef, type ChangeEvent } from 'react'
import { RiAddLine, RiCloseLine, RiInstagramLine, RiLinksLine, RiLoader4Line, RiMailLine, RiPhoneFill } from 'react-icons/ri'
import { BIO_LIMIT, GALLERY_LIMIT, type VendorProfileDraft } from './profile-draft'
import { IconInput, SaveButton } from './profile-fields'
import { FIELD_LABEL_ON_DARK_CLASS } from '@/components/shared/field-label'
import { cn } from '@/lib/utils'

export function ProfileTab({ draft, update, onSave, isDirty, isSaving }: ITab) {
  const pictureInput = useRef<HTMLInputElement>(null)
  const galleryInput = useRef<HTMLInputElement>(null)
  const uploadPicture = useUploadImage()
  const uploadGallery = useUploadImage()

  async function handlePicture(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    const url = await uploadPicture.mutateAsync(file).catch(() => null)
    if (url) update({ picture: url })
  }

  async function handleGallery(e: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []).slice(0, GALLERY_LIMIT - draft.gallery.length)
    e.target.value = ''
    if (files.length === 0) return
    const results = await Promise.allSettled(files.map((file) => uploadGallery.mutateAsync(file)))
    const urls = results.flatMap((result) => (result.status === 'fulfilled' ? [result.value] : []))
    if (urls.length) update({ gallery: [...draft.gallery, ...urls] })
  }

  return (
    <div className='flex flex-col gap-6'>
      <div className='flex flex-col items-center gap-1.5'>
        <button
          type='button'
          onClick={() => pictureInput.current?.click()}
          disabled={uploadPicture.isPending}
          aria-label='Change profile picture'
          className='group relative mb-2 flex size-[86px] items-center justify-center overflow-hidden rounded-full bg-black'>
          {draft.picture ? (
            <img src={draft.picture} alt='' className='size-full object-cover' />
          ) : (
            <img src='/assets/landing-page/AR.png' alt='' className='w-14' />
          )}
          <span className='absolute inset-0 flex items-center justify-center bg-black/60 font-inter-tight text-[11px] text-white opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100'>
            {uploadPicture.isPending ? <RiLoader4Line className='size-5 animate-spin' /> : 'Change'}
          </span>
          {uploadPicture.isPending && (
            <span className='absolute inset-0 flex items-center justify-center bg-black/60'>
              <RiLoader4Line className='size-5 animate-spin text-white' />
            </span>
          )}
        </button>
        <input ref={pictureInput} type='file' accept='image/*' hidden onChange={handlePicture} />
        <p className='font-inter-tight text-lg font-bold text-white'>{draft.businessName || 'Your business'}</p>
        <p className='font-inter-tight text-sm text-white/70'>{draft.email}</p>
      </div>

      <label className='flex flex-col gap-1'>
        <span className={cn(FIELD_LABEL_ON_DARK_CLASS, 'flex justify-between')}>
          Bio
          <span className='normal-case'>
            {draft.bio.length}/{BIO_LIMIT}
          </span>
        </span>
        <textarea
          value={draft.bio}
          maxLength={BIO_LIMIT}
          onChange={(e) => update({ bio: e.target.value })}
          placeholder='Tell organizers about your business: what you offer, events you’ve worked and what makes you stand out'
          className='h-[284px] w-full resize-none rounded-md border border-white/20 bg-transparent p-3.5 font-inter-tight text-sm text-white outline-none placeholder:text-white/40 focus:border-white/50'
        />
      </label>

      <section className='flex flex-col gap-5 rounded-xl bg-[#2E2E2E] p-3.5'>
        <div>
          <h3 className='font-inter-tight text-base font-bold text-white'>Contact Details</h3>
          <p className='font-inter-tight text-sm text-white'>How organizers can reach you.</p>
        </div>
        <div className='grid gap-4 sm:grid-cols-2'>
          <IconInput
            icon={<RiMailLine className='size-4' />}
            label='Email'
            type='email'
            value={draft.email}
            // Read only: it's the vendor's sign-in email.
            disabled
            readOnly
          />
          <IconInput
            icon={<RiPhoneFill className='size-4' />}
            label='Phone Number'
            type='tel'
            inputMode='tel'
            value={draft.phoneDigits}
            onChange={(e) => update({ phoneDigits: e.target.value.replace(/[^\d]/g, '') })}
            placeholder='Add phone number'
          />
          <IconInput
            icon={<RiLinksLine className='size-4' />}
            label='Web Url (Optional)'
            type='url'
            value={draft.webUrl}
            onChange={(e) => update({ webUrl: e.target.value })}
            placeholder='Add website link'
          />
          <IconInput
            icon={<RiInstagramLine className='size-4' />}
            label='Instagram'
            value={draft.instagram}
            onChange={(e) => update({ instagram: e.target.value })}
            placeholder='Add Instagram handle'
          />
        </div>
      </section>

      <section className='flex flex-col gap-4 rounded-xl bg-[#2E2E2E] p-3.5'>
        <div>
          <h3 className='font-inter-tight text-base font-bold text-white'>Gallery</h3>
          <p className='font-inter-tight text-sm text-white'>Add photos of your past work for organizers to see.</p>
        </div>
        <div className='grid grid-cols-2 sm:grid-cols-3'>
          {draft.gallery.map((url, index) => (
            <div key={`${url}-${index}`} className='group relative aspect-square overflow-hidden bg-black'>
              <img src={url} alt={`Past work ${index + 1}`} className='size-full object-cover' />
              <button
                type='button'
                aria-label={`Remove photo ${index + 1}`}
                onClick={() => update({ gallery: draft.gallery.filter((_, i) => i !== index) })}
                className='absolute top-2 right-2 flex size-7 items-center justify-center rounded-full bg-black/70 text-white opacity-0 transition-opacity group-hover:opacity-100 focus-visible:opacity-100 max-md:opacity-100'>
                <RiCloseLine className='size-4' />
              </button>
            </div>
          ))}
          {draft.gallery.length < GALLERY_LIMIT && (
            <button
              type='button'
              onClick={() => galleryInput.current?.click()}
              disabled={uploadGallery.isPending}
              aria-label='Add photos'
              className='flex aspect-square items-center justify-center bg-[#262626] transition-colors hover:bg-[#2A2A2A]'>
              <span className='flex size-9 items-center justify-center rounded-full bg-[#4A4A4A] text-white'>
                {uploadGallery.isPending ? <RiLoader4Line className='size-5 animate-spin' /> : <RiAddLine className='size-5' />}
              </span>
            </button>
          )}
        </div>
        <input ref={galleryInput} type='file' accept='image/*' multiple hidden onChange={handleGallery} />
      </section>

      <SaveButton disabled={!isDirty || uploadPicture.isPending || uploadGallery.isPending} isSaving={isSaving} onClick={onSave} />
    </div>
  )
}

export interface ITab {
  draft: VendorProfileDraft
  update: (patch: Partial<VendorProfileDraft>) => void
  onSave: () => void
  isDirty: boolean
  isSaving: boolean
}
