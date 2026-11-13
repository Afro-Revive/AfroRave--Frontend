import { FIELD_LABEL_CLASS } from "@/components/shared/field-label";
import { cn } from "@/lib/utils";

/**
 * A settings field with its label above it, in the same style as every other
 * form. The label wraps the field, so clicking it focuses the input or opens
 * the select. Shared by the organizer settings Account and Payout tabs; the
 * input and select classes are in settings-field-classes.ts.
 */
export function SettingsField({
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
    <label className="flex w-full flex-col gap-1">
      <span className={cn(FIELD_LABEL_CLASS, muted && "text-[#ACACAC]")}>
        {label}
      </span>
      {children}
    </label>
  );
}
