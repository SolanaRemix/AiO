import { templates } from "@/lib/constants";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";

export function Templates() {
  return (
    <Card>
      <div className="mb-5">
        <p className="text-xs uppercase tracking-[0.22em] text-foreground/45">Templates</p>
        <h2 className="mt-2 text-xl font-semibold">Reusable operating system blueprints</h2>
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        {templates.map((template) => (
          <div key={template.id} className="rounded-3xl border border-border/80 bg-card/45 p-4 transition hover:border-primary/35 hover:bg-card/70">
            <div className="flex items-center justify-between gap-2">
              <Badge variant="primary">{template.category}</Badge>
              <span className="text-xs uppercase tracking-[0.2em] text-foreground/45">{template.complexity}</span>
            </div>
            <h3 className="mt-4 text-lg font-semibold">{template.name}</h3>
            <p className="mt-2 text-sm text-foreground/55">{template.description}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {template.tags.map((tag) => (
                <Badge key={tag}>{tag}</Badge>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
