import type { TopicModule } from './types';

export const corporateIssuers: TopicModule = {
  id: 'corporate-issuers',
  name: 'Corporate Issuers',
  sourceVolume: 'cfa-program2025L1V4.txt',
  learningObjectives: [
    {
      id: 'corp-1',
      title: 'Analyze capital budgeting decisions',
      summary:
        'Apply NPV, IRR, payback, and profitability index techniques to evaluate investment projects and rank mutually exclusive opportunities.',
    },
    {
      id: 'corp-2',
      title: 'Evaluate cost of capital and capital structure',
      summary:
        'Estimate the weighted average cost of capital and assess the impact of leverage on earnings, risk, and value.',
    },
    {
      id: 'corp-3',
      title: 'Explain working capital and corporate governance considerations',
      summary:
        'Recommend liquidity management policies and board practices that align management with shareholder interests.',
    },
  ],
  formulas: [
    {
      name: 'Weighted Average Cost of Capital',
      expression: 'WACC = w_d k_d (1 − t) + w_p k_p + w_e k_e',
      context: 'Combines after-tax debt, preferred, and equity component costs using market-value weights.',
    },
    {
      name: 'Operating Cycle',
      expression: 'OC = Days Inventory Outstanding + Days Receivables Outstanding',
      context: 'Measures time between inventory acquisition and cash collection.',
    },
    {
      name: 'Net Present Value',
      expression: 'NPV = \sum_{t=0}^{n} \frac{CF_t}{(1 + r)^t}',
      context: 'Discounts project cash flows at the required rate of return to assess value added.',
    },
  ],
  examTips: [
    {
      focus: 'Project interactions',
      guidance: 'For mutually exclusive projects, choose the highest NPV; use crossover rates to explain conflicting IRR rankings.',
    },
    {
      focus: 'Capital structure target',
      guidance: 'Base WACC on target market-value weights, not book values, unless explicitly instructed.',
    },
  ],
  flashcards: [
    {
      prompt: 'What is financial leverage?',
      answer: 'Use of fixed-cost financing (debt or preferred) to magnify returns to equity holders.',
      source: 'Leverage and Capital Structure',
    },
    {
      prompt: 'List primary working capital policy objectives.',
      answer: 'Maintain liquidity, minimize funding costs, and support uninterrupted operations.',
      source: 'Working Capital Management',
    },
  ],
  timeline: [
    {
      label: 'Capital budgeting planning',
      detail: 'Identify investment ideas, forecast cash flows, and select hurdle rates.',
      emphasis: 'core',
    },
    {
      label: 'Financing execution',
      detail: 'Issue debt or equity to fund approved projects while keeping leverage near targets.',
      emphasis: 'application',
    },
    {
      label: 'Post-audit review',
      detail: 'Compare realized project performance to initial forecasts to refine future decisions.',
      emphasis: 'exam',
    },
  ],
  calculators: [
    {
      id: 'corp-wacc',
      name: 'WACC Estimator',
      description: 'Computes weighted average cost of capital including tax shields on debt.',
      inputs: [
        { id: 'weightDebt', label: 'Debt weight', type: 'number', step: '0.01' },
        { id: 'weightEquity', label: 'Equity weight', type: 'number', step: '0.01' },
        { id: 'weightPreferred', label: 'Preferred weight', type: 'number', step: '0.01' },
        { id: 'costDebt', label: 'Pre-tax cost of debt (%)', type: 'number', step: '0.01' },
        { id: 'costEquity', label: 'Cost of equity (%)', type: 'number', step: '0.01' },
        { id: 'costPreferred', label: 'Cost of preferred (%)', type: 'number', step: '0.01' },
        { id: 'taxRate', label: 'Marginal tax rate (%)', type: 'number', step: '0.01' },
      ],
      compute: (values) => {
        const wd = Number(values.weightDebt) || 0;
        const we = Number(values.weightEquity) || 0;
        const wp = Number(values.weightPreferred) || 0;
        const totalWeight = wd + we + wp;
        if (totalWeight === 0) {
          return { result: 'Enter at least one positive capital component weight.' };
        }
        const normalizedWd = wd / totalWeight;
        const normalizedWe = we / totalWeight;
        const normalizedWp = wp / totalWeight;
        const kd = (Number(values.costDebt) || 0) / 100;
        const ke = (Number(values.costEquity) || 0) / 100;
        const kp = (Number(values.costPreferred) || 0) / 100;
        const t = (Number(values.taxRate) || 0) / 100;
        const wacc = normalizedWd * kd * (1 - t) + normalizedWp * kp + normalizedWe * ke;
        return {
          result: `WACC = ${(wacc * 100).toFixed(2)}%`,
          breakdown: `Weights normalized to 1.0 → Debt ${(normalizedWd * 100).toFixed(1)}%, Preferred ${(normalizedWp * 100).toFixed(1)}%, Equity ${(normalizedWe * 100).toFixed(1)}%.`,
        };
      },
    },
  ],
};
