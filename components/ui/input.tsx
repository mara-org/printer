import * as React from "react";
import { cn } from "@/lib/utils";

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  function Input({ className, ...props }, ref) {
    return (
      <input
        ref={ref}
        className={cn(
          "h-10 w-full rounded-xl border border-ink/15 bg-white px-4 text-base outline-none transition placeholder:text-ink/40 focus:border-accent disabled:opacity-50",
          className,
        )}
        {...props}
      />
    );
  },
);
