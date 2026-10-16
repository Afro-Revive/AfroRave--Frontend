import DOMPurify from 'dompurify'

/**
 * Event descriptions are written in a rich text editor and saved as HTML.
 * Only what the editor can make survives sanitizing.
 */
const ALLOWED_TAGS = [
  'p',
  'br',
  'h2',
  'h3',
  'strong',
  'b',
  'em',
  'i',
  'u',
  's',
  'code',
  'pre',
  'blockquote',
  'ul',
  'ol',
  'li',
  'hr',
  'a',
]

/** Links keep their address; DOMPurify still drops javascript: and the like. */
const ALLOWED_ATTR = ['href', 'target', 'rel']

let linksHooked = false

/**
 * Every link leaves the site in a new tab, without handing it this page or a
 * search-ranking vote, whatever the saved HTML says. Hooked on first use, and
 * only where there's a DOM: without one DOMPurify has no methods, and this
 * module is also loaded by the event form's schema.
 */
function hookLinks() {
  if (linksHooked || !DOMPurify.isSupported) return

  DOMPurify.addHook('afterSanitizeAttributes', (node) => {
    // Only real links: one whose unsafe address was just removed is left bare.
    if (node.tagName === 'A' && node.hasAttribute('href')) {
      node.setAttribute('target', '_blank')
      node.setAttribute('rel', 'noopener noreferrer nofollow')
    }
  })
  linksHooked = true
}

/**
 * How rich text looks, shared by the editor and the pages that show it so both
 * match. Tailwind's reset strips headings, lists and the rest, so they're
 * restored here. Colours follow the text (current), so it reads on the light
 * editor and the dark event page alike.
 */
export const RICH_TEXT_CLASSES = [
  '[&_h2]:mt-3 [&_h2]:mb-1 [&_h2]:text-lg [&_h2]:font-bold',
  '[&_h3]:mt-2 [&_h3]:mb-1 [&_h3]:text-base [&_h3]:font-semibold',
  '[&_strong]:font-bold [&_b]:font-bold [&_em]:italic [&_i]:italic [&_u]:underline [&_s]:line-through',
  '[&_a]:underline [&_a]:underline-offset-2',
  '[&_code]:rounded [&_code]:bg-current/10 [&_code]:px-1 [&_code]:font-mono [&_code]:text-[0.9em]',
  '[&_pre]:my-2 [&_pre]:overflow-x-auto [&_pre]:rounded [&_pre]:bg-current/10 [&_pre]:p-3 [&_pre_code]:bg-transparent [&_pre_code]:p-0',
  '[&_blockquote]:my-2 [&_blockquote]:border-l-2 [&_blockquote]:border-current/30 [&_blockquote]:pl-3 [&_blockquote]:opacity-90',
  '[&_ul]:list-disc [&_ol]:list-decimal [&_ul]:pl-5 [&_ol]:pl-5 [&_li]:my-0.5',
  '[&_hr]:my-3 [&_hr]:border-current/20',
  '[&_p:empty]:min-h-[1lh]',
].join(' ')

/** Whether a description is the editor's HTML rather than older plain text. */
export function isRichText(value?: string | null): boolean {
  return new RegExp(`</?(${ALLOWED_TAGS.join('|')})\\b[^>]*>`, 'i').test(value ?? '')
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

/**
 * A description as the editor's HTML. Older ones are plain text, so each line
 * becomes a paragraph and the line breaks survive.
 */
export function toRichText(value?: string | null): string {
  const text = value ?? ''
  if (!text || isRichText(text)) return text

  return text
    .split(/\r?\n/)
    .map((line) => `<p>${escapeHtml(line)}</p>`)
    .join('')
}

/** Rich text safe to put on the page: the allowed tags, and links' addresses only. */
export function sanitizeRichText(html: string): string {
  hookLinks()
  return DOMPurify.sanitize(html, { ALLOWED_TAGS, ALLOWED_ATTR })
}

/** The characters a reader sees, not counting tags: what the 2000 limit counts. */
export function richTextLength(value?: string | null): number {
  if (!isRichText(value)) return (value ?? '').length

  return (value ?? '')
    .replace(/<[^>]*>/g, '')
    .replace(/&(amp|lt|gt|quot|#39|nbsp);/g, ' ').length
}
