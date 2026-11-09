import type { ProfileSchema } from '@/schema/profile-shema'
import type { UpdateUserProfileRequest, UserProfileData } from '@/types'
import type { z } from 'zod'
import { fromDateOfBirth, toDateOfBirth } from './helper-func'

/**
 * Transforms profile form data to API request format
 */
export function transformProfileToUpdateRequest(
  formData: z.infer<typeof ProfileSchema>,
): UpdateUserProfileRequest {
  // The month select holds "mar", so it's turned back into "03": "1998-03-07".
  // The schema makes all three required, so there's always a date here.
  const dateOfBirth = toDateOfBirth(formData.birthday) ?? ''

  // Format phone number with country code
  const telephone = `${formData.number.country_code}${formData.number.digits}`

  return {
    firstName: formData.first_name,
    lastName: formData.last_name,
    email: formData.email,
    telphone: telephone,
    gender: formData.gender,
    dateOfBirth,
    country: formData.country,
    state: formData.state,
  }
}

/**
 * Transforms API response data to form format
 */
export function transformProfileFromResponse(
  apiData: UserProfileData,
): z.infer<typeof ProfileSchema> {
  // Read from the date's own digits, so a time zone can't shift the day; no
  // date on file leaves the selects empty.
  const birthday = fromDateOfBirth(apiData.dateOfBirth) ?? { month: '', day: '', year: '' }

  // Parse phone number
  const phoneNumber = apiData.phoneNumber || ''
  const countryCode = phoneNumber.startsWith('+') ? phoneNumber.substring(0, 4) : ''
  const digits = phoneNumber.startsWith('+') ? phoneNumber.substring(4) : phoneNumber

  return {
    first_name: apiData.firstName || '',
    last_name: apiData.lastName || '',
    email: apiData.email || '',
    password: '', // Don't populate password from API
    gender: apiData.gender || '',
    birthday,
    country: apiData.country || '',
    state: apiData.state || '',
    number: {
      country_code: countryCode,
      digits,
    },
  }
}
