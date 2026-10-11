import { spec, type TestApi } from '@cxl/spec';
import { Radio, Form, Fieldset, Label, FormReset, Button, create } from './index.js';

export default spec('radio', a => {
	for (const native of [true, false]) {
		a.test(`isolates same-name groups in ${native ? 'native' : 'custom'} forms`, a => {
			const first = native ? document.createElement('form') : new Form();
			const second = native ? document.createElement('form') : new Form();
			const one = create(Radio, { name: 'choice', checked: true });
			const two = create(Radio, { name: 'choice', checked: true });
			first.append(one);
			second.append(two);
			a.dom.append(first, second);
			a.equal(one.checked, true);
			a.equal(two.checked, true);
		});
	}
	a.test('uses the nearest form across nested native and custom containers', a => {
		const outer = new Form();
		const first = document.createElement('form');
		const second = document.createElement('form');
		const one = create(Radio, { name: 'choice', checked: true });
		const two = create(Radio, { name: 'choice', checked: true });
		first.append(one);
		second.append(two);
		outer.append(first, second);
		a.dom.append(outer);
		a.equal(one.checked, true);
		a.equal(two.checked, true);
	});

	a.test('validates required against the group selection', a => {
		const form = document.createElement('form');
		const one = create(Radio, { name: 'choice', rules: 'required' });
		const two = create(Radio, { name: 'choice', value: 'two' });
		form.append(one, two);
		a.dom.append(form);
		a.equal(one.invalid, true);
		two.checked = true;
		a.equal(one.invalid, false);
		a.equal(form.checkValidity(), true);
	});
	a.test('submits the selected custom-form value regardless of element order', a => {
		const form = new Form();
		form.append(
			create(Radio, { name: 'choice', value: 'one', checked: true }),
			create(Radio, { name: 'choice', value: 'two' }),
		);
		a.dom.append(form);
		a.equal(form.getFormData().choice, 'one');
	});

	a.test('leaves unrelated groups and custom validity unchanged', a => {
		const first = document.createElement('form');
		const second = document.createElement('form');
		const one = create(Radio, { name: 'choice', checked: true, rules: 'required' });
		const two = create(Radio, { name: 'choice' });
		first.append(one);
		second.append(two);
		a.dom.append(first, second);
		one.setCustomValidity('Unavailable');
		const observer = new MutationObserver(() => undefined);
		observer.observe(one, { attributes: true });
		two.click();
		a.equal(observer.takeRecords().length, 0, 'unrelated attribute writes');
		observer.disconnect();
		a.equal(one.validationMessage, 'Unavailable');
	});

	a.test('omits disabled radios from custom-form submission and validation', a => {
		const form = new Form();
		const radio = create(Radio, { name: 'choice', disabled: true, checked: true });
		const required = create(Radio, { name: 'empty', disabled: true, rules: 'required' });
		form.append(radio, required);
		a.dom.append(form);
		a.equal(form.getFormData().choice, undefined);
		a.equal(form.checkValidity(), true);
		let submits = 0;
		form.addEventListener('submit', () => submits++);
		form.submit();
		a.equal(submits, 1);
		required.disabled = false;
		a.equal(form.checkValidity(), false);
		form.submit();
		a.equal(submits, 1);
		required.click();
		a.equal(form.checkValidity(), true);
		form.submit();
		a.equal(submits, 2);
	});

	a.test('keeps unchecked custom-form names that match object properties', a => {
		const form = new Form();
		form.append(create(Radio, { name: 'toString' }));
		a.dom.append(form);
		a.equal(Object.hasOwn(form.getFormData(), 'toString'), true);
		a.equal(form.getFormData().toString, undefined);
	});

	a.test('selects one named radio and leaves unnamed radios independent', a => {
		const one = create(Radio, { name: 'choice', checked: true });
		const two = create(Radio, { name: 'choice' });
		const unnamed = create(Radio, { checked: true });
		const other = create(Radio, { checked: true });
		a.dom.append(one, two, unnamed, other);
		let changes = 0;
		two.addEventListener('change', () => changes++);
		two.click();
		two.click();
		a.equal(changes, 1);
		a.equal(one.checked, false);
		a.equal(two.checked, true);
		a.equal(two.ariaChecked, 'true');
		a.equal(two.hasAttribute('checked'), true);
		a.equal(one.hasAttribute('checked'), false);
		a.equal(two.touched, true);
		a.equal(one.tabIndex, -1);
		a.equal(two.tabIndex, 0);
		a.equal(unnamed.checked, true);
		a.equal(other.checked, true);
	});

	a.test('isolates document and shadow-root groups', a => {
		const one = create(Radio, { name: 'choice', checked: true });
		const wrapper = document.createElement('div');
		const shadow = wrapper.attachShadow({ mode: 'open' });
		const two = create(Radio, { name: 'choice', checked: true });
		shadow.append(two);
		a.dom.append(one, wrapper);
		a.equal(one.checked, true);
		a.equal(two.checked, true);
	});

	a.test('follows name changes, reparenting, removal and reconnection', a => {
		const first = document.createElement('form');
		const second = document.createElement('form');
		const one = create(Radio, { name: 'choice', checked: true, rules: 'required' });
		const two = create(Radio, { name: 'other', checked: true });
		first.append(one, two);
		a.dom.append(first, second);
		two.name = 'choice';
		a.equal(one.checked, false);
		a.equal(one.invalid, false);
		second.append(two);
		a.equal(one.invalid, true);
		one.checked = true;
		a.equal(two.checked, true);
		first.append(two);
		a.equal(one.checked, false);
		two.remove();
		a.equal(one.invalid, true);
		a.equal(one.tabIndex, 0);
		first.append(two);
		a.equal(one.invalid, false);
		let changes = 0;
		one.addEventListener('change', () => changes++);
		one.click();
		a.equal(changes, 1);
		a.equal(two.checked, false);
	});

	a.testElement('supports keyboard activation and ignores unrelated keys', async a => {
		a.dom.style.cssText = 'position:fixed;top:100px;right:0;z-index:1';
		const radio = create(Radio, undefined, 'Option');
		a.dom.append(radio);
		let changes = 0;
		radio.addEventListener('change', () => changes++);
		await a.action({ type: 'press', element: radio, value: 'Escape' });
		a.equal(radio.checked, false);
		await a.action({ type: 'press', element: radio, value: 'Space' });
		await a.action({ type: 'press', element: radio, value: 'Enter' });
		a.equal(radio.checked, true);
		a.equal(changes, 1);
	});

	for (const native of [true, false]) {
		a.testElement(`submits and resets ${native ? 'native' : 'custom'} forms`, async a => {
			a.dom.style.cssText = 'position:fixed;top:200px;right:0;z-index:1';
			const form = native ? document.createElement('form') : new Form();
			const one = create(Radio, { name: 'choice', value: 'one', checked: true }, 'One');
			const two = create(Radio, { name: 'choice', value: 'two' }, 'Two');
			const reset = new FormReset();
			const button = create(Button, undefined, 'Reset');
			reset.append(button);
			form.append(one, two, reset);
			a.dom.append(form);
			await a.action({ type: 'click', element: two });
			two.value = 'changed';
			const read = () => form instanceof Form ? form.getFormData().choice : new FormData(form).get('choice');
			a.equal(read(), 'changed');
			await a.action({ type: 'click', element: button });
			a.equal(read(), 'one');
			a.equal(one.checked, true);
			a.equal(two.checked, false);
			a.equal(one.touched, false);
			a.equal(two.touched, false);
			form.remove();
			a.dom.append(form);
			await a.action({ type: 'click', element: two });
			await a.action({ type: 'click', element: button });
			a.equal(one.checked, true);
		});
	}

	a.test('tracks native form ownership changes through the form attribute', a => {
		const first = document.createElement('form');
		const second = document.createElement('form');
		first.id = `first-${a.id}`;
		second.id = `second-${a.id}`;
		const one = create(Radio, { name: 'choice', checked: true });
		const two = create(Radio, { name: 'choice', checked: true });
		one.setAttribute('form', first.id);
		two.setAttribute('form', second.id);
		a.dom.append(first, second, one, two);
		a.equal(one.checked, true);
		a.equal(two.checked, true);
		two.setAttribute('form', first.id);
		a.equal(one.checked, false);
		a.equal(new FormData(first).get('choice'), 'on');
	});

	a.test('honors native fieldset disabling and external labels', a => {
		const form = document.createElement('form');
		const fieldset = document.createElement('fieldset');
		const radio = create(Radio, { name: 'choice' });
		radio.id = `radio-${a.id}`;
		const label = document.createElement('label');
		label.htmlFor = radio.id;
		label.textContent = 'Choice';
		fieldset.append(radio);
		form.append(label, fieldset);
		a.dom.append(form);
		a.equal(radio.labels[0], label);
		label.click();
		a.equal(radio.checked, true);
		fieldset.disabled = true;
		a.equal(radio.ariaDisabled, 'true');
		a.equal(radio.tabIndex, -1);
		radio.checked = false;
		radio.click();
		a.equal(radio.checked, false);
		a.equal(new FormData(form).get('choice'), null);
		fieldset.disabled = false;
		a.equal(radio.ariaDisabled, null);
		radio.click();
		a.equal(radio.checked, true);
	});

	a.test('labels fieldset groups and supports vertical layout', async (a: TestApi) => {
		const fieldset = a.element(Fieldset);
		const labelSlot = fieldset.shadowRoot?.querySelector('slot[name=label]');
		const bodySlot = fieldset.shadowRoot?.querySelector('#bodyslot');
		a.assert(labelSlot);
		a.assert(bodySlot);
		const label = create(Label, undefined, 'Choose an option');
		const radio = create(Radio, { name: 'choice' }, 'Option');
		await a.waitForEvent(labelSlot, 'slotchange', () => fieldset.append(label, radio));
		a.equal(fieldset.getAttribute('role'), 'group');
		a.equal(fieldset.getAttribute('aria-labelledby'), label.id);
		a.equal(getComputedStyle(bodySlot).flexDirection, 'row');
		fieldset.vflex = true;
		a.equal(getComputedStyle(bodySlot).flexDirection, 'column');
		await a.a11y(fieldset);
		await a.waitForEvent(labelSlot, 'slotchange', () => label.remove());
		a.equal(fieldset.getAttribute('aria-labelledby'), null);
	});

	a.test('wraps horizontal fieldsets at narrow widths', a => {
		const fieldset = new Fieldset();
		fieldset.style.width = '160px';
		const one = create(Radio, { name: 'narrow' }, 'First option');
		const two = create(Radio, { name: 'narrow' }, 'Second option');
		fieldset.append(one, two);
		a.dom.append(fieldset);
		a.ok(two.getBoundingClientRect().top > one.getBoundingClientRect().top);
		a.ok(fieldset.scrollWidth <= fieldset.clientWidth);
	});

	a.testElement('uses arrow keys in document order, wraps and skips disabled radios', async a => {
		a.dom.style.cssText = 'position:fixed;top:300px;right:0;z-index:1';
		const one = create(Radio, { name: `navigation-${a.id}`, checked: true }, 'One');
		const disabled = create(Radio, { name: `navigation-${a.id}`, disabled: true }, 'Disabled');
		const two = create(Radio, { name: `navigation-${a.id}` }, 'Two');
		a.dom.append(one, disabled, two);
		a.equal(disabled.disabled, true, 'initial disabled state');
		one.focus();
		for (const [source, target, key] of [
			[one, two, 'ArrowRight'], [two, one, 'ArrowDown'],
			[one, two, 'ArrowLeft'], [two, one, 'ArrowUp'],
		] as const) {
			await a.action({ type: 'press', element: source, value: key });
			a.equal(target.checked, true);
			a.equal(document.activeElement, target);
		}
		disabled.click();
		disabled.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }));
		a.equal(disabled.checked, false);
		a.equal(disabled.tabIndex, -1);
		one.disabled = true;
		a.equal(two.tabIndex, 0);
		await a.action({ type: 'press', element: two, value: 'ArrowRight' });
		a.equal(two.checked, true);
	});

});
