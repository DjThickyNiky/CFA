import { createContext, useContext, useEffect, useRef, useState, ReactNode } from 'react';
import { Question, DifficultyLevel } from '../data/questions';

type Topic = Question['topic'];

export interface ResponseRecord {
  questionId: string;
  topic: Topic;
  difficulty: DifficultyLevel;
  learningObjectiveId: string;
  correct: boolean;
  selectedChoiceId: string;
  timestamp: number;
}

export interface DiagnosticsState {
  responses: ResponseRecord[];
}

export interface PerformanceSummary {
  correct: number;
  total: number;
  accuracy: number;
}

export interface TopicPerformanceMap {
  [topic: string]: PerformanceSummary;
}

export interface DifficultyPerformanceMap {
  [difficulty in DifficultyLevel]?: PerformanceSummary;
}

export interface LearningObjectivePerformanceMap {
  [learningObjectiveId: string]: PerformanceSummary;
}

export interface MasterySnapshot {
  byTopic: TopicPerformanceMap;
  byDifficulty: DifficultyPerformanceMap;
  byLearningObjective: LearningObjectivePerformanceMap;
}

const STORAGE_KEY = 'cfa.diagnostics.state.v1';

interface StorageAdapter {
  load(): DiagnosticsState | undefined;
  save(state: DiagnosticsState): void;
}

export class LocalStorageAdapter implements StorageAdapter {
  load(): DiagnosticsState | undefined {
    if (typeof window === 'undefined' || !window.localStorage) {
      return undefined;
    }
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return undefined;
    }
    try {
      const parsed = JSON.parse(raw);
      if (parsed && Array.isArray(parsed.responses)) {
        return { responses: parsed.responses as ResponseRecord[] };
      }
    } catch (error) {
      console.warn('Failed to parse diagnostics state', error);
    }
    return undefined;
  }

  save(state: DiagnosticsState): void {
    if (typeof window === 'undefined' || !window.localStorage) {
      return;
    }
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }
}

export class MemoryStorageAdapter implements StorageAdapter {
  private state: DiagnosticsState | undefined;

  load(): DiagnosticsState | undefined {
    return this.state;
  }

  save(state: DiagnosticsState): void {
    this.state = state;
  }
}

export type DiagnosticsSubscriber = (state: DiagnosticsState) => void;

export class DiagnosticsEngine {
  private state: DiagnosticsState;
  private subscribers: Set<DiagnosticsSubscriber> = new Set();

  constructor(private readonly storage: StorageAdapter = new LocalStorageAdapter()) {
    this.state = storage.load() ?? { responses: [] };
  }

  getState(): DiagnosticsState {
    return this.state;
  }

  subscribe(callback: DiagnosticsSubscriber): () => void {
    this.subscribers.add(callback);
    return () => {
      this.subscribers.delete(callback);
    };
  }

  private notify(): void {
    this.storage.save(this.state);
    this.subscribers.forEach((subscriber) => subscriber(this.state));
  }

  recordResponse(question: Question, selectedChoiceId: string): ResponseRecord {
    const correct = question.answerId === selectedChoiceId;
    const record: ResponseRecord = {
      questionId: question.id,
      topic: question.topic,
      difficulty: question.difficulty,
      learningObjectiveId: question.learningObjective.id,
      correct,
      selectedChoiceId,
      timestamp: Date.now(),
    };

    this.state = {
      ...this.state,
      responses: [...this.state.responses, record],
    };

    this.notify();
    return record;
  }

  reset(): void {
    this.state = { responses: [] };
    this.notify();
  }

  private buildPerformanceSummary(records: ResponseRecord[]): PerformanceSummary {
    const total = records.length;
    const correct = records.filter((response) => response.correct).length;
    return {
      correct,
      total,
      accuracy: total === 0 ? 0 : correct / total,
    };
  }

  private groupBy<K extends string>(records: ResponseRecord[], keySelector: (record: ResponseRecord) => K): Record<K, ResponseRecord[]> {
    return records.reduce((accumulator, record) => {
      const key = keySelector(record);
      if (!accumulator[key]) {
        accumulator[key] = [] as ResponseRecord[];
      }
      accumulator[key].push(record);
      return accumulator;
    }, {} as Record<K, ResponseRecord[]>);
  }

  getTopicPerformance(): TopicPerformanceMap {
    const grouped = this.groupBy(this.state.responses, (record) => record.topic);
    return Object.fromEntries(
      Object.entries(grouped).map(([topic, records]) => [topic, this.buildPerformanceSummary(records)])
    );
  }

  getDifficultyPerformance(): DifficultyPerformanceMap {
    const grouped = this.groupBy(this.state.responses, (record) => record.difficulty);
    return Object.fromEntries(
      Object.entries(grouped).map(([difficulty, records]) => [difficulty, this.buildPerformanceSummary(records)])
    ) as DifficultyPerformanceMap;
  }

  getLearningObjectivePerformance(): LearningObjectivePerformanceMap {
    const grouped = this.groupBy(this.state.responses, (record) => record.learningObjectiveId);
    return Object.fromEntries(
      Object.entries(grouped).map(([learningObjective, records]) => [learningObjective, this.buildPerformanceSummary(records)])
    );
  }

  getMasterySnapshot(): MasterySnapshot {
    return {
      byTopic: this.getTopicPerformance(),
      byDifficulty: this.getDifficultyPerformance(),
      byLearningObjective: this.getLearningObjectivePerformance(),
    };
  }

  getRecentResponses(limit = 10): ResponseRecord[] {
    return [...this.state.responses].sort((a, b) => b.timestamp - a.timestamp).slice(0, limit);
  }
}

const DiagnosticsContext = createContext<DiagnosticsEngine | null>(null);

export const DiagnosticsProvider = ({ children }: { children: ReactNode }) => {
  const [engine] = useState(() => new DiagnosticsEngine());
  return <DiagnosticsContext.Provider value={engine}>{children}</DiagnosticsContext.Provider>;
};

export const useDiagnostics = (): DiagnosticsEngine => {
  const context = useContext(DiagnosticsContext);
  if (!context) {
    throw new Error('useDiagnostics must be used within a DiagnosticsProvider');
  }
  return context;
};

const useDiagnosticsSubscription = <T,>(selector: (engine: DiagnosticsEngine) => T): T => {
  const diagnostics = useDiagnostics();
  const selectorRef = useRef(selector);
  selectorRef.current = selector;
  const [value, setValue] = useState<T>(() => selector(diagnostics));

  useEffect(() => {
    const unsubscribe = diagnostics.subscribe(() => {
      setValue(selectorRef.current(diagnostics));
    });
    return unsubscribe;
  }, [diagnostics]);

  return value;
};

export const useMasterySnapshot = (): MasterySnapshot =>
  useDiagnosticsSubscription((engine) => engine.getMasterySnapshot());

export const useRecentResponses = (limit = 10): ResponseRecord[] =>
  useDiagnosticsSubscription((engine) => engine.getRecentResponses(limit));

export const useTopicPerformance = (): TopicPerformanceMap =>
  useDiagnosticsSubscription((engine) => engine.getTopicPerformance());

export const useDifficultyPerformance = (): DifficultyPerformanceMap =>
  useDiagnosticsSubscription((engine) => engine.getDifficultyPerformance());

export const useLearningObjectivePerformance = (): LearningObjectivePerformanceMap =>
  useDiagnosticsSubscription((engine) => engine.getLearningObjectivePerformance());
