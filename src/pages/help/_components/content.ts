/**
 * The Support and Terms pages are written as data: sections of blocks. It keeps the
 * copy in one readable place, and lets the support search filter it.
 *
 * Text can mark bold runs with **double asterisks**.
 */
export type Block =
  | { type: 'p'; text: string; link?: InlineLink }
  | { type: 'list'; items: string[] }
  | { type: 'steps'; items: string[] }
  | { type: 'note'; text: string }
  | { type: 'subheading'; text: string }
  | ({ type: 'link' } & InlineLink)

export interface InlineLink {
  text: string
  to: string
}

/**
 * How a section's heading looks. A part is the big red title (Fan Support), accent the
 * smaller red one (Organizer). Left out, it follows the depth: part, then h2, then h3.
 */
export type HeadingStyle = 'part' | 'accent' | 'h2' | 'h3'

export interface Section {
  title: string
  heading?: HeadingStyle
  /** Defaults to the title, slugified. */
  id?: string
  /** Set on a part's sections that get a link in the page menu. */
  navLabel?: string
  blocks?: Block[]
  children?: Section[]
}

export const p = (text: string, link?: InlineLink): Block => ({ type: 'p', text, link })
export const list = (items: string[]): Block => ({ type: 'list', items })
export const steps = (items: string[]): Block => ({ type: 'steps', items })
export const note = (text: string): Block => ({ type: 'note', text })
export const sub = (text: string): Block => ({ type: 'subheading', text })
export const link = (text: string, to: string): Block => ({ type: 'link', text, to })

export function sectionId(section: Section) {
  return (
    section.id ??
    section.title
      .toLowerCase()
      .replace(/&/g, 'and')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
  )
}

function blockText(block: Block) {
  switch (block.type) {
    case 'list':
    case 'steps':
      return block.items.join(' ')
    case 'p':
      return block.link ? `${block.text} ${block.link.text}` : block.text
    default:
      return block.text
  }
}

const matches = (text: string, query: string) => text.replace(/\*\*/g, '').toLowerCase().includes(query)

/**
 * The sections that mention `query` (lower case). A section whose title matches keeps
 * everything under it; otherwise it keeps its own text only if that matches, and only
 * the children that do.
 */
export function filterSections(sections: Section[], query: string): Section[] {
  return sections.flatMap((section) => {
    if (matches(section.title, query)) return [section]

    const blocks = section.blocks?.some((block) => matches(blockText(block), query)) ? section.blocks : undefined
    const children = section.children ? filterSections(section.children, query) : []
    return blocks || children.length ? [{ ...section, blocks, children }] : []
  })
}
