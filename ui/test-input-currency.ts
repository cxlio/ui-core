import { spec, type TestApi } from '@cxl/spec';
import {
	InputCurrency,
	Form,
	Field,
	Label,
	content,
	create,
	getRegisteredComponents,
} from './index.js';

async function frame() {
	await new Promise<void>(resolve => requestAnimationFrame(() => resolve()));
	await new Promise<void>(resolve => requestAnimationFrame(() => resolve()));
}

function enter(input: InputCurrency, value: string, event = 'input') {
	input.inputEl.value = value;
	input.inputEl.dispatchEvent(new Event(event, { bubbles: true }));
}

export default spec('input-currency', a => {
	const previous = content.registeredLocales.fr;
	content.register({
		...content.locale.value,
		name: 'fr',
		localeName: 'fr-FR',
		decimalSeparator: ',',
		currencyCode: 'EUR',
	});
	a.afterAll(() => {
		if (previous) content.register(previous);
		else delete content.registeredLocales.fr;
	});

	a.test('preserves typed zero as a numeric value', async a => {
		const input = create(InputCurrency, { locale: 'en' });
		a.dom.append(input);
		await frame();
		for (const value of ['0', '0.00', '$0.00']) {
			enter(input, value);
			a.equal(input.value, 0);
			input.inputEl.dispatchEvent(new Event('blur'));
			a.equal(input.inputValue, '$0.00');
		}
	});

	a.test('registers the public tag and parses numeric attributes', async (a: TestApi) => {
		a.equal(getRegisteredComponents()['c-input-currency'], InputCurrency);
		a.dom.innerHTML = '<c-input-currency locale="en" value="0" hidesymbol></c-input-currency>';
		const input = a.dom.querySelector('c-input-currency');
		a.assert(input instanceof InputCurrency);
		await frame();
		a.equal(input.value, 0);
		a.equal(input.inputValue, '0.00');
		a.equal(input.hidesymbol, true);
		input.setAttribute('value', '-1234.5');
		a.equal(input.value, -1234.5);
		a.equal(input.inputValue, '-1,234.50');
		input.removeAttribute('value');
		a.equal(input.value, undefined);
		a.equal(input.inputValue, '');
		input.value = NaN;
		a.equal(input.inputValue, '');
	});

	for (const [locale, text, expected] of [
		['en', '-$1,234.56', -1234.56],
		['en', '$1,234.567', 1234.57],
		['fr', '-1\u202f234,56\u00a0€', -1234.56],
		['fr', '1.234,56 €', 1234.56],
		['fr', '0,00 €', 0],
	] as const) {
		a.test(`parses ${locale} currency ${text}`, async a => {
			const input = create(InputCurrency, { locale });
			a.dom.append(input);
			await frame();
			enter(input, text);
			a.equal(input.value, expected);
			a.equal(input.inputValue, new Intl.NumberFormat(
				locale === 'en' ? 'en-US' : 'fr-FR',
				{ style: 'currency', currency: locale === 'en' ? 'USD' : 'EUR' },
			).format(expected));
		});
	}

	a.test('clears empty and nonnumeric input and cleans repeated separators', async a => {
		const input = create(InputCurrency, { locale: 'en', value: 5 });
		a.dom.append(input);
		await frame();
		for (const value of ['', 'abc', '$', '-']) {
			enter(input, value);
			a.equal(input.value, undefined);
			input.inputEl.dispatchEvent(new Event('blur'));
			a.equal(input.inputValue, '');
		}
		enter(input, '4.5.9');
		a.equal(input.value, 4.59);
		enter(input, '-4-5.50');
		a.equal(input.value, -45.5);
	});

	a.test('reacts to currency options and symbol visibility', async a => {
		const input = create(InputCurrency, { locale: 'en', value: 1234.567 });
		a.dom.append(input);
		await frame();
		input.format = { currency: 'EUR', currencyDisplay: 'code', minimumFractionDigits: 3 };
		await frame();
		a.equal(input.inputValue, 'EUR\u00a01,234.567');
		input.hidesymbol = true;
		await frame();
		a.equal(input.inputValue, '\u00a01,234.567');
		a.equal(input.value, 1234.567);
		input.hidesymbol = false;
		input.format = { currency: 'JPY' };
		await frame();
		enter(input, '1234.56');
		a.equal(input.value, 1235);
		a.equal(input.inputValue, '¥1,235');
		input.format = { currency: 'USD', useGrouping: false, maximumFractionDigits: 1 };
		await frame();
		enter(input, '-1234.56', 'change');
		a.equal(input.value, -1234.6);
		a.equal(input.inputValue, '-$1234.6');
	});

	for (const format of [
		{ currencySign: 'accounting' },
		{ signDisplay: 'never' },
	] as const) {
		a.test(`preserves negative values with ${JSON.stringify(format)}`, async a => {
			const input = create(InputCurrency, { locale: 'en', format });
			a.dom.append(input);
			await frame();
			enter(input, '-12.345');
			a.equal(input.value, -12.35);
			a.equal(input.inputValue, new Intl.NumberFormat('en-US', {
				style: 'currency', currency: 'USD', ...format,
			}).format(-12.35));
			if (Object.hasOwn(format, 'currencySign')) {
				enter(input, '($1,234.50)');
				a.equal(input.value, -1234.5);
			}
		});
	}

	a.test('updates locale without changing the numeric value and ignores stale locale requests', async a => {
		const input = create(InputCurrency, { locale: 'en', value: -1234.5 });
		a.dom.append(input);
		await frame();
		input.locale = 'fr';
		await frame();
		a.equal(input.inputValue, '-1\u202f234,50\u00a0€');
		a.equal(input.value, -1234.5);
		enter(input, '12,50 €');
		a.equal(input.value, 12.5);
		input.locale = 'en';
		input.locale = 'fr';
		input.locale = 'en';
		await frame();
		a.equal(input.inputValue, '$12.50');
		enter(input, '12.75');
		a.equal(input.value, 12.75);
	});

	a.test('follows application locale and currency unless overridden', async a => {
		const previous = content.locale.value;
		const input = new InputCurrency();
		input.value = 12.5;
		const explicit = create(InputCurrency, { locale: 'en', value: 12.5 });
		a.dom.append(input, explicit);
		try {
			await content.setLocale('fr');
			await frame();
			a.equal(input.inputValue, '12,50\u00a0€');
			a.equal(explicit.inputValue, '$12.50');
			await content.setLocale('en');
			await frame();
			a.equal(input.inputValue, '$12.50');
			a.equal(input.value, 12.5);
		} finally {
			content.locale.next(previous);
		}
	});

	a.testElement('preserves editing text and cursor, then formats on blur', async a => {
		const input = create(InputCurrency, { locale: 'en', value: 12.5 });
		a.dom.append(input);
		await frame();
		input.focus();
		enter(input, '1234.5');
		input.setSelectionRange(2, 2);
		a.equal(input.value, 1234.5);
		a.equal(input.inputEl.value, '1234.5');
		a.equal(input.inputValue, '1234.5');
		a.equal(input.selectionStart, 2);
		input.inputEl.blur();
		a.equal(input.inputValue, '$1,234.50');
		a.equal(input.touched, true);
	});

	a.testElement('accepts keyboard entry and commits on Tab', async a => {
		const input = create(InputCurrency, { locale: 'en' });
		a.dom.append(input);
		await frame();
		let changes = 0;
		input.onchange = ev => {
			a.equal(ev.target, input);
			changes++;
		};
		await a.action({ type: 'type', element: input.inputEl, value: '-1234.50' });
		a.equal(input.value, -1234.5);
		a.equal(input.inputEl.value, '-1234.50');
		await a.action({ type: 'press', element: input.inputEl, value: 'Tab' });
		a.equal(input.inputValue, '-$1,234.50');
		a.equal(changes, 1);
	});

	a.test('exposes field labels, error states, and disabled state accessibly', async a => {
		const input = create(InputCurrency, { locale: 'en', value: 0 });
		const label = create(Label, undefined, 'Amount');
		const field = create(Field, undefined, label, input);
		a.dom.append(field);
		await frame();
		a.equal(input.inputEl.getAttribute('aria-labelledby'), label.id);
		await a.a11y(field);
		input.setCustomValidity('Amount unavailable');
		a.equal(input.inputEl.ariaInvalid, 'true');
		a.equal(input.validationMessage, 'Amount unavailable');
		input.setCustomValidity('');
		a.equal(input.inputEl.ariaInvalid, null);
		input.disabled = true;
		a.equal(input.inputEl.disabled, true);
		a.equal(input.ariaDisabled, 'true');
		input.disabled = false;
		input.removeAttribute('aria-labelledby');
		input.ariaLabel = 'Total';
		await frame();
		a.equal(input.inputEl.ariaLabel, 'Total');
		a.equal(input.inputEl.getAttribute('aria-labelledby'), null);
		await a.a11y(input);
	});

	a.test('forwards input and change once and reconnects without duplicate handlers', async a => {
		const input = create(InputCurrency, { locale: 'en' });
		a.dom.append(input);
		await frame();
		let events = 0;
		for (const type of ['input', 'change']) {
			a.dom.addEventListener(type, ev => {
				a.equal(ev.target, input);
				events++;
			});
		}
		enter(input, '12.5');
		enter(input, '0', 'change');
		a.equal(events, 2);
		input.remove();
		input.locale = 'fr';
		a.dom.append(input);
		await frame();
		enter(input, '-2,50');
		a.equal(input.value, -2.5);
		a.equal(events, 3);
	});

	for (const native of [true, false]) {
		a.test(`submits numeric values and resets ${native ? 'native' : 'custom'} forms`, async a => {
			const form = native ? document.createElement('form') : new Form();
			const input = create(InputCurrency, { locale: 'en', value: 0, name: 'amount' });
			const empty = create(InputCurrency, { locale: 'en', name: 'empty' });
			form.append(input, empty);
			a.dom.append(form);
			await frame();
			const data = () => form instanceof Form ? form.getFormData().amount : new FormData(form).get('amount');
			a.equal(data(), native ? '0' : 0);
			enter(input, '-1234.50');
			let submissions = 0;
			form.addEventListener('submit', ev => {
				ev.preventDefault();
				submissions++;
				a.equal(data(), native ? '-1234.5' : -1234.5);
			});
			form.requestSubmit();
			a.equal(submissions, 1);
			input.touched = true;
			empty.value = 5;
			form.reset();
			a.equal(input.value, 0);
			a.equal(input.inputValue, '$0.00');
			a.equal(input.touched, false);
			a.equal(empty.value, undefined);
			a.equal(empty.inputValue, '');
			a.equal(data(), native ? '0' : 0);
			input.disabled = true;
			a.equal(data(), native ? null : undefined);
		});
	}
});
