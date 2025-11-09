import type { TopicModule } from '../data/types';
import { createElement, createSection } from './ui';
import { renderFlashcards } from './flashcards';
import { renderCalculators } from './calculators';
import { renderTimeline } from './timeline';

export function renderTopic(topic: TopicModule): HTMLElement {
  const container = createElement('div', { className: 'main-content' });

  const overview = createSection(`${topic.name} Overview`);
  const meta = createElement('p');
  meta.innerHTML = `<span class="tag">Source: ${topic.sourceVolume}</span>`;
  overview.appendChild(meta);

  const objectivesList = createElement('div', { className: 'grid' });
  topic.learningObjectives.forEach((objective) => {
    const card = createElement('div', { className: 'card' });
    const title = createElement('h3', { textContent: objective.title });
    const summary = createElement('p', { textContent: objective.summary });
    card.append(title, summary);
    objectivesList.appendChild(card);
  });
  overview.appendChild(objectivesList);
  container.appendChild(overview);

  const formulaSection = createSection('Key Formulas');
  const formulaGrid = createElement('div', { className: 'grid' });
  topic.formulas.forEach((formula) => {
    const card = createElement('div', { className: 'card' });
    const title = createElement('h3', { textContent: formula.name });
    const expression = createElement('p');
    expression.innerHTML = `<code>${formula.expression}</code>`;
    const context = createElement('p', { textContent: formula.context });
    card.append(title, expression, context);
    formulaGrid.appendChild(card);
  });
  formulaSection.appendChild(formulaGrid);
  container.appendChild(formulaSection);

  const tipsSection = createSection('Exam Tips');
  const tipsList = createElement('div', { className: 'grid' });
  topic.examTips.forEach((tip) => {
    const card = createElement('div', { className: 'card' });
    const focus = createElement('h3', { textContent: tip.focus });
    const guidance = createElement('p', { textContent: tip.guidance });
    card.append(focus, guidance);
    tipsList.appendChild(card);
  });
  tipsSection.appendChild(tipsList);
  container.appendChild(tipsSection);

  container.appendChild(renderFlashcards(topic.flashcards));

  const calculators = renderCalculators(topic.calculators);
  if (calculators) {
    container.appendChild(calculators);
  }

  const timeline = renderTimeline(topic.timeline);
  if (timeline) {
    container.appendChild(timeline);
  }

  return container;
}
