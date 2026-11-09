import { cn } from '@/lib/utils'
import { RiInformationLine } from 'react-icons/ri'
import { Link } from 'react-router-dom'
import type { Block, InlineLink } from './content'

/** A section's paragraphs, lists and notes. `lead` sets paragraphs a size up, for a part's intro. */
export function ContentBlocks({ blocks, lead = false, className }: { blocks: Block[]; lead?: boolean; className?: string }) {
  return (
    <div className={cn('flex flex-col gap-3', lead ? 'text-base md:text-lg' : 'text-[15px] md:text-base', className)}>
      {blocks.map((block, index) => (
        <ContentBlock key={index} block={block} />
      ))}
    </div>
  )
}

function ContentBlock({ block }: { block: Block }) {
  switch (block.type) {
    case 'p':
      return (
        <p className='leading-relaxed'>
          <Inline text={block.text} />
          {block.link && (
            <>
              {' '}
              <TextLink {...block.link} />
            </>
          )}
        </p>
      )
    case 'list':
      return (
        <ul className='flex list-disc flex-col gap-1 pl-6 leading-relaxed'>
          {block.items.map((item) => (
            <li key={item}>
              <Inline text={item} />
            </li>
          ))}
        </ul>
      )
    case 'steps':
      return (
        <ol className='flex list-decimal flex-col gap-1 pl-6 leading-relaxed'>
          {block.items.map((item) => (
            <li key={item}>
              <Inline text={item} />
            </li>
          ))}
        </ol>
      )
    case 'note':
      return (
        <p className='flex w-fit max-w-[560px] items-start gap-3 rounded-lg bg-[#EEEEEE] px-3 py-2.5 text-xs font-bold leading-snug text-[#4A4A4A]'>
          <RiInformationLine aria-hidden className='size-5 shrink-0' />
          <span className='self-center'>{block.text}</span>
        </p>
      )
    case 'subheading':
      return <h5 className='mt-1 text-base font-semibold md:text-[17px]'>{block.text}</h5>
    case 'link':
      return (
        <p>
          <TextLink text={block.text} to={block.to} />
        </p>
      )
  }
}

function TextLink({ text, to }: InlineLink) {
  return (
    <Link to={to} className='font-bold text-tech-blue underline underline-offset-2 hover:opacity-80'>
      {text}
    </Link>
  )
}

/** Plain text with **bold** runs. */
function Inline({ text }: { text: string }) {
  return text.split(/(\*\*[^*]+\*\*)/).map((part, index) =>
    part.startsWith('**') ? (
      <strong key={index} className='font-semibold'>
        {part.slice(2, -2)}
      </strong>
    ) : (
      part
    ),
  )
}
