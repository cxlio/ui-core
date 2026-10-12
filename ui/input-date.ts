import { Slot, component, create, attribute, get } from './component.js';
import { $valueProxy } from './input-proxy.js';
import { InputTextBase, inputTextStyles } from './input-text.js';
import { content } from './locale.js';
import type { DateFormat } from './datetime.js';
import { combineLatest, merge } from './rx.js';

declare module './component.js' {
	interface Components {
		'c-input-date': InputDate;
	}
}

function dateFormatter(
	locale?: string,
	format?: Exclude<DateFormat, 'relative'>,
) {
	return new Intl.DateTimeFormat(
		locale ?? content.locale.value.localeName,
		typeof format === 'string'
			? { dateStyle: format }
			: (format ?? {
					year: 'numeric',
					month: 'numeric',
					day: 'numeric',
				}),
	);
}

function calendarDate(year: number, month: number, day: number) {
	if (year < 1 || year > 9999) return new Date(NaN);
	const date = new Date(0);
	date.setFullYear(year, month - 1, day);
	date.setHours(0, 0, 0, 0);
	return date.getFullYear() === year &&
		date.getMonth() === month - 1 &&
		date.getDate() === day
		? date
		: new Date(NaN);
}

function parseDateAttribute(value: string | null) {
	if (!value) return undefined;
	const parts = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
	return parts
		? calendarDate(Number(parts[1]), Number(parts[2]), Number(parts[3]))
		: new Date(NaN);
}

function dateParser(formatter: Intl.DateTimeFormat) {
	const options = formatter.resolvedOptions();
	const digits = new Intl.NumberFormat(options.locale, {
		useGrouping: false,
		numberingSystem: options.numberingSystem,
	});
	const normalize = (text: string, trim = true) => {
		for (let i = 0; i < 10; i++)
			text = text.replaceAll(digits.format(i), String(i));
		text = text
			.replace(/[\u200e\u200f\u061c]/g, '')
			.replace(/\s+/g, ' ')
			.toLocaleLowerCase(options.locale);
		return trim ? text.trim() : text;
	};
	const escape = (text: string) =>
		normalize(text, false).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
	const parts = formatter.formatToParts(new Date(2006, 10, 22));
	const months = Array.from({ length: 12 }, (_, month) =>
		normalize(
			formatter
				.formatToParts(new Date(2006, month, 22))
				.find(p => p.type === 'month')?.value ?? '',
		),
	);
	const numericMonth = months.every(month => /^\d+$/.test(month));
	const supported =
		options.calendar === 'gregory' &&
		options.timeZone ===
			new Intl.DateTimeFormat().resolvedOptions().timeZone &&
		!options.timeZoneName &&
		parts.every(p =>
			['year', 'month', 'day', 'weekday', 'literal'].includes(p.type),
		) &&
		['year', 'month', 'day'].every(type =>
			parts.some(p => p.type === type),
		) &&
		new Set(months).size === 12;
	const pattern = parts
		.map(p => {
			if (p.type === 'literal')
				return escape(p.value).replaceAll(' ', '\\s*');
			if (p.type === 'weekday') return '(?<weekday>.+?)';
			if (p.type === 'month' && !numericMonth)
				return `(?<month>${months.map(escape).join('|')})`;
			return `(?<${p.type}>\\d{1,${p.type === 'year' ? 4 : 2}})`;
		})
		.join('');
	const regex = supported ? new RegExp(`^${pattern}$`, 'u') : undefined;
	return (text: string) => {
		const fields = regex?.exec(normalize(text))?.groups;
		if (!fields) return new Date(NaN);
		const year =
			Number(fields.year) +
			(fields.year?.length === 2 &&
			(options.year === '2-digit' || options.dateStyle === 'short')
				? 2000
				: 0);
		const month = numericMonth
			? Number(fields.month)
			: months.indexOf(fields.month ?? '') + 1;
		const date = calendarDate(year, month, Number(fields.day));
		if (fields.weekday && !isNaN(date.getTime())) {
			const weekday = formatter
				.formatToParts(date)
				.find(p => p.type === 'weekday')?.value;
			if (normalize(weekday ?? '') !== fields.weekday)
				return new Date(NaN);
		}
		return date;
	};
}

/**
 * Base class for localized calendar-date inputs using the text input proxy.
 * Maps entered dates to local midnight and retains invalid text for correction.
 */
export abstract class InputDateBase extends InputTextBase {
	/**
	 * The selected date. Undefined clears the field; an invalid Date marks it invalid.
	 * The value attribute accepts a complete ISO calendar date (YYYY-MM-DD).
	 * @attribute
	 */
	value: Date | undefined = undefined;

	/**
	 * Locale used for both display and parsing, such as en-GB or fr-FR.
	 * When omitted, follows the active content locale.
	 * @attribute
	 */
	locale?: string;

	/**
	 * Date-only Intl options or a short, medium, long, or full date preset.
	 * Defaults to numeric year, month, and day. Editable formats must contain all
	 * three fields in the Gregorian calendar, with an unambiguous month and no time.
	 * Entered dates use the local time zone and years 1–9999. Formats with
	 * two-digit years use 2000–2099. Relative formats are unsupported.
	 * @attribute
	 */
	format?: Exclude<DateFormat, 'relative'>;

	/** Native text control used for date entry, focus, and selection. */
	readonly inputEl: HTMLInputElement = create('input', {
		className: 'input',
	});

	static {
		component(InputDateBase, {
			init: [
				attribute('value', { parse: parseDateAttribute }),
				attribute('format'),
				attribute('locale'),
			],
			augment: [
				Slot,
				$ => $.append($.inputEl),
				$ => {
					let formatter = dateFormatter($.locale, $.format);
					let parse = dateParser(formatter);
					return merge(
						get($, 'value').tap(date =>
							$.setValidity({
								key: 'date',
								valid: !date || !isNaN(date.getTime()),
							}),
						),
						$valueProxy({
							host: $,
							input: $.inputEl,
							toText: (date, old) =>
								!date
									? ''
									: isNaN(date.getTime())
										? old
										: formatter.format(date),
							toValue: text =>
								text.trim() ? parse(text) : undefined,
							update: combineLatest(
								content.locale,
								get($, 'locale'),
								get($, 'format'),
							).tap(() => {
								formatter = dateFormatter($.locale, $.format);
								parse = dateParser(formatter);
							}),
						}),
					);
				},
			],
		});
	}

	/** Restores the initial date and displayed text, including while focused. */
	formResetCallback() {
		super.formResetCallback();
		if (!this.value) this.setInputValue('');
		else if (!isNaN(this.value.getTime()))
			this.setInputValue(
				dateFormatter(this.locale, this.format).format(this.value),
			);
	}
}

/**
 * A text field for entering a single localized calendar date.
 * Invalid or incomplete dates remain visible and prevent form submission.
 * Clearing the field sets value to undefined. Native forms serialize Date values
 * through the input base; c-form retains the Date object.
 *
 * @title Date Input Field
 * @icon event
 * @tagName c-input-date
 * @see Field
 * @example
 * <c-field>
 *   <c-label>Date</c-label>
 *   <c-input-date locale="en-GB" value="1984-08-06"></c-input-date>
 * </c-field>
 */
export class InputDate extends InputDateBase {}

component(InputDate, {
	tagName: 'c-input-date',
	augment: [...inputTextStyles],
});
