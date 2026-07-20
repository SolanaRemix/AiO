import { MainLayout } from "@/components/layout/MainLayout";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { knowledgeCollections } from "@/lib/constants";

export default function KnowledgePage() {
  return (
    <MainLayout>
      <Card>
        <Badge variant="primary">Knowledge</Badge>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight">Knowledge graph and retrieval fabric</h1>
        <p className="mt-3 max-w-3xl text-sm text-foreground/60 sm:text-base">
          Keep documentation, tickets, research, controls, and customer signals fresh, linked, and enterprise searchable.
        </p>
      </Card>
      <div className="grid gap-4 xl:grid-cols-2">
        {knowledgeCollections.map((collection) => (
          <Card key={collection.title}>
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-xl font-semibold">{collection.title}</h2>
              <Badge variant="success">Coverage {collection.coverage}</Badge>
            </div>
            <p className="mt-3 text-sm text-foreground/60">{collection.detail}</p>
            <div className="mt-5 rounded-2xl border border-border/80 bg-card/50 px-4 py-3 text-sm text-foreground/55">
              Freshness · {collection.freshness}
            </div>
          </Card>
        ))}
      </div>
    </MainLayout>
  );
}
