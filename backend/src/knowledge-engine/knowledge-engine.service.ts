import { Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';

export interface KnowledgeHit {
  id: string;
  title: string;
  excerpt: string;
  score: number;
  projectId?: string;
}

@Injectable()
export class KnowledgeEngineService {
  private readonly corpus: KnowledgeHit[] = [
    {
      id: randomUUID(),
      title: 'Orchestration playbook',
      excerpt: 'Guidelines for decomposing prompts into agent execution plans.',
      score: 0.96,
    },
    {
      id: randomUUID(),
      title: 'Enterprise memory patterns',
      excerpt: 'Strategies for project, workspace, and user memory management.',
      score: 0.91,
    },
  ];

  search(query: string, projectId?: string): Promise<KnowledgeHit[]> {
    const normalizedQuery = query.toLowerCase();
    return Promise.resolve(
      this.corpus
        .filter((item) => {
          const matchesProject =
            projectId == null ||
            item.projectId == null ||
            item.projectId === projectId;
          const matchesQuery =
            item.title.toLowerCase().includes(normalizedQuery) ||
            item.excerpt.toLowerCase().includes(normalizedQuery) ||
            normalizedQuery.length < 12;
          return matchesProject && matchesQuery;
        })
        .sort((left, right) => right.score - left.score)
        .slice(0, 5),
    );
  }

  ingest(document: {
    title: string;
    excerpt: string;
    projectId?: string;
  }): Promise<KnowledgeHit> {
    const record: KnowledgeHit = {
      id: randomUUID(),
      title: document.title,
      excerpt: document.excerpt,
      score: 0.88,
      projectId: document.projectId,
    };
    this.corpus.unshift(record);
    return Promise.resolve(record);
  }
}
