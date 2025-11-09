import type { TopicModule } from './types';

export const fixedIncome: TopicModule = {
  id: 'fixed-income',
  name: 'Fixed Income',
  sourceVolume: 'cfa-program2025L1V6.txt',
  learningObjectives: [
    {
      id: 'fi-1',
      title: 'Explain fixed-income securities features',
      summary:
        'Describe bond terminology, cash flow structures, embedded options, and credit enhancements that shape price sensitivity.',
    },
    {
      id: 'fi-2',
      title: 'Analyze bond pricing and yields',
      summary:
        'Price bonds using present value of cash flows, compute yield measures, and evaluate spot and forward rate relationships.',
    },
    {
      id: 'fi-3',
      title: 'Measure interest rate risk',
      summary:
        'Calculate duration, convexity, and key rate exposures to estimate price changes under yield curve shifts.',
    },
  ],
  formulas: [
    {
      name: 'Full Price of a Bond',
      expression: 'Full Price = Clean Price + Accrued Interest',
      context: 'Adjusts quoted bond price for accrued coupon between payment dates.',
    },
    {
      name: 'Macaulay Duration',
      expression: 'D_M = \sum \frac{t × PV(CF_t)}{Price}',
      context: 'Time-weighted present value of cash flows measuring interest rate sensitivity.',
    },
    {
      name: 'Approximate Percentage Price Change',
      expression: 'ΔP/P ≈ −Duration × Δy + 0.5 × Convexity × (Δy)^2',
      context: 'Estimates bond price response to small yield changes incorporating convexity.',
    },
  ],
  examTips: [
    {
      focus: 'Quotation conventions',
      guidance: 'Check whether price is quoted per 100 par and whether a 30/360 or actual/actual day count applies.',
    },
    {
      focus: 'Duration interpretation',
      guidance: 'Lower coupon, longer maturity, and lower yield bonds have higher duration and greater price volatility.',
    },
  ],
  flashcards: [
    {
      prompt: 'What is reinvestment risk?',
      answer: 'Risk that interim cash flows are reinvested at lower yields than initially expected.',
      source: 'Yield measures, spot rates, and forward rates',
    },
    {
      prompt: 'Define convexity.',
      answer: 'Second-order measure capturing curvature in the price-yield relationship, improving duration-based estimates.',
      source: 'Interest rate risk',
    },
  ],
  timeline: [
    {
      label: 'Issuance',
      detail: 'Issuer sets coupon, maturity, and covenants; underwriters price based on market conditions.',
      emphasis: 'core',
    },
    {
      label: 'Secondary market trading',
      detail: 'Dealers quote clean prices; settlement adds accrued interest to arrive at invoice price.',
      emphasis: 'application',
    },
    {
      label: 'Portfolio risk review',
      detail: 'Portfolio managers monitor duration targets and hedging effectiveness against benchmark shifts.',
      emphasis: 'exam',
    },
  ],
  calculators: [
    {
      id: 'fi-duration',
      name: 'Duration Impact Estimator',
      description: 'Uses duration and convexity to approximate price change for a yield shift.',
      inputs: [
        { id: 'duration', label: 'Modified duration', type: 'number', step: '0.01' },
        { id: 'convexity', label: 'Convexity', type: 'number', step: '0.01' },
        { id: 'yieldChange', label: 'Yield change (bps)', type: 'number', step: '0.01' },
      ],
      compute: (values) => {
        const duration = Number(values.duration) || 0;
        const convexity = Number(values.convexity) || 0;
        const deltaY = (Number(values.yieldChange) || 0) / 10000;
        const change = -duration * deltaY + 0.5 * convexity * Math.pow(deltaY, 2);
        return {
          result: `Estimated price change ≈ ${(change * 100).toFixed(2)}%`,
          breakdown: 'Negative sign indicates price moves opposite to yield changes.',
        };
      },
    },
  ],
};
