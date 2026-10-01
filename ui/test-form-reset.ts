import { spec } from '@cxl/spec';
import { Button, Form, FormReset, InputText, create } from './index.js';

export default spec('form-reset', a => {
	a.test('registers a slotted display-contents wrapper', a => {
		const reset = a.element('c-form-reset');
		a.ok(reset instanceof FormReset);
		a.equal(getComputedStyle(reset).display, 'contents');
		a.ok(reset.shadowRoot?.querySelector('slot'));
	});

	for (const native of [true, false]) {
		a.test(
			`restores values and touched state in ${native ? 'native' : 'custom'} forms`,
			async a => {
				a.dom.style.cssText = `position:fixed;top:${native ? 0 : 200}px;right:0;z-index:1`;
				const form = native
					? document.createElement('form')
					: new Form();
				const input = create(InputText, {
					value: 'initial',
					name: 'text',
				});
				const empty = new InputText();
				const reset = new FormReset();
				const button = new Button();
				reset.append(button);
				form.append(input, empty, reset);
				a.dom.append(form);

				for (let i = 0; i < 2; i++) {
					input.value = 'changed';
					empty.value = 'changed';
					input.touched = empty.touched = true;
					await a.action({ type: 'click', element: button });
					a.equal(input.value, 'initial');
					a.equal(empty.value, '');
					a.equal(input.touched, false);
					a.equal(empty.touched, false);
				}
			},
		);
	}

	a.test('resets native controls and honors canceled reset events', a => {
		const form = document.createElement('form');
		const input = document.createElement('input');
		input.defaultValue = 'initial';
		const custom = create(InputText, { value: 'initial' });
		const reset = new FormReset();
		form.append(input, custom, reset);
		a.dom.append(form);
		input.value = custom.value = 'changed';
		custom.touched = true;
		let events = 0;
		form.addEventListener(
			'reset',
			ev => {
				events++;
				ev.preventDefault();
			},
			{ once: true },
		);
		reset.click();
		a.equal(events, 1);
		a.equal(input.value, 'changed');
		a.equal(custom.value, 'changed');
		a.equal(custom.touched, true);
		reset.click();
		a.equal(input.value, 'initial');
		a.equal(custom.value, 'initial');
		a.equal(custom.touched, false);
	});

	a.test('supports Enter and Space through a slotted button', async a => {
		a.dom.style.cssText = 'position:fixed;top:400px;right:0;z-index:1';
		const form = new Form();
		const input = create(InputText, { value: 'initial' });
		const reset = new FormReset();
		const button = new Button();
		button.textContent = 'Reset';
		reset.append(button);
		form.append(input, reset);
		a.dom.append(form);
		let submits = 0;
		form.addEventListener('submit', () => submits++);
		for (const key of ['Enter', 'Space']) {
			input.value = 'changed';
			input.touched = true;
			await a.action({ type: 'press', element: button, value: key });
			a.equal(input.value, 'initial');
			a.equal(input.touched, false);
		}
		a.equal(submits, 0);
	});

	a.test(
		'uses the nearest form and follows reparenting without duplicate handlers',
		a => {
			const outer = document.createElement('form');
			const inner = new Form();
			const input = create(InputText, { value: 'initial' });
			const reset = new FormReset();
			const container = document.createElement('div');
			container.append(reset);
			inner.append(input, container);
			outer.append(inner);
			a.dom.append(outer);
			let outerResets = 0;
			outer.addEventListener('reset', () => outerResets++);
			input.value = 'changed';
			reset.click();
			a.equal(input.value, 'initial');
			a.equal(outerResets, 0);
			input.value = 'changed';
			outer.append(container);
			reset.click();
			a.equal(outerResets, 1);
			a.equal(input.value, 'initial');
			container.remove();
			reset.click();
			a.equal(outerResets, 1);
			outer.append(container);
			reset.click();
			a.equal(outerResets, 2);
		},
	);

	a.test('allows activation outside a form', a => {
		const reset = a.element(FormReset);
		reset.click();
		const form = document.createElement('form');
		let events = 0;
		form.addEventListener('reset', () => events++);
		a.dom.append(form);
		form.append(reset);
		reset.click();
		a.equal(events, 1);
	});
});
