import type { TopicModule } from './types';

export const equityInvestments: TopicModule = {
  id: 'equity-investments',
  name: 'Equity Investments',
  sourceVolume: 'cfa-program2025L1V5.txt',
  learningObjectives: [
    {
      id: 'equity-1',
      title: 'Describe equity securities and market structures',
      summary:
        'Differentiate common vs. preferred stock, primary vs. secondary markets, and order types used in equity trading.',
    },
    {
      id: 'equity-2',
      title: 'Value equities using dividend discount and multiples models',
      summary:
        'Estimate intrinsic value with Gordon growth, multi-stage dividend models, and price multiples compared with peers.',
    },
    {
      id: 'equity-3',
      title: 'Interpret industry and company analysis frameworks',
      summary:
        'Apply Porter’s Five Forces, life-cycle stages, and competitive strategies when forecasting earnings.',
    },
  ],
  formulas: [
    {
      name: 'Gordon Growth Model',
      expression: 'V_0 = \frac{D_1}{r - g}',
      context: 'Values a stock assuming dividends grow at a constant rate g and the required return is r.',
    },
    {
      name: 'Justified P/E',
      expression: 'P/E = \frac{(1 - b)}{r - g}',
      context: 'Links payout ratio (1 − b), required return r, and growth g to an appropriate price-to-earnings multiple.',
    },
    {
      name: 'Enterprise Value',
      expression: 'EV = Market Cap + Debt + Preferred + Minority Interest − Cash',
      context: 'Represents the total value of the firm available to all capital providers.',
    },
  ],
  examTips: [
    {
      focus: 'Dividend timeline',
      guidance: 'Remember ex-dividend date is two business days before record date in standard settlement cycles.',
    },
    {
      focus: 'Relative valuation',
      guidance: 'Compare multiples to justified benchmarks and adjust for growth, profitability, and risk differences.',
    },
  ],
  flashcards: [
    {
      prompt: 'What is a dark pool?',
      answer: 'An alternative trading system that matches large block trades anonymously to reduce market impact.',
      source: 'Market organization and structure',
    },
    {
      prompt: 'How is sustainable growth rate calculated?',
      answer: 'g = ROE × retention ratio.',
      source: 'Equity valuation concepts',
    },
  ],
  timeline: [
    {
      label: 'Research initiation',
      detail: 'Analyst constructs industry outlook, financial forecasts, and valuation models.',
      emphasis: 'core',
    },
    {
      label: 'Investment committee review',
      detail: 'Recommendations vetted for assumptions, catalysts, and risk controls.',
      emphasis: 'exam',
    },
    {
      label: 'Post-investment monitoring',
      detail: 'Track earnings releases, competitive developments, and valuation signals for exit decisions.',
      emphasis: 'application',
    },
  ],
  calculators: [
    {
      id: 'equity-gordon',
      name: 'Dividend Discount Calculator',
      description: 'Computes intrinsic value using the Gordon growth assumption.',
      inputs: [
        { id: 'dividend', label: 'Next dividend (D1)', type: 'number', step: '0.01' },
        { id: 'requiredReturn', label: 'Required return (%)', type: 'number', step: '0.01' },
        { id: 'growth', label: 'Growth rate (%)', type: 'number', step: '0.01' },
      ],
      compute: (values) => {
        const d1 = Number(values.dividend);
        const r = (Number(values.requiredReturn) || 0) / 100;
        const g = (Number(values.growth) || 0) / 100;
        if (!isFinite(d1) || !r || r <= g) {
          return { result: 'Ensure D1 is provided and r > g.' };
        }
        const value = d1 / (r - g);
        return {
          result: `Intrinsic value = ${value.toFixed(2)}`,
          breakdown: `Implied dividend yield ${(d1 / value * 100).toFixed(2)}% with growth ${(g * 100).toFixed(2)}%.`,
        };
      },
    },
  ],
};
