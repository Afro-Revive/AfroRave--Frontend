import { LoadingFallback } from '@/components/loading-fallback'
import { getRoutePath } from '@/config/get-route-path'
import { useAfroStore } from '@/stores'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'

interface AuthGuardProps {
  children: React.ReactNode
  requiredAccountType?: 'User' | 'Vendor' | 'Organizer'
}

export function AuthGuard({ children, requiredAccountType }: AuthGuardProps) {
  const { user, isAuthenticated } = useAfroStore()
  const navigate = useNavigate()

  useEffect(() => {
    // Check if user is authenticated
    if (!isAuthenticated || !user) {
      // Redirect to the landing page that matches the required account type
      // so logging out of creators/vendor dashboard lands on /home, not the fan home at /
      const destination =
        requiredAccountType === 'Organizer' || requiredAccountType === 'Vendor'
          ? getRoutePath('creators_home')
          : getRoutePath('home')
      navigate(destination, {
        replace: true,
        state: { from: window.location.pathname },
      })
      return
    }

    // Check if user has the required account type
    if (requiredAccountType && user.accountType !== requiredAccountType) {
      toast.error(`Access denied. This page is for ${requiredAccountType} accounts only.`)
      // Redirect to appropriate dashboard based on user's account type
      switch (user.accountType) {
        case 'User':
          navigate(getRoutePath('account'), { replace: true })
          break
        case 'Vendor':
          navigate(getRoutePath('vendor_profile'), { replace: true })
          break
        case 'Organizer':
          navigate(getRoutePath('standalone'), { replace: true })
          break
        default:
          navigate(getRoutePath('home'), { replace: true })
      }
      return
    }
  }, [isAuthenticated, user, requiredAccountType, navigate])

  // Show loading while checking authentication
  if (!isAuthenticated || !user) {
    return <LoadingFallback />
  }

  // Show loading while checking account type
  if (requiredAccountType && user.accountType !== requiredAccountType) {
    return <LoadingFallback />
  }

  return <>{children}</>
}
