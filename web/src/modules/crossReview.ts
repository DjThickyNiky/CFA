import type { FormulaSummary, TopicModule } from '../data/types';
import { createElement, createSection } from './ui';

interface ReviewState {
  due: number;
  interval: number;
}

const STORAGE_KEY = 'cfa-spaced-repetition';

function loadState(): Record<string, ReviewState> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as Record<string, ReviewState>;
  } catch (error) {
    console.warn('Unable to load spaced repetition state', error);
    return {};
  }
}

function saveState(state: Record<string, ReviewState>): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.warn('Unable to persist spaced repetition state', error);
  }
}

export function renderCrossTopicReview(topics: TopicModule[]): HTMLElement {
  const container = createElement('div', { className: 'main-content' });
  container.appendChild(renderMixedQuiz(topics));
  container.appendChild(renderFormulaSheet(topics));
  container.appendChild(renderSpacedQueue(topics));
  return container;
}

function renderMixedQuiz(topics: TopicModule[]): HTMLElement {
  const allFlashcards = topics.flatMap((topic) =>
    topic.flashcards.map((card) => ({ ...card, topic: topic.name })),
  );
  const section = createSection('Cross-Topic Mixed Quiz');
  const quizWrapper = createElement('div', { className: 'section mixed-quiz' });

  const prompt = createElement('h3');
  const topicTag = createElement('span', { className: 'tag' });
  const optionsContainer = createElement('div', { className: 'quiz-options' });
  const feedback = createElement('div', { className: 'quiz-feedback' });
  const nextButton = createElement('button', { className: 'primary', textContent: 'Next Question' });

  let currentAnswer = '';

  function buildQuestion(): void {
    const shuffled = [...allFlashcards].sort(() => Math.random() - 0.5);
    const current = shuffled[0];
    const distractors = shuffled.slice(1, 4).filter(Boolean);
    const choices = [current, ...distractors].sort(() => Math.random() - 0.5);
    currentAnswer = current.answer;
    prompt.textContent = current.prompt;
    topicTag.textContent = current.topic;
    optionsContainer.innerHTML = '';
    feedback.textContent = '';

    choices.forEach((choice) => {
      const option = createElement('button', { textContent: choice.answer });
      option.addEventListener('click', () => {
        if (choice.answer === currentAnswer) {
          feedback.textContent = 'Correct! Reinforce the rationale in your own words.';
        } else {
          feedback.textContent = `Not quite. Correct answer: ${currentAnswer}`;
        }
      });
      optionsContainer.appendChild(option);
    });
  }

  nextButton.addEventListener('click', () => buildQuestion());

  quizWrapper.append(topicTag, prompt, optionsContainer, feedback, nextButton);
  section.appendChild(quizWrapper);
  buildQuestion();
  return section;
}

function renderFormulaSheet(topics: TopicModule[]): HTMLElement {
  const section = createSection('Global Formula Sheet');
  const grid = createElement('div', { className: 'grid two' });

  const allFormulas: Array<FormulaSummary & { topic: string }> = topics.flatMap((topic) =>
    topic.formulas.map((formula) => ({ ...formula, topic: topic.name })),
  );

  allFormulas.forEach((formula) => {
    const card = createElement('div', { className: 'card' });
    const header = createElement('h3', { textContent: `${formula.name} (${formula.topic})` });
    const expression = createElement('p');
    expression.innerHTML = `<code>${formula.expression}</code>`;
    const context = createElement('p', { textContent: formula.context });
    card.append(header, expression, context);
    grid.appendChild(card);
  });

  section.appendChild(grid);
  return section;
}

function renderSpacedQueue(topics: TopicModule[]): HTMLElement {
  const section = createSection('Spaced-Repetition Queue');
  const state = loadState();
  const cards = topics.flatMap((topic) =>
    topic.flashcards.map((card) => ({ ...card, topic: topic.name })),
  );

  const queue = () => {
    const now = Date.now();
    return cards
      .map((card) => {
        const key = `${card.topic}:${card.prompt}`;
        const review = state[key] || { due: now, interval: 1 }; // 1 day default
        return { card, key, review };
      })
      .sort((a, b) => a.review.due - b.review.due);
  };

  const queueCard = createElement('div', { className: 'card queue-card' });
  const controls = createElement('div', { className: 'queue-controls' });
  const stats = createElement('p');

  function renderNext(): void {
    const items = queue();
    const now = Date.now();
    const dueNow = items.filter((item) => item.review.due <= now);
    const next = dueNow[0] || items[0];
    if (!next) {
      queueCard.textContent = 'No flashcards available.';
      controls.innerHTML = '';
      stats.textContent = '';
      return;
    }
    queueCard.innerHTML = '';
    const tag = createElement('span', { className: 'tag', textContent: next.card.topic });
    const prompt = createElement('h3', { textContent: next.card.prompt });
    const answer = createElement('p', { textContent: next.card.answer });
    answer.style.display = 'none';
    const reveal = createElement('button', { className: 'primary', textContent: 'Show Answer' });
    reveal.addEventListener('click', () => {
      answer.style.display = answer.style.display === 'none' ? 'block' : 'none';
    });

    queueCard.append(tag, prompt, reveal, answer);

    controls.innerHTML = '';
    const again = createElement('button', { textContent: 'Again (1 day)' });
    const good = createElement('button', { textContent: 'Good (+2 days)' });
    const easy = createElement('button', { textContent: 'Easy (+5 days)' });

    again.addEventListener('click', () => updateReview(next.key, 1));
    good.addEventListener('click', () => updateReview(next.key, next.review.interval + 2));
    easy.addEventListener('click', () => updateReview(next.key, next.review.interval + 5));

    controls.append(again, good, easy);

    const dueToday = items.filter((item) => item.review.due <= now).length;
    stats.textContent = `${dueToday} cards due now • Next review on ${new Date(next.review.due).toLocaleDateString()}`;
  }

  function updateReview(key: string, intervalDays: number): void {
    const nextDue = Date.now() + intervalDays * 24 * 60 * 60 * 1000;
    state[key] = { due: nextDue, interval: intervalDays };
    saveState(state);
    renderNext();
  }

  section.append(queueCard, controls, stats);
  renderNext();
  return section;
}
