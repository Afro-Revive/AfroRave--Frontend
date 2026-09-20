import { useState } from 'react'
import { Plus } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ShowMoreTextProps {
  text?: string
  /** Characters shown before the fold. */
  limit?: number
  className?: string
}

/**
 * Collapses long copy to `limit` characters with a Read more / Show less toggle.
 * Cuts on a word boundary so the preview never ends mid-word.
 */
export function ShowMoreText({ text, limit = 300, className }: ShowMoreTextProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const full = text?.trim() ?? ''
  if (!full) return null

  const needsToggle = full.length > limit

  let preview = full
  if (needsToggle) {
    const cut = full.slice(0, limit)
    const lastSpace = cut.lastIndexOf(' ')
    // Fall back to the hard cut if the first `limit` chars have no space at all.
    preview = (lastSpace > 0 ? cut.slice(0, lastSpace) : cut).trimEnd()
  }

  return (
    <div className='flex flex-col gap-2 items-start'>
      {/* pre-line keeps the newlines the API sends in event descriptions. */}
      <p className={cn('whitespace-pre-line', className)}>
        {isExpanded || !needsToggle ? full : `${preview}...`}
      </p>

      {needsToggle && (
        <button
          type='button'
          onClick={() => setIsExpanded((prev) => !prev)}
          className='md:w-3/10 w-1/2 font-inter-tight border border-white py-2.5 px-5 rounded-2xl justify-between text-sm font-medium inline-flex items-center gap-2 transition-opacity hover:opacity-80 mt-4'>
          {isExpanded ? 'Show less' : 'Read more'}
          <Plus
            size={14}
            className={cn('transition-transform', {
              'rotate-45': isExpanded,
            })}
          />
        </button>
      )}
    </div>
  )
}
