import type { HTMLAttributes } from "react";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { cn } from "@/lib/utils";

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <GlassPanel className={cn("p-5", className)} {...props} />;
}
