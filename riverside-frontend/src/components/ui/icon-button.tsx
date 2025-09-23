import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/lib/utils";

type IconButtonProps = React.ComponentProps<"button"> & {
  asChild?: boolean;
};

function IconButton({ className, asChild = false, ...props }: IconButtonProps) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="icon-button"
      className={cn(
        // square, centered, minimal button
        "inline-flex items-center justify-center rounded-lg size-9 p-0 transition-colors disabled:opacity-50 disabled:pointer-events-none outline-none focus-visible:ring-2 focus-visible:ring-ring/50 [&>svg]:pointer-events-none [&>svg:not([class*='size-'])]:size-4 hover:bg-[var(--icon-hover)]",
        className
      )}
      {...props}
    />
  );
}

export { IconButton };
