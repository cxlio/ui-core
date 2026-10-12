import {
	component,
	attribute,
	property,
	get,
	create,
	numberAttribute,
} from './component.js';
import { merge } from './rx.js';
import { InputTextBase, inputTextBase } from './input-text.js';
import { $valueProxy } from './input-proxy.js';
import { content, getLocale } from './locale.js';

declare module './component.js' {
	interface Components {
		'c-input-currency': InputCurrency;
	}
}

function normalizeNumber(value: string, decimalSeparator: string) {
	const text = value.trim();
	const normalized = [...text]
		.filter(ch => /\d/.test(ch) || ch === decimalSeparator || ch === '-')
		.join('')
		.replace(decimalSeparator, '.')
		.replace(/(?!^)-/g, '')
		.replace(/^([^.]*\.[^.]*)\./, '$1');
	const number = parseFloat(normalized);
	if (isNaN(number)) return undefined;
	return text.startsWith('(') && text.endsWith(')')
		? -Math.abs(number)
		: number;
}

/**
 * Input for monetary values with locale-aware parsing and currency formatting.
 * Formats values on blur and preserves the text and cursor while typing.
 *
 * @title Currency Input Field
 * @icon attach_money
 * @tagName c-input-currency
 * @see Field
 * @demo
 * <c-field>
 *   <c-label>Currency Input</c-label>
 *   <c-input-currency locale="en" value="20.05"></c-input-currency>
 * </c-field>
 */
export class InputCurrency extends InputTextBase {
	/**
	 * The current monetary value as a number. Empty input becomes undefined.
	 * @attribute
	 */
	value: number | undefined = undefined;

	/**
	 * Overrides the active application locale with a registered locale.
	 * @attribute
	 */
	locale?: string;

	/** Currency and precision options passed to Intl.NumberFormat. */
	format?: Intl.NumberFormatOptions;

	/**
	 * Omits the currency symbol from the formatted text.
	 * @attribute
	 * @demo
	 * <c-field>
	 *   <c-label>Amount</c-label>
	 *   <c-input-currency locale="en" hidesymbol value="20.05"></c-input-currency>
	 * </c-field>
	 */
	hidesymbol = false;

	/** The native input used for text entry. */
	readonly inputEl: HTMLInputElement = create('input', { className: 'input' });
}

component(InputCurrency, {
	tagName: 'c-input-currency',
	init: [
		numberAttribute('value'),
		attribute('locale'),
		property('format'),
		attribute('hidesymbol'),
	],
	augment: [
		...inputTextBase,
		$ => $.append($.inputEl),
		$ => {
			let locale = content.locale.value;
			const format = (number: number) =>
				new Intl.NumberFormat(locale.localeName, {
					currency: locale.currencyCode,
					...$.format,
					style: 'currency',
				}).formatToParts(number);

			return $valueProxy({
				host: $,
				input: $.inputEl,
				toText: number =>
					number === undefined || isNaN(number)
						? ''
						: format(number)
								.filter(part => !$.hidesymbol || part.type !== 'currency')
								.map(part => part.value)
								.join(''),
				toValue: value => {
					const number = normalizeNumber(value, locale.decimalSeparator);
					if (number === undefined) return undefined;

					const result = format(number)
						.filter(part =>
							['integer', 'fraction', 'decimal'].includes(part.type),
						)
						.map(part => (part.type === 'decimal' ? '.' : part.value))
						.join('');
					return Math.sign(number) * parseFloat(result);
				},
				update: merge(
					getLocale($).tap(value => (locale = value)),
					get($, 'format'),
					get($, 'hidesymbol'),
				).raf(),
			});
		},
	],
});
