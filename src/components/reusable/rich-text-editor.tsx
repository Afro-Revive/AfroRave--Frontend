import { useEffect, useState, type KeyboardEvent } from 'react'
import { EditorContent, useEditor, useEditorState, type Editor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import type { IconType } from 'react-icons'
import {
  RiArrowGoBackLine,
  RiArrowGoForwardLine,
  RiBold,
  RiCodeBoxLine,
  RiCodeLine,
  RiDoubleQuotesL,
  RiH2,
  RiH3,
  RiItalic,
  RiLink,
  RiListOrdered2,
  RiListUnordered,
  RiSeparator,
  RiStrikethrough,
  RiUnderline,
} from 'react-icons/ri'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { RICH_TEXT_CLASSES, toRichText } from '@/lib/rich-text'
import { cn } from '@/lib/utils'

type Chain = ReturnType<ReturnType<Editor['chain']>['focus']>

/**
 * The editor's HTML as it's saved. After a heading, list, quote or code block
 * at the end, the editor keeps an empty paragraph to type into; it isn't
 * content, so it's dropped rather than shown as a blank line.
 */
function toSavedHtml(editor: Editor): string {
  return editor.isEmpty ? '' : editor.getHTML().replace(/(<p><\/p>)+$/, '')
}

/**
 * Everything in StarterKit is on: paragraphs, bold, italic, underline,
 * strikethrough, inline code, code blocks, quotes, dividers, bullet and
 * numbered lists, links, undo/redo. Only these two need settings. Built once:
 * useEditor compares extensions by identity, so new ones every render made it
 * re-apply its options each time.
 */
const EXTENSIONS = [
  StarterKit.configure({
    // The event name is the page's heading, so descriptions start at h2.
    heading: { levels: [2, 3] },
    link: {
      // A click while editing places the cursor instead of leaving the page.
      openOnClick: false,
      autolink: true,
      linkOnPaste: true,
      defaultProtocol: 'https',
      HTMLAttributes: { target: '_blank', rel: 'noopener noreferrer nofollow' },
    },
  }),
]

/** A link address as typed, with https:// added when there's no scheme. */
function toHref(typed: string): string {
  const url = typed.trim()
  if (!url) return ''
  return /^[a-z][a-z\d+.-]*:/i.test(url) ? url : `https://${url}`
}

/**
 * A rich text field for event descriptions: headings, bold, italic,
 * underline, strikethrough, code, links, lists, quotes, code blocks and
 * dividers. The value is HTML (empty when there's no text); older plain text
 * is turned into paragraphs when it loads.
 */
export function RichTextEditor({
  id,
  value,
  onChange,
  onBlur,
  placeholder,
  className,
}: {
  /** Lets the field's label point at the editor. */
  id?: string
  value?: string | null
  onChange: (html: string) => void
  onBlur?: () => void
  placeholder?: string
  className?: string
}) {
  const editor = useEditor({
    extensions: EXTENSIONS,
    content: toRichText(value),
    editorProps: {
      attributes: {
        ...(id ? { id } : {}),
        'aria-multiline': 'true',
        class: cn(
          'min-h-[230px] max-h-[480px] overflow-y-auto px-3 py-[11px] text-sm text-black font-sf-pro-display normal-case outline-none',
          RICH_TEXT_CLASSES,
        ),
      },
    },
    onUpdate: ({ editor }) => onChange(toSavedHtml(editor)),
    onBlur: () => onBlur?.(),
  })

  // A value set from outside (the edit page loading the event, a form reset)
  // replaces what's in the editor. Typing doesn't come back through here: the
  // value it sends is already what the editor holds.
  useEffect(() => {
    // useEditor can swap in a fresh editor (it treats one not yet attached to
    // the page as destroyed); this render still holds the old one. The fresh
    // one starts from the current value, and the next render compares again.
    if (!editor || editor.isDestroyed) return

    // Compared as saved, so the editor's own trailing paragraph doesn't read
    // as a change and reset it mid-typing.
    const next = toRichText(value).replace(/(<p><\/p>)+$/, '')
    if (next !== toSavedHtml(editor)) editor.commands.setContent(next, { emitUpdate: false })
  }, [editor, value])

  const state = useEditorState({
    editor,
    selector: ({ editor }) => ({
      h2: editor?.isActive('heading', { level: 2 }) ?? false,
      h3: editor?.isActive('heading', { level: 3 }) ?? false,
      bold: editor?.isActive('bold') ?? false,
      italic: editor?.isActive('italic') ?? false,
      underline: editor?.isActive('underline') ?? false,
      strike: editor?.isActive('strike') ?? false,
      code: editor?.isActive('code') ?? false,
      link: editor?.isActive('link') ?? false,
      bulletList: editor?.isActive('bulletList') ?? false,
      orderedList: editor?.isActive('orderedList') ?? false,
      blockquote: editor?.isActive('blockquote') ?? false,
      codeBlock: editor?.isActive('codeBlock') ?? false,
      canUndo: editor?.can().undo() ?? false,
      canRedo: editor?.can().redo() ?? false,
      isEmpty: editor?.isEmpty ?? true,
    }),
  })

  return (
    <div
      className={cn(
        'w-full rounded-[4px] border border-mid-dark-gray/50 bg-white focus-within:border-black/60',
        className,
      )}>
      <div
        role='toolbar'
        aria-label='Text formatting'
        className='flex flex-wrap items-center gap-0.5 border-b border-mid-dark-gray/20 px-2 py-1.5'>
        <ToolbarButton
          editor={editor}
          label='Undo'
          shortcut='⌘Z'
          Icon={RiArrowGoBackLine}
          disabled={!state?.canUndo}
          onClick={(chain) => chain.undo().run()}
        />
        <ToolbarButton
          editor={editor}
          label='Redo'
          shortcut='⌘⇧Z'
          Icon={RiArrowGoForwardLine}
          disabled={!state?.canRedo}
          onClick={(chain) => chain.redo().run()}
        />

        <ToolbarDivider />

        <ToolbarButton
          editor={editor}
          label='Heading'
          shortcut='⌘⌥2'
          Icon={RiH2}
          active={state?.h2}
          onClick={(chain) => chain.toggleHeading({ level: 2 }).run()}
        />
        <ToolbarButton
          editor={editor}
          label='Subheading'
          shortcut='⌘⌥3'
          Icon={RiH3}
          active={state?.h3}
          onClick={(chain) => chain.toggleHeading({ level: 3 }).run()}
        />

        <ToolbarDivider />

        <ToolbarButton
          editor={editor}
          label='Bold'
          shortcut='⌘B'
          Icon={RiBold}
          active={state?.bold}
          onClick={(chain) => chain.toggleBold().run()}
        />
        <ToolbarButton
          editor={editor}
          label='Italic'
          shortcut='⌘I'
          Icon={RiItalic}
          active={state?.italic}
          onClick={(chain) => chain.toggleItalic().run()}
        />
        <ToolbarButton
          editor={editor}
          label='Underline'
          shortcut='⌘U'
          Icon={RiUnderline}
          active={state?.underline}
          onClick={(chain) => chain.toggleUnderline().run()}
        />
        <ToolbarButton
          editor={editor}
          label='Strikethrough'
          shortcut='⌘⇧S'
          Icon={RiStrikethrough}
          active={state?.strike}
          onClick={(chain) => chain.toggleStrike().run()}
        />
        <ToolbarButton
          editor={editor}
          label='Inline code'
          shortcut='⌘E'
          Icon={RiCodeLine}
          active={state?.code}
          onClick={(chain) => chain.toggleCode().run()}
        />
        <LinkButton editor={editor} active={state?.link ?? false} />

        <ToolbarDivider />

        <ToolbarButton
          editor={editor}
          label='Bullet list'
          shortcut='⌘⇧8'
          Icon={RiListUnordered}
          active={state?.bulletList}
          onClick={(chain) => chain.toggleBulletList().run()}
        />
        <ToolbarButton
          editor={editor}
          label='Numbered list'
          shortcut='⌘⇧7'
          Icon={RiListOrdered2}
          active={state?.orderedList}
          onClick={(chain) => chain.toggleOrderedList().run()}
        />
        <ToolbarButton
          editor={editor}
          label='Quote'
          shortcut='⌘⇧B'
          Icon={RiDoubleQuotesL}
          active={state?.blockquote}
          onClick={(chain) => chain.toggleBlockquote().run()}
        />
        <ToolbarButton
          editor={editor}
          label='Code block'
          shortcut='⌘⌥C'
          Icon={RiCodeBoxLine}
          active={state?.codeBlock}
          onClick={(chain) => chain.toggleCodeBlock().run()}
        />
        <ToolbarButton
          editor={editor}
          label='Divider'
          Icon={RiSeparator}
          onClick={(chain) => chain.setHorizontalRule().run()}
        />
      </div>

      <div className='relative'>
        {state?.isEmpty && placeholder && (
          <span className='pointer-events-none absolute inset-x-3 top-2.75 whitespace-pre-line text-sm normal-case text-mid-dark-gray/70 font-sf-pro-display'>
            {placeholder}
          </span>
        )}
        <EditorContent editor={editor} />
      </div>
    </div>
  )
}

const toolbarButtonClass = (active: boolean) =>
  cn(
    'inline-flex size-7 items-center justify-center rounded text-black/60 transition-colors hover:bg-black/5 hover:text-black disabled:pointer-events-none disabled:opacity-30',
    active && 'bg-black/10 text-black',
  )

function ToolbarButton({
  editor,
  label,
  shortcut,
  Icon,
  active = false,
  disabled = false,
  onClick,
}: {
  editor: Editor | null
  label: string
  shortcut?: string
  Icon: IconType
  active?: boolean
  disabled?: boolean
  onClick: (chain: Chain) => void
}) {
  return (
    <button
      type='button'
      aria-label={label}
      aria-pressed={active}
      title={shortcut ? `${label} (${shortcut})` : label}
      disabled={!editor || disabled}
      // Keeps the selection in the editor, so the format applies to it.
      onMouseDown={(event) => event.preventDefault()}
      onClick={() => editor && onClick(editor.chain().focus())}
      className={toolbarButtonClass(active)}>
      <Icon className='size-4' />
    </button>
  )
}

function ToolbarDivider() {
  return <span aria-hidden className='mx-1 h-4 w-px bg-black/15' />
}

/**
 * Adds, edits or removes a link. With text selected, the text becomes the
 * link; with none, the address itself is inserted as one.
 */
function LinkButton({ editor, active }: { editor: Editor | null; active: boolean }) {
  const [open, setOpen] = useState(false)
  const [url, setUrl] = useState('')

  const apply = () => {
    if (!editor) return
    const href = toHref(url)

    if (!href) {
      editor.chain().focus().extendMarkRange('link').unsetLink().run()
    } else if (editor.state.selection.empty && !editor.isActive('link')) {
      editor
        .chain()
        .focus()
        .insertContent({ type: 'text', text: url.trim(), marks: [{ type: 'link', attrs: { href } }] })
        .run()
    } else {
      editor.chain().focus().extendMarkRange('link').setLink({ href }).run()
    }
    setOpen(false)
  }

  const remove = () => {
    editor?.chain().focus().extendMarkRange('link').unsetLink().run()
    setOpen(false)
  }

  // No <form>: this sits inside the event form, and a nested submit would
  // bubble up to it through the portal.
  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault()
      apply()
    }
  }

  return (
    <Popover
      open={open}
      onOpenChange={(next) => {
        if (next) setUrl(editor?.getAttributes('link').href ?? '')
        setOpen(next)
      }}>
      <PopoverTrigger asChild>
        <button
          type='button'
          aria-label='Link'
          aria-pressed={active}
          title='Link'
          disabled={!editor}
          onMouseDown={(event) => event.preventDefault()}
          className={toolbarButtonClass(active)}>
          <RiLink className='size-4' />
        </button>
      </PopoverTrigger>

      <PopoverContent align='start' className='flex w-72 flex-col gap-2 p-3 z-10000000000'>
        <label htmlFor='rich-text-link' className='text-xs font-medium text-black/70'>
          Link address
        </label>
        <Input
          id='rich-text-link'
          autoFocus
          value={url}
          onChange={(event) => setUrl(event.target.value)}
          onKeyDown={onKeyDown}
          placeholder='https://example.com'
          className='h-9 text-sm'
        />
        <div className='flex justify-end gap-2'>
          {active && (
            <Button type='button' variant='ghost' size='sm' onClick={remove}>
              Remove link
            </Button>
          )}
          <Button type='button' size='sm' onClick={apply} className='bg-black text-white hover:bg-black/90'>
            Apply
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}
