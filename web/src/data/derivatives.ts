import type { TopicModule } from './types';

export const derivatives: TopicModule = {
  id: 'derivatives',
  name: 'Derivatives',
  sourceVolume: 'cfa-program2025L1V7.txt',
  learningObjectives: [
    {
      id: 'der-1',
      title: 'Describe derivative markets and instruments',
      summary:
        'Differentiate forwards, futures, options, and swaps, including payoff profiles and trading venues.',
    },
    {
      id: 'der-2',
      title: 'Value forward commitments',
      summary:
        'Compute forward prices using spot, cost of carry, and discounting for equity, fixed income, and currency contracts.',
    },
    {
      id: 'der-3',
      title: 'Evaluate option strategies',
      summary:
        'Analyze intrinsic vs. time value, put-call parity, and payoff diagrams for spreads and combinations.',
    },
  ],
  formulas: [
    {
      name: 'Forward Price (No Income Asset)',
      expression: 'F_0 = S_0 (1 + r)^T',
      context: 'Arbitrage-free forward price derived from spot price compounded at the risk-free rate.',
    },
    {
      name: 'Put-Call Parity',
      expression: 'C + PV(K) = P + S_0',
      context: 'Relates European call (C) and put (P) prices with strike K and spot S_0.',
    },
    {
      name: 'Option Payoff',
      expression: 'Call payoff = max(0, S_T − K); Put payoff = max(0, K − S_T)',
      context: 'Terminal payoffs for long call and put positions at option expiration.',
    },
  ],
  examTips: [
    {
      focus: 'Sign conventions',
      guidance: 'Long forward gains when spot > forward price; short is opposite. Draw payoff diagrams to confirm direction.',
    },
    {
      focus: 'Option boundaries',
      guidance: 'Check that option prices satisfy intrinsic value ≤ option price ≤ underlying price for calls.',
    },
  ],
  flashcards: [
    {
      prompt: 'What is the difference between a swap and a series of forward contracts?',
      answer: 'A swap can be viewed as a portfolio of forwards with different settlement dates, netted at each exchange.',
      source: 'Swap markets',
    },
    {
      prompt: 'Define delta.',
      answer: 'Delta measures the change in option price for a small change in the underlying price.',
      source: 'Option valuation',
    },
  ],
  timeline: [
    {
      label: 'Contract initiation',
      detail: 'Parties agree on terms, notional, and settlement mechanics; margin posted for exchange-traded contracts.',
      emphasis: 'core',
    },
    {
      label: 'During the life',
      detail: 'Daily marking to market for futures; collateral adjustments for OTC agreements.',
      emphasis: 'application',
    },
    {
      label: 'Expiration or termination',
      detail: 'Contracts settle via physical delivery, cash settlement, or offsetting trades.',
      emphasis: 'exam',
    },
  ],
  calculators: [
    {
      id: 'der-forward',
      name: 'Forward Pricing Tool',
      description: 'Computes theoretical forward price incorporating income yields.',
      inputs: [
        { id: 'spot', label: 'Spot price', type: 'number', step: '0.01' },
        { id: 'rate', label: 'Risk-free rate (%)', type: 'number', step: '0.01' },
        { id: 'time', label: 'Time to maturity (years)', type: 'number', step: '0.01' },
        { id: 'incomeYield', label: 'Income yield (%)', type: 'number', step: '0.01' },
      ],
      compute: (values) => {
        const spot = Number(values.spot);
        const r = (Number(values.rate) || 0) / 100;
        const t = Number(values.time) || 0;
        const q = (Number(values.incomeYield) || 0) / 100;
        if (!isFinite(spot) || t <= 0) {
          return { result: 'Enter spot price and time to maturity.' };
        }
        const forward = spot * Math.exp((r - q) * t);
        return {
          result: `Forward price ≈ ${forward.toFixed(2)}`,
          breakdown: `Uses continuous compounding with cost-of-carry adjustment (r − q).`,
        };
      },
    },
  ],
};
