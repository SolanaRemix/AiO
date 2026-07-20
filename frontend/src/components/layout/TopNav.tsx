"use client";

import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import * as Tooltip from "@radix-ui/react-tooltip";
import { Bell, Bot, BrainCircuit, Coins, MoonStar, PanelLeft, PanelRight, Search, Sparkles, SunMedium } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";

type TopNavProps = {
  theme: "dark" | "light";
  onThemeToggle: () => void;
  onSidebarToggle: () => void;
  onRightPanelToggle: () => void;
};

const agentSignals = [
  { label: "Primary swarm stable", tone: "success" as const },
  { label: "2 queues warming", tone: "warning" as const },
  { label: "Latency 122ms", tone: "primary" as const },
];

export function TopNav({ theme, onThemeToggle, onSidebarToggle, onRightPanelToggle }: TopNavProps) {
  return (
    <Tooltip.Provider delayDuration={120}>
      <header className="sticky top-0 z-40 px-4 pb-4 pt-4 lg:px-6">
        <div className="glass-panel floating-panel mx-auto flex max-w-[1800px] items-center gap-3 px-4 py-3">
          <Button variant="ghost" size="icon" className="lg:hidden" onClick={onSidebarToggle}>
            <PanelLeft className="h-4 w-4" />
          </Button>
          <div className="flex items-center gap-3 rounded-2xl border border-primary/20 bg-primary/10 px-3 py-2 neural-glow">
            <div className="rounded-xl bg-primary/20 p-2 text-primary">
              <BrainCircuit className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold tracking-[0.2em] text-primary">AIO</p>
              <p className="text-xs text-foreground/60">Enterprise OS</p>
            </div>
          </div>

          <div className="hidden flex-1 items-center gap-2 rounded-2xl border border-border/80 bg-card/60 px-3 md:flex">
            <Search className="h-4 w-4 text-foreground/40" />
            <Input className="border-none bg-transparent px-0 focus:ring-0" placeholder="Search projects, memory, knowledge, or agents" />
          </div>

          <div className="hidden items-center gap-2 xl:flex">
            {agentSignals.map((signal) => (
              <Tooltip.Root key={signal.label}>
                <Tooltip.Trigger asChild>
                  <div>
                    <Badge variant={signal.tone}>{signal.label}</Badge>
                  </div>
                </Tooltip.Trigger>
                <Tooltip.Portal>
                  <Tooltip.Content sideOffset={8} className="rounded-lg border border-border/80 bg-card px-3 py-2 text-xs text-foreground shadow-glass">
                    Live agent telemetry updated in the last 5 seconds.
                  </Tooltip.Content>
                </Tooltip.Portal>
              </Tooltip.Root>
            ))}
          </div>

          <div className="ml-auto flex items-center gap-2">
            <div className="hidden items-center gap-2 rounded-2xl border border-border/80 bg-card/60 px-3 py-2 md:flex">
              <Coins className="h-4 w-4 text-warning" />
              <div>
                <p className="text-xs text-foreground/55">Credits</p>
                <p className="font-mono text-sm">148.2k</p>
              </div>
            </div>

            <Button variant="ghost" size="icon" onClick={onRightPanelToggle} className="hidden xl:inline-flex">
              <PanelRight className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={onThemeToggle}>
              {theme === "dark" ? <SunMedium className="h-4 w-4" /> : <MoonStar className="h-4 w-4" />}
            </Button>
            <Button variant="ghost" size="icon">
              <Bell className="h-4 w-4" />
            </Button>

            <DropdownMenu.Root>
              <DropdownMenu.Trigger asChild>
                <button className="flex items-center gap-2 rounded-2xl border border-border/80 bg-card/70 px-3 py-2 text-left outline-none transition hover:border-primary/40">
                  <div className="rounded-xl bg-primary/15 p-2 text-primary">
                    <Bot className="h-4 w-4" />
                  </div>
                  <div className="hidden sm:block">
                    <p className="text-sm font-medium">Operator One</p>
                    <p className="text-xs text-foreground/55">Neural admin lane</p>
                  </div>
                </button>
              </DropdownMenu.Trigger>
              <DropdownMenu.Portal>
                <DropdownMenu.Content sideOffset={8} className="glass-panel min-w-56 p-2 text-sm shadow-glass">
                  <DropdownMenu.Label className="px-2 py-1 text-xs uppercase tracking-[0.2em] text-foreground/50">Workspace</DropdownMenu.Label>
                  <DropdownMenu.Item className="rounded-lg px-3 py-2 outline-none transition hover:bg-foreground/5">
                    <Sparkles className="mr-2 inline h-4 w-4 text-primary" /> Optimize current surface
                  </DropdownMenu.Item>
                  <DropdownMenu.Item className="rounded-lg px-3 py-2 outline-none transition hover:bg-foreground/5">Invite collaborators</DropdownMenu.Item>
                  <DropdownMenu.Separator className="my-2 h-px bg-border/80" />
                  <DropdownMenu.Item className="rounded-lg px-3 py-2 outline-none transition hover:bg-foreground/5">Profile settings</DropdownMenu.Item>
                  <DropdownMenu.Item className="rounded-lg px-3 py-2 outline-none transition hover:bg-foreground/5">Sign out</DropdownMenu.Item>
                </DropdownMenu.Content>
              </DropdownMenu.Portal>
            </DropdownMenu.Root>
          </div>
        </div>
      </header>
    </Tooltip.Provider>
  );
}
