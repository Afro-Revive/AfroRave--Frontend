import { Button } from '@/components/ui/button'
import { getRoutePath } from '@/config/get-route-path'
import { ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

interface ComingSoonProps {
  title: string
  description?: string
  showBackButton?: boolean
}

export function ComingSoon({
  title,
  description = "This feature is coming soon. We're working hard to bring you the best experience.",
  showBackButton = true,
}: ComingSoonProps) {
  const navigate = useNavigate()

  return (
    <div className='w-full min-h-screen flex flex-col items-center justify-center bg-light-gray'>
      <div className='flex flex-col items-center gap-8 max-w-md text-center px-6'>
        {/* Icon */}
        <div className='w-24 h-24 bg-deep-red/10 rounded-full flex items-center justify-center'>
          <svg
            width='48'
            height='48'
            viewBox='0 0 24 24'
            fill='none'
            xmlns='http://www.w3.org/2000/svg'
            className='text-deep-red'
            aria-label='Coming soon'>
            <title>Coming Soon</title>
            <path
              d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z'
              fill='currentColor'
            />
          </svg>
        </div>

        {/* Content */}
        <div className='flex flex-col gap-4'>
          <h1 className='text-3xl font-bold text-black font-inter-tight'>
            {title || 'Coming Soon'}
          </h1>
          <p className='text-base text-black/70 font-inter-tight leading-relaxed'>{description}</p>
        </div>

        {/* Actions */}
        <div className='flex flex-col gap-4 w-full'>
          {showBackButton && (
            <Button
              variant='outline'
              className='w-full h-12 font-inter-tight font-medium'
              onClick={() => navigate(getRoutePath('standalone'))}>
              <ArrowLeft className='w-4 h-4 mr-2' />
              Back to Dashboard
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
