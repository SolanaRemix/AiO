import { Lightbulb, Sparkles, Target, Workflow } from "lucide-react";
import { examplePrompts } from "@/lib/constants";
import { Card } from "@/components/ui/Card";

const icons = [Sparkles, Workflow, Target, Lightbulb];

export function ExamplesSection() {
  return (
    <Card>
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-foreground/45">Example prompts</p>
          <h2 className="mt-2 text-xl font-semibold">High-signal launch patterns</h2>
        </div>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        {examplePrompts.slice(0, 4).map((prompt, index) => {
          const Icon = icons[index % icons.length];
          return (
            <div key={prompt} className="rounded-2xl border border-border/80 bg-card/45 p-4 transition hover:border-primary/35 hover:bg-card/70">
              <div className="mb-3 inline-flex rounded-xl bg-primary/10 p-2 text-primary">
                <Icon className="h-4 w-4" />
              </div>
              <p className="text-sm text-foreground/75">{prompt}</p>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
