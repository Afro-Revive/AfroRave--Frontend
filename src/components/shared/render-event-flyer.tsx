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
            'flex items-center justify-center bg-white/30 px-5 min-h-40 h-60 md:h-64',
            className,
          )}>
          <p className='text-center font-semibold text-white'>{event_name}</p>
        </div>
      ) : (
        <img
          src={image}
          alt={event_name}
          className={cn('object-cover h-[160px] md:h-[250px]', className)}
        />
      )}
    </>
  )
}
