import type { TimelineEvent } from '../data/types';
import { createElement } from './ui';

export function renderTimeline(events: TimelineEvent[]): HTMLElement | null {
  if (!events.length) {
    return null;
  }

  const section = createElement('section', { className: 'section' });
  const heading = createElement('h2');
  heading.textContent = 'Learning Timeline';
  section.appendChild(heading);

  const timeline = createElement('div', { className: 'timeline' });
  events.forEach((event) => {
    const item = createElement('div', { className: 'timeline-item' });
    const label = createElement('h4', { textContent: event.label });
    const detail = createElement('p', { textContent: event.detail });
    if (event.emphasis) {
      const tag = createElement('span', { className: 'tag', textContent: event.emphasis.toUpperCase() });
      item.appendChild(tag);
    }
    item.append(label, detail);
    timeline.appendChild(item);
  });

  section.appendChild(timeline);
  return section;
}
