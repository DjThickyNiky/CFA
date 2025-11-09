import type { TopicModule } from './types';

export const financialReporting: TopicModule = {
  id: 'financial-reporting',
  name: 'Financial Statement Analysis',
  sourceVolume: 'cfa-program2025L1V3.txt',
  learningObjectives: [
    {
      id: 'fra-1',
      title: 'Interpret the primary financial statements',
      summary:
        'Evaluate income statement, balance sheet, and cash flow statement relationships to assess profitability, liquidity, and solvency.',
    },
    {
      id: 'fra-2',
      title: 'Analyze revenue recognition and inventory methods',
      summary:
        'Compare IFRS and US GAAP policies for revenue recognition, cost flow assumptions, and inventory valuation impacts.',
    },
    {
      id: 'fra-3',
      title: 'Assess financial performance using ratios',
      summary:
        'Apply profitability, efficiency, liquidity, and coverage ratios to benchmark companies and detect red flags.',
    },
  ],
  formulas: [
    {
      name: 'Dupont Return on Equity',
      expression: 'ROE = Net Profit Margin × Asset Turnover × Financial Leverage',
      context: 'Decomposes shareholder returns into profitability, efficiency, and leverage drivers.',
    },
    {
      name: 'Cash Conversion Cycle',
      expression: 'CCC = DSO + DIO − DPO',
      context: 'Measures net time between cash outlay for inventory and cash collection from customers.',
    },
    {
      name: 'Interest Coverage',
      expression: 'EBIT / Interest Expense',
      context: 'Evaluates a firm’s ability to meet debt service obligations from operating earnings.',
    },
  ],
  examTips: [
    {
      focus: 'Common-size statements',
      guidance: 'Express balance sheet items as a percentage of assets and income statement items as a percentage of revenue for cross-company comparisons.',
    },
    {
      focus: 'Quality of earnings',
      guidance: 'Flag large accruals, aggressive revenue recognition, or frequent restructuring charges as potential red flags.',
    },
  ],
  flashcards: [
    {
      prompt: 'How does LIFO vs. FIFO affect financial statements during rising prices?',
      answer: 'LIFO yields higher COGS, lower ending inventory, and lower taxable income compared with FIFO.',
      source: 'Inventory analysis',
    },
    {
      prompt: 'What is the difference between IFRS and US GAAP for development costs?',
      answer: 'IFRS allows capitalization when criteria are met; US GAAP generally expenses development costs.',
      source: 'Long-lived assets and intangible assets',
    },
  ],
  timeline: [
    {
      label: 'Period-end close',
      detail: 'Management records accruals, deferrals, and valuation adjustments prior to issuing statements.',
      emphasis: 'core',
    },
    {
      label: 'Earnings release',
      detail: 'Analysts review MD&A, footnotes, and KPIs to reconcile GAAP and non-GAAP metrics.',
      emphasis: 'exam',
    },
    {
      label: 'Credit review cycle',
      detail: 'Debt analysts update ratio models and covenant compliance tests post-filing.',
      emphasis: 'application',
    },
  ],
  calculators: [
    {
      id: 'fra-dupont',
      name: 'DuPont Decomposition Tool',
      description: 'Breaks down return on equity into margin, turnover, and leverage effects.',
      inputs: [
        { id: 'netIncome', label: 'Net income', type: 'number', step: '0.01' },
        { id: 'sales', label: 'Revenue', type: 'number', step: '0.01' },
        { id: 'averageAssets', label: 'Average assets', type: 'number', step: '0.01' },
        { id: 'equity', label: 'Average equity', type: 'number', step: '0.01' },
      ],
      compute: (values) => {
        const netIncome = Number(values.netIncome);
        const sales = Number(values.sales);
        const averageAssets = Number(values.averageAssets);
        const equity = Number(values.equity);
        if ([netIncome, sales, averageAssets, equity].some((v) => !isFinite(v) || v === 0)) {
          return { result: 'Enter non-zero income, revenue, assets, and equity values.' };
        }
        const margin = netIncome / sales;
        const turnover = sales / averageAssets;
        const leverage = averageAssets / equity;
        const roe = margin * turnover * leverage;
        return {
          result: `ROE = ${(roe * 100).toFixed(2)}%`,
          breakdown: `Margin ${(margin * 100).toFixed(1)}%, Turnover ${turnover.toFixed(2)}x, Leverage ${leverage.toFixed(2)}x.`,
        };
      },
    },
  ],
};
