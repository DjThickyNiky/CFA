export function createElement<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  options: { className?: string; textContent?: string } = {},
): HTMLElementTagNameMap[K] {
  const el = document.createElement(tag);
  if (options.className) {
    el.className = options.className;
  }
  if (options.textContent) {
    el.textContent = options.textContent;
  }
  return el;
}

export function createSection(title: string): HTMLElement {
  const section = createElement('section', { className: 'section' });
  const heading = createElement('h2');
  heading.textContent = title;
  section.appendChild(heading);
  return section;
}
