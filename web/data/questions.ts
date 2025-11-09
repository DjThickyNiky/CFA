export type DifficultyLevel = 'easy' | 'medium' | 'hard';

export interface LearningObjective {
  id: string;
  description: string;
}

export interface QuestionChoice {
  id: string;
  label: string;
}

export interface Question {
  id: string;
  prompt: string;
  choices: QuestionChoice[];
  answerId: string;
  topic: string;
  difficulty: DifficultyLevel;
  learningObjective: LearningObjective;
  rationale?: string;
}

export interface QuestionBankMeta {
  topics: string[];
  difficulties: DifficultyLevel[];
  learningObjectives: LearningObjective[];
}

export interface QuestionBank {
  metadata: QuestionBankMeta;
  questions: Question[];
}

export const questionBank: QuestionBank = {
  metadata: {
    topics: [
      'Ethics',
      'Quantitative Methods',
      'Economics',
      'Financial Reporting & Analysis',
      'Equity Investments',
    ],
    difficulties: ['easy', 'medium', 'hard'],
    learningObjectives: [
      {
        id: 'ethics_standards',
        description: 'Interpret the CFA Institute Code of Ethics and Standards of Professional Conduct.',
      },
      {
        id: 'quant_probability',
        description: 'Apply probability concepts to investment decision-making.',
      },
      {
        id: 'econ_supply_demand',
        description: 'Analyze supply and demand relationships in microeconomic contexts.',
      },
      {
        id: 'fra_ratios',
        description: 'Evaluate financial statements using key ratio analysis.',
      },
      {
        id: 'equity_valuation',
        description: 'Assess intrinsic value using fundamental equity valuation techniques.',
      },
    ],
  },
  questions: [
    {
      id: 'q_ethics_001',
      prompt: 'Which of the following best describes the primary focus of the CFA Institute Code of Ethics?',
      choices: [
        { id: 'a', label: 'Protecting the CFA Institute brand from reputational risk' },
        { id: 'b', label: 'Establishing a framework for ethical conduct among investment professionals' },
        { id: 'c', label: 'Ensuring legal compliance with securities regulators globally' },
      ],
      answerId: 'b',
      topic: 'Ethics',
      difficulty: 'easy',
      learningObjective: {
        id: 'ethics_standards',
        description: 'Interpret the CFA Institute Code of Ethics and Standards of Professional Conduct.',
      },
      rationale:
        'The Code of Ethics sets broad expectations for professional conduct, going beyond legal compliance to emphasize integrity and client interests.',
    },
    {
      id: 'q_quant_002',
      prompt: 'An event with a 40% chance of occurring in each independent trial is repeated three times. What is the probability the event occurs at least once?',
      choices: [
        { id: 'a', label: '21.6%' },
        { id: 'b', label: '48.0%' },
        { id: 'c', label: '78.4%' },
      ],
      answerId: 'c',
      topic: 'Quantitative Methods',
      difficulty: 'medium',
      learningObjective: {
        id: 'quant_probability',
        description: 'Apply probability concepts to investment decision-making.',
      },
      rationale:
        'Use the complement rule: 1 - (1 - 0.4)^3 = 1 - 0.6^3 = 1 - 0.216 = 0.784.',
    },
    {
      id: 'q_econ_003',
      prompt: 'A decrease in supply with demand unchanged will most likely result in:',
      choices: [
        { id: 'a', label: 'Lower equilibrium price and higher equilibrium quantity' },
        { id: 'b', label: 'Higher equilibrium price and lower equilibrium quantity' },
        { id: 'c', label: 'Higher equilibrium price and higher equilibrium quantity' },
      ],
      answerId: 'b',
      topic: 'Economics',
      difficulty: 'easy',
      learningObjective: {
        id: 'econ_supply_demand',
        description: 'Analyze supply and demand relationships in microeconomic contexts.',
      },
      rationale:
        'With demand unchanged, a leftward shift in supply leads to higher prices and lower quantities.',
    },
    {
      id: 'q_fra_004',
      prompt: 'Which ratio best captures a firm’s ability to cover short-term liabilities with its most liquid assets?',
      choices: [
        { id: 'a', label: 'Current ratio' },
        { id: 'b', label: 'Quick ratio' },
        { id: 'c', label: 'Cash conversion cycle' },
      ],
      answerId: 'b',
      topic: 'Financial Reporting & Analysis',
      difficulty: 'medium',
      learningObjective: {
        id: 'fra_ratios',
        description: 'Evaluate financial statements using key ratio analysis.',
      },
      rationale:
        'The quick ratio excludes inventory and other less liquid current assets, focusing on the most liquid resources.',
    },
    {
      id: 'q_equity_005',
      prompt: 'Which valuation model discounts expected dividends by the required rate of return minus the growth rate?',
      choices: [
        { id: 'a', label: 'Residual income model' },
        { id: 'b', label: 'Gordon growth model' },
        { id: 'c', label: 'Free cash flow to equity model' },
      ],
      answerId: 'b',
      topic: 'Equity Investments',
      difficulty: 'hard',
      learningObjective: {
        id: 'equity_valuation',
        description: 'Assess intrinsic value using fundamental equity valuation techniques.',
      },
      rationale:
        'The Gordon growth model values equity by discounting expected dividends at the difference between the required return and the growth rate.',
    },
  ],
};
