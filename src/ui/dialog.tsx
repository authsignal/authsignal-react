import * as DialogPrimitive from "@radix-ui/react-dialog";
import { Cross2Icon } from "@radix-ui/react-icons";
import * as React from "react";

import { cn } from "../lib/utils";

const Dialog = DialogPrimitive.Root;

const DialogTrigger = DialogPrimitive.Trigger;

const DialogPortal = DialogPrimitive.Portal;

const DialogClose = DialogPrimitive.Close;

const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      "as-fixed as-inset-0 as-z-50 as-bg-black/80 data-[state=open]:as-animate-in data-[state=closed]:as-animate-out data-[state=closed]:as-fade-out-0 data-[state=open]:as-fade-in-0",
      className,
    )}
    {...props}
  />
));
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName;

const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> & {
    container: Element | null | undefined;
  }
>(({ className, children, container, ...props }, ref) => (
  <DialogPortal container={container}>
    <DialogOverlay />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        "as-fixed as-left-1/2 as-top-1/2 as-z-50 as-grid as-w-full as-max-w-lg -as-translate-x-1/2 -as-translate-y-1/2 as-gap-4 as-border as-bg-background as-p-6 as-shadow-lg as-duration-200 data-[state=open]:as-animate-in data-[state=closed]:as-animate-out data-[state=closed]:as-fade-out-0 data-[state=open]:as-fade-in-0 data-[state=closed]:as-zoom-out-95 data-[state=open]:as-zoom-in-95 data-[state=closed]:as-slide-out-to-left-1/2 data-[state=closed]:as-slide-out-to-top-[48%] data-[state=open]:as-slide-in-from-left-1/2 data-[state=open]:as-slide-in-from-top-[48%] sm:as-rounded-lg",
        className,
      )}
      {...props}
    >
      {children}
      <DialogPrimitive.Close className="as-absolute as-right-4 as-top-4 as-rounded-sm as-opacity-70 as-ring-offset-background as-transition-opacity hover:as-opacity-100 focus:as-outline-none focus:as-ring-2 focus:as-ring-ring focus:as-ring-offset-2 disabled:as-pointer-events-none data-[state=open]:as-text-foreground">
        <Cross2Icon className="as-size-[1rem]" />
        <span className="as-sr-only">Close</span>
      </DialogPrimitive.Close>
    </DialogPrimitive.Content>
  </DialogPortal>
));
DialogContent.displayName = DialogPrimitive.Content.displayName;

const DialogHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "as-flex as-flex-col as-space-y-1.5 as-text-center sm:as-text-left",
      className,
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
      "as-flex as-flex-col-reverse sm:as-flex-row sm:as-justify-end sm:as-space-x-2",
      className,
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
      "as-text-lg as-font-semibold as-leading-none as-tracking-tight",
      className,
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
    className={cn("as-text-sm as-text-foreground", className)}
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
