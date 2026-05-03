import * as React from "react";
import { cn } from "@/lib/utils";

type Tone = "default" | "low" | "medium" | "high" | "accent";

const toneStyles: Record<Tone, string> = {
  default: "border-ink/15 bg-white text-ink/70",
  low: "border-emerald-200 bg-emerald-50 text-emerald-800",
  medium: "border-amber-200 bg-amber-50 text-amber-800",
  high: "border-red-200 bg-red-50 text-red-800",
  accent: "border-accent/30 bg-accent/10 text-accent",
};

export function Badge({
  tone = "default",
  className,
  ...props
}: { tone?: Tone } & React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium",
        toneStyles[tone],
        className,
      )}
      {...props}
    />
  );
}
