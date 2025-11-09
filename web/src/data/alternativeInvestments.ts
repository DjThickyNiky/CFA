import type { TopicModule } from './types';

export const alternativeInvestments: TopicModule = {
  id: 'alternative-investments',
  name: 'Alternative Investments',
  sourceVolume: 'cfa-program2025L1V8.txt',
  learningObjectives: [
    {
      id: 'alt-1',
      title: 'Describe alternative investment categories',
      summary:
        'Differentiate hedge funds, private equity, real assets, commodities, and infrastructure by strategies, liquidity, and fee structures.',
    },
    {
      id: 'alt-2',
      title: 'Evaluate performance and risk considerations',
      summary:
        'Adjust returns for smoothing, leverage, and illiquidity; interpret appraisal-based indices and value at risk limits.',
    },
    {
      id: 'alt-3',
      title: 'Assess portfolio roles of alternatives',
      summary:
        'Explain diversification, inflation protection, and income characteristics relative to traditional assets.',
    },
  ],
  formulas: [
    {
      name: 'Management Fee',
      expression: 'Fee = Management Fee Rate × Net Asset Value',
      context: 'Annual fee applied to average assets under management for hedge funds and private equity funds.',
    },
    {
      name: 'Carried Interest Waterfall',
      expression: 'Distribute cash: Return of capital → Preferred return → Catch-up → Carried interest split',
      context: 'Outlines order of cash flows between limited and general partners.',
    },
    {
      name: 'Value at Risk (Parametric)',
      expression: 'VaR = μ_p − z_α σ_p',
      context: 'Estimates worst expected loss over a horizon at confidence level α.',
    },
  ],
  examTips: [
    {
      focus: 'Fee calculations',
      guidance: 'Apply management fees to committed vs. invested capital as specified; performance fees often net of management fees.',
    },
    {
      focus: 'Liquidity premium',
      guidance: 'Expect higher required returns for illiquid assets; consider J-curve effects in private equity.',
    },
  ],
  flashcards: [
    {
      prompt: 'What is the hurdle rate in private equity?',
      answer: 'Minimum return that must be achieved before the general partner earns carried interest.',
      source: 'Private equity structures',
    },
    {
      prompt: 'Name two risks specific to commodity investing.',
      answer: 'Convenience yield volatility and roll yield from futures curve shifts.',
      source: 'Commodity markets',
    },
  ],
  timeline: [
    {
      label: 'Fundraising',
      detail: 'Managers pitch strategy, secure commitments, and close the fund.',
      emphasis: 'core',
    },
    {
      label: 'Investment period',
      detail: 'Capital deployed into target assets; cash flows called from investors.',
      emphasis: 'application',
    },
    {
      label: 'Harvest/exit',
      detail: 'Assets sold, distributions made, performance fees crystallized.',
      emphasis: 'exam',
    },
  ],
  calculators: [
    {
      id: 'alt-fees',
      name: 'Hedge Fund Fee Calculator',
      description: 'Calculates net investor return after management and incentive fees with a hurdle.',
      inputs: [
        { id: 'grossReturn', label: 'Gross return (%)', type: 'number', step: '0.01' },
        { id: 'managementFee', label: 'Management fee (%)', type: 'number', step: '0.01' },
        { id: 'incentiveFee', label: 'Incentive fee (%)', type: 'number', step: '0.01' },
        { id: 'hurdle', label: 'Hurdle rate (%)', type: 'number', step: '0.01' },
      ],
      compute: (values) => {
        const gross = (Number(values.grossReturn) || 0) / 100;
        const mgmt = (Number(values.managementFee) || 0) / 100;
        const incentive = (Number(values.incentiveFee) || 0) / 100;
        const hurdle = (Number(values.hurdle) || 0) / 100;
        const afterMgmt = gross - mgmt;
        const incentiveBase = Math.max(afterMgmt - hurdle, 0);
        const incentiveFee = incentiveBase * incentive;
        const net = afterMgmt - incentiveFee;
        return {
          result: `Net investor return ≈ ${(net * 100).toFixed(2)}%`,
          breakdown: `Management fee ${(mgmt * 100).toFixed(2)}%, Incentive applied on ${(incentiveBase * 100).toFixed(2)}% of returns.`,
        };
      },
    },
  ],
};
