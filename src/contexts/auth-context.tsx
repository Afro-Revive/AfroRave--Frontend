import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'

type AuthType = 'login' | 'signup'
export type LoginType = 'guest' | 'creator' | 'vendor'
type SignupType = 'guest' | 'creator' | 'vendor'

interface AuthModalOptions {
  withVideo?: boolean
  /** Shown above the login form, to say why the user is being asked to log in. */
  notice?: string
  /** Keep the user on the page they logged in from instead of their dashboard. */
  stayOnPage?: boolean
}

interface AuthContextType {
  isAuthModalOpen: boolean
  authType: AuthType
  loginType: LoginType
  signupType: SignupType
  /**
   * True only when the modal was opened somewhere the video panel belongs 
   * This is true from the fans sidebar and the fans heder login button, and false from the organizer/vendor login and checkout.
   */
  showAuthVideo: boolean
  authNotice: string | null
  stayOnPage: boolean
  openAuthModal: (type: AuthType, loginType?: LoginType, options?: AuthModalOptions) => void
  closeAuthModal: () => void
  switchAuthType: (type: AuthType, loginType?: LoginType) => void
  switchToSignup: (signupType: SignupType) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const [authType, setAuthType] = useState<AuthType>('login')
  const [loginType, setLoginType] = useState<LoginType>('guest')
  const [signupType, setSignupType] = useState<SignupType>('guest')
  const [showAuthVideo, setShowAuthVideo] = useState(false)
  const [authNotice, setAuthNotice] = useState<string | null>(null)
  const [stayOnPage, setStayOnPage] = useState(false)
  const [searchParams, setSearchParams] = useSearchParams()

  useEffect(() => {
    const loginParam = searchParams.get('login')
    const signupParam = searchParams.get('signup')

    if (loginParam === 'guest' || loginParam === 'creator' || loginParam === 'vendor') {
      setLoginType(loginParam)
      setAuthType('login')
      setIsAuthModalOpen(true)
    } else if (loginParam === 'true') {
      setAuthType('login')
      setIsAuthModalOpen(true)
    } else if (signupParam === 'guest' || signupParam === 'creator' || signupParam === 'vendor') {
      setSignupType(signupParam)
      setAuthType('signup')
      setIsAuthModalOpen(true)
    } else if (signupParam === 'true') {
      setAuthType('signup')
      setIsAuthModalOpen(true)
    }
  }, [searchParams])

  const openAuthModal = useCallback(
    (type: AuthType, loginType?: LoginType, options?: AuthModalOptions) => {
      setAuthType(type)
      setShowAuthVideo(options?.withVideo === true)
      setAuthNotice(options?.notice ?? null)
      setStayOnPage(options?.stayOnPage === true)
      if (loginType) {
        setLoginType(loginType)
        setSearchParams({ [type]: loginType })
      } else {
        setSearchParams({ [type]: 'true' })
      }
      setIsAuthModalOpen(true)
    },
    [setSearchParams],
  )

  const closeAuthModal = useCallback(() => {
    setIsAuthModalOpen(false)
    // Reset signupType to 'guest' so role selection shows again next time
    setSignupType('guest')
    setShowAuthVideo(false)
    setAuthNotice(null)
    setStayOnPage(false)
    setSearchParams(
      (params) => {
        params.delete('login')
        params.delete('signup')
        params.delete('auth')
        return params
      },
      { replace: true },
    )
  }, [setSearchParams])

  const switchAuthType = useCallback(
    (type: AuthType, loginType?: LoginType) => {
      setAuthType(type)
      if (loginType) {
        setLoginType(loginType)
        setSearchParams({ [type]: loginType })
      } else {
        setSearchParams({ [type]: 'true' })
      }
    },
    [setSearchParams],
  )

  const switchToSignup = useCallback(
    (signupType: SignupType) => {
      setSignupType(signupType)
      setAuthType('signup')
      setSearchParams({ signup: signupType })
    },
    [setSearchParams],
  )

  return (
    <AuthContext.Provider
      value={{
        isAuthModalOpen,
        authType,
        loginType,
        signupType,
        showAuthVideo,
        authNotice,
        stayOnPage,
        openAuthModal,
        closeAuthModal,
        switchAuthType,
        switchToSignup,
      }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
