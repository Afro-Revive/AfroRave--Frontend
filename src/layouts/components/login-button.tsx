import { BaseDropdown } from '@/components/reusable'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/contexts/auth-context'
import { cn } from '@/lib/utils'

export default function LoginButton({ className }: { className?: string }) {
  const { openAuthModal } = useAuth()

  return (
    <BaseDropdown
      trigger={
        <Button
          className={cn(
            'h-6 w-14 rounded-sm bg-white text-[10px] text-black font-input-mono hover:bg-white/90',
            className,
          )}>
          Log In
        </Button>
      }
      items={[
        {
          label: 'Fan',
          // Fans get the video panel; organizers and vendors don't.
          onClick: () => openAuthModal('login', 'guest', { withVideo: true }),
        },
        {
          label: 'Organizer',
          onClick: () => openAuthModal('login', 'creator'),
        },
        {
          label: 'Vendor',
          onClick: () => openAuthModal('login', 'vendor'),
        },
      ]}
    />
  )
}
