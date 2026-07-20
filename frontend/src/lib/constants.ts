export type NavItem = {
  label: string;
  href: string;
  description: string;
};

export type ProjectItem = {
  id: string;
  name: string;
  summary: string;
  lastActivity: string;
  status: "Active" | "Review" | "Ready";
  agents: number;
  progress: number;
  stack: string[];
};

export type TemplateItem = {
  id: string;
  name: string;
  description: string;
  category: string;
  complexity: string;
  tags: string[];
};

export type AgentRecord = {
  id: string;
  name: string;
  specialty: string;
  status: "Running" | "Idle" | "Queued" | "Learning";
  load: number;
  latency: string;
  model: string;
  region: string;
};

export type FileNode = {
  name: string;
  type: "folder" | "file";
  children?: FileNode[];
};

export const navigationItems: NavItem[] = [
  { label: "Home", href: "/", description: "Overview and launchpad" },
  { label: "Workspace", href: "/workspace", description: "Collaborative build surface" },
  { label: "Projects", href: "/projects", description: "Program portfolio and delivery" },
  { label: "Knowledge", href: "/knowledge", description: "Indexed docs and research" },
  { label: "Memory", href: "/memory", description: "Long-term execution memory" },
  { label: "Agents", href: "/agents", description: "Distributed agent operations" },
];

export const examplePrompts = [
  "Build a regulated fintech onboarding flow with audit trails and SOC2-ready controls.",
  "Refactor the customer portal for multi-tenant AI copilots with granular policy routing.",
  "Design a launch plan for a knowledge graph that synchronizes docs, tickets, and memory.",
  "Create a roadmap for shipping an enterprise workspace with approvals, analytics, and AI agents.",
  "Generate an incident response cockpit with agent handoffs, runbooks, and deployment evidence.",
  "Prototype an adaptive support console that drafts replies from product knowledge and memory.",
];

export const modelOptions = [
  "AIO Ultra Reasoning",
  "AIO Visionary",
  "AIO Sprint",
  "AIO Retrieval+",
];

export const homeStats = [
  { label: "Projects in flight", value: "24", delta: "+6 this week" },
  { label: "Agents online", value: "108", delta: "99.97% uptime" },
  { label: "Knowledge synced", value: "4.2 TB", delta: "12 sources refreshed" },
  { label: "Memory recall", value: "96.4%", delta: "2.1M traces indexed" },
];

export const recentProjects: ProjectItem[] = [
  {
    id: "apollo-grid",
    name: "Apollo Grid",
    summary: "Enterprise workflow mesh for regulated operations teams.",
    lastActivity: "2 minutes ago",
    status: "Active",
    agents: 12,
    progress: 82,
    stack: ["Next.js", "GraphQL", "OPA"],
  },
  {
    id: "vector-hub",
    name: "Vector Hub",
    summary: "Unified knowledge ingestion for product, support, and legal corpora.",
    lastActivity: "14 minutes ago",
    status: "Review",
    agents: 7,
    progress: 64,
    stack: ["Python", "pgvector", "Airflow"],
  },
  {
    id: "relay-os",
    name: "Relay OS",
    summary: "Cross-functional command center for launch readiness and task orchestration.",
    lastActivity: "41 minutes ago",
    status: "Ready",
    agents: 5,
    progress: 91,
    stack: ["TypeScript", "Supabase", "Redis"],
  },
  {
    id: "helios-care",
    name: "Helios Care",
    summary: "Patient operations workspace with HIPAA-safe automations and memory.",
    lastActivity: "1 hour ago",
    status: "Active",
    agents: 18,
    progress: 53,
    stack: ["React", "FHIR", "Kafka"],
  },
];

export const templates: TemplateItem[] = [
  {
    id: "enterprise-saas",
    name: "Enterprise SaaS Command Center",
    description: "Composable control plane with approvals, billing intelligence, and customer ops views.",
    category: "Operations",
    complexity: "Advanced",
    tags: ["RBAC", "Audit", "Dashboards"],
  },
  {
    id: "ai-support",
    name: "AI Support Hub",
    description: "Multi-agent support workspace with knowledge retrieval, SLA routing, and escalation automation.",
    category: "Support",
    complexity: "Intermediate",
    tags: ["RAG", "Agent Handoffs", "CSAT"],
  },
  {
    id: "launch-room",
    name: "Launch Readiness Room",
    description: "Program room for release checklists, artifact capture, and go/no-go confidence scoring.",
    category: "Delivery",
    complexity: "Intermediate",
    tags: ["Releases", "Approvals", "Evidence"],
  },
  {
    id: "memory-fabric",
    name: "Memory Fabric",
    description: "Persistent memory graph for teams, decisions, incidents, and reusable execution context.",
    category: "Knowledge",
    complexity: "Advanced",
    tags: ["Embeddings", "Context", "Recall"],
  },
];

export const projectHistory = [
  { title: "Apollo Grid reached policy sign-off", detail: "Compliance squad approved 14 workflow automations.", time: "Today · 09:24" },
  { title: "Vector Hub re-indexed legal corpus", detail: "7,200 documents refreshed with chain-of-custody metadata.", time: "Today · 08:11" },
  { title: "Relay OS deployment evidence attached", detail: "Build, QA, and change management artifacts linked to release 4.6.", time: "Yesterday · 17:48" },
  { title: "Helios Care memory snapshots promoted", detail: "Three clinically reviewed memory packs moved to production.", time: "Yesterday · 15:02" },
];

export const quickActions = [
  { title: "Create AI workspace", detail: "Spin up panels, memory, knowledge, and agents in one action." },
  { title: "Import repositories", detail: "Attach GitHub, docs, tickets, and incidents to a new command center." },
  { title: "Launch agent swarm", detail: "Dispatch specialized agents across product, infra, and compliance streams." },
  { title: "Open review gate", detail: "Bundle quality, security, and cost signals before release." },
];

export const workspaceTabs = [
  "Chat",
  "Files",
  "Tasks",
  "Timeline",
  "Artifacts",
  "Memory",
  "Knowledge",
  "Agents",
  "Logs",
  "Terminal",
  "Deployments",
];

export const workspaceMessages = [
  { id: 1, role: "assistant", author: "Planner Agent", body: "I mapped the delivery milestones, attached quality gates, and opened a cross-functional task board.", time: "09:18" },
  { id: 2, role: "user", author: "You", body: "Great. Also connect launch blockers to the release timeline and surface missing evidence.", time: "09:19" },
  { id: 3, role: "assistant", author: "Ops Agent", body: "Done. Two blockers remain: final legal sign-off and dependency drift in the support portal build.", time: "09:20" },
  { id: 4, role: "assistant", author: "Memory Agent", body: "I found similar launch patterns from Apollo Grid and suggested remediation owners with confidence scores.", time: "09:22" },
];

export const workspaceFiles: FileNode[] = [
  {
    name: "src",
    type: "folder",
    children: [
      {
        name: "app",
        type: "folder",
        children: [
          { name: "page.tsx", type: "file" },
          { name: "workspace/page.tsx", type: "file" },
          { name: "globals.css", type: "file" },
        ],
      },
      {
        name: "components",
        type: "folder",
        children: [
          { name: "layout", type: "folder", children: [{ name: "TopNav.tsx", type: "file" }, { name: "RightPanel.tsx", type: "file" }] },
          { name: "workspace", type: "folder", children: [{ name: "WorkspaceChat.tsx", type: "file" }, { name: "TaskList.tsx", type: "file" }] },
        ],
      },
    ],
  },
  { name: "package.json", type: "file" },
  { name: "tailwind.config.ts", type: "file" },
];

export const workspaceTasks = [
  { title: "Close release policy gaps", owner: "Compliance Agent", progress: 72, state: "In review" },
  { title: "Prepare executive launch brief", owner: "Strategy Agent", progress: 48, state: "Drafting" },
  { title: "Resolve dependency drift", owner: "Platform Agent", progress: 90, state: "Ready for merge" },
  { title: "Refresh sales enablement memory", owner: "Memory Agent", progress: 63, state: "Syncing" },
];

export const timelineEntries = [
  { title: "Deployment pipeline passed", detail: "QA, accessibility, and security checks green across staging.", time: "08:57", tone: "success" },
  { title: "Memory diff detected", detail: "Support playbook v12 superseded legacy escalation guidance.", time: "08:42", tone: "warning" },
  { title: "Agent swarm dispatched", detail: "6 specialists now working across docs, tickets, and repo context.", time: "08:31", tone: "primary" },
  { title: "Cost threshold tripped", detail: "Two long-context agents exceeded the hourly soft cap by 6%.", time: "08:15", tone: "danger" },
];

export const artifacts = [
  { name: "Launch checklist", type: "Checklist", updated: "4 min ago", size: "18 items" },
  { name: "Security evidence bundle", type: "Bundle", updated: "19 min ago", size: "11 files" },
  { name: "Exec narrative deck", type: "Deck", updated: "27 min ago", size: "28 slides" },
  { name: "Regression log", type: "Trace", updated: "1 hr ago", size: "142 events" },
];

export const knowledgeCollections = [
  { title: "Product source graph", detail: "PRDs, RFCs, release notes, and customer interviews linked by semantic intent.", freshness: "Updated 6 min ago", coverage: "92%" },
  { title: "Security controls library", detail: "Mapped control objectives, implementation notes, and evidence owners.", freshness: "Updated 18 min ago", coverage: "88%" },
  { title: "Support resolution memory", detail: "Top escalations, agent macros, and confidence-ranked response trees.", freshness: "Updated 42 min ago", coverage: "95%" },
  { title: "Go-to-market playbooks", detail: "Messaging, assets, and regional launch variations for field teams.", freshness: "Updated 1 hr ago", coverage: "81%" },
];

export const memoryClusters = [
  { title: "Incident memory", detail: "Retains root causes, mitigations, and blast radius lessons for rapid response.", score: "97.1%", entries: 421 },
  { title: "Decision ledger", detail: "Captures product, compliance, and architectural decisions with rationale and owners.", score: "94.8%", entries: 196 },
  { title: "Customer signal memory", detail: "Aggregates feedback loops, churn risks, and outcome-linked requests.", score: "92.5%", entries: 583 },
  { title: "Execution reflexes", detail: "Reusable system prompts, task recipes, and quality gates for repeatable delivery.", score: "96.2%", entries: 312 },
];

export const agentActivities = [
  { title: "Planner Agent", detail: "Sequencing launch workstreams", status: "Running" },
  { title: "Knowledge Agent", detail: "Refreshing incident postmortems", status: "Learning" },
  { title: "Security Agent", detail: "Awaiting threat model delta", status: "Queued" },
  { title: "Memory Agent", detail: "Merging support resolution traces", status: "Idle" },
];

export const contextSummaries: Record<string, { title: string; summary: string; tags: string[] }> = {
  "/": {
    title: "Home context",
    summary: "Create, inspect, and orchestrate enterprise workspaces from a single operating layer.",
    tags: ["Prompting", "Templates", "Signals"],
  },
  "/workspace": {
    title: "Workspace context",
    summary: "Live execution room with files, tasks, memory, and deployment evidence in sync.",
    tags: ["Execution", "Handoffs", "Artifacts"],
  },
  "/projects": {
    title: "Projects context",
    summary: "Portfolio health, delivery risk, and readiness signals across every initiative.",
    tags: ["Portfolio", "Milestones", "Health"],
  },
  "/knowledge": {
    title: "Knowledge context",
    summary: "High-fidelity retrieval across docs, tickets, controls, and research artifacts.",
    tags: ["RAG", "Sources", "Freshness"],
  },
  "/memory": {
    title: "Memory context",
    summary: "Persistent recall for decisions, incidents, customer signals, and reusable workflows.",
    tags: ["Recall", "Persistence", "Confidence"],
  },
  "/agents": {
    title: "Agents context",
    summary: "Distributed specialists with live load, queues, latency, and outcome tracking.",
    tags: ["Swarms", "Observability", "Capacity"],
  },
};

export const qualityGates = [
  { label: "Quality", status: "Pass" },
  { label: "Security", status: "Pass" },
  { label: "Cost", status: "Monitor" },
  { label: "Latency", status: "Stable" },
];

const specialties = [
  "Planner", "Architect", "Frontend", "Backend", "Research", "Security", "Memory", "Knowledge", "Compliance", "QA", "Release", "Platform",
];
const domains = [
  "Atlas", "Nova", "Vector", "Relay", "Orion", "Apex", "Helios", "Cortex", "Prism",
];
const models = ["AIO Ultra", "AIO Visionary", "AIO Sprint", "AIO Retrieval+"];
const regions = ["us-east-1", "us-west-2", "eu-west-1", "ap-southeast-1"];
const statuses: AgentRecord["status"][] = ["Running", "Idle", "Queued", "Learning"];

export const agents: AgentRecord[] = Array.from({ length: 108 }, (_, index) => ({
  id: `agent-${index + 1}`,
  name: `${domains[index % domains.length]} ${specialties[Math.floor(index / domains.length) % specialties.length]} ${String(index + 1).padStart(2, "0")}`,
  specialty: `${specialties[index % specialties.length]} orchestration`,
  status: statuses[index % statuses.length],
  load: 38 + ((index * 7) % 59),
  latency: `${95 + ((index * 13) % 180)} ms`,
  model: models[index % models.length],
  region: regions[index % regions.length],
}));
