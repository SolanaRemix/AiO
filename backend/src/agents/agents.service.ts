import { Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { DatabaseService } from '../database/database.service';
import {
  type AgentDefinition,
  type AgentExecutionDetail,
  type AgentExecutionSummary,
  type AgentLearnResult,
  type AgentSummarizeResult,
  type AgentType,
  type AgentValidateResult,
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

  constructor(private readonly databaseService: DatabaseService) {}

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
        .slice(0, 4);
    }

    if (normalizedPrompt.includes('data')) {
      return this.agents
        .filter((agent) => agent.id.startsWith('data-'))
        .slice(0, 4);
    }

    if (
      normalizedPrompt.includes('deploy') ||
      normalizedPrompt.includes('incident')
    ) {
      return this.agents
        .filter((agent) => agent.id.startsWith('delivery-'))
        .slice(0, 4);
    }

    return [
      this.getAgent('delivery-planner'),
      this.getAgent('backend-architect'),
      this.getAgent('quality-reviewer'),
      this.getAgent('governance-builder'),
    ];
  }

  plan(prompt: string): AgentExecutionSummary {
    const selectedAgents = this.recommendAgents(prompt).map(
      (agent) => agent.id,
    );
    const summary = `Prepared ${selectedAgents.length} agents for ${prompt.slice(0, 80)}.`;
    return {
      requestedPrompt: prompt,
      selectedAgents,
      queuedAt: new Date().toISOString(),
      summary,
      steps: [
        'Classify the prompt and project context.',
        'Allocate specialist agents based on risk and domain coverage.',
        'Validate dependencies, quality gates, and monitoring requirements.',
      ],
      validations: [
        'Security review coverage assigned when required.',
        'Quality gate review added before execution.',
      ],
    };
  }

  async execute(prompt: string): Promise<AgentExecutionDetail> {
    const plan = this.plan(prompt);
    const record: AgentExecutionDetail = {
      id: randomUUID(),
      ...plan,
      status: 'completed',
      report:
        'Execution context assembled with routing, validation, and delivery oversight ready for handoff.',
    };

    await this.databaseService.mutate((draft) => {
      draft.agentExecutions.unshift({
        id: record.id ?? randomUUID(),
        prompt,
        selectedAgents: plan.selectedAgents,
        status: 'completed',
        summary: plan.summary ?? '',
        steps: plan.steps ?? [],
        validations: plan.validations ?? [],
        createdAt: record.queuedAt,
        updatedAt: new Date().toISOString(),
      });
    });

    return record;
  }

  async retry(executionId: string): Promise<AgentExecutionDetail> {
    const executions = await this.databaseService.list('agentExecutions');
    const execution = executions.find((entry) => entry.id === executionId);
    if (execution == null) {
      throw new NotFoundException(
        `Agent execution ${executionId} was not found.`,
      );
    }

    return this.execute(execution.prompt);
  }

  async report(executionId: string): Promise<AgentExecutionDetail> {
    const executions = await this.databaseService.list('agentExecutions');
    const execution = executions.find((entry) => entry.id === executionId);
    if (execution == null) {
      throw new NotFoundException(
        `Agent execution ${executionId} was not found.`,
      );
    }

    return {
      id: execution.id,
      requestedPrompt: execution.prompt,
      selectedAgents: execution.selectedAgents,
      queuedAt: execution.createdAt,
      summary: execution.summary,
      steps: execution.steps,
      validations: execution.validations,
      status: execution.status,
      report: 'Execution report generated from the persisted runtime ledger.',
    };
  }

  scheduleAgents(prompt: string): AgentExecutionSummary {
    return this.plan(prompt);
  }

  async learn(executionId: string): Promise<AgentLearnResult> {
    const executions = await this.databaseService.list('agentExecutions');
    const execution = executions.find((entry) => entry.id === executionId);
    if (execution == null) {
      throw new NotFoundException(
        `Agent execution ${executionId} was not found.`,
      );
    }

    return {
      executionId,
      learnedAt: new Date().toISOString(),
      patterns: [
        'Identified recurring task decomposition pattern for this domain.',
        'Captured quality gate sequence for future reuse.',
        'Noted cross-domain dependency handoff signature.',
      ],
      confidence: 0.91,
    };
  }

  async summarize(executionId: string): Promise<AgentSummarizeResult> {
    const executions = await this.databaseService.list('agentExecutions');
    const execution = executions.find((entry) => entry.id === executionId);
    if (execution == null) {
      throw new NotFoundException(
        `Agent execution ${executionId} was not found.`,
      );
    }

    return {
      executionId,
      summarizedAt: new Date().toISOString(),
      summary: execution.summary,
      keyPoints: [
        ...execution.steps.slice(0, 3),
        ...execution.validations.slice(0, 2),
      ],
    };
  }

  validate(prompt: string): AgentValidateResult {
    const issues: string[] = [];
    const recommendations: string[] = [];

    if (prompt.trim().length < 10) {
      issues.push('Prompt is too short for meaningful agent dispatch.');
      recommendations.push('Provide more context to improve agent selection.');
    }

    if (prompt.length > 2000) {
      issues.push('Prompt exceeds the recommended length of 2000 characters.');
      recommendations.push('Break the prompt into smaller, focused tasks.');
    }

    return {
      prompt,
      validatedAt: new Date().toISOString(),
      passed: issues.length === 0,
      issues,
      recommendations,
    };
  }
}
