import type { TopicModule } from './types';

export const portfolioManagement: TopicModule = {
  id: 'portfolio-management',
  name: 'Portfolio Management and Wealth Planning',
  sourceVolume: 'cfa-program2025L1V9.txt',
  learningObjectives: [
    {
      id: 'pm-1',
      title: 'Define portfolio management process',
      summary:
        'Outline planning, execution, and feedback stages, including investment policy statements and strategic asset allocation.',
    },
    {
      id: 'pm-2',
      title: 'Explain modern portfolio theory concepts',
      summary:
        'Use efficient frontier, diversification, and the capital market line to align risk and return objectives.',
    },
    {
      id: 'pm-3',
      title: 'Evaluate risk management techniques',
      summary:
        'Apply risk budgeting, performance attribution, and monitoring metrics to maintain desired exposures.',
    },
  ],
  formulas: [
    {
      name: 'Expected Portfolio Return',
      expression: 'E(R_p) = \sum w_i E(R_i)',
      context: 'Weighted average of individual asset expected returns.',
    },
    {
      name: 'Portfolio Variance',
      expression: 'σ_p^2 = w^T Σ w',
      context: 'Quadratic form combining weights with covariance matrix Σ to assess portfolio risk.',
    },
    {
      name: 'Sharpe Ratio',
      expression: 'Sharpe = (E(R_p) − R_f) / σ_p',
      context: 'Measures excess return per unit of total risk relative to the risk-free rate.',
    },
  ],
  examTips: [
    {
      focus: 'IPS construction',
      guidance: 'State objectives (return, risk) and constraints (liquidity, time horizon, taxes, legal, unique) explicitly.',
    },
    {
      focus: 'Performance attribution',
      guidance: 'Separate allocation, selection, and interaction effects when evaluating manager results.',
    },
  ],
  flashcards: [
    {
      prompt: 'What is the difference between strategic and tactical asset allocation?',
      answer: 'Strategic sets long-term target weights; tactical makes short-term deviations to exploit opportunities.',
      source: 'Portfolio planning and construction',
    },
    {
      prompt: 'Define risk tolerance components in IPS.',
      answer: 'Ability (financial capacity) and willingness (psychological comfort) to take risk.',
      source: 'The portfolio management process',
    },
  ],
  timeline: [
    {
      label: 'Planning',
      detail: 'Gather client data, draft IPS, select capital market expectations.',
      emphasis: 'core',
    },
    {
      label: 'Execution',
      detail: 'Construct portfolio, implement trades, and allocate to managers.',
      emphasis: 'application',
    },
    {
      label: 'Feedback',
      detail: 'Monitor, rebalance, and report performance versus objectives.',
      emphasis: 'exam',
    },
  ],
  calculators: [
    {
      id: 'pm-sharpe',
      name: 'Sharpe Ratio Calculator',
      description: 'Evaluates risk-adjusted performance given expected or realized returns.',
      inputs: [
        { id: 'portfolioReturn', label: 'Portfolio return (%)', type: 'number', step: '0.01' },
        { id: 'riskFree', label: 'Risk-free rate (%)', type: 'number', step: '0.01' },
        { id: 'volatility', label: 'Portfolio volatility (%)', type: 'number', step: '0.01' },
      ],
      compute: (values) => {
        const rp = (Number(values.portfolioReturn) || 0) / 100;
        const rf = (Number(values.riskFree) || 0) / 100;
        const sigma = (Number(values.volatility) || 0) / 100;
        if (!sigma) {
          return { result: 'Volatility must be positive.' };
        }
        const sharpe = (rp - rf) / sigma;
        return {
          result: `Sharpe ratio = ${sharpe.toFixed(2)}`,
          breakdown: `Excess return ${(rp - rf) * 100 >= 0 ? '+' : ''}${((rp - rf) * 100).toFixed(2)}% over volatility ${(sigma * 100).toFixed(2)}%.`,
        };
      },
    },
  ],
};
