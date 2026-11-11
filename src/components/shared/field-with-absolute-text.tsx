import type {
  FieldValues,
  UseFormReturn,
  Path,
  ControllerRenderProps,
} from "react-hook-form";
import { FormField } from "../reusable";

export function FormFieldWithAbsoluteText<T extends FieldValues>({
  form,
  name,
  label,
  text,
  children,
}: {
  form: UseFormReturn<T>;
  name: Path<T>;
  label: string;
  text: string;
  children: (field: ControllerRenderProps<T, Path<T>>) => React.ReactNode;
}) {
  return (
    <FormField
      form={form}
      name={name}
      label={label}
      className="w-full flex flex-col gap-1 text-black text-xs uppercase font-sf-pro-text"
    >
      {(field) => (
        // On mobile the prefix sits above the input
        <div className="flex w-full flex-col rounded-[4px] border border-mid-dark-gray/50 bg-white sm:h-10 sm:flex-row sm:items-center">
          <p className="shrink-0 whitespace-nowrap lowercase px-3 pt-2 sm:border-r sm:border-mid-dark-gray/50 sm:py-[11px] rounded-l-[4px] text-black text-xs font-light font-sf-pro-text">
            {text}
          </p>

          <div className="min-w-0 flex-1">{children(field)}</div>
        </div>
      )}
    </FormField>
  );
}
