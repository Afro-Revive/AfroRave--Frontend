import { cva, type VariantProps } from "class-variance-authority";

export const buttonVariants = cva(
  "font-inter-tight cursor-pointer inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-xs hover:bg-primary/90",
        destructive:
          "bg-destructive text-white shadow-xs hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline:
          "border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50",
        secondary: "bg-charcoal text-white shadow-xs hover:bg-charcoal/80",
        ghost:
          "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
        link: "text-primary underline-offset-4 hover:underline",
        green: "bg-vibrant-green hover:bg-vibrabt-green/80",
        // The action that commits: Save, Create, Publish.
        primary: "bg-deep-red text-white shadow-xs hover:bg-deep-red/90",
        // The other button beside it: Cancel, Save Draft.
        dark: "bg-black text-white shadow-xs hover:bg-black/90",
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        icon: "size-9",
        // Labels set their own case: one word in capitals (SAVE, CANCEL),
        // longer ones in Title Case (Create Ticket, Update Password).
        // Save / Publish in a page header.
        header: "h-8 px-4 rounded-[5px] text-xs font-bold",
        // A full-width submit, as on the settings tabs.
        block: "h-11 w-full rounded-[6px] text-sm font-bold",
        // A cancel + submit pair inside a form: side by side from sm, stacked
        // full width on a phone. A minimum, not a fixed width, so a longer
        // label ("Creating promocode...") still fits.
        pill: "h-8 w-full sm:w-auto sm:min-w-[155px] px-4 rounded-full text-xs font-bold",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export type ButtonVariants = VariantProps<typeof buttonVariants>;
