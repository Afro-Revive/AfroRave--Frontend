import { cn } from '@/lib/utils'
import { useEffect, useMemo, useState } from 'react'
import { RiSearchLine } from 'react-icons/ri'
import { useLocation } from 'react-router-dom'
import { ContentBlocks } from './content-blocks'
import { filterSections, sectionId, type HeadingStyle, type Section } from './content'
import { PageNav } from './page-nav'

const DEPTH_HEADINGS: HeadingStyle[] = ['part', 'h2', 'h3']

const HEADING_STYLES: Record<HeadingStyle, { Tag: 'h2' | 'h3' | 'h4'; wrapper: string; heading: string }> = {
  part: {
    Tag: 'h2',
    wrapper: 'mt-16 md:mt-20',
    heading: 'font-work-sans font-black uppercase leading-none text-light-red text-[40px] md:text-[64px]',
  },
  accent: {
    Tag: 'h3',
    wrapper: 'mt-12',
    heading: 'font-bold uppercase leading-tight text-light-red text-[32px] md:text-[40px]',
  },
  h2: {
    Tag: 'h3',
    wrapper: 'mt-10',
    heading: 'font-medium tracking-tight leading-tight text-[26px] md:text-[32px]',
  },
  h3: {
    Tag: 'h4',
    wrapper: 'mt-7',
    heading: 'font-semibold leading-snug text-lg md:text-xl',
  },
}

/**
 * The layout the Support and Terms pages share: a mono eyebrow, the big title, an
 * intro, then the sections, with the page menu beside them. `searchable` adds a
 * search box that narrows the sections to the ones that mention it.
 */
export function InfoPage({
  eyebrow,
  title,
  intro,
  sections,
  searchable = false,
}: {
  eyebrow: string
  title: string
  intro: React.ReactNode
  sections: Section[]
  searchable?: boolean
}) {
  const [query, setQuery] = useState('')
  const { hash } = useLocation()
  const search = query.trim().toLowerCase()
  const visibleSections = useMemo(() => (search ? filterSections(sections, search) : sections), [sections, search])

  // A link to a section (#transfers-and-resale). The timeout lets the app's
  // scroll-to-top on a new page run first.
  useEffect(() => {
    if (!hash) return
    const timer = setTimeout(() => document.getElementById(decodeURIComponent(hash.slice(1)))?.scrollIntoView(), 0)
    return () => clearTimeout(timer)
  }, [hash])

  function goTo(id: string) {
    // The section may be hidden by a search, so clear it first.
    setQuery('')
    requestAnimationFrame(() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }))
  }

  return (
    <main className='relative w-full flex-1'>
      <PageNav sections={sections} onSelect={goTo} />

      <article className='mx-auto w-full max-w-200 px-4 pt-16 font-inter-tight text-charcoal md:pt-24 lg:px-0'>
        <p className='w-fit border-b border-light-red pb-0.5 font-input-mono text-sm uppercase'>{eyebrow}</p>
        <h1 className='mt-6 font-work-sans font-black uppercase leading-[0.95] text-[clamp(40px,11vw,88px)]'>{title}</h1>

        <div className='mt-8 flex flex-col gap-10'>{intro}</div>

        {searchable && (
          <label className='mt-10 flex h-10 items-center gap-2 rounded-lg border border-[#CFCFCF] px-4 transition-colors focus-within:border-charcoal'>
            <RiSearchLine aria-hidden className='size-4 shrink-0 text-slate-gray' />
            <span className='sr-only'>Search support</span>
            <input
              type='search'
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder='Search'
              className='flex-1 bg-transparent text-sm outline-none placeholder:text-slate-gray'
            />
          </label>
        )}

        {visibleSections.length > 0 ? (
          visibleSections.map((section) => <SectionView key={section.title} section={section} depth={0} />)
        ) : (
          <p className='mt-12 text-base'>
            Nothing matches “{query.trim()}”. Try another word, or browse the topics in the menu.
          </p>
        )}
      </article>
    </main>
  )
}

function SectionView({ section, depth }: { section: Section; depth: number }) {
  const style = HEADING_STYLES[section.heading ?? DEPTH_HEADINGS[Math.min(depth, DEPTH_HEADINGS.length - 1)]]
  const { Tag } = style

  return (
    <section id={sectionId(section)} className={cn('flex scroll-mt-24 flex-col', style.wrapper)}>
      <Tag className={style.heading}>{section.title}</Tag>

      {section.blocks && <ContentBlocks blocks={section.blocks} lead={depth === 0} className='mt-4' />}

      {section.children?.map((child) => <SectionView key={child.title} section={child} depth={depth + 1} />)}
    </section>
  )
}
