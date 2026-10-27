import { useMemo } from 'react'
import { RICH_TEXT_CLASSES, isRichText, sanitizeRichText } from '@/lib/rich-text'
import { cn } from '@/lib/utils'

/**
 * Text written in the rich text editor, shown in full: sanitized HTML, or
 * older plain text with its line breaks. For long copy that should fold, use
 * ShowMoreText.
 */
export function RichTextContent({ value, className }: { value: string; className?: string }) {
  const html = useMemo(() => (isRichText(value) ? sanitizeRichText(value) : null), [value])

  if (html === null) return <p className={cn('whitespace-pre-line', className)}>{value}</p>

  return (
    <div className={cn(RICH_TEXT_CLASSES, className)} dangerouslySetInnerHTML={{ __html: html }} />
  )
}
