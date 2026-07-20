import { Injectable, NotFoundException } from '@nestjs/common';
import {
  type AgentDefinition,
  type AgentExecutionSummary,
  type AgentType,
} from './interfaces/agent.interface';

const DOMAINS = [
  {
    slug: 'product',
    label: 'Product',
    capabilities: ['roadmap modeling', 'requirements triage'],
    type: 'planning',
  },
  {
    slug: 'delivery',
    label: 'Delivery',
    capabilities: ['execution tracking', 'dependency management'],
    type: 'orchestration',
  },
  {
    slug: 'platform',
    label: 'Platform',
    capabilities: ['service topology', 'runtime optimization'],
    type: 'engineering',
  },
  {
    slug: 'frontend',
    label: 'Frontend',
    capabilities: ['ui delivery', 'design system alignment'],
    type: 'engineering',
  },
  {
    slug: 'backend',
    label: 'Backend',
    capabilities: ['api composition', 'service contracts'],
    type: 'engineering',
  },
  {
    slug: 'data',
    label: 'Data',
    capabilities: ['data modeling', 'pipeline quality'],
    type: 'data',
  },
  {
    slug: 'security',
    label: 'Security',
    capabilities: ['threat modeling', 'policy enforcement'],
    type: 'security',
  },
  {
    slug: 'quality',
    label: 'Quality',
    capabilities: ['test strategy', 'release validation'],
    type: 'analysis',
  },
  {
    slug: 'support',
    label: 'Support',
    capabilities: ['incident response', 'customer triage'],
    type: 'operations',
  },
  {
    slug: 'governance',
    label: 'Governance',
    capabilities: ['auditability', 'compliance workflows'],
    type: 'governance',
  },
] as const satisfies ReadonlyArray<{
  slug: string;
  label: string;
  capabilities: readonly string[];
  type: AgentType;
}>;

const ROLES = [
  {
    slug: 'architect',
    label: 'Architect',
    capabilities: ['system design', 'tradeoff analysis'],
    maxConcurrency: 6,
  },
  {
    slug: 'planner',
    label: 'Planner',
    capabilities: ['task decomposition', 'delivery forecasting'],
    maxConcurrency: 10,
  },
  {
    slug: 'builder',
    label: 'Builder',
    capabilities: ['implementation guidance', 'change execution'],
    maxConcurrency: 12,
  },
  {
    slug: 'reviewer',
    label: 'Reviewer',
    capabilities: ['quality assessment', 'risk detection'],
    maxConcurrency: 8,
  },
  {
    slug: 'analyst',
    label: 'Analyst',
    capabilities: ['signal interpretation', 'decision support'],
    maxConcurrency: 10,
  },
  {
    slug: 'operator',
    label: 'Operator',
    capabilities: ['workflow execution', 'incident handling'],
    maxConcurrency: 14,
  },
  {
    slug: 'optimizer',
    label: 'Optimizer',
    capabilities: ['performance tuning', 'cost controls'],
    maxConcurrency: 8,
  },
  {
    slug: 'guardian',
    label: 'Guardian',
    capabilities: ['policy review', 'safety checks'],
    maxConcurrency: 6,
  },
  {
    slug: 'researcher',
    label: 'Researcher',
    capabilities: ['knowledge retrieval', 'comparative analysis'],
    maxConcurrency: 9,
  },
  {
    slug: 'coordinator',
    label: 'Coordinator',
    capabilities: ['handoff management', 'status reporting'],
    maxConcurrency: 16,
  },
] as const;

const AGENT_DEFINITIONS: AgentDefinition[] = DOMAINS.flatMap((domain) =>
  ROLES.map((role) => ({
    id: `${domain.slug}-${role.slug}`,
    name: `${domain.label} ${role.label}`,
    type: domain.type,
    capabilities: [...domain.capabilities, ...role.capabilities],
    maxConcurrency: role.maxConcurrency,
  })),
);

@Injectable()
export class AgentsService {
  private readonly agents = AGENT_DEFINITIONS;

  listAgents(): AgentDefinition[] {
    return this.agents;
  }

  getAgent(id: string): AgentDefinition {
    const agent = this.agents.find((candidate) => candidate.id === id);
    if (agent == null) {
      throw new NotFoundException(`Agent ${id} was not found.`);
    }
    return agent;
  }

  recommendAgents(prompt: string): AgentDefinition[] {
    const normalizedPrompt = prompt.toLowerCase();

    if (normalizedPrompt.includes('security')) {
      return this.agents
        .filter((agent) => agent.id.startsWith('security-'))
        .slice(0, 5);
    }

    if (normalizedPrompt.includes('data')) {
      return this.agents
        .filter((agent) => agent.id.startsWith('data-'))
        .slice(0, 5);
    }

    if (
      normalizedPrompt.includes('deploy') ||
      normalizedPrompt.includes('incident')
    ) {
      return this.agents
        .filter((agent) => agent.id.startsWith('delivery-'))
        .slice(0, 5);
    }

    return [
      this.getAgent('delivery-coordinator'),
      this.getAgent('backend-architect'),
      this.getAgent('quality-reviewer'),
      this.getAgent('support-operator'),
    ];
  }

  scheduleAgents(prompt: string): AgentExecutionSummary {
    return {
      requestedPrompt: prompt,
      selectedAgents: this.recommendAgents(prompt).map((agent) => agent.id),
      queuedAt: new Date().toISOString(),
    };
  }
}
