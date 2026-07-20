import { timelineEntries } from "@/lib/constants";
import { Badge } from "@/components/ui/Badge";

export function Timeline() {
  return (
    <div className="space-y-3">
      {timelineEntries.map((entry) => (
        <div key={entry.title} className="rounded-3xl border border-border/80 bg-card/45 p-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="font-medium">{entry.title}</p>
            <Badge variant={entry.tone === "success" ? "success" : entry.tone === "warning" ? "warning" : entry.tone === "danger" ? "danger" : "primary"}>{entry.time}</Badge>
          </div>
          <p className="mt-2 text-sm text-foreground/55">{entry.detail}</p>
        </div>
      ))}
    </div>
  );
}
