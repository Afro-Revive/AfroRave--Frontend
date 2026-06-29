import BaseModal from '@/components/reusable/base-modal'
import { useAuth } from '@/contexts/auth-context'
import { OnlyShowIf } from '@/lib/environment'
import { cn } from '@/lib/utils'
import { SignupForm } from '@/pages/auth/sign-up/signup-form'
// import { VendorSignupForm } from '@/pages/auth/sign-up/vendor-signup-form'
import { CreatorLogo, UserLoginForm } from '@/pages/auth/user-login/user-login-form'
import { RoleSelection } from './role-selection'
import { ForgotPasswordView } from './forgot-password-modal'
import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'

export function AuthModal() {
  const { isAuthModalOpen, authType, signupType, closeAuthModal, switchAuthType, loginType, switchToSignup } =
    useAuth()
  const [showForgotPassword, setShowForgotPassword] = useState(false)

  // Check if we are on the fans page — fans get a different signup experience
  const isFansPage = window.location.pathname === '/fans' || window.location.pathname.startsWith('/fans/')

  const renderSignupForm = () => {
    // On /fans, skip role selection and go straight to fan signup form
    if (signupType === 'guest' && authType === 'signup' && !isFansPage) {
      return <RoleSelection onContinue={(role) => switchToSignup(role)} />
    }

    switch (signupType) {
      case 'creator':
        return <SignupForm onSwitchToLogin={() => switchAuthType('login')} type='Organizer' />
      case 'vendor':
        return <SignupForm onSwitchToLogin={() => switchAuthType('login')} type='Vendor' />
      default:
        return <SignupForm onSwitchToLogin={() => switchAuthType('login')} type='User' />
    }
  }

  const getModalSize = () => {
    if (authType === 'login') return 'small'
    if (signupType === 'creator' || signupType === 'vendor') return 'large'
    // Role selection modal should be large, but NOT on fans page (fans get small form)
    if (signupType === 'guest' && authType === 'signup' && !isFansPage) return 'large'
    return 'small'
  }

  const shouldShowCreatorLogo = () => {
    // Never show creator logo on the fans page
    if (isFansPage) return false
    // Show logo for creator login or vendor login, role selection, or creator signup
    // Vendor signup has its own logo inside the form, so don't show floating logo
    if (authType === 'signup' && signupType === 'vendor') {
      return false
    }
    return (
      loginType === 'creator' ||
      loginType === 'vendor' ||
      (authType === 'signup' && signupType === 'guest') || // Role selection
      (authType === 'signup' && signupType === 'creator')
    )
  }

  // Generate unique key for AnimatePresence based on current form state
  const formKey = showForgotPassword ? 'forgot-password' : `${authType}-${signupType}`

  function handleModalClose() {
    setShowForgotPassword(false)
    closeAuthModal()
  }

  return (
    <BaseModal
      open={isAuthModalOpen}
      onClose={handleModalClose}
      floatingCancel
      className={cn({
        'bg-transparent shadow-none':
          !showForgotPassword && authType === 'signup' && (signupType === 'creator' || signupType === 'vendor' || (signupType === 'guest' && !isFansPage)),
        'bg-[#F5F5F5]':
          !showForgotPassword && authType === 'signup' && !(signupType === 'creator' || signupType === 'vendor' || (signupType === 'guest' && !isFansPage)),
      })}
      overlayClassName='bg-gradient-to-b from-[#848484] to-[#1E1E1E] !opacity-100'
      size={getModalSize()}>
      <>
        <AnimatePresence mode='wait' initial={false}>
          <motion.div
            key={formKey}
            initial={{ opacity: 0, scale: 0.96, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -20 }}
            transition={{
              duration: 0.4,
              ease: [0.25, 0.1, 0.25, 1],
              layout: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }
            }}
            layout>
            {showForgotPassword ? (
              <ForgotPasswordView
                onBack={() => setShowForgotPassword(false)}
                onDone={handleModalClose}
              />
            ) : (
              <>
                <OnlyShowIf condition={shouldShowCreatorLogo()}>
                  <motion.div
                    className='relative w-full'
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}>
                    <div className='absolute -top-16 md:-top-20 left-1/2 -translate-x-1/2 scale-[0.8] md:scale-100 origin-bottom'>
                      <CreatorLogo />
                    </div>
                  </motion.div>
                </OnlyShowIf>
                {authType === 'login'
                  ? <UserLoginForm onForgotPassword={() => setShowForgotPassword(true)} />
                  : renderSignupForm()}
              </>
            )}
          </motion.div>
        </AnimatePresence>
      </>
    </BaseModal>
  )
}
