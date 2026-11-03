import { useLayoutEffect, useMemo, useRef, useState } from 'react'
import { Plus } from 'lucide-react'
import { RICH_TEXT_CLASSES, isRichText, sanitizeRichText } from '@/lib/rich-text'
import { cn } from '@/lib/utils'

interface ShowMoreTextProps {
  text?: string
  /** Characters shown before the fold. */
  limit?: number
  className?: string
}

/**
 * Collapses long copy to `limit` characters with a Read more / Show less toggle.
 * Cuts on a word boundary so the preview never ends mid-word. Rich text (an
 * event description from the editor) keeps its formatting and is cut by
 * height instead, since HTML can't be cut mid-tag.
 */
export function ShowMoreText({ text, limit = 300, className }: ShowMoreTextProps) {
  const full = text?.trim() ?? ''
  if (!full) return null

  if (isRichText(full)) return <ShowMoreRichText html={full} className={className} />

  return <ShowMorePlainText full={full} limit={limit} className={className} />
}

function ShowMorePlainText({
  full,
  limit,
  className,
}: {
  full: string
  limit: number
  className?: string
}) {
  const [isExpanded, setIsExpanded] = useState(false)

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
        <ToggleButton isExpanded={isExpanded} onToggle={() => setIsExpanded((prev) => !prev)} />
      )}
    </div>
  )
}

/**
 * Sanitized HTML, clipped to a few lines with a fade until it's expanded.
 * Whether it needs the toggle is measured, since the length of the text alone
 * doesn't say how tall bullets and paragraphs make it.
 */
function ShowMoreRichText({ html, className }: { html: string; className?: string }) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [overflows, setOverflows] = useState(false)
  const contentRef = useRef<HTMLDivElement>(null)
  const safeHtml = useMemo(() => sanitizeRichText(html), [html])

  // Measured while clipped: expanded, nothing overflows and the toggle would vanish.
  useLayoutEffect(() => {
    const content = contentRef.current
    if (content && !isExpanded) setOverflows(content.scrollHeight > content.clientHeight + 1)
  }, [safeHtml, isExpanded])

  const isClipped = !isExpanded && overflows

  return (
    <div className='flex flex-col gap-2 items-start'>
      <div
        ref={contentRef}
        className={cn(
          RICH_TEXT_CLASSES,
          !isExpanded && 'max-h-30 overflow-hidden',
          isClipped && 'mask-[linear-gradient(to_bottom,black_55%,transparent)]',
          className,
        )}
        dangerouslySetInnerHTML={{ __html: safeHtml }}
      />

      {overflows && (
        <ToggleButton isExpanded={isExpanded} onToggle={() => setIsExpanded((prev) => !prev)} />
      )}
    </div>
  )
}

function ToggleButton({ isExpanded, onToggle }: { isExpanded: boolean; onToggle: () => void }) {
  return (
    <button
      type='button'
      onClick={onToggle}
      className='md:w-3/10 w-1/2 font-inter-tight border border-white py-2.5 px-5 rounded-2xl justify-between text-sm font-medium inline-flex items-center gap-2 transition-opacity hover:opacity-80 mt-4'>
      {isExpanded ? 'Show less' : 'Read more'}
      <Plus
        size={14}
        className={cn('transition-transform', {
          'rotate-45': isExpanded,
        })}
      />
    </button>
  )
}
