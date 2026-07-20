"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { agents } from "@/lib/constants";
import { AgentCard } from "@/components/agents/AgentCard";
import { Input } from "@/components/ui/Input";

export function AgentGrid() {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) {
      return agents;
    }

    return agents.filter((agent) =>
      [agent.name, agent.specialty, agent.status, agent.model, agent.region].some((field) =>
        field.toLowerCase().includes(normalized),
      ),
    );
  }, [query]);

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3 rounded-3xl border border-border/80 bg-card/45 px-4 py-3">
        <Search className="h-4 w-4 text-foreground/45" />
        <Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search all agents, models, regions, or specialties" className="border-none bg-transparent px-0 focus:ring-0" />
        <span className="hidden text-sm text-foreground/45 md:inline">{filtered.length} results</span>
      </div>
      <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-3">
        {filtered.map((agent) => (
          <AgentCard key={agent.id} agent={agent} />
        ))}
      </div>
    </div>
  );
}
