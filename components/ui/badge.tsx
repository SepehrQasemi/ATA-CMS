import type { HTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.08em]",
  {
    variants: {
      variant: {
        neutral: "bg-white text-foreground ring-1 ring-line",
        success: "bg-emerald-50 text-success ring-1 ring-emerald-100",
        warning: "bg-amber-50 text-amber-700 ring-1 ring-amber-100",
        muted: "bg-[#fff0f0] text-brand-strong ring-1 ring-[#f2d0d0]",
      },
    },
    defaultVariants: {
      variant: "neutral",
    },
  },
);

type BadgeProps = HTMLAttributes<HTMLSpanElement> &
  VariantProps<typeof badgeVariants>;

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant, className }))} {...props} />;
}
