import { useEffect, useRef } from 'react'

const DUST_VIDEO_SRC = '/assets/creators/90000194-dust-in-motion_ineedfx.com_0423.mp4'

/**
 * The dust in motion behind the whole About Us page. Fixed to the viewport so
 * it stays put while the sections scroll over it; the page needs `isolate` so
 * the negative z-index lands above its background, not behind it.
 */
export default function DustBackground() {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    // Autoplay only works muted, and the attribute alone isn't always enough.
    // Older browsers (and jsdom) return nothing from play(), so the catch is optional.
    video.muted = true
    video.play()?.catch(() => {})
  }, [])

  return (
    <div aria-hidden className='pointer-events-none fixed inset-0 -z-10'>
      <video
        ref={videoRef}
        src={DUST_VIDEO_SRC}
        autoPlay
        muted
        loop
        playsInline
        preload='auto'
        className='size-full object-cover'
      />
    </div>
  )
}
