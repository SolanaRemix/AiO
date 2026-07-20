import { Download, FileStack } from "lucide-react";
import { artifacts } from "@/lib/constants";
import { Badge } from "@/components/ui/Badge";

export function Artifacts() {
  return (
    <div className="grid gap-3 md:grid-cols-2">
      {artifacts.map((artifact) => (
        <div key={artifact.name} className="rounded-3xl border border-border/80 bg-card/45 p-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-primary/10 p-2 text-primary">
                <FileStack className="h-4 w-4" />
              </div>
              <div>
                <p className="font-medium">{artifact.name}</p>
                <p className="text-sm text-foreground/55">{artifact.updated}</p>
              </div>
            </div>
            <Download className="h-4 w-4 text-foreground/45" />
          </div>
          <div className="mt-4 flex items-center justify-between">
            <Badge variant="primary">{artifact.type}</Badge>
            <span className="text-sm text-foreground/55">{artifact.size}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
