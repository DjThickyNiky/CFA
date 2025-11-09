export interface LearningObjective {
  id: string;
  title: string;
  summary: string;
}

export interface FormulaSummary {
  name: string;
  expression: string;
  context: string;
}

export interface ExamTip {
  focus: string;
  guidance: string;
}

export interface Flashcard {
  prompt: string;
  answer: string;
  source: string;
}

export interface TimelineEvent {
  label: string;
  detail: string;
  emphasis?: 'core' | 'exam' | 'application';
}

export interface CalculatorInput {
  id: string;
  label: string;
  type: 'number' | 'select';
  step?: string;
  min?: number;
  options?: { value: string; label: string }[];
}

export interface CalculatorDefinition {
  id: string;
  name: string;
  description: string;
  inputs: CalculatorInput[];
  compute: (values: Record<string, number | string>) => { result: string; breakdown?: string };
}

export interface TopicModule {
  id: string;
  name: string;
  sourceVolume: string;
  learningObjectives: LearningObjective[];
  formulas: FormulaSummary[];
  examTips: ExamTip[];
  flashcards: Flashcard[];
  timeline: TimelineEvent[];
  calculators: CalculatorDefinition[];
}
