import { cn } from "@/lib/utils";
import * as React from "react";

export interface InputProps
  extends Omit<React.ComponentProps<"input">, "onError"> {
  onError?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, onError, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "text-pure-black text-[13px] flex h-[35px] w-full rounded-xs bg-transparent border border-white px-3 py-1 text-base  transition-colors file:border-0  file:text-sm file:font-medium file:text-foreground c:text-gray-150 focus-visible:outline-none  focus-within:border-white  disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          className,
          onError && "border-error-900"
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };
