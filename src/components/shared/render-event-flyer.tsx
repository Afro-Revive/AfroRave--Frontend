import { cn } from '@/lib/utils'

export function RenderEventImage({
  image,
  event_name,
  className = ' rounded-sm md:rounded-lg',
}: { image?: string; event_name: string; className?: string }) {
  return (
    <>
      {!image || image === '' ? (
        <div
          className={cn(
            // Flyers are 3:4 across the site; callers set the width.
            'flex w-full aspect-3/4 items-center justify-center bg-white/30 px-8',
            className,
          )}>
          <p className='text-center font-semibold text-white'>{event_name}</p>
        </div>
      ) : (
        <img
          src={image}
          alt={event_name}
          className={cn('object-cover w-full aspect-3/4', className)}
        />
      )}
    </>
  )
}
