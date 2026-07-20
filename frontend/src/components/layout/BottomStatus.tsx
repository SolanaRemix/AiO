import { Activity, ShieldCheck, Wallet } from "lucide-react";
import { qualityGates } from "@/lib/constants";
import { Badge } from "@/components/ui/Badge";

export function BottomStatus() {
  return (
    <div className="pointer-events-none fixed bottom-4 left-0 right-0 z-40 px-4 lg:px-6">
      <div className="glass-panel floating-panel pointer-events-auto mx-auto flex max-w-[1800px] flex-wrap items-center gap-3 px-4 py-3 text-sm">
        <div className="flex items-center gap-2 rounded-2xl bg-success/12 px-3 py-2 text-success">
          <Activity className="h-4 w-4" />
          <span>12 agents running</span>
        </div>
        <div className="rounded-2xl bg-card/70 px-3 py-2 text-foreground/75">Current task: shipping AiO Enterprise surface</div>
        <div className="rounded-2xl bg-card/70 px-3 py-2 font-mono text-foreground/75">Tokens 1.8M · $42.18</div>
        <div className="flex flex-wrap gap-2">
          {qualityGates.map((gate) => (
            <Badge key={gate.label} variant={gate.status === "Pass" ? "success" : gate.status === "Monitor" ? "warning" : "primary"}>
              {gate.label} {gate.status}
            </Badge>
          ))}
        </div>
        <div className="ml-auto hidden items-center gap-2 text-foreground/55 xl:flex">
          <ShieldCheck className="h-4 w-4 text-success" />
          <Wallet className="h-4 w-4 text-warning" />
          <span>Policy, cost, and quality gates attached</span>
        </div>
      </div>
    </div>
  );
}
