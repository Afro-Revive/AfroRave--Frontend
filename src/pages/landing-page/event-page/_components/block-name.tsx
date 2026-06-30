export function BlockName({
  name,
  className,
}: {
  name: string;
  className?: string;
}) {
  return (
    <p
      className={`md:text-2xl text-xl font-sf-pro-display font-black tracking-[-0.25px] text-white uppercase ${className}`}
    >
      {name}
    </p>
  );
}
