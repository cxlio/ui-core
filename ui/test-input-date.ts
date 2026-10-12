import { spec, type TestApi } from '@cxl/spec';
import {
	InputDate,
	InputDateBase,
	Form,
	content,
	create,
	getRegisteredComponents,
} from './index.js';

function enter(input: InputDate, text: string, event = 'input') {
	input.inputEl.value = text;
	input.inputEl.dispatchEvent(new Event(event, { bubbles: true }));
}

export default spec('input-date', a => {
	a.test(
		'registers and parses ISO value attributes without rollover',
		(a: TestApi) => {
			const input = a.element('c-input-date');
			a.assert(input instanceof InputDate);
			a.ok(input instanceof InputDateBase);
			a.equal(getRegisteredComponents()['c-input-date'], InputDate);
			input.locale = 'en-GB';
			input.setAttribute('value', '1984-08-06');
			a.equal(input.value?.getFullYear(), 1984);
			a.equal(input.value?.getMonth(), 7);
			a.equal(input.value?.getDate(), 6);
			a.equal(input.inputValue, '06/08/1984');
			for (const value of [
				'2023-02-29',
				'2024-04-31',
				'not a date',
				'08/06/1984',
			]) {
				input.setAttribute('value', value);
				a.ok(input.invalid);
				a.equal(input.inputValue, '06/08/1984');
			}
			input.removeAttribute('value');
			a.equal(input.value, undefined);
			a.equal(input.inputValue, '');
			a.ok(input.checkValidity());
		},
	);

	for (const [locale, text] of [
		['en-US', '8/6/1984'],
		['en-GB', '06/08/1984'],
		['fr-FR', '06/08/1984'],
		['de-DE', '6.8.1984'],
		['ja-JP', '1984/8/6'],
		['ar-EG', '٦/٨/١٩٨٤'],
	]) {
		a.test(`parses and formats ${locale}`, a => {
			const input = create(InputDate, { locale });
			a.dom.append(input);
			enter(input, text ?? '');
			a.equal(input.value?.getFullYear(), 1984);
			a.equal(input.value?.getMonth(), 7);
			a.equal(input.value?.getDate(), 6);
			a.equal(input.value?.getHours(), 0);
			a.ok(input.checkValidity());
			const expected = new Intl.DateTimeFormat(locale, {
				year: 'numeric',
				month: 'numeric',
				day: 'numeric',
			}).format(new Date(1984, 7, 6));
			a.equal(input.inputValue, expected);
			enter(input, expected, 'change');
			a.equal(input.value?.getFullYear(), 1984);
		});
	}

	for (const format of ['short', 'medium', 'long', 'full'] as const) {
		for (const locale of ['en-US', 'fr-FR']) {
			a.test(`round-trips ${locale} ${format} dates`, a => {
				const input = create(InputDate, {
					locale,
					format,
					value: new Date(2024, 1, 29),
				});
				a.dom.append(input);
				const text = new Intl.DateTimeFormat(locale, {
					dateStyle: format,
				}).format(new Date(2024, 1, 29));
				a.equal(input.inputValue, text);
				enter(input, text);
				a.equal(input.value?.getFullYear(), 2024);
				a.equal(input.value?.getMonth(), 1);
				a.equal(input.value?.getDate(), 29);
				a.ok(input.checkValidity());
			});
		}
	}

	a.test(
		'preserves early Gregorian years and validates century leap years',
		a => {
			const input = create(InputDate, { locale: 'en-US' });
			a.dom.append(input);
			for (const year of [1, 99, 1900, 2000]) {
				input.setAttribute(
					'value',
					`${String(year).padStart(4, '0')}-01-01`,
				);
				a.equal(input.value?.getFullYear(), year);
				a.ok(input.checkValidity());
				enter(input, `1/1/${String(year).padStart(4, '0')}`);
				a.equal(input.value?.getFullYear(), year);
				a.ok(input.checkValidity());
			}
			for (const text of ['1/1/0000', '2/29/1900']) {
				enter(input, text);
				a.ok(input.invalid);
			}
			enter(input, '2/29/2000');
			a.ok(input.checkValidity());
			input.format = 'full';
			enter(input, 'Monday, February 29, 2000');
			a.ok(input.invalid);
		},
	);

	a.test('parses uppercase month names using the selected locale', a => {
		const date = new Date(2024, 4, 6);
		const input = create(InputDate, { locale: 'tr-TR', format: 'long' });
		a.dom.append(input);
		const text = new Intl.DateTimeFormat('tr-TR', { dateStyle: 'long' })
			.format(date)
			.toLocaleUpperCase('tr-TR');
		enter(input, text);
		a.equal(input.value?.getFullYear(), 2024);
		a.equal(input.value?.getMonth(), 4);
		a.equal(input.value?.getDate(), 6);
		a.ok(input.checkValidity());
	});

	a.test(
		'supports Intl options and rejects ambiguous or incomplete formats',
		a => {
			const input = create(InputDate, {
				locale: 'en-US',
				format: { year: 'numeric', month: 'long', day: '2-digit' },
			});
			a.dom.append(input);
			enter(input, 'February 29, 2024');
			a.equal(input.value?.getDate(), 29);
			a.ok(input.checkValidity());
			input.format = {
				year: '2-digit',
				month: '2-digit',
				day: '2-digit',
			};
			enter(input, '02/29/24');
			a.equal(input.value?.getFullYear(), 2024);
			for (const format of [
				{ year: 'numeric', month: 'narrow', day: 'numeric' },
				{ year: 'numeric', month: 'numeric' },
				{
					year: 'numeric',
					month: 'numeric',
					day: 'numeric',
					hour: 'numeric',
				},
				{
					year: 'numeric',
					month: 'numeric',
					day: 'numeric',
					calendar: 'buddhist',
				},
			] as const) {
				input.format = format;
				input.value = new Date(2024, 1, 29);
				enter(input, input.inputValue);
				a.ok(input.invalid);
			}
		},
	);

	a.test(
		'rejects invalid dates, preserves text, and recovers on edit or clear',
		a => {
			const input = create(InputDate, { locale: 'en-GB' });
			a.dom.append(input);
			for (const text of [
				'29/02/2023',
				'31/04/2024',
				'00/01/2024',
				'01/13/2024',
				'6/8',
				'garbage',
				'06/08/1984 trailing',
			]) {
				enter(input, text);
				a.ok(input.invalid);
				a.ok(!input.checkValidity());
				a.ok(input.value && isNaN(input.value.getTime()));
				a.equal(input.inputValue, text);
				input.inputEl.dispatchEvent(new Event('blur'));
				a.equal(input.inputValue, text);
			}
			enter(input, '29/02/2024');
			a.ok(input.checkValidity());
			a.equal(input.value?.getDate(), 29);
			input.value = new Date(NaN);
			a.ok(input.invalid);
			a.equal(input.inputValue, '29/02/2024');
			enter(input, '   ');
			a.equal(input.value, undefined);
			a.equal(input.inputValue, '');
			a.ok(input.checkValidity());
			input.rules = 'required';
			a.ok(!input.checkValidity());
			enter(input, '29/02/2024');
			a.ok(input.checkValidity());
		},
	);

	a.test(
		'reformats and reparses on locale, format, and active locale changes',
		a => {
			const input = create(InputDate, {
				locale: 'en-US',
				value: new Date(1984, 7, 6),
			});
			a.dom.append(input);
			input.locale = 'en-GB';
			a.equal(input.inputValue, '06/08/1984');
			input.format = 'long';
			a.equal(input.inputValue, '6 August 1984');
			enter(input, '7 August 1984');
			a.equal(input.value?.getDate(), 7);
			const active = content.locale.value;
			try {
				input.format = undefined;
				input.locale = undefined;
				content.locale.next(content.registeredLocales.en ?? active);
				a.equal(input.inputValue, '8/7/1984');
				content.locale.next({ ...active, localeName: 'fr-FR' });
				a.equal(input.inputValue, '07/08/1984');
				enter(input, '08/08/1984');
				a.equal(input.value?.getDate(), 8);
				input.locale = 'en-US';
				content.locale.next({ ...active, localeName: 'de-DE' });
				a.equal(input.inputValue, '8/8/1984');
			} finally {
				content.locale.next(active);
			}
		},
	);

	for (const native of [true, false]) {
		a.test(
			`integrates with ${native ? 'native' : 'custom'} submission and focused reset`,
			a => {
				const form = native
					? document.createElement('form')
					: new Form();
				const initial = new Date(1984, 7, 6);
				const input = create(InputDate, {
					name: 'date',
					value: initial,
					locale: 'en-GB',
				});
				const empty = create(InputDate, {
					name: 'empty',
					locale: 'en-GB',
				});
				form.append(input, empty);
				a.dom.append(form);
				input.focus();
				enter(input, '29/02/2024');
				let submits = 0;
				form.addEventListener('submit', ev => {
					ev.preventDefault();
					submits++;
				});
				form.requestSubmit();
				a.equal(submits, 1);
				if (form instanceof HTMLFormElement) {
					a.equal(
						new FormData(form).get('date'),
						String(input.value),
					);
					a.equal(new FormData(form).get('empty'), null);
				} else a.equal(form.getFormData().date, input.value);
				enter(input, '31/02/2024');
				form.requestSubmit();
				a.equal(submits, 1);
				a.ok(!form.checkValidity());
				input.touched = empty.touched = true;
				empty.value = new Date(2024, 1, 29);
				form.reset();
				a.equal(input.value, initial);
				a.equal(input.inputValue, '06/08/1984');
				a.equal(empty.value, undefined);
				a.equal(empty.inputValue, '');
				a.equal(input.touched, false);
				a.equal(empty.touched, false);
				a.ok(input.checkValidity());
			},
		);
	}

	a.test(
		'preserves editing selection, forwards events once, and reconnects cleanly',
		a => {
			const input = create(InputDate, { locale: 'en-GB' });
			a.dom.append(input);
			let inputs = 0;
			let changes = 0;
			input.addEventListener('input', () => inputs++);
			input.addEventListener('change', () => changes++);
			input.focus();
			enter(input, '6/8/1984');
			input.setSelectionRange(2, 3);
			a.equal(input.selectionStart, 2);
			a.equal(input.selectionEnd, 3);
			a.equal(input.inputValue, '6/8/1984');
			input.value = new Date(NaN);
			a.ok(input.invalid);
			enter(input, '6/8/1984', 'change');
			a.ok(input.checkValidity());
			input.inputEl.blur();
			a.equal(input.inputValue, '06/08/1984');
			a.equal(inputs, 1);
			a.equal(changes, 1);
			input.remove();
			input.locale = 'en-US';
			enter(input, '9/7/1984');
			a.equal(input.value.getMonth(), 7);
			a.dom.append(input);
			a.equal(input.inputValue, '8/6/1984');
			enter(input, '9/7/1984');
			a.equal(input.value.getMonth(), 8);
			a.equal(inputs, 3);
			a.equal(changes, 1);
		},
	);

	a.test(
		'forwards accessibility and native input attributes',
		(a: TestApi) => {
			const input = a.element('c-input-date');
			a.assert(input instanceof InputDate);
			input.setAttribute('aria-label', 'Birthday');
			input.name = 'birthday';
			input.autocomplete = 'bday';
			input.disabled = true;
			a.equal(input.inputEl.name, 'birthday');
			a.equal(input.inputEl.autocomplete, 'bday');
			a.equal(input.inputEl.disabled, true);
		},
	);
});
