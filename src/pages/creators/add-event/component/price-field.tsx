import {
  CustomFormField as FormField,
  CustomInput as Input,
} from "@/components/shared/custom-form";
import { cn } from "@/lib/utils";
import type { FieldValues, Path, UseFormReturn } from "react-hook-form";
import { useWatch } from "react-hook-form";

interface IPriceField<T extends FieldValues> {
  form: UseFormReturn<T>;
  name: Path<T>;
  label?: string;
  ticketTypeName?: Path<T>;
  className?: string;
  readOnly?: boolean;
  description?: string;
  showMessage?: boolean;
}

export function PriceField<T extends FieldValues>({
  form,
  name,
  label = "PRICE",
  ticketTypeName,
  className,
  readOnly = false,
  description,
  showMessage = false,
}: IPriceField<T>) {
  const ticketType = useWatch({
    control: form.control,
    name: ticketTypeName || (name as Path<T>),
  });
  const isFreeTicket = ticketType === "free";

  if (isFreeTicket) {
    return (
      <div className="w-full h-9 flex items-center gap-3">
        <p className="py-[11px] w-14 h-full flex items-center justify-center bg-[#acacac] rounded-[5px]">
          FREE
        </p>
        <div className="w-full h-9 flex items-center px-3 bg-gray-100 rounded-[5px] text-gray-500 text-sm">
          Free ticket
        </div>
      </div>
    );
  }

  return (
    <FormField
      form={form}
      name={name}
      label={label}
      className="w-full"
      showMessage={showMessage}
    >
      {(field) => (
        <div>
          <div className="w-full h-9 flex items-center gap-3">
            <p className="py-[11px] w-14 h-full flex items-center justify-center bg-[#acacac] rounded-[5px]">
              ₦
            </p>
            <Input
              type="number"
              readOnly={readOnly}
              className={cn(
                "w-full h-9",
                readOnly && "bg-gray-100 text-mid-dark-gray",
                className,
              )}
              {...field}
              value={field.value == null ? "" : String(field.value)}
            />
          </div>
          <p className="mt-2 text-[10px] normal-case font-sf-pro-text text-mid-dark-gray">
            {description}
          </p>
        </div>
      )}
    </FormField>
  );
}
