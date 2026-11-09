import { cn } from '@/lib/utils'
import { useState } from 'react'
import { RiArrowUpSLine, RiListUnordered } from 'react-icons/ri'
import { sectionId, type Section } from './content'

/**
 * The dark menu of the page's parts. On wide screens it sits to the right of the text
 * and follows the reader down; below that it's a round button that drops it down.
 */
export function PageNav({ sections, onSelect }: { sections: Section[]; onSelect: (id: string) => void }) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <div className='pointer-events-none absolute inset-y-0 right-5 hidden pt-5 xl:block'>
        <div className='pointer-events-auto sticky top-[84px]'>
          <NavPanel sections={sections} onSelect={onSelect} />
        </div>
      </div>

      <div className='fixed right-4 top-20 z-30 flex flex-col items-end gap-2 xl:hidden'>
        <button
          type='button'
          aria-label='On this page'
          aria-expanded={open}
          onClick={() => setOpen((isOpen) => !isOpen)}
          className='flex size-11 items-center justify-center rounded-full bg-charcoal text-white shadow-lg transition-opacity hover:opacity-90'>
          <RiListUnordered className='size-5' />
        </button>

        {open && (
          <NavPanel
            sections={sections}
            className='max-h-[calc(100svh-150px)] overflow-y-auto'
            onSelect={(id) => {
              setOpen(false)
              onSelect(id)
            }}
          />
        )}
      </div>
    </>
  )
}

function NavPanel({
  sections,
  onSelect,
  className,
}: {
  sections: Section[]
  onSelect: (id: string) => void
  className?: string
}) {
  return (
    <nav aria-label='On this page' className={cn('w-[220px] rounded-[20px] bg-charcoal p-6 text-white shadow-lg', className)}>
      <ul className='flex flex-col gap-6'>
        {sections.map((section) => (
          <NavGroup key={section.title} section={section} onSelect={onSelect} />
        ))}
      </ul>
    </nav>
  )
}

function NavGroup({ section, onSelect }: { section: Section; onSelect: (id: string) => void }) {
  // Starts closed, showing just the parts until one is opened.
  const [expanded, setExpanded] = useState(false)
  const items = section.children?.filter((child) => child.navLabel) ?? []

  return (
    <li className='flex flex-col gap-4'>
      <div className='flex items-center justify-between gap-2'>
        <JumpLink id={sectionId(section)} onSelect={onSelect} className='text-[15px] font-medium'>
          {section.title}
        </JumpLink>

        {items.length > 0 && (
          <button
            type='button'
            aria-label={`${expanded ? 'Hide' : 'Show'} ${section.title} topics`}
            aria-expanded={expanded}
            onClick={() => setExpanded((isExpanded) => !isExpanded)}
            className='rounded p-0.5 transition-colors hover:bg-white/10'>
            <RiArrowUpSLine className={cn('size-5 transition-transform', !expanded && 'rotate-180')} />
          </button>
        )}
      </div>

      {items.length > 0 && expanded && (
        <ul className='flex flex-col gap-4'>
          {items.map((item) => (
            <li key={item.title}>
              <JumpLink id={sectionId(item)} onSelect={onSelect} className='text-[13px] leading-snug'>
                {item.navLabel}
              </JumpLink>
            </li>
          ))}
        </ul>
      )}
    </li>
  )
}

function JumpLink({
  id,
  onSelect,
  className,
  children,
}: {
  id: string
  onSelect: (id: string) => void
  className?: string
  children: React.ReactNode
}) {
  return (
    <a
      href={`#${id}`}
      onClick={(event) => {
        event.preventDefault()
        onSelect(id)
      }}
      className={cn('transition-opacity hover:opacity-70', className)}>
      {children}
    </a>
  )
}
