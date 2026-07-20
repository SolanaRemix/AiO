import { workspaceTasks } from "@/lib/constants";
import { Badge } from "@/components/ui/Badge";

export function TaskList() {
  return (
    <div className="space-y-3">
      {workspaceTasks.map((task) => (
        <div key={task.title} className="rounded-3xl border border-border/80 bg-card/45 p-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="font-medium">{task.title}</p>
              <p className="mt-1 text-sm text-foreground/55">Owner: {task.owner}</p>
            </div>
            <Badge variant={task.progress > 80 ? "success" : task.progress > 60 ? "primary" : "warning"}>{task.state}</Badge>
          </div>
          <div className="mt-4 h-2 rounded-full bg-foreground/10">
            <div className="h-2 rounded-full bg-primary" style={{ width: `${task.progress}%` }} />
          </div>
        </div>
      ))}
    </div>
  );
}
