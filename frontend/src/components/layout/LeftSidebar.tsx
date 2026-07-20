"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import * as ScrollArea from "@radix-ui/react-scroll-area";
import { Bot, ChevronRight, FolderKanban, Home, LibraryBig, MemoryStick, PanelLeftClose, PanelLeftOpen, Sparkles, Workflow } from "lucide-react";
import { navigationItems, recentProjects } from "@/lib/constants";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

const iconMap = {
  Home,
  Workspace: Workflow,
  Projects: FolderKanban,
  Knowledge: LibraryBig,
  Memory: MemoryStick,
  Agents: Bot,
} as const;

type LeftSidebarProps = {
  collapsed: boolean;
  onToggle: () => void;
};

export function LeftSidebar({ collapsed, onToggle }: LeftSidebarProps) {
  const pathname = usePathname();

  return (
    <aside className={cn("hidden shrink-0 lg:block", collapsed ? "w-24" : "w-80")}>
      <div className="glass-panel floating-panel sticky top-24 flex h-[calc(100vh-8rem)] flex-col overflow-hidden p-3">
        <div className="mb-3 flex items-center justify-between px-1">
          {!collapsed && (
            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-foreground/45">Navigation</p>
              <p className="text-sm text-foreground/65">Adaptive command surface</p>
            </div>
          )}
          <Button variant="ghost" size="icon" onClick={onToggle}>
            {collapsed ? <PanelLeftOpen className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
          </Button>
        </div>

        <ScrollArea.Root className="flex-1 overflow-hidden">
          <ScrollArea.Viewport className="scroll-area-viewport h-full pr-2">
            <nav className="space-y-2">
              {navigationItems.map((item) => {
                const Icon = iconMap[item.label as keyof typeof iconMap] ?? Home;
                const active = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "group flex items-center gap-3 rounded-2xl border px-3 py-3 transition-all",
                      active
                        ? "border-primary/40 bg-primary/10 text-primary shadow-glow"
                        : "border-transparent bg-transparent text-foreground/70 hover:border-border/80 hover:bg-card/60 hover:text-foreground",
                    )}
                  >
                    <div className={cn("rounded-xl p-2", active ? "bg-primary/15" : "bg-foreground/5")}>
                      <Icon className="h-4 w-4" />
                    </div>
                    {!collapsed && (
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium">{item.label}</p>
                        <p className="truncate text-xs text-foreground/45">{item.description}</p>
                      </div>
                    )}
                    {!collapsed && active && <ChevronRight className="h-4 w-4" />}
                  </Link>
                );
              })}
            </nav>

            <div className="mt-6 space-y-3">
              {!collapsed && (
                <div className="flex items-center justify-between px-1">
                  <p className="text-xs uppercase tracking-[0.22em] text-foreground/45">Recent projects</p>
                  <Badge variant="primary">4 live</Badge>
                </div>
              )}
              {recentProjects.slice(0, 3).map((project) => (
                <div key={project.id} className="rounded-2xl border border-border/80 bg-card/50 p-3">
                  <div className="flex items-center justify-between gap-2">
                    <div className="rounded-xl bg-success/12 p-2 text-success">
                      <Sparkles className="h-4 w-4" />
                    </div>
                    {!collapsed && <Badge variant={project.status === "Active" ? "success" : project.status === "Review" ? "warning" : "primary"}>{project.status}</Badge>}
                  </div>
                  {!collapsed && (
                    <>
                      <p className="mt-3 text-sm font-medium">{project.name}</p>
                      <p className="mt-1 text-xs text-foreground/45">{project.lastActivity}</p>
                    </>
                  )}
                </div>
              ))}
            </div>
          </ScrollArea.Viewport>
          <ScrollArea.Scrollbar orientation="vertical" className="flex w-2 touch-none p-0.5">
            <ScrollArea.Thumb className="relative flex-1 rounded-full bg-border" />
          </ScrollArea.Scrollbar>
        </ScrollArea.Root>

        <div className="mt-3 rounded-2xl border border-primary/20 bg-primary/10 p-3">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-primary/20 p-2 text-primary">
              <Bot className="h-4 w-4" />
            </div>
            {!collapsed && (
              <div>
                <p className="text-sm font-medium">108 agents online</p>
                <p className="text-xs text-foreground/55">12 currently executing critical paths</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
}
