import { africanCountryCodes, nigerianStates } from '@/pages/creators/add-event/constant'
import type { User } from '@/types/auth'
import type { UpdateVendorProfileRequest, VendorBusinessData, VendorProfileData } from '@/types/profile'

/**
 * Everything the Profile and Account tabs edit. Both tabs share one draft, since the
 * email, phone and website appear in each, and either Save sends all of it.
 */
export interface VendorProfileDraft {
  picture: string
  bio: string
  email: string
  phoneCode: string
  phoneDigits: string
  webUrl: string
  instagram: string
  gallery: string[]
  businessName: string
  category: string
  firstName: string
  lastName: string
  gender: string
  birthMonth: string
  birthDay: string
  birthYear: string
  country: string
  state: string
}

export const BIO_LIMIT = 450
export const GALLERY_LIMIT = 12
const DEFAULT_PHONE_CODE = '+234'

/** '+2348146027405' -> ['+234', '8146027405'], matching the longest known code. */
function splitPhone(phone?: string | null): [string, string] {
  const value = (phone ?? '').replace(/\s+/g, '')
  if (!value.startsWith('+')) return [DEFAULT_PHONE_CODE, value]
  const match = africanCountryCodes
    .map((code) => code.value)
    .filter((code) => value.startsWith(code))
    .sort((a, b) => b.length - a.length)[0]
  return match ? [match, value.slice(match.length)] : [DEFAULT_PHONE_CODE, value.replace(/^\+/, '')]
}

/** 'https://www.instagram.com/afrorevive_' -> 'afrorevive_', so the field shows a handle. */
function instagramHandle(link?: string): string {
  if (!link) return ''
  const match = link.match(/instagram\.com\/([^/?#]+)/i)
  return match ? match[1] : link.replace(/^@/, '')
}

/** 'afrorevive_' or '@afrorevive_' -> 'https://www.instagram.com/afrorevive_'; links pass through. */
function instagramLink(handle: string): string {
  const value = handle.trim()
  if (!value) return ''
  if (/^https?:\/\//i.test(value) || /instagram\.com/i.test(value)) return value
  return `https://www.instagram.com/${value.replace(/^@/, '')}`
}

export function toDraft(profile: VendorProfileData | undefined, user: User | null): VendorProfileDraft {
  const business = profile?.businessData ?? {}
  const userBusiness = user?.profile.businessData
  const [phoneCode, phoneDigits] = splitPhone(profile?.contactPhone || user?.profile.phoneNumber)
  // The User type doesn't list dateOfBirth, but the user's profile may still carry it.
  const dateOfBirth = profile?.dateOfBirth || (user?.profile as { dateOfBirth?: string } | undefined)?.dateOfBirth
  const [birthYear = '', birthMonth = '', birthDay = ''] = dateOfBirth?.slice(0, 10).split('-') ?? []
  const country = profile?.country || user?.profile.country || ''

  return {
    picture: business.profilePicture || profile?.profilePicture || userBusiness?.profilePicture || '',
    bio: business.aboutBusiness || profile?.description || user?.profile.description || '',
    email: profile?.contactEmail || user?.email || '',
    phoneCode,
    phoneDigits,
    webUrl: business.portfolio?.webUrl || userBusiness?.portfolio?.webUrl || '',
    instagram: instagramHandle(business.socials?.instagram || userBusiness?.socials?.instagram),
    gallery: business.gallery ?? business.gallary ?? user?.profile.gallery ?? [],
    businessName: profile?.businessName || user?.profile.businessName || user?.profile.companyName || '',
    category: profile?.category || profile?.vendorCategory || profile?.businessCategory || user?.profile.vendorType || '',
    firstName: user?.profile.firstName ?? '',
    lastName: user?.profile.lastName ?? '',
    gender: user?.profile.gender ?? '',
    birthMonth: birthMonth ? String(Number(birthMonth)) : '',
    birthDay: birthDay ? String(Number(birthDay)) : '',
    birthYear,
    country,
    state: matchNigerianState(country, profile?.state || user?.profile.state || ''),
  }
}

/**
 * States saved before the State select existed were typed freely ("lagos", "Abuja").
 * Match them to the list so the select shows them; anything that doesn't match is left
 * as typed. Same as the fans' profile tab.
 */
function matchNigerianState(country: string, state: string): string {
  if (country !== 'nigeria' || !state) return state

  const typed = state.trim().toLowerCase()
  if (typed === 'abuja' || typed === 'fct') return 'Federal Capital Territory'

  const match = nigerianStates.find(
    (option) => option.value.toLowerCase() === typed || option.label.toLowerCase() === typed,
  )
  return match?.value ?? state
}

export function toUpdateRequest(draft: VendorProfileDraft, profile: VendorProfileData | undefined): UpdateVendorProfileRequest {
  const business: VendorBusinessData = profile?.businessData ?? {}
  const phone = draft.phoneDigits ? `${draft.phoneCode}${draft.phoneDigits.replace(/^0/, '')}` : ''
  const hasBirthday = draft.birthYear && draft.birthMonth && draft.birthDay

  return {
    firstName: draft.firstName.trim(),
    lastName: draft.lastName.trim(),
    businessName: draft.businessName.trim(),
    email: draft.email.trim(),
    phoneNumber: phone,
    telephone: phone,
    gender: draft.gender,
    businessData: {
      ...business,
      // Clear the old spelling so it can't bring back removed images.
      gallary: undefined,
      aboutBusiness: draft.bio.trim(),
      profilePicture: draft.picture,
      gallery: draft.gallery,
      portfolio: { ...business.portfolio, webUrl: draft.webUrl.trim() },
      socials: { ...business.socials, instagram: instagramLink(draft.instagram) },
    },
    // The profile has more than one field for each of these; keep them all in step.
    category: draft.category,
    services: draft.category,
    vendorType: draft.category,
    website: draft.webUrl.trim(),
    country: draft.country,
    state: draft.state.trim(),
    // Month as a number: '1998-03-07', never '1998-mar-07'.
    dateOfBirth: hasBirthday
      ? `${draft.birthYear}-${draft.birthMonth.padStart(2, '0')}-${draft.birthDay.padStart(2, '0')}`
      : undefined,
  }
}

/** The logged-in user with the saved draft applied, so the sidebar updates without a reload. */
export function applyDraftToUser(user: User, draft: VendorProfileDraft, request: UpdateVendorProfileRequest): User {
  return {
    ...user,
    profile: {
      ...user.profile,
      firstName: draft.firstName,
      lastName: draft.lastName,
      businessName: draft.businessName,
      phoneNumber: request.phoneNumber,
      gender: draft.gender,
      country: draft.country,
      state: request.state,
      vendorType: draft.category,
      description: request.businessData?.aboutBusiness ?? '',
      gallery: draft.gallery,
      businessData: {
        ...user.profile.businessData,
        aboutBusiness: request.businessData?.aboutBusiness ?? '',
        profilePicture: draft.picture,
        portfolio: { ...user.profile.businessData?.portfolio, webUrl: draft.webUrl },
        socials: {
          facebook: '',
          x: '',
          linkedIn: '',
          tikTok: '',
          youTube: '',
          socialLink: '',
          ...user.profile.businessData?.socials,
          instagram: request.businessData?.socials?.instagram ?? '',
        },
      },
    },
  }
}

export const GENDERS = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'other', label: 'Other' },
]

export const COUNTRIES = [
  { value: 'nigeria', label: 'Nigeria' },
  { value: 'ghana', label: 'Ghana' },
  { value: 'kenya', label: 'Kenya' },
  { value: 'south_africa', label: 'South Africa' },
]

export const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
].map((label, index) => ({ value: String(index + 1), label }))

export const DAYS = Array.from({ length: 31 }, (_, index) => ({ value: String(index + 1), label: String(index + 1) }))

export const YEARS = Array.from({ length: 90 }, (_, index) => {
  const year = String(new Date().getFullYear() - 13 - index)
  return { value: year, label: year }
})

export const PHONE_CODES = africanCountryCodes.map((code) => ({ value: code.value, label: code.value }))
