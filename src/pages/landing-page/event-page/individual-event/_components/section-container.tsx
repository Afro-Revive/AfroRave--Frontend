export function SectionContainer({ children }: { children: React.ReactNode }) {
  return (
    // No page padding — these sit inside the scrolling column, which owns the gutters.
    <div className="flex max-lg:flex-col gap-[30px] lg:gap-[60px] w-full min-w-0">
      {children}
    </div>
  );
}
