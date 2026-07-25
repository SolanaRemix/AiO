import { MainLayout } from "@/components/layout/MainLayout";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";

export default function GitPage() {
  return (
    <MainLayout>
      <Card>
        <Badge variant="primary">Git Workspace</Badge>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight">Integrated version control workspace</h1>
        <p className="mt-3 text-sm text-foreground/60 sm:text-base">
          Manage repositories, branches, changes, commits, and pull flows from GitHub, GitLab, and Bitbucket in one surface.
        </p>
      </Card>
      <div className="grid gap-4 xl:grid-cols-2">
        <Card>
          <p className="text-xs uppercase tracking-[0.2em] text-foreground/45">Repository</p>
          <p className="mt-2 text-lg font-semibold">aio-enterprise</p>
          <p className="mt-1 text-sm text-foreground/55">main · 6 branches · connected</p>
        </Card>
        <Card>
          <p className="text-xs uppercase tracking-[0.2em] text-foreground/45">Latest milestone commit</p>
          <p className="mt-2 text-lg font-semibold">feat: Completed authentication module</p>
          <p className="mt-1 text-sm text-foreground/55">Agent: Backend Agent · Validation: Passed</p>
        </Card>
      </div>
    </MainLayout>
  );
}
