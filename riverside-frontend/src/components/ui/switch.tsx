import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const switchVariants = cva(
  "relative inline-flex items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 disabled:opacity-50 disabled:cursor-not-allowed",
  {
    variants: {
      size: {
        xs: "h-4 w-7",
        sm: "h-5 w-9",
        md: "h-6 w-11",
        lg: "h-7 w-14",
      },
      variant: {
        default: "data-[state=checked]:bg-primary bg-input/60",
        white:
          "bg-card data-[state=checked]:bg-primary border border-input shadow-xs",
      },
    },
    defaultVariants: {
      size: "md",
      variant: "default",
    },
  }
);

const thumbVariants = cva(
  "pointer-events-none block rounded-full bg-white shadow-sm ring-1 ring-black/10 transition-transform",
  {
    variants: {
      size: {
        xs: "h-3 w-3 translate-x-0.5 data-[state=checked]:translate-x-[12px]",
        sm: "h-4 w-4 translate-x-0.5 data-[state=checked]:translate-x-[16px]",
        md: "h-5 w-5 translate-x-0.5 data-[state=checked]:translate-x-[22px]",
        lg: "h-6 w-6 translate-x-1 data-[state=checked]:translate-x-[26px]",
      },
    },
    defaultVariants: {
      size: "md",
    },
  }
);

type SwitchProps = Omit<React.ComponentProps<"button">, "onChange"> &
  VariantProps<typeof switchVariants> & {
    checked?: boolean;
    defaultChecked?: boolean;
    onCheckedChange?: (checked: boolean) => void;
    label?: string;
  };

function Switch({
  className,
  size,
  variant,
  checked: controlledChecked,
  defaultChecked,
  onCheckedChange,
  disabled,
  label,
  ...props
}: SwitchProps) {
  const [uncontrolledChecked, setUncontrolledChecked] = React.useState(
    !!defaultChecked
  );
  const isControlled = controlledChecked !== undefined;
  const checked = isControlled ? controlledChecked : uncontrolledChecked;

  const setChecked = (value: boolean) => {
    if (!isControlled) setUncontrolledChecked(value);
    onCheckedChange?.(value);
  };

  const toggle = () => {
    if (disabled) return;
    setChecked(!checked);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      toggle();
    }
  };

  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      aria-disabled={disabled}
      data-state={checked ? "checked" : "unchecked"}
      className={cn(switchVariants({ size, variant }), className)}
      disabled={disabled}
      onClick={toggle}
      onKeyDown={onKeyDown}
      {...props}
    >
      <span
        aria-hidden
        data-state={checked ? "checked" : "unchecked"}
        className={thumbVariants({ size })}
      />
    </button>
  );
}

export { Switch };
