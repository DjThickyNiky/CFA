import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import './derivatives.css';

type BasicBlock = {
  heading: string;
  content: string;
  tag?: string;
};

type ForwardCalculatorBlock = {
  type: 'forwardCalculator';
  heading: string;
  content: string;
};

type OptionCalculatorBlock = {
  type: 'optionCalculator';
  heading: string;
  content: string;
};

type PayoffChartBlock = {
  type: 'payoffChart';
  heading: string;
  content: string;
};

type FlashcardItem = {
  front: string;
  back: string;
};

type FlashcardsBlock = {
  type: 'flashcards';
  heading: string;
  content: string;
  items: FlashcardItem[];
};

type QuizOption = {
  text: string;
  correct: boolean;
  feedback: string;
};

type QuizQuestion = {
  prompt: string;
  options: QuizOption[];
};

type QuizBlock = {
  type: 'quiz';
  heading: string;
  content: string;
  questions: QuizQuestion[];
};

type DetailsItem = {
  summary: string;
  body: string;
};

type DetailsBlock = {
  type: 'details';
  heading: string;
  content: string;
  items: DetailsItem[];
};

type Block =
  | BasicBlock
  | ForwardCalculatorBlock
  | OptionCalculatorBlock
  | PayoffChartBlock
  | FlashcardsBlock
  | QuizBlock
  | DetailsBlock;

type Section = {
  id: string;
  title: string;
  intro: string;
  blocks: Block[];
};

const sections: Section[] = [
  {
    id: 'map',
    title: 'Learning Roadmap',
    intro:
      'Follow the CFA curriculum structure as you move from derivative market foundations through valuation and risk management. Each card highlights key exam themes and quick wins.',
    blocks: [
      {
        heading: '1. Derivative Market Overview',
        tag: 'Core Concept',
        content:
          'Purpose, market participants, and types of derivatives (forwards, futures, options, swaps). Understand why derivatives exist and how they distribute risk.'
      },
      {
        heading: '2. Pricing & Valuation',
        tag: 'Core Concept',
        content:
          'Learn to compute forward prices, option intrinsic/extrinsic values, and swap fixed rates using no-arbitrage and present value logic.'
      },
      {
        heading: '3. Risk & Return Profiles',
        tag: 'Exam Favorite',
        content:
          'Master payoff diagrams, breakeven points, and how combining derivatives alters return distributions.'
      },
      {
        heading: '4. Uses of Derivatives',
        tag: 'Applications',
        content:
          'Hedging (portfolio insurance, interest rate exposure) and speculation (volatility trading). Understand how CFA exam vignettes test strategic thinking.'
      }
    ]
  },
  {
    id: 'instruments',
    title: 'Derivative Instruments Deep Dive',
    intro: 'Interact with the cards to break down the mechanics, payoffs, and valuation fundamentals of each contract type.',
    blocks: [
      {
        heading: 'Forwards',
        content:
          'Customized OTC agreements to buy/sell an asset at a future date for a price set today. Key exam focus: no-arbitrage pricing F₀ = S₀(1 + r)ᵀ (adjusted for income/storage).'
      },
      {
        heading: 'Futures',
        content:
          'Exchange-traded forwards with daily marking-to-market and margin requirements. Remember: futures price converges to spot at expiration and credit risk is mitigated by the clearinghouse.'
      },
      {
        heading: 'Options',
        content:
          'Rights without obligations. Calls profit from price increases, puts from decreases. Understand moneyness, intrinsic vs. time value, and option Greeks at a qualitative level.'
      },
      {
        heading: 'Swaps',
        content:
          'Agreements to exchange cash flow streams. Level I focuses on plain-vanilla interest rate swaps and currency swaps priced using series of forwards.'
      }
    ]
  },
  {
    id: 'valuation',
    title: 'Valuation Playgrounds',
    intro:
      'Manipulate assumptions to see how derivative values respond. Values update instantly to reinforce no-arbitrage intuition.',
    blocks: [
      {
        type: 'forwardCalculator',
        heading: 'Forward Price Explorer',
        content:
          'Adjust inputs to compute the theoretical forward price on an investment asset with continuous income (e.g., stock index with dividend yield).'
      },
      {
        type: 'optionCalculator',
        heading: 'Option Intrinsic Value Trainer',
        content:
          'Toggle spot and strike prices to visualize intrinsic values for calls and puts. Time value is highlighted to cement intuition.'
      }
    ]
  },
  {
    id: 'payoffs',
    title: 'Payoff Lab',
    intro: 'Compare payoffs for key strategies. Choose a profile and watch the diagram morph.',
    blocks: [
      {
        type: 'payoffChart',
        heading: 'Options Strategy Visualizer',
        content:
          'Select a strategy to see profit diagrams at expiration. Track how breakeven points change and which payoffs have limited vs. unlimited potential.'
      }
    ]
  },
  {
    id: 'risk',
    title: 'Risk Management & Exam Insights',
    intro: 'Digest the qualitative angles: how derivatives transform risk and how the CFA exam frames common traps.',
    blocks: [
      {
        heading: 'Risk Transfer & Hedging',
        content:
          'Derivatives allow separating ownership from risk exposure. Examples: duration matching with interest rate swaps, beta adjustment via equity index futures, and protective puts for portfolio insurance.'
      },
      {
        heading: 'Counterparty & Liquidity Risk',
        content:
          'OTC derivatives introduce credit risk, mitigated by collateral and netting agreements. Futures manage liquidity via standardization but expose users to margin calls.'
      },
      {
        heading: 'Exam Watch-outs',
        content:
          'Read question stems carefully for long vs. short orientation, identify payoff at expiration vs. profit, and remember cash vs. price-settled distinctions.'
      }
    ]
  },
  {
    id: 'flashcards',
    title: 'Tap-to-Reveal Flashcards',
    intro: 'Flip each flashcard to test yourself on vocabulary, valuation logic, and risk management applications.',
    blocks: [
      {
        type: 'flashcards',
        heading: 'Tap-to-Reveal Flashcards',
        content: 'Flip each flashcard to test yourself on vocabulary, valuation logic, and risk management applications.',
        items: [
          {
            front: 'Define basis risk',
            back: 'Risk that the spot price and futures price do not move in lockstep, causing an imperfect hedge.'
          },
          {
            front: 'Mark-to-market',
            back: 'Daily settlement of futures gains/losses through margin accounts overseen by the clearinghouse.'
          },
          {
            front: 'Protective put',
            back: 'Long stock + long put; establishes a portfolio floor while keeping upside potential.'
          },
          {
            front: 'Swap fixed rate',
            back: 'Chosen such that PV(fixed leg) = PV(floating leg) at initiation, typically derived from forward rates.'
          },
          {
            front: 'Intrinsic value',
            back: 'Immediate exercise value: max(0, S − K) for calls, max(0, K − S) for puts.'
          }
        ]
      }
    ]
  },
  {
    id: 'quiz',
    title: 'Exam Drill Mini-Quiz',
    intro: 'Answer quick questions to cement memory. Feedback explains the logic so you remember the rationale, not just the answer.',
    blocks: [
      {
        type: 'quiz',
        heading: 'Exam Drill Mini-Quiz',
        content: 'Answer quick questions to cement memory. Feedback explains the logic so you remember the rationale, not just the answer.',
        questions: [
          {
            prompt: 'At initiation, the value of a properly priced forward contract to both counterparties is...',
            options: [
              {
                text: 'Positive to the long, negative to the short',
                correct: false,
                feedback: 'No: arbitrage prevents one side from starting with value.'
              },
              {
                text: 'Zero',
                correct: true,
                feedback: 'Correct! Forwards are priced so PV of long and short positions offset at inception.'
              },
              {
                text: 'Equal to the spot price',
                correct: false,
                feedback: 'Spot price is part of the pricing, but contract value begins at zero.'
              }
            ]
          },
          {
            prompt: 'A long call combined with a short put (same strike and maturity) replicates...',
            options: [
              {
                text: 'A long forward contract',
                correct: true,
                feedback: 'Yes! Put-call parity rearrangement yields synthetic forwards.'
              },
              {
                text: 'A covered call',
                correct: false,
                feedback: 'Covered calls combine long stock and short call.'
              },
              {
                text: 'A straddle',
                correct: false,
                feedback: 'Straddles are long call + long put.'
              }
            ]
          },
          {
            prompt: 'The primary reason futures reduce counterparty risk compared to forwards is...',
            options: [
              {
                text: 'They are standardized',
                correct: false,
                feedback: 'Standardization aids liquidity but does not eliminate credit risk.'
              },
              {
                text: 'They settle through a clearinghouse with margining',
                correct: true,
                feedback: 'Right! Daily settlement and clearinghouse guarantees curb default risk.'
              },
              {
                text: 'They always require physical delivery',
                correct: false,
                feedback: 'Many futures are cash-settled.'
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'glossary',
    title: 'Formulas & Quick Reference',
    intro: 'Use this expandable list for rapid revision. Each item highlights a high-yield relationship tested on the CFA exam.',
    blocks: [
      {
        type: 'details',
        heading: 'Formulas & Quick Reference',
        content: 'Use this expandable list for rapid revision. Each item highlights a high-yield relationship tested on the CFA exam.',
        items: [
          {
            summary: 'Forward Price (Investment Asset with Income)',
            body:
              '<div class="derivatives__formula">F_0 = S_0 e^{(r - q)T}</div><p>Where r is the risk-free rate, q is the continuous income (dividend yield), and T is time to maturity in years.</p>'
          },
          {
            summary: 'Forward Price (Commodity with Storage)',
            body:
              '<div class="derivatives__formula">F_0 = (S_0 + PV_{storage} - PV_{convenience})e^{rT}</div><p>Convenience yield lowers the fair forward price because it reflects the non-monetary benefits of holding the physical commodity.</p>'
          },
          {
            summary: 'Put-Call Parity',
            body: '<div class="derivatives__formula">C_0 + PV(K) = P_0 + S_0</div><p>Can be rearranged to build synthetic positions and detect mispricing.</p>'
          },
          {
            summary: 'Option Breakeven',
            body:
              '<div class="derivatives__formula">\\text{Call BE} = K + \\text{Premium}</div><div class="derivatives__formula">\\text{Put BE} = K - \\text{Premium}</div>'
          },
          {
            summary: 'Swap Valuation',
            body:
              '<p>At initiation: PV(fixed leg) = PV(floating leg). Fixed rate = par swap rate derived from zero-coupon curve.</p><p>After initiation, value equals PV(received leg) - PV(paid leg).</p>'
          }
        ]
      }
    ]
  }
];

type ForwardInputs = {
  spot: number;
  rate: number;
  yield: number;
  time: number;
};

const ForwardCalculator: React.FC<{ heading: string; content: string }> = ({ heading, content }) => {
  const [inputs, setInputs] = useState<ForwardInputs>({ spot: 100, rate: 5, yield: 2, time: 1 });

  const forwardPrice = useMemo(() => {
    const rate = inputs.rate / 100;
    const yieldRate = inputs.yield / 100;
    const value = inputs.spot * Math.exp((rate - yieldRate) * Math.max(inputs.time, 0));
    return Number.isFinite(value) ? value : 0;
  }, [inputs]);

  const updateInput = (key: keyof ForwardInputs) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputs((prev) => ({ ...prev, [key]: Number(event.target.value) }));
  };

  return (
    <div className="derivatives-card">
      <div>
        <span className="tag">No-Arbitrage</span>
        <h3>{heading}</h3>
        <p>{content}</p>
      </div>
      <label>
        Spot Price (S₀)
        <input type="number" value={inputs.spot} min={0} step={0.5} onChange={updateInput('spot')} />
      </label>
      <label>
        Risk-free Rate (r, %)
        <input type="number" value={inputs.rate} step={0.1} onChange={updateInput('rate')} />
      </label>
      <label>
        Dividend Yield (q, %)
        <input type="number" value={inputs.yield} step={0.1} onChange={updateInput('yield')} />
      </label>
      <label>
        Time to Maturity (T, years)
        <input type="number" value={inputs.time} min={0} step={0.1} onChange={updateInput('time')} />
      </label>
      <div className="derivatives__formula">
        Forward Price = <strong>{forwardPrice.toFixed(2)}</strong>
      </div>
    </div>
  );
};

type OptionInputs = {
  spot: number;
  strike: number;
};

const OptionCalculator: React.FC<{ heading: string; content: string }> = ({ heading, content }) => {
  const [inputs, setInputs] = useState<OptionInputs>({ spot: 100, strike: 105 });

  const { callIntrinsic, putIntrinsic, insight } = useMemo(() => {
    const call = Math.max(0, inputs.spot - inputs.strike);
    const put = Math.max(0, inputs.strike - inputs.spot);
    const message = call === 0 && put === 0
      ? 'Both options are out-of-the-money: only time value remains.'
      : call > 0
      ? 'Call is in-the-money; intrinsic value equals S - K.'
      : 'Put is in-the-money; intrinsic value equals K - S.';
    return { callIntrinsic: call, putIntrinsic: put, insight: message };
  }, [inputs]);

  const updateInput = (key: keyof OptionInputs) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputs((prev) => ({ ...prev, [key]: Number(event.target.value) }));
  };

  return (
    <div className="derivatives-card">
      <div>
        <span className="tag">Intrinsic Insight</span>
        <h3>{heading}</h3>
        <p>{content}</p>
      </div>
      <label>
        Spot Price (S)
        <input type="number" value={inputs.spot} step={1} onChange={updateInput('spot')} />
      </label>
      <label>
        Strike Price (K)
        <input type="number" value={inputs.strike} step={1} onChange={updateInput('strike')} />
      </label>
      <div>
        <p>
          Call: <strong>{callIntrinsic.toFixed(2)}</strong>
        </p>
        <p>
          Put: <strong>{putIntrinsic.toFixed(2)}</strong>
        </p>
        <p>Time Value Insight: {insight}</p>
      </div>
    </div>
  );
};

type Strategy = 'longCall' | 'shortCall' | 'longPut' | 'shortPut' | 'coveredCall' | 'protectivePut' | 'straddle' | 'strangle';

type PayoffInputs = {
  strategy: Strategy;
  strike: number;
  premiumCall: number;
  premiumPut: number;
};

const strategies: { value: Strategy; label: string }[] = [
  { value: 'longCall', label: 'Long Call' },
  { value: 'shortCall', label: 'Short Call' },
  { value: 'longPut', label: 'Long Put' },
  { value: 'shortPut', label: 'Short Put' },
  { value: 'coveredCall', label: 'Covered Call' },
  { value: 'protectivePut', label: 'Protective Put' },
  { value: 'straddle', label: 'Long Straddle' },
  { value: 'strangle', label: 'Long Strangle' }
];

const PayoffChart: React.FC<{ heading: string; content: string }> = ({ heading, content }) => {
  const [inputs, setInputs] = useState<PayoffInputs>({ strategy: 'longCall', strike: 100, premiumCall: 6, premiumPut: 4 });
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const payoff = useCallback(
    (strategy: Strategy, S: number, K: number, premiumCall: number, premiumPut: number) => {
      switch (strategy) {
        case 'longCall':
          return { payoff: Math.max(0, S - K), profit: Math.max(0, S - K) - premiumCall };
        case 'shortCall':
          return { payoff: -Math.max(0, S - K), profit: premiumCall - Math.max(0, S - K) };
        case 'longPut':
          return { payoff: Math.max(0, K - S), profit: Math.max(0, K - S) - premiumPut };
        case 'shortPut':
          return { payoff: -Math.max(0, K - S), profit: premiumPut - Math.max(0, K - S) };
        case 'coveredCall':
          return { payoff: Math.min(S - K, 0) + (S - K), profit: Math.min(S - K, 0) + (S - K) + premiumCall };
        case 'protectivePut':
          return { payoff: Math.max(S - K, 0) + Math.max(0, K - S), profit: Math.max(S - K, 0) + Math.max(0, K - S) - premiumPut };
        case 'straddle': {
          const call = Math.max(0, S - K);
          const put = Math.max(0, K - S);
          return { payoff: call + put, profit: call + put - (premiumCall + premiumPut) };
        }
        case 'strangle': {
          const callStrike = K * 1.1;
          const call = Math.max(0, S - callStrike);
          const put = Math.max(0, K - S);
          return { payoff: call + put, profit: call + put - (premiumCall + premiumPut) };
        }
        default:
          return { payoff: 0, profit: 0 };
      }
    },
    []
  );

  const drawChart = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext('2d');
    if (!context) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    context.setTransform(dpr, 0, 0, dpr, 0, 0);

    const width = rect.width;
    const height = rect.height;
    context.clearRect(0, 0, width, height);

    const { strategy, strike: K, premiumCall, premiumPut } = inputs;
    const maxS = K * 2;
    const minS = Math.max(0, K * 0.2);
    const steps = 100;

    const xs: number[] = [];
    const payoffs: number[] = [];
    const profits: number[] = [];

    for (let i = 0; i <= steps; i += 1) {
      const S = minS + ((maxS - minS) * i) / steps;
      const { payoff: payoffVal, profit: profitVal } = payoff(strategy, S, K, premiumCall, premiumPut);
      xs.push(S);
      payoffs.push(payoffVal);
      profits.push(profitVal);
    }

    const allY = [...payoffs, ...profits];
    const minY = Math.min(...allY);
    const maxY = Math.max(...allY);

    const mapX = (S: number) => ((S - minS) / (maxS - minS)) * width;
    const mapY = (val: number) => {
      const padding = 20;
      const scale = maxY - minY === 0 ? 1 : maxY - minY;
      return height - padding - ((val - minY) / scale) * (height - padding * 2);
    };

    context.strokeStyle = 'rgba(255, 255, 255, 0.4)';
    context.lineWidth = 1;
    context.beginPath();
    context.moveTo(0, mapY(0));
    context.lineTo(width, mapY(0));
    context.stroke();

    context.beginPath();
    context.moveTo(mapX(K), 0);
    context.lineTo(mapX(K), height);
    context.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    context.stroke();

    context.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue('--info');
    context.lineWidth = 2;
    context.beginPath();
    payoffs.forEach((value, idx) => {
      const x = mapX(xs[idx]);
      const y = mapY(value);
      if (idx === 0) context.moveTo(x, y);
      else context.lineTo(x, y);
    });
    context.stroke();

    context.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue('--accent');
    context.beginPath();
    profits.forEach((value, idx) => {
      const x = mapX(xs[idx]);
      const y = mapY(value);
      if (idx === 0) context.moveTo(x, y);
      else context.lineTo(x, y);
    });
    context.stroke();
  }, [inputs, payoff]);

  useEffect(() => {
    drawChart();
  }, [drawChart]);

  useEffect(() => {
    const handleResize = () => drawChart();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [drawChart]);

  const updateInput = (key: keyof PayoffInputs) => (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const value = key === 'strategy' ? (event.target.value as Strategy) : Number(event.target.value);
    setInputs((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="derivatives-card">
      <div>
        <span className="tag">Visual Intuition</span>
        <h3>{heading}</h3>
        <p>{content}</p>
      </div>
      <div className="derivatives__grid derivatives__grid--auto">
        <label>
          Strategy
          <select value={inputs.strategy} onChange={updateInput('strategy')}>
            {strategies.map((strategy) => (
              <option key={strategy.value} value={strategy.value}>
                {strategy.label}
              </option>
            ))}
          </select>
        </label>
        <label>
          Strike (K)
          <input type="number" value={inputs.strike} step={1} onChange={updateInput('strike')} />
        </label>
        <label>
          Premium (Call)
          <input type="number" value={inputs.premiumCall} step={0.5} onChange={updateInput('premiumCall')} />
        </label>
        <label>
          Premium (Put)
          <input type="number" value={inputs.premiumPut} step={0.5} onChange={updateInput('premiumPut')} />
        </label>
      </div>
      <canvas ref={canvasRef} className="derivatives__payoff-canvas" />
      <div className="derivatives__legend">
        <span>
          <i style={{ background: 'var(--accent)' }} /> Profit
        </span>
        <span>
          <i style={{ background: 'var(--info)' }} /> Payoff
        </span>
      </div>
    </div>
  );
};

const Flashcards: React.FC<{ items: FlashcardItem[] }> = ({ items }) => {
  const [flipped, setFlipped] = useState<Record<number, boolean>>({});

  const toggle = (index: number) => {
    setFlipped((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  return (
    <div className="derivatives__flashcards">
      {items.map((item, index) => {
        const isFlipped = flipped[index];
        return (
          <div
            key={item.front}
            className={`derivatives__flashcard${isFlipped ? ' is-flipped' : ''}`}
            onClick={() => toggle(index)}
            role="button"
            tabIndex={0}
            onKeyDown={(event) => {
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                toggle(index);
              }
            }}
          >
            <div className="derivatives__flashcard-inner">
              <div className="derivatives__flashcard-face">{item.front}</div>
              <div className="derivatives__flashcard-face derivatives__flashcard-face--back">{item.back}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

type QuizState = {
  [questionIndex: number]: {
    selected?: number;
  };
};

const Quiz: React.FC<{ heading: string; content: string; questions: QuizQuestion[] }> = ({ heading, content, questions }) => {
  const [state, setState] = useState<QuizState>({});

  const handleSelection = (questionIndex: number, optionIndex: number) => {
    setState((prev) => ({
      ...prev,
      [questionIndex]: { selected: optionIndex }
    }));
  };

  return (
    <div className="derivatives-card">
      <span className="tag">Self-Test</span>
      <h3>{heading}</h3>
      <p>{content}</p>
      <div className="derivatives__grid">
        {questions.map((question, qIndex) => {
          const selected = state[qIndex]?.selected;
          return (
            <div key={question.prompt} className="derivatives__quiz-question">
              <p>
                <strong>Q{qIndex + 1}.</strong> {question.prompt}
              </p>
              {question.options.map((option, oIndex) => {
                const isSelected = selected === oIndex;
                const statusClass = isSelected ? (option.correct ? 'correct' : 'wrong') : '';
                return (
                  <button
                    key={option.text}
                    type="button"
                    className={statusClass}
                    onClick={() => handleSelection(qIndex, oIndex)}
                  >
                    {option.text}
                  </button>
                );
              })}
              {selected !== undefined && (
                <p style={{ fontStyle: 'italic', color: '#caf0f8' }}>{question.options[selected].feedback}</p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

const DetailsList: React.FC<{ heading: string; content: string; items: DetailsItem[] }> = ({ heading, content, items }) => (
  <div className="derivatives-card">
    <span className="tag">Quick Reference</span>
    <h3>{heading}</h3>
    <p>{content}</p>
    {items.map((item) => (
      <details key={item.summary} className="derivatives__details">
        <summary>{item.summary}</summary>
        <div className="derivatives__details-body" dangerouslySetInnerHTML={{ __html: item.body }} />
      </details>
    ))}
  </div>
);

const renderBlock = (block: Block): React.ReactNode => {
  if ('type' in block) {
    switch (block.type) {
      case 'forwardCalculator':
        return <ForwardCalculator heading={block.heading} content={block.content} />;
      case 'optionCalculator':
        return <OptionCalculator heading={block.heading} content={block.content} />;
      case 'payoffChart':
        return <PayoffChart heading={block.heading} content={block.content} />;
      case 'flashcards':
        return (
          <div className="derivatives-card">
            <span className="tag">Active Recall</span>
            <h3>{block.heading}</h3>
            <p>{block.content}</p>
            <Flashcards items={block.items} />
          </div>
        );
      case 'quiz':
        return <Quiz heading={block.heading} content={block.content} questions={block.questions} />;
      case 'details':
        return <DetailsList heading={block.heading} content={block.content} items={block.items} />;
      default:
        return null;
    }
  }

  const basicBlock = block as BasicBlock;
  return (
    <div className="derivatives-card">
      {basicBlock.tag && <span className="tag">{basicBlock.tag}</span>}
      <h3>{basicBlock.heading}</h3>
      <p>{basicBlock.content}</p>
    </div>
  );
};

const DerivativesModule: React.FC = () => {
  return (
    <div className="derivatives" role="region" aria-label="Derivatives mastery lab">
      {sections.map((section) => (
        <section key={section.id} className="derivatives__section">
          <div className="derivatives-card derivatives__intro">
            <h2 className="derivatives__section-title">{section.title}</h2>
            <p>{section.intro}</p>
          </div>
          <div className={`derivatives__grid ${section.id === 'valuation' || section.id === 'instruments' ? 'derivatives__grid--auto' : ''}`}>
            {section.blocks.map((block, index) => (
              <React.Fragment key={`${section.id}-${index}`}>
                {renderBlock(block)}
              </React.Fragment>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
};

export default DerivativesModule;
