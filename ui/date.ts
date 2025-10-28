import { component, attribute, Component, get } from './component.js';
import { dateAttribute, DateFormat } from './datetime.js';
import { content } from './locale.js';
import { combineLatest } from './rx.js';

declare module './component' {
	interface Components {
		'c-date': Date;
	}
}

/**
 * Utility component to display a formatted date.
 *
 * @tagName c-date
 * @title Date formatting
 * @icon schedule
 * @demo
 * <c-t><c-date date="1984-08-06"></c-date></c-t>
 */
export class Date extends Component {
	/**
	 * Holds the input date.
	 *
	 * @attribute
	 */
	date?: globalThis.Date;

	/**
	 * The 'format' property allows users to specify desired output styling for the date.
	 * This enables customization of how dates are presented based on locale, length, or pattern.
	 *
	 * Supports a preset string value or a Intl.DateTimeFormatOptions object.
	 *
	 * Supported string values:
	 * - `'short'`: Short date format, typically numeric and compact.
	 * - `'medium'`: Medium length, includes more detail but still concise.
	 * - `'long'`: Long format, generally includes more explicit information such as a full month name, and optional weekday.
	 * - `'full'`: Full date, includes as much detail as possible, often includes weekday and time zone.
	 *
	 * @demo
	 * <c-t><c-date date="1984-08-06" format="short"></c-date></c-t>
	 *
	 * @attribute
	 */
	format?: DateFormat;

	/**
	 * The 'locale' property allows specification of the desired locale for date formatting.
	 * This provides control over language, numbering, and calendar systems when displaying dates.
	 *
	 * When unset, it defaults to the user's browser or system locale.
	 *
	 * @attribute
	 * @demo
	 * <c-t><c-date date="1984-08-06" locale="es"></c-date></c-t>
	 */
	locale?: string;
}

component(Date, {
	tagName: 'c-date',
	init: [dateAttribute('date'), attribute('format'), attribute('locale')],
	augment: [
		$ =>
			combineLatest(
				get($, 'locale').switchMap(l => content.getLocale(l)),
				get($, 'date'),
				get($, 'format'),
			).raf(
				([locale, date, format]) =>
					($.textContent = date
						? locale.formatDate(date, format)
						: ''),
			),
	],
});
