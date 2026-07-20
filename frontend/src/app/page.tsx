import { AiPrompt } from "@/components/home/AiPrompt";
import { AiStatus } from "@/components/home/AiStatus";
import { ExamplesSection } from "@/components/home/ExamplesSection";
import { ProjectHistory } from "@/components/home/ProjectHistory";
import { QuickActions } from "@/components/home/QuickActions";
import { RecentProjects } from "@/components/home/RecentProjects";
import { Templates } from "@/components/home/Templates";
import { MainLayout } from "@/components/layout/MainLayout";

export default function Home() {
  return (
    <MainLayout>
      <AiPrompt />
      <div className="grid gap-6 xl:grid-cols-[1.25fr_0.85fr]">
        <ExamplesSection />
        <AiStatus />
      </div>
      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <RecentProjects />
        <QuickActions />
      </div>
      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <Templates />
        <ProjectHistory />
      </div>
    </MainLayout>
  );
}
