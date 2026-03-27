import * as React from "react";

import { cn } from "@/lib/utils";

export const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, type = "text", ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn(
        "focus-ring flex h-11 w-full rounded-2xl border border-line bg-white px-4 py-2 text-sm shadow-sm outline-none placeholder:text-muted",
        className,
      )}
      ref={ref}
      {...props}
    />
  );
});
Input.displayName = "Input";
