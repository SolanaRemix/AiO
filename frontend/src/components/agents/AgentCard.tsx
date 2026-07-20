"use client";

import { motion } from "framer-motion";
import { Activity, Gauge, MapPin, TimerReset } from "lucide-react";
import type { AgentRecord } from "@/lib/constants";
import { Badge } from "@/components/ui/Badge";

export function AgentCard({ agent }: { agent: AgentRecord }) {
  return (
    <motion.div whileHover={{ y: -4 }} className="rounded-3xl border border-border/80 bg-card/45 p-4 transition hover:border-primary/35 hover:bg-card/70">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-lg font-semibold">{agent.name}</p>
          <p className="mt-1 text-sm text-foreground/55">{agent.specialty}</p>
        </div>
        <Badge variant={agent.status === "Running" ? "success" : agent.status === "Queued" ? "warning" : agent.status === "Learning" ? "primary" : "neutral"}>{agent.status}</Badge>
      </div>
      <div className="mt-4 grid gap-3 text-sm text-foreground/60 sm:grid-cols-2">
        <div className="rounded-2xl border border-border/80 bg-card/60 p-3">
          <div className="flex items-center gap-2"><Gauge className="h-4 w-4 text-primary" /> Load</div>
          <p className="mt-2 font-mono text-lg text-foreground">{agent.load}%</p>
        </div>
        <div className="rounded-2xl border border-border/80 bg-card/60 p-3">
          <div className="flex items-center gap-2"><TimerReset className="h-4 w-4 text-warning" /> Latency</div>
          <p className="mt-2 font-mono text-lg text-foreground">{agent.latency}</p>
        </div>
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-foreground/55">
        <div className="inline-flex items-center gap-2"><Activity className="h-4 w-4 text-success" /> {agent.model}</div>
        <div className="inline-flex items-center gap-2"><MapPin className="h-4 w-4 text-primary" /> {agent.region}</div>
      </div>
    </motion.div>
  );
}
