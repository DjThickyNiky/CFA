import type { TopicModule } from './types';

export const quantitativeMethods: TopicModule = {
  id: 'quantitative-methods',
  name: 'Quantitative Methods',
  sourceVolume: 'cfa-program2025L1V1.txt',
  learningObjectives: [
    {
      id: 'qm-1',
      title: 'Evaluate rates and returns across compounding conventions',
      summary:
        'Convert between holding period, arithmetic, geometric, and continuously compounded returns to compare investments on a consistent basis.',
    },
    {
      id: 'qm-2',
      title: 'Apply time value of money techniques',
      summary:
        'Solve for present value, future value, payment, and number of periods for single sums, annuities, and perpetuities in financial contexts.',
    },
    {
      id: 'qm-3',
      title: 'Assess investment risk using statistical concepts',
      summary:
        'Use mean, variance, covariance, correlation, and the coefficient of variation to interpret dispersion and relationships between variables.',
    },
  ],
  formulas: [
    {
      name: 'Future Value with Compounding',
      expression: 'FV = PV × (1 + i/m)^{n×m}',
      context: 'Accumulate a present value given periodic compounding m times per year over n years.',
    },
    {
      name: 'Continuously Compounded Return',
      expression: 'r_c = \ln(1 + R)',
      context: 'Transform a simple holding period return R into its continuous equivalent for additive time aggregation.',
    },
    {
      name: 'Variance of a Two-Asset Portfolio',
      expression: 'σ_p^2 = w_A^2 σ_A^2 + w_B^2 σ_B^2 + 2 w_A w_B σ_A σ_B ρ_{AB}',
      context: 'Measure portfolio dispersion using asset weights, individual volatilities, and correlation.',
    },
  ],
  examTips: [
    {
      focus: 'Timeline setup',
      guidance: 'Sketch cash flows before using the TVM keys; label deposits (+) and withdrawals (−) to avoid sign errors.',
    },
    {
      focus: 'Return conversions',
      guidance: 'When comparing investments, annualize both nominal and effective rates using the same compounding frequency.',
    },
  ],
  flashcards: [
    {
      prompt: 'What is the relationship between arithmetic and geometric mean returns?',
      answer: 'Arithmetic mean ≥ geometric mean; the gap widens with greater return volatility.',
      source: 'Rates and Returns module',
    },
    {
      prompt: 'Define covariance.',
      answer: 'Covariance measures how two random variables move together: Cov(X,Y) = E[(X - μ_X)(Y - μ_Y)].',
      source: 'Statistical Concepts and Market Returns',
    },
  ],
  timeline: [
    {
      label: 'Initial investment decision',
      detail: 'Estimate expected return and risk metrics from historical data to screen opportunities.',
      emphasis: 'application',
    },
    {
      label: 'Capital budgeting',
      detail: 'Discount project cash flows using the firm’s hurdle rate to derive NPV and IRR.',
      emphasis: 'core',
    },
    {
      label: 'Performance evaluation',
      detail: 'Annualize realized returns and compare to benchmarks adjusting for risk.',
      emphasis: 'exam',
    },
  ],
  calculators: [
    {
      id: 'qm-tvm',
      name: 'Time Value of Money Solver',
      description: 'Computes the unknown TVM variable for single cash flow or annuity problems.',
      inputs: [
        { id: 'pv', label: 'Present value (PV)', type: 'number', step: '0.01' },
        { id: 'fv', label: 'Future value (FV)', type: 'number', step: '0.01' },
        { id: 'payment', label: 'Payment (PMT)', type: 'number', step: '0.01' },
        { id: 'rate', label: 'Interest rate (%)', type: 'number', step: '0.01' },
        { id: 'periods', label: 'Number of periods (N)', type: 'number', step: '1', min: 0 },
      ],
      compute: (values) => {
        const pv = Number(values.pv);
        const fv = Number(values.fv);
        const payment = Number(values.payment);
        const rate = Number(values.rate) / 100;
        const periods = Number(values.periods);

        if (rate && periods && (isFinite(pv) || isFinite(fv))) {
          const fvCalc =
            pv * Math.pow(1 + rate, periods) +
            (payment !== 0 ? payment * ((Math.pow(1 + rate, periods) - 1) / rate) : 0);
          return {
            result: `Future value = ${fvCalc.toFixed(2)}`,
            breakdown: 'Assumes payments occur at period end. Use the annuity due adjustment for beginning-of-period cash flows.',
          };
        }

        if (!rate && periods && pv && fv) {
          const impliedRate = Math.pow(fv / pv, 1 / periods) - 1;
          return {
            result: `Implied rate = ${(impliedRate * 100).toFixed(3)}%`,
            breakdown: 'Solves for the growth rate that links PV and FV over the specified horizon.',
          };
        }

        return { result: 'Provide PV, FV, rate, and N to compute missing variables.' };
      },
    },
  ],
};
