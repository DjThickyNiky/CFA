import type { TopicModule } from './types';

export const economics: TopicModule = {
  id: 'economics',
  name: 'Economics',
  sourceVolume: 'cfa-program2025L1V2.txt',
  learningObjectives: [
    {
      id: 'econ-1',
      title: 'Analyze microeconomic decision making',
      summary:
        'Apply demand and supply, elasticity, and marginal analysis to explain consumer and firm behavior in competitive markets.',
    },
    {
      id: 'econ-2',
      title: 'Evaluate macroeconomic performance',
      summary:
        'Interpret GDP, inflation, unemployment, and business cycle indicators to assess the state of the economy.',
    },
    {
      id: 'econ-3',
      title: 'Explain monetary and fiscal policy tools',
      summary:
        'Compare expansionary and contractionary policy transmission mechanisms and their impact on aggregate demand and interest rates.',
    },
  ],
  formulas: [
    {
      name: 'Price Elasticity of Demand',
      expression: 'E_d = (ΔQ/Q) / (ΔP/P)',
      context: 'Quantifies responsiveness of quantity demanded to price changes; elasticities greater than one imply high sensitivity.',
    },
    {
      name: 'Quantity Theory of Money',
      expression: 'MV = PY',
      context: 'Links money supply growth (M) and velocity (V) to nominal GDP (P×Y).',
    },
    {
      name: 'Fiscal Multiplier',
      expression: 'k = 1 / (1 - MPC × (1 - t))',
      context: 'Estimates the change in aggregate demand resulting from a change in government spending when taxes t reduce disposable income.',
    },
  ],
  examTips: [
    {
      focus: 'Cycle classification',
      guidance: 'Identify leading, coincident, and lagging indicators to match a described economy with its business cycle phase.',
    },
    {
      focus: 'Policy conflicts',
      guidance: 'Remember central banks target price stability; when inflation is above target, expect tightening even if growth slows.',
    },
  ],
  flashcards: [
    {
      prompt: 'What shifts the long-run aggregate supply curve?',
      answer: 'Changes in labor, capital, technology, or productivity that alter the economy’s potential output.',
      source: 'Aggregate Demand and Supply',
    },
    {
      prompt: 'Define absolute advantage.',
      answer: 'The ability to produce more of a good with the same resources compared to another producer.',
      source: 'International Trade and Capital Flows',
    },
  ],
  timeline: [
    {
      label: 'Policy formulation',
      detail: 'Legislators set fiscal policy budgets while central banks adjust policy rates and reserve requirements.',
      emphasis: 'core',
    },
    {
      label: 'Economic data release',
      detail: 'Traders interpret GDP, CPI, and PMI announcements to update growth and inflation expectations.',
      emphasis: 'exam',
    },
    {
      label: 'Cycle turning points',
      detail: 'Analysts monitor yield curve slope, credit spreads, and new orders to detect early expansions or contractions.',
      emphasis: 'application',
    },
  ],
  calculators: [
    {
      id: 'econ-inflation',
      name: 'Inflation Breakeven Analyzer',
      description: 'Compares nominal and real yields to extract expected inflation.',
      inputs: [
        { id: 'nominalYield', label: 'Nominal yield (%)', type: 'number', step: '0.01' },
        { id: 'realYield', label: 'Real yield (%)', type: 'number', step: '0.01' },
      ],
      compute: (values) => {
        const nominal = Number(values.nominalYield);
        const real = Number(values.realYield);
        if (!isFinite(nominal) || !isFinite(real)) {
          return { result: 'Enter both nominal and real yields.' };
        }
        const breakeven = nominal - real;
        return {
          result: `Expected inflation ≈ ${breakeven.toFixed(2)}%`,
          breakdown: 'Assumes Fisher relationship and stable inflation risk premium.',
        };
      },
    },
  ],
};
