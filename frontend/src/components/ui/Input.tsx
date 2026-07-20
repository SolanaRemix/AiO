import * as React from "react";
import { cn } from "@/lib/utils";

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(function Input(
  { className, ...props },
  ref,
) {
  return (
    <input
      ref={ref}
      className={cn(
        "h-11 w-full rounded-xl border border-border/80 bg-card/60 px-4 text-sm text-foreground outline-none transition placeholder:text-foreground/35 focus:border-primary/70 focus:ring-2 focus:ring-primary/20",
        className,
      )}
      {...props}
    />
  );
});
