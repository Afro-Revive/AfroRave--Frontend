/**
 * A field box with its label inset at the top, as on the fans account page.
 * Shared by the organizer settings Account and Payout tabs; the input and
 * select classes that go inside it are in settings-field-classes.ts.
 */
export function InsetField({
  label,
  muted = false,
  children,
}: {
  label: string;
  /** For a read-only field: the label goes grey to match. */
  muted?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="relative w-full">
      <label
        className={`absolute left-4 top-[10px] z-10 pointer-events-none text-[10px] font-sf-pro-display uppercase tracking-widest ${
          muted ? "text-[#ACACAC]" : "text-mid-dark-gray"
        }`}
      >
        {label}
      </label>
      {children}
    </div>
  );
}
