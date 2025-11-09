import { topics } from './data';
import { renderTopic } from './modules/topicView';
import { renderCrossTopicReview } from './modules/crossReview';
import { createElement } from './modules/ui';

type View = {
  id: string;
  label: string;
  render: () => HTMLElement;
};

const app = document.getElementById('app');
if (!app) {
  throw new Error('App container not found');
}

const views: View[] = [
  ...topics.map((topic) => ({
    id: topic.id,
    label: topic.name,
    render: () => renderTopic(topic),
  })),
  {
    id: 'cross-review',
    label: 'Cross-Topic Review',
    render: () => renderCrossTopicReview(topics),
  },
];

const shell = createElement('div', { className: 'app-shell' });
const sidebar = createElement('aside', { className: 'sidebar' });
const title = createElement('h1', { textContent: 'CFA Level I Navigator' });
const nav = createElement('nav', { className: 'nav-links' });
const content = createElement('main');

sidebar.append(title, nav);
shell.append(sidebar, content);
app.appendChild(shell);

let activeButton: HTMLButtonElement | null = null;

function activateView(view: View): void {
  content.innerHTML = '';
  content.appendChild(view.render());
}

views.forEach((view, index) => {
  const button = createElement('button', { textContent: view.label }) as HTMLButtonElement;
  button.addEventListener('click', () => {
    if (activeButton) {
      activeButton.classList.remove('active');
    }
    button.classList.add('active');
    activeButton = button;
    activateView(view);
  });
  if (index === 0) {
    button.classList.add('active');
    activeButton = button;
    activateView(view);
  }
  nav.appendChild(button);
});
