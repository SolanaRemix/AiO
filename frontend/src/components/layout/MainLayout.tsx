"use client";

import { useEffect, useState } from "react";
import { BottomStatus } from "@/components/layout/BottomStatus";
import { LeftSidebar } from "@/components/layout/LeftSidebar";
import { RightPanel } from "@/components/layout/RightPanel";
import { TopNav } from "@/components/layout/TopNav";

export function MainLayout({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [rightCollapsed, setRightCollapsed] = useState(false);

  useEffect(() => {
    const stored = window.localStorage.getItem("aio-theme");
    const nextTheme = stored === "light" ? "light" : "dark";
    setTheme(nextTheme);
    document.documentElement.dataset.theme = nextTheme;
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    window.localStorage.setItem("aio-theme", theme);
  }, [theme]);

  return (
    <div className="min-h-screen bg-grid">
      <TopNav
        theme={theme}
        onThemeToggle={() => setTheme((current) => (current === "dark" ? "light" : "dark"))}
        onSidebarToggle={() => setSidebarCollapsed((current) => !current)}
        onRightPanelToggle={() => setRightCollapsed((current) => !current)}
      />

      <div className="mx-auto flex max-w-[1800px] gap-4 px-4 pb-28 lg:px-6">
        <LeftSidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed((current) => !current)} />
        <main className="min-w-0 flex-1 pt-2">
          <div className="space-y-6">{children}</div>
        </main>
        <RightPanel collapsed={rightCollapsed} onToggle={() => setRightCollapsed((current) => !current)} />
      </div>

      <BottomStatus />
    </div>
  );
}
