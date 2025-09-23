import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { Loader2 } from "lucide-react"; // spinner icon

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&>svg]:pointer-events-none [&>svg:not([class*='size-'])]:size-4 shrink-0 [&>svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive has-[>svg:only-child]:gap-0",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground hover:bg-primary/90 data-[selected=true]:ring-2 data-[selected=true]:ring-ring",
        destructive:
          "bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline:
          "border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50 data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost:
          "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3 gap-2",
        sm: "h-8 rounded-md px-3 has-[>svg]:px-2.5 gap-1.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4 gap-2",
        icon: "size-9 p-0",
      },
      selected: {
        true: "ring-2 ring-ring",
        false: "",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      selected: false,
    },
  }
);

function Button({
  className,
  variant,
  size,
  selected,
  asChild = false,
  isLoading = false,
  children,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
    isLoading?: boolean;
  }) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="button"
      data-selected={selected ? "true" : undefined}
      className={cn(
        buttonVariants({ variant, size, selected }),
        className,
        isLoading && "cursor-not-allowed opacity-80"
      )}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading ? <Loader2 className="animate-spin text-white" /> : children}
    </Comp>
  );
}

export { Button, buttonVariants };
