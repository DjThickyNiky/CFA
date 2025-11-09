import type { CalculatorDefinition } from '../data/types';
import { createElement } from './ui';

export function renderCalculators(calculators: CalculatorDefinition[]): HTMLElement | null {
  if (!calculators.length) {
    return null;
  }

  const section = createElement('section', { className: 'section' });
  const heading = createElement('h2');
  heading.textContent = 'Interactive Calculators';
  section.appendChild(heading);

  const grid = createElement('div', { className: 'grid two' });

  calculators.forEach((calc) => {
    const wrapper = createElement('div', { className: 'card calculator' });
    const title = createElement('h3', { textContent: calc.name });
    const description = createElement('p', { textContent: calc.description });
    const form = createElement('form');
    const result = createElement('div', { className: 'card' });
    result.textContent = 'Provide inputs to calculate.';

    calc.inputs.forEach((input) => {
      const label = createElement('label');
      label.htmlFor = input.id;
      label.textContent = input.label;

      let field: HTMLElement;
      if (input.type === 'select') {
        const select = createElement('select') as HTMLSelectElement;
        (input.options || []).forEach((option) => {
          const optionEl = createElement('option') as HTMLOptionElement;
          optionEl.value = option.value;
          optionEl.textContent = option.label;
          select.appendChild(optionEl);
        });
        field = select;
      } else {
        const inputEl = createElement('input') as HTMLInputElement;
        inputEl.type = 'number';
        if (input.step) inputEl.step = input.step;
        if (typeof input.min === 'number') inputEl.min = String(input.min);
        field = inputEl;
      }

      (field as HTMLInputElement | HTMLSelectElement).id = input.id;
      (field as HTMLInputElement | HTMLSelectElement).name = input.id;

      const fieldWrapper = createElement('div');
      fieldWrapper.append(label, field);
      form.appendChild(fieldWrapper);
    });

    const submit = createElement('button', { className: 'primary', textContent: 'Calculate' });
    submit.type = 'submit';
    form.appendChild(submit);

    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const formData = new FormData(form);
      const values: Record<string, number | string> = {};
      for (const [key, value] of formData.entries()) {
        values[key] = value as string;
      }
      const output = calc.compute(values);
      result.innerHTML = `<strong>${output.result}</strong>${
        output.breakdown ? `<br /><small>${output.breakdown}</small>` : ''
      }`;
    });

    wrapper.append(title, description, form, result);
    grid.appendChild(wrapper);
  });

  section.appendChild(grid);
  return section;
}
