import { Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { AgentsService } from '../agents/agents.service';
import { DatabaseService } from '../database/database.service';
import {
  type StoredWorkflowDefinition,
  type StoredWorkflowExecution,
  type StoredWorkflowStep,
} from '../database/database.types';
import { KnowledgeEngineService } from '../knowledge-engine/knowledge-engine.service';
import { MonitoringService } from '../monitoring/monitoring.service';
import { RunWorkflowDto } from './dto/run-workflow.dto';

interface StepExecutionResult {
  stepId: string;
  name: string;
  status: 'completed' | 'skipped' | 'waiting_approval' | 'failed';
  attempts: number;
  startedAt: string;
  finishedAt?: string;
  output?: Record<string, unknown>;
  error?: string;
}

@Injectable()
export class WorkflowsService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly agentsService: AgentsService,
    private readonly knowledgeEngineService: KnowledgeEngineService,
    private readonly monitoringService: MonitoringService,
  ) {}

  async run(
    dto: RunWorkflowDto,
    actor = 'system',
  ): Promise<StoredWorkflowExecution> {
    const definition = await this.persistDefinition(dto);
    const steps: StepExecutionResult[] = [];
    const executionInput = dto.input ?? {};
    let status: StoredWorkflowExecution['status'] = 'running';

    for (const step of definition.steps) {
      const result = await this.executeStep(step, executionInput);
      steps.push(result);

      if (result.status === 'waiting_approval') {
        status = 'waiting_approval';
        break;
      }

      if (result.status === 'failed') {
        status = 'failed';
        break;
      }
    }

    if (status === 'running') {
      status = 'completed';
    }

    const execution: StoredWorkflowExecution = {
      id: randomUUID(),
      workflowId: definition.id,
      name: definition.name,
      status,
      input: executionInput,
      output: {
        completedSteps: steps.filter((step) => step.status === 'completed')
          .length,
        waitingApproval: steps.some(
          (step) => step.status === 'waiting_approval',
        ),
      },
      steps,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await this.databaseService.mutate((draft) => {
      draft.workflowExecutions.unshift(execution);
    });
    await this.monitoringService.recordAuditEvent({
      action: 'workflow.run',
      actor,
      resource: definition.name,
      status: status === 'failed' ? 'failure' : 'success',
      detail: `Workflow finished with status ${status}.`,
    });

    return execution;
  }

  async listExecutions(): Promise<StoredWorkflowExecution[]> {
    return this.databaseService.list('workflowExecutions');
  }

  private async persistDefinition(
    dto: RunWorkflowDto,
  ): Promise<StoredWorkflowDefinition> {
    const timestamp = new Date().toISOString();
    const definition: StoredWorkflowDefinition = {
      id: randomUUID(),
      name: dto.name,
      steps: dto.steps,
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    await this.databaseService.mutate((draft) => {
      draft.workflows.unshift(definition);
    });

    return definition;
  }

  private async executeStep(
    step: StoredWorkflowStep,
    input: Record<string, unknown>,
  ): Promise<StepExecutionResult> {
    const startedAt = new Date().toISOString();

    try {
      if (step.type === 'condition') {
        const passed = this.evaluateCondition(step.condition, input);
        return {
          stepId: step.id,
          name: step.name,
          status: passed ? 'completed' : 'skipped',
          attempts: 1,
          startedAt,
          finishedAt: new Date().toISOString(),
          output: { passed },
        };
      }

      if (step.type === 'approval') {
        const approved = input.approved === true;
        return {
          stepId: step.id,
          name: step.name,
          status: approved ? 'completed' : 'waiting_approval',
          attempts: 1,
          startedAt,
          finishedAt: approved ? new Date().toISOString() : undefined,
          output: { approved },
        };
      }

      if (step.type === 'event') {
        return {
          stepId: step.id,
          name: step.name,
          status: 'completed',
          attempts: 1,
          startedAt,
          finishedAt: new Date().toISOString(),
          output: { event: step.action ?? 'manual-trigger' },
        };
      }

      if (step.type === 'parallel') {
        const branchResults = (step.branches ?? []).map((branch) => ({
          id: branch.id,
          name: branch.name,
          summary: this.agentsService.plan(
            branch.prompt ?? branch.action ?? branch.name,
          ).summary,
        }));

        return {
          stepId: step.id,
          name: step.name,
          status: 'completed',
          attempts: 1,
          startedAt,
          finishedAt: new Date().toISOString(),
          output: { branches: branchResults },
        };
      }

      const prompt = step.prompt ?? step.action ?? step.name;
      const knowledge = await this.knowledgeEngineService.search(prompt);
      const plan = this.agentsService.plan(prompt);
      return {
        stepId: step.id,
        name: step.name,
        status: 'completed',
        attempts: 1,
        startedAt,
        finishedAt: new Date().toISOString(),
        output: {
          action: step.action ?? 'task',
          recommendedAgents: plan.selectedAgents,
          knowledgeHits: knowledge.length,
        },
      };
    } catch (error) {
      return {
        stepId: step.id,
        name: step.name,
        status: 'failed',
        attempts: 1,
        startedAt,
        finishedAt: new Date().toISOString(),
        error: error instanceof Error ? error.message : 'Step execution failed',
      };
    }
  }

  private evaluateCondition(
    condition: string | undefined,
    input: Record<string, unknown>,
  ): boolean {
    if (condition == null || condition.trim().length === 0) {
      return true;
    }

    const [key, expected] = condition.split('==').map((part) => part.trim());
    if (key == null || key.length === 0) {
      return false;
    }

    const currentValue = input[key];
    if (expected == null) {
      return Boolean(currentValue);
    }

    return String(currentValue) === expected.replace(/^['"]|['"]$/g, '');
  }
}
