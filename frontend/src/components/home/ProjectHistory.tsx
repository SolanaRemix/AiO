import { Clock3 } from "lucide-react";
import { projectHistory } from "@/lib/constants";
import { Card } from "@/components/ui/Card";

export function ProjectHistory() {
  return (
    <Card>
      <div className="mb-5">
        <p className="text-xs uppercase tracking-[0.22em] text-foreground/45">Project history</p>
        <h2 className="mt-2 text-xl font-semibold">Recent orchestration milestones</h2>
      </div>
      <div className="space-y-4">
        {projectHistory.map((entry) => (
          <div key={entry.title} className="relative rounded-2xl border border-border/80 bg-card/45 p-4 pl-6">
            <div className="absolute left-3 top-5 h-2 w-2 rounded-full bg-primary" />
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-foreground/45">
              <Clock3 className="h-3.5 w-3.5" />
              {entry.time}
            </div>
            <h3 className="mt-2 font-medium">{entry.title}</h3>
            <p className="mt-1 text-sm text-foreground/55">{entry.detail}</p>
          </div>
        ))}
      </div>
    </Card>
  );
}
