"use client";

import { usePathname } from "next/navigation";
import * as ScrollArea from "@radix-ui/react-scroll-area";
import * as Separator from "@radix-ui/react-separator";
import { Activity, Gauge, Settings2, SlidersHorizontal, Sparkles } from "lucide-react";
import { agentActivities, contextSummaries } from "@/lib/constants";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

type RightPanelProps = {
  collapsed: boolean;
  onToggle: () => void;
};

export function RightPanel({ collapsed, onToggle }: RightPanelProps) {
  const pathname = usePathname();
  const context = contextSummaries[pathname] ?? contextSummaries["/"];

  return (
    <aside className={cn("hidden shrink-0 xl:block", collapsed ? "w-24" : "w-80")}>
      <div className="glass-panel floating-panel sticky top-24 flex h-[calc(100vh-8rem)] flex-col overflow-hidden p-4">
        <div className="mb-4 flex items-center justify-between gap-2">
          {!collapsed && (
            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-foreground/45">Context panel</p>
              <p className="text-sm text-foreground/65">Live state and settings</p>
            </div>
          )}
          <Button variant="ghost" size="icon" onClick={onToggle}>
            <SlidersHorizontal className="h-4 w-4" />
          </Button>
        </div>

        <ScrollArea.Root className="flex-1 overflow-hidden">
          <ScrollArea.Viewport className="scroll-area-viewport h-full pr-2">
            <div className="space-y-4">
              <div className="rounded-2xl border border-primary/20 bg-primary/10 p-4 neural-border">
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-primary/20 p-2 text-primary">
                    <Sparkles className="h-4 w-4" />
                  </div>
                  {!collapsed && (
                    <div>
                      <p className="text-sm font-semibold">{context.title}</p>
                      <p className="mt-1 text-xs text-foreground/55">{context.summary}</p>
                    </div>
                  )}
                </div>
                {!collapsed && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {context.tags.map((tag) => (
                      <Badge key={tag} variant="primary">{tag}</Badge>
                    ))}
                  </div>
                )}
              </div>

              {!collapsed && (
                <>
                  <Separator.Root className="h-px bg-border/80" decorative />
                  <section>
                    <div className="mb-3 flex items-center gap-2">
                      <Activity className="h-4 w-4 text-success" />
                      <h3 className="text-sm font-semibold">Agent activity</h3>
                    </div>
                    <div className="space-y-3">
                      {agentActivities.map((activity) => (
                        <div key={activity.title} className="rounded-2xl border border-border/80 bg-card/50 p-3">
                          <div className="flex items-center justify-between gap-2">
                            <p className="text-sm font-medium">{activity.title}</p>
                            <Badge variant={activity.status === "Running" ? "success" : activity.status === "Queued" ? "warning" : activity.status === "Learning" ? "primary" : "neutral"}>{activity.status}</Badge>
                          </div>
                          <p className="mt-1 text-xs text-foreground/45">{activity.detail}</p>
                        </div>
                      ))}
                    </div>
                  </section>

                  <Separator.Root className="h-px bg-border/80" decorative />
                  <section>
                    <div className="mb-3 flex items-center gap-2">
                      <Gauge className="h-4 w-4 text-warning" />
                      <h3 className="text-sm font-semibold">Quick settings</h3>
                    </div>
                    <div className="space-y-3">
                      {[
                        ["Adaptive panel density", "Balanced"],
                        ["Knowledge freshness", "Auto-refresh"],
                        ["Quality gate strictness", "High"],
                      ].map(([label, value]) => (
                        <div key={label} className="flex items-center justify-between rounded-2xl border border-border/80 bg-card/50 px-3 py-3 text-sm">
                          <span className="text-foreground/65">{label}</span>
                          <span className="font-medium">{value}</span>
                        </div>
                      ))}
                    </div>
                  </section>
                </>
              )}
            </div>
          </ScrollArea.Viewport>
          <ScrollArea.Scrollbar orientation="vertical" className="flex w-2 touch-none p-0.5">
            <ScrollArea.Thumb className="relative flex-1 rounded-full bg-border" />
          </ScrollArea.Scrollbar>
        </ScrollArea.Root>

        {!collapsed && (
          <div className="mt-4 rounded-2xl border border-border/80 bg-card/50 p-3">
            <div className="mb-2 flex items-center gap-2 text-sm font-medium">
              <Settings2 className="h-4 w-4 text-primary" /> Neural tuning
            </div>
            <p className="text-xs text-foreground/45">Surface fidelity, cost posture, and memory depth automatically adapt to route intent.</p>
          </div>
        )}
      </div>
    </aside>
  );
}
