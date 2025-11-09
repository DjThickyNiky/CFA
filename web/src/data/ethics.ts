import type { TopicModule } from './types';

export const ethics: TopicModule = {
  id: 'ethics',
  name: 'Ethical and Professional Standards',
  sourceVolume: 'cfa-program2025L1V10.txt',
  learningObjectives: [
    {
      id: 'ethics-1',
      title: 'Apply the CFA Institute Code of Ethics and Standards of Professional Conduct',
      summary:
        'Interpret scenarios to determine which Standard is implicated and the recommended course of action to preserve market integrity and client interests.',
    },
    {
      id: 'ethics-2',
      title: 'Distinguish duties owed to clients, employers, and the profession',
      summary:
        'Contrast loyalty, prudence, care, and fair dealing obligations when handling client information, soft dollars, and performance presentation.',
    },
    {
      id: 'ethics-3',
      title: 'Explain the Global Investment Performance Standards (GIPS) framework',
      summary:
        'Summarize core GIPS principles, including composite construction, input data integrity, and verification disclosures.',
    },
  ],
  formulas: [
    {
      name: 'Professionalism Decision Process',
      expression: 'Identify stakeholders → Consider duties → Isolate conflicts → Take action → Document',
      context:
        'Structured approach for ethics vignette analysis to demonstrate diligence and independence in judgment.',
    },
  ],
  examTips: [
    {
      focus: 'Violation diagnostics',
      guidance:
        'Underline trigger words (e.g., misrepresentation, material nonpublic information) and map them to Standards before selecting a response.',
    },
    {
      focus: 'GIPS calculations',
      guidance:
        'When performance figures appear, confirm the portfolio is in the composite for the full period and that returns are asset-weighted.',
    },
  ],
  flashcards: [
    {
      prompt: 'Which Standard addresses improper use of client brokerage (soft dollars)?',
      answer: 'Standard III(A) Loyalty, Prudence, and Care—requires that client brokerage benefit the client and be disclosed.',
      source: 'Standard III(A)',
    },
    {
      prompt: 'List the seven sections of the GIPS standards.',
      answer: '1) Fundamentals of Compliance, 2) Input Data, 3) Calculation Methodology, 4) Composite Construction, 5) Disclosures, 6) Presentation and Reporting, 7) Real Estate and Private Equity provisions.',
      source: 'GIPS 2020 Executive Summary',
    },
  ],
  timeline: [
    {
      label: 'Pre-engagement due diligence',
      detail: 'Confirm independence, conflicts, and suitability before accepting new client mandates.',
      emphasis: 'core',
    },
    {
      label: 'Ongoing monitoring',
      detail: 'Maintain regular compliance certifications, disclosure updates, and trade surveillance reports.',
      emphasis: 'exam',
    },
    {
      label: 'Post-violation remediation',
      detail: 'Document findings, inform supervisors, and notify clients or regulators when required.',
      emphasis: 'application',
    },
  ],
  calculators: [
    {
      id: 'ethics-gifts',
      name: 'Gift Materiality Gauge',
      description: 'Benchmarks the monetary value of gifts against client relationship revenue to judge independence risks.',
      inputs: [
        { id: 'giftValue', label: 'Gift value (USD)', type: 'number', step: '0.01', min: 0 },
        { id: 'annualRevenue', label: 'Client annual revenue (USD)', type: 'number', step: '0.01', min: 0 },
      ],
      compute: (values) => {
        const gift = Number(values.giftValue || 0);
        const revenue = Number(values.annualRevenue || 0);
        if (!revenue) {
          return { result: 'Provide client revenue to evaluate materiality.' };
        }
        const ratio = (gift / revenue) * 100;
        const qualitative =
          ratio < 1
            ? 'low'
            : ratio < 5
            ? 'moderate'
            : 'heightened';
        return {
          result: `${ratio.toFixed(2)}% of annual revenue`,
          breakdown: `Independence risk is ${qualitative}; document the gift and seek approval when ratio exceeds firm policy thresholds.`,
        };
      },
    },
  ],
};
