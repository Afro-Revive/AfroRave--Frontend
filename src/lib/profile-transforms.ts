import type { ProfileSchema } from '@/schema/profile-shema'
import type { UpdateUserProfileRequest, UserProfileData } from '@/types'
import type { z } from 'zod'
import { monthNumberToName } from './helper-func'

/**
 * Transforms profile form data to API request format
 */
export function transformProfileToUpdateRequest(
  formData: z.infer<typeof ProfileSchema>,
): UpdateUserProfileRequest {
  // Format date of birth as YYYY-MM-DD
  const dateOfBirth = `${formData.birthday.year}-${formData.birthday.month.padStart(2, '0')}-${formData.birthday.day.padStart(2, '0')}`

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
    password: formData.password,
  }
}

/**
 * Transforms API response data to form format
 */
export function transformProfileFromResponse(
  apiData: UserProfileData,
): z.infer<typeof ProfileSchema> {
  // Parse date of birth
  // currently using createdDate as a placeholder for dateOfBirth 
  // would be updated once the backend provides a dateOfBirth field
  const dateOfBirth = new Date(apiData.createdDate)
  const year = dateOfBirth.getFullYear().toString()
  const month = monthNumberToName((dateOfBirth.getMonth() + 1).toString())
  const day = dateOfBirth.getDate().toString()
  console.log('Parsed date of birth:', { year, month, day })

  // Parse phone number
  const phoneNumber = apiData.phoneNumber || ''
  const countryCode = phoneNumber.startsWith('+') ? phoneNumber.substring(0, 4) : ''
  const digits = phoneNumber.startsWith('+') ? phoneNumber.substring(4) : phoneNumber

  return {
    first_name: apiData.firstName || '',
    last_name: apiData.lastName || '',
    email: apiData.email || '',
    password: '', // Don't populate password from API
    gender: apiData.userType || '',
    birthday: {
      month,
      day,
      year,
    },
    country: '',
    state: '',
    number: {
      country_code: countryCode,
      digits,
    },
  }
}
