import { toast } from 'sonner'

// Auth-related toast messages
export const authToasts = {
  // Registration success messages
  userRegistered: () => toast.success('Account created successfully! Welcome to AfroRave! 🎉'),
  userVerified: () => toast.success('An email has been sent to your inbox for verification. Please check your email to complete the registration process.'),
  vendorRegistered: () =>
    toast.success('Vendor account created successfully! Welcome to AfroRave! 🎉'),
  organizerRegistered: () =>
    toast.success('Organizer account created successfully! Welcome to AfroRave! 🎉'),

  // Login messages
  loginSuccess: () => toast.success('Welcome back! 🎉'),
  loginOtpRequired: () => toast.info('Please check your email for OTP verification code'),
  loginError: (message?: string) =>
    toast.error(message || 'Login failed. Please check your credentials and try again.'),

  // Logout messages
  logoutSuccess: () => toast.success('Logged out successfully. See you soon! 👋'),
  logoutError: (message?: string) => toast.error(message || 'Logout failed. Please try again.'),

  // Registration error messages
  registrationError: (message?: string) =>
    toast.error(message || 'Registration failed. Please try again.'),
  vendorRegistrationError: (message?: string) =>
    toast.error(message || 'Vendor registration failed. Please try again.'),
  organizerRegistrationError: (message?: string) =>
    toast.error(message || 'Organizer registration failed. Please try again.'),
}

// General toast helpers
export const toastHelpers = {
  success: (message: string) => toast.success(message),
  error: (message: string) => toast.error(message),
  info: (message: string) => toast.info(message),
  warning: (message: string) => toast.warning(message),

  // Loading toast
  loading: (message: string) => toast.loading(message),

  // Dismiss all toasts
  dismiss: () => toast.dismiss(),

  // Promise toast
  promise: <T>(
    promise: Promise<T>,
    {
      loading,
      success,
      error,
    }: {
      loading: string
      success: string
      error: string
    },
  ) => {
    return toast.promise(promise, {
      loading,
      success,
      error,
    })
  },
}

// Form validation toasts
export const formToasts = {
  validationError: (field: string) => toast.error(`Please check the ${field} field`),
  requiredField: (field: string) => toast.error(`${field} is required`),
  invalidEmail: () => toast.error('Please enter a valid email address'),
  passwordMismatch: () => toast.error('Passwords do not match'),
  weakPassword: () => toast.error('Password must be at least 8 characters long'),
}

// API error toasts
export const apiToasts = {
  networkError: () => toast.error('Network error. Please check your connection and try again.'),
  serverError: () => toast.error('Server error. Please try again later.'),
  unauthorized: () => toast.error('You are not authorized to perform this action.'),
  forbidden: () => toast.error('Access denied. You do not have permission for this action.'),
  notFound: () => toast.error('The requested resource was not found.'),
  timeout: () => toast.error('Request timed out. Please try again.'),
}

// Event-related toasts
export const eventToasts = {
  eventCreated: () => toast.success('Event created successfully! 🎉'),
  eventUpdated: () => toast.success('Event updated successfully! ✨'),
  eventDeleted: () => toast.success('Event deleted successfully! 🗑️'),
  ticketPurchased: () => toast.success('Ticket purchased successfully! 🎫'),
  ticketRefunded: () => toast.success('Ticket refunded successfully! 💰'),
}

// Profile-related toasts
export const profileToasts = {
  profileUpdated: () => toast.success('Profile updated successfully! ✨'),
  passwordChanged: () => toast.success('Password changed successfully! 🔒'),
  avatarUpdated: () => toast.success('Profile picture updated successfully! 📸'),
  profileCompleted: () => toast.success('Profile completed successfully! ✨'),
  profileCompletionError: (message?: string) => toast.error(message || 'Failed to complete profile. Please try again.'),
}
