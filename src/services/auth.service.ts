import type {
  AuthResponse,
  LoginData,
  LoginResponse,
  OrganizerRegisterData,
  VendorRegisterData,
  RefreshTokenResponse,
  CompleteProfileData,
  UserSignup,
} from '@/types/auth'
import api from './http.service'

class AuthService {
  // User Registration
  static registerUser(data: UserSignup) {
    return api.post<AuthResponse>('/api/Auth/signup', data)
  }

  // Vendor Registration
  static registerVendor(data: VendorRegisterData) {
    return api.post<AuthResponse>('/api/Auth/register/vendor', data)
  }

  // Organizer Registration
  static registerOrganizer(data: OrganizerRegisterData) {
    return api.post<AuthResponse>('/api/Auth/register/organizer', data)
  }

  // Login
  static login(data: LoginData) {
    return api.post<LoginResponse>('/api/Auth/login', data)
  }

  static logout() {
    return api.post<{ message: string }>('/auth/logout')
  }

  static changePassword(data: { currentPassword: string; newPassword: string }) {
    return api.post<{ message: string }>('/api/Auth/change-password', data)
  }

  static refreshToken(data: { accessToken: string; refreshToken: string }) {
    return api.post<RefreshTokenResponse>('/api/Auth/refresh', data)
  }

  static completeProfile(data: CompleteProfileData){
    return api.post<AuthResponse>('/api/Auth/complete-profile', data)
  }
}

const authService = AuthService

export default authService
