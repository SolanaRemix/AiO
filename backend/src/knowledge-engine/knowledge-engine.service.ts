import { Injectable, OnModuleInit } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { DatabaseService } from '../database/database.service';

export interface KnowledgeHit {
  id: string;
  title: string;
  excerpt: string;
  content?: string;
  score: number;
  projectId?: string;
  tags?: string[];
}

function tokenize(value: string): string[] {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((token) => token.length > 2);
}

@Injectable()
export class KnowledgeEngineService implements OnModuleInit {
  constructor(private readonly databaseService: DatabaseService) {}

  async onModuleInit(): Promise<void> {
    await this.databaseService.mutate((draft) => {
      if (draft.knowledgeDocuments.length > 0) {
        return;
      }

      const timestamp = new Date().toISOString();
      draft.knowledgeDocuments.push(
        {
          id: randomUUID(),
          title: 'Orchestration playbook',
          excerpt:
            'Guidelines for decomposing prompts into agent execution plans.',
          content:
            'Use staged execution, assign specialists, validate dependencies, and summarize risk before release.',
          tags: ['orchestration', 'planning', 'agents'],
          createdAt: timestamp,
          updatedAt: timestamp,
        },
        {
          id: randomUUID(),
          title: 'Enterprise memory patterns',
          excerpt:
            'Strategies for project, workspace, and user memory management.',
          content:
            'Persist reusable decisions, annotate project context, and index operational traces for later retrieval.',
          tags: ['memory', 'knowledge', 'persistence'],
          createdAt: timestamp,
          updatedAt: timestamp,
        },
      );
    });
  }

  async search(query: string, projectId?: string): Promise<KnowledgeHit[]> {
    const documents = await this.databaseService.list('knowledgeDocuments');
    const queryTokens = tokenize(query);

    return documents
      .filter(
        (item) =>
          projectId == null ||
          item.projectId == null ||
          item.projectId === projectId,
      )
      .map((item) => {
        const candidateTokens = tokenize(
          [item.title, item.excerpt, item.content, item.tags.join(' ')].join(
            ' ',
          ),
        );
        const overlap = queryTokens.filter((token) =>
          candidateTokens.includes(token),
        );
        const lexicalScore = overlap.length / Math.max(queryTokens.length, 1);
        const densityScore =
          overlap.length / Math.max(candidateTokens.length, 1);
        const score = Number(
          (lexicalScore * 0.7 + densityScore * 0.3).toFixed(4),
        );
        return {
          id: item.id,
          title: item.title,
          excerpt: item.excerpt,
          content: item.content,
          projectId: item.projectId,
          tags: item.tags,
          score,
        };
      })
      .filter((item) => item.score > 0 || queryTokens.length < 3)
      .sort((left, right) => right.score - left.score)
      .slice(0, 5);
  }

  async vectorSearch(
    query: string,
    projectId?: string,
  ): Promise<KnowledgeHit[]> {
    return this.search(query, projectId);
  }

  async ragQuery(
    query: string,
    projectId?: string,
  ): Promise<{
    answer: string;
    citations: KnowledgeHit[];
  }> {
    const citations = await this.search(query, projectId);
    const answer =
      citations.length > 0
        ? citations.map((item) => `${item.title}: ${item.excerpt}`).join(' ')
        : 'No relevant knowledge was found for this query.';

    return { answer, citations };
  }

  async ingest(document: {
    title: string;
    excerpt: string;
    content?: string;
    tags?: string[];
    projectId?: string;
  }): Promise<KnowledgeHit> {
    const timestamp = new Date().toISOString();
    const record = {
      id: randomUUID(),
      title: document.title,
      excerpt: document.excerpt,
      content: document.content ?? document.excerpt,
      tags: document.tags ?? [],
      projectId: document.projectId,
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    await this.databaseService.mutate((draft) => {
      draft.knowledgeDocuments.unshift(record);
    });

    return {
      id: record.id,
      title: record.title,
      excerpt: record.excerpt,
      content: record.content,
      score: 1,
      projectId: record.projectId,
      tags: record.tags,
    };
  }
}
