export function PageHeader({
  title,
  description,
  children,
}: {
  title: string
  description?: React.ReactNode
  /** Filters or actions, on the right. */
  children?: React.ReactNode
}) {
  return (
    <header className='flex flex-col gap-4 md:flex-row md:items-end md:justify-between'>
      <div className='flex flex-col gap-1'>
        <h1 className='text-2xl font-bold text-white'>{title}</h1>
        {description && <p className='max-w-2xl text-sm text-white/60'>{description}</p>}
      </div>
      {children && <div className='flex flex-wrap items-center gap-2'>{children}</div>}
    </header>
  )
}
