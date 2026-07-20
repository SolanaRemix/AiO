import { Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { AgentsService } from '../agents/agents.service';
import { KnowledgeEngineService } from '../knowledge-engine/knowledge-engine.service';
import { ModelRouterService } from '../model-router/model-router.service';

export interface OrchestrationResult {
  taskId: string;
  status: string;
  plan: string[];
  agents: string[];
}

@Injectable()
export class OrchestratorService {
  constructor(
    private readonly agentsService: AgentsService,
    private readonly knowledgeEngineService: KnowledgeEngineService,
    private readonly modelRouterService: ModelRouterService,
  ) {}

  async processPrompt(
    prompt: string,
    projectId?: string,
  ): Promise<OrchestrationResult> {
    const normalizedPrompt = prompt.trim();
    const knowledge = await this.knowledgeEngineService.search(
      normalizedPrompt,
      projectId,
    );
    const routeDecision = await this.modelRouterService.route({
      messages: [{ role: 'user', content: normalizedPrompt }],
      maxTokens: 512,
    });

    const plan = [
      'Detect user intent and classify the request.',
      `Retrieve relevant context${projectId ? ` for project ${projectId}` : ''}.`,
      `Route execution to ${routeDecision.provider}.`,
      'Schedule specialist agents and track execution state.',
      knowledge.length > 0
        ? `Incorporate ${knowledge.length} knowledge hit(s) into the plan.`
        : 'Proceed with default execution heuristics.',
    ];

    const agents = this.agentsService
      .recommendAgents(normalizedPrompt)
      .slice(0, 4)
      .map((agent) => agent.id);

    return {
      taskId: randomUUID(),
      status: 'queued',
      plan,
      agents,
    };
  }
}
