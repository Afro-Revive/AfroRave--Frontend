"use client";

import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

const Dialog = DialogPrimitive.Root;

const DialogTrigger = DialogPrimitive.Trigger;

const DialogPortal = DialogPrimitive.Portal;

const DialogClose = DialogPrimitive.Close;

const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay> & {
    cancelOnOverlay?: boolean;
  }
>(({ className, cancelOnOverlay, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      "fixed inset-0 z-[900000] bg-black/50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    )}
    {...props}
  />
));
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName;

interface DialogContentProps
  extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> {
  noCancel?: boolean;
  floatingCancel?: boolean;
  cancelOnOverlay?: boolean;
  overlayClassName?: string;
  slideFromBottom?: boolean;
}

const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  DialogContentProps
>(
  (
    {
      className,
      overlayClassName,
      children,
      noCancel,
      floatingCancel,
      cancelOnOverlay,
      slideFromBottom,
      ...props
    },
    ref
  ) => (
    <DialogPortal>
      <DialogOverlay className={overlayClassName} cancelOnOverlay={cancelOnOverlay} />
      <DialogPrimitive.Content
        ref={ref}
        className={cn(
          "fixed z-[990000] grid w-full bg-white p-6 shadow-lg duration-300 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
          slideFromBottom
            ? "bottom-0 left-0 right-0 max-w-full gap-0 data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom"
            : "left-[50%] top-[50%] max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-center data-[state=open]:slide-in-from-center sm:rounded-lg",
          className
        )}
        {...props}
      >
        {!noCancel && !cancelOnOverlay && (
          <DialogPrimitive.Close
            className={cn(
              "z-50 font-bold opacity-90 transition-opacity hover:opacity-100 focus:outline-none disabled:pointer-events-none",
              floatingCancel
                ? "absolute top-4 right-4 md:top-6 md:right-6 p-2 bg-white/10 hover:bg-white/20 rounded-full backdrop-blur-sm text-white cursor-pointer"
                : "w-full flex justify-end px-10 pt-6"
            )}
            onClick={(e) => e.stopPropagation()}
          >
            <X className="h-5 w-5 md:h-6 md:w-6 cursor-pointer" />
            <span className="sr-only">Close</span>
          </DialogPrimitive.Close>
        )}
        {children}
      </DialogPrimitive.Content>
      {cancelOnOverlay && (
        <DialogPrimitive.Close
          className="fixed top-4 right-4 md:top-10 md:right-10 z-[1000000] p-2 bg-white/10 hover:bg-white/20 rounded-full backdrop-blur-sm font-bold opacity-90 transition-all hover:opacity-100 focus:outline-none disabled:pointer-events-none cursor-pointer data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0"
          onClick={(e) => e.stopPropagation()}
          style={{ WebkitTapHighlightColor: 'transparent' }}
        >
          <X className="h-5 w-5 md:h-6 md:w-6 text-white font-bold" />
          <span className="sr-only">Close</span>
        </DialogPrimitive.Close>
      )}
    </DialogPortal>
  )
);
DialogContent.displayName = DialogPrimitive.Content.displayName;

const DialogHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col text-center sm:text-left",
      className
    )}
    {...props}
  />
);
DialogHeader.displayName = "DialogHeader";

const DialogFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",
      className
    )}
    {...props}
  />
);
DialogFooter.displayName = "DialogFooter";

const DialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn(
      "text-lg font-semibold leading-none tracking-tight",
      className
    )}
    {...props}
  />
));
DialogTitle.displayName = DialogPrimitive.Title.displayName;

const DialogDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
));
DialogDescription.displayName = DialogPrimitive.Description.displayName;

export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogTrigger,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
};
