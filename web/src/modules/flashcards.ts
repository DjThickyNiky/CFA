import type { Flashcard } from '../data/types';
import { createElement } from './ui';

export function renderFlashcards(flashcards: Flashcard[]): HTMLElement {
  const section = createElement('section', { className: 'section' });
  const heading = createElement('h2');
  heading.textContent = 'Flashcards';
  section.appendChild(heading);

  const grid = createElement('div', { className: 'grid two' });
  flashcards.forEach((card, index) => {
    const cardEl = createElement('div', { className: 'flashcard' });
    cardEl.setAttribute('tabindex', '0');

    const front = createElement('div', { className: 'front' });
    front.innerHTML = `<strong>Prompt ${index + 1}:</strong><br />${card.prompt}`;
    const back = createElement('div', { className: 'back' });
    back.innerHTML = `<strong>Answer:</strong> ${card.answer}<br /><small class="tag">Source: ${card.source}</small>`;

    cardEl.append(front, back);
    cardEl.addEventListener('click', () => {
      cardEl.classList.toggle('show-answer');
    });
    cardEl.addEventListener('keypress', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        cardEl.classList.toggle('show-answer');
      }
    });

    grid.appendChild(cardEl);
  });

  section.appendChild(grid);
  return section;
}
