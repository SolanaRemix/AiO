"use client";

import * as Tabs from "@radix-ui/react-tabs";
import { Bot, BookOpenText, FileStack, Files, History, ListChecks, Logs, MemoryStick, MonitorCog, TerminalSquare } from "lucide-react";
import { workspaceTabs } from "@/lib/constants";
import { Artifacts } from "@/components/workspace/Artifacts";
import { FileTree } from "@/components/workspace/FileTree";
import { TaskList } from "@/components/workspace/TaskList";
import { Timeline } from "@/components/workspace/Timeline";
import { WorkspaceChat } from "@/components/workspace/WorkspaceChat";
import { Badge } from "@/components/ui/Badge";

const tabIcons = {
  Chat: Bot,
  Files,
  Tasks: ListChecks,
  Timeline: History,
  Artifacts: FileStack,
  Memory: MemoryStick,
  Knowledge: BookOpenText,
  Agents: Bot,
  Logs,
  Terminal: TerminalSquare,
  Deployments: MonitorCog,
} as const;

function PlaceholderPanel({ title, detail }: { title: string; detail: string }) {
  return (
    <div className="rounded-3xl border border-border/80 bg-card/45 p-5">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-lg font-semibold">{title}</h3>
        <Badge variant="primary">Live</Badge>
      </div>
      <p className="mt-3 text-sm text-foreground/60">{detail}</p>
      <div className="mt-5 grid gap-3 md:grid-cols-3">
        {[1, 2, 3].map((item) => (
          <div key={item} className="rounded-2xl border border-border/80 bg-card/60 p-4">
            <div className="h-4 w-24 animate-pulse rounded-full bg-foreground/10" />
            <div className="mt-3 h-12 animate-pulse rounded-2xl bg-foreground/10" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function WorkspaceTabs() {
  return (
    <Tabs.Root defaultValue="Chat" className="space-y-5">
      <Tabs.List className="flex gap-2 overflow-x-auto rounded-3xl border border-border/80 bg-card/45 p-2">
        {workspaceTabs.map((tab) => {
          const Icon = tabIcons[tab as keyof typeof tabIcons] ?? Bot;
          return (
            <Tabs.Trigger
              key={tab}
              value={tab}
              className="inline-flex min-w-max items-center gap-2 rounded-2xl px-4 py-2 text-sm text-foreground/60 transition data-[state=active]:bg-primary data-[state=active]:text-white"
            >
              <Icon className="h-4 w-4" />
              {tab}
            </Tabs.Trigger>
          );
        })}
      </Tabs.List>

      <Tabs.Content value="Chat"><WorkspaceChat /></Tabs.Content>
      <Tabs.Content value="Files"><FileTree /></Tabs.Content>
      <Tabs.Content value="Tasks"><TaskList /></Tabs.Content>
      <Tabs.Content value="Timeline"><Timeline /></Tabs.Content>
      <Tabs.Content value="Artifacts"><Artifacts /></Tabs.Content>
      <Tabs.Content value="Memory"><PlaceholderPanel title="Memory lane" detail="Review durable traces, reusable workflows, and confidence-ranked recall packs for the current initiative." /></Tabs.Content>
      <Tabs.Content value="Knowledge"><PlaceholderPanel title="Knowledge retrieval" detail="Inspect connected docs, freshness, and semantic coverage powering the active workspace." /></Tabs.Content>
      <Tabs.Content value="Agents"><PlaceholderPanel title="Agent command deck" detail="Track specialist capacity, execution queues, and handoff latency across the swarm." /></Tabs.Content>
      <Tabs.Content value="Logs"><PlaceholderPanel title="Execution logs" detail="Search tool traces, model usage, and deployment events with linked task context." /></Tabs.Content>
      <Tabs.Content value="Terminal"><PlaceholderPanel title="Terminal surface" detail="Observe build and runtime telemetry alongside artifacts and quality gates." /></Tabs.Content>
      <Tabs.Content value="Deployments"><PlaceholderPanel title="Deployment control" detail="Bundle release evidence, environment health, and change approvals before production handoff." /></Tabs.Content>
    </Tabs.Root>
  );
}
