import React, { useMemo, useState } from 'react';
import DerivativesModule from '../modules/derivatives';

type View = {
  id: string;
  label: string;
  description: string;
  bullets?: string[];
  render?: () => React.ReactNode;
};

const topicViews: View[] = [
  {
    id: 'ethics',
    label: 'Ethics',
    description: 'Master the CFA Institute Code of Ethics and Standards of Professional Conduct to ground every analysis in integrity.',
    bullets: [
      'Know the seven Standards and how they apply in scenario questions.',
      'Prioritise client interests, diligence, and independence in judgement.',
      'Understand the GIPS standards structure and compliant presentation requirements.'
    ]
  },
  {
    id: 'quant',
    label: 'Quantitative Methods',
    description: 'Build fluency with time value of money, probability, and statistical techniques that underpin portfolio analysis.',
    bullets: [
      'Solve TVM, annuity, and perpetuity problems with confidence.',
      'Interpret sampling distributions, hypothesis tests, and p-values.',
      'Explain correlation vs. causation and model specification pitfalls.'
    ]
  },
  {
    id: 'economics',
    label: 'Economics',
    description: 'Connect micro and macro frameworks to investment decision making, from supply-demand shifts to currency regimes.',
    bullets: [
      'Apply elasticity, utility, and market structure concepts.',
      'Analyse monetary and fiscal policy effects on growth and inflation.',
      'Evaluate currency quotes, parity conditions, and trade balances.'
    ]
  },
  {
    id: 'fsa',
    label: 'Financial Statement Analysis',
    description: 'Translate financial statements into actionable insights, adjusting for accounting differences and distortions.',
    bullets: [
      'Recast income statements and balance sheets for comparability.',
      'Compute key ratios and DuPont-style decompositions.',
      'Identify revenue recognition, inventory, and long-lived asset issues.'
    ]
  },
  {
    id: 'corporate',
    label: 'Corporate Issuers',
    description: 'Understand capital budgeting, cost of capital, and corporate governance considerations that drive firm value.',
    bullets: [
      'Evaluate investment projects using NPV and IRR with scenario analysis.',
      'Estimate WACC incorporating flotation costs and leverage changes.',
      'Assess payout policy, capital structure, and ESG integration choices.'
    ]
  },
  {
    id: 'equity',
    label: 'Equity',
    description: 'Develop intuition for equity valuation models, market indices, and industry analysis frameworks.',
    bullets: [
      'Differentiate DDM, FCFE, and market multiple approaches.',
      'Interpret index weighting methods and passive vs. active implications.',
      'Use Porter’s Five Forces to assess competitive advantage durability.'
    ]
  },
  {
    id: 'fixed-income',
    label: 'Fixed Income',
    description: 'Analyse bond pricing, yield measures, and interest rate risk to manage fixed-income portfolios effectively.',
    bullets: [
      'Price bonds with spot curves and compute yield spreads.',
      'Measure duration, convexity, and scenario-based sensitivities.',
      'Explain securitisation structures and prepayment modelling basics.'
    ]
  },
  {
    id: 'derivatives',
    label: 'Derivatives',
    description: 'Explore pricing intuition, payoff diagrams, and exam-style drills in the Derivatives Mastery Lab.',
    render: () => <DerivativesModule />
  },
  {
    id: 'alternatives',
    label: 'Alternative Investments',
    description: 'Survey real assets, private equity, and hedge fund strategies, focusing on valuation, fees, and risk disclosures.',
    bullets: [
      'Contrast appraisal- vs. transaction-based real estate metrics.',
      'Outline private equity fund structures, waterfalls, and IRR drivers.',
      'Classify hedge fund strategies and qualitative risk factors.'
    ]
  },
  {
    id: 'portfolio',
    label: 'Portfolio Management',
    description: 'Connect behavioural finance, asset allocation, and IPS construction into a cohesive wealth management process.',
    bullets: [
      'Profile investor risk/return objectives and constraints.',
      'Explain the efficient frontier, diversification, and CAPM logic.',
      'Differentiate active return/risk decomposition and performance attribution.'
    ]
  },
  {
    id: 'progress',
    label: 'Progress',
    description: 'Track your study momentum and identify the next best action using spaced repetition cues and study hour targets.',
    bullets: [
      'Log completed readings and mock exam scores to monitor trendlines.',
      'Review weekly hour allocations vs. study plan baselines.',
      'Surface weak LOS areas from diagnostics to reprioritise sessions.'
    ]
  },
  {
    id: 'diagnostics',
    label: 'Diagnostics',
    description: 'Use quick diagnostics to stress-test topic mastery before mock exams.',
    bullets: [
      'Trigger 10-question drills for any topic with time-boxed practice.',
      'Review confidence tagging to focus on blind spots.',
      'Export results to feed your personalised review calendar.'
    ]
  }
];

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<View>(topicViews[0]);

  const content = useMemo(() => {
    if (activeView.render) {
      return activeView.render();
    }

    return (
      <article className="placeholder-card">
        <header>
          <h2>{activeView.label}</h2>
        </header>
        <p>{activeView.description}</p>
        {activeView.bullets && (
          <ul>
            {activeView.bullets.map((bullet) => (
              <li key={bullet}>{bullet}</li>
            ))}
          </ul>
        )}
      </article>
    );
  }, [activeView]);

  return (
    <div className="app-shell">
      <header className="app-header">
        <h1 className="app-header__title">CFA Level I Study Companion</h1>
        <nav className="app-nav" aria-label="Topic navigation">
          {topicViews.map((view) => (
            <button
              key={view.id}
              type="button"
              className={`app-nav__button${view.id === activeView.id ? ' app-nav__button--active' : ''}`}
              onClick={() => setActiveView(view)}
            >
              {view.label}
            </button>
          ))}
        </nav>
      </header>
      <main className="app-main">{content}</main>
    </div>
  );
};

export default App;
