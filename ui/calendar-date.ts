import { component, property, styleAttribute, get } from './component.js';
import { ButtonRound } from './button-round.js';
import { css } from './theme.js';
import { itemBehavior } from './item.js';
import { content } from './locale.js';
import { combineLatest } from './rx.js';

declare module './component.js' {
	interface Components {
		'c-calendar-date': CalendarDate;
	}
}

/** Calendar date and display state used by date cells. */
export interface DateInformation {
	/** Calendar date in the local time zone. */
	date: Date;
	/** Whether this date is today. */
	isToday: boolean;
	/** Whether the date belongs to an adjacent month. */
	isOutsideMonth: boolean;
	/** Timestamp of the calendar date at local midnight. */
	time: number;
}

/** Parses YYYY-MM or YYYY-MM-DD at local midnight, rejecting invalid dates. */
export function parseCalendarDate(value: string | null) {
	if (!value) return undefined;
	const parts = /^(\d{4})-(\d{2})(?:-(\d{2}))?$/.exec(value);
	if (!parts) return new Date(NaN);
	const year = Number(parts[1]);
	const month = Number(parts[2]) - 1;
	const day = Number(parts[3] ?? 1);
	const date = new Date(0);
	date.setFullYear(year, month, day);
	date.setHours(0, 0, 0, 0);
	return year > 0 && date.getFullYear() === year &&
		date.getMonth() === month && date.getDate() === day
		? date : new Date(NaN);
}

/** Returns the local-midnight timestamp without changing the supplied date. */
export function normalizeDate(date: Date) {
	return new Date(date).setHours(0, 0, 0, 0);
}

/**
 * Displays an interactive date cell with a localized accessible label.
 * Reflects selection and marks today's date for assistive technology.
 * Used by CalendarMonthInput; assign date information through the date property.
 * @tagName c-calendar-date
 * @title Calendar Date Cell
 * @icon event
 * @see CalendarMonthInput
 */
export class CalendarDate extends ButtonRound {
	/**
	 * Highlights the date and exposes its selected state to assistive technology.
	 * @attribute
	 */
	selected = false;

	/** Date and display state for this cell. Undefined clears its label and content. */
	date?: DateInformation;

	/** BCP 47 locale for the accessible date label. Defaults to the active content locale. */
	locale?: string;
}

component(CalendarDate, {
	tagName: 'c-calendar-date',
	init: [property('date'), property('locale'), styleAttribute('selected')],
	augment: [
		css(`
:host([variant=text][selected]:not([disabled])) {
	background-color: var(--cxl-color-primary);
	color: var(--cxl-color-on-primary);
}
:host([today]) { outline: 1px solid var(--cxl-color-primary); }
		`),
		itemBehavior,
		$ => combineLatest(get($, 'date'), get($, 'locale'), content.locale).tap(([info, locale, active]) => {
			$.variant = 'text';
			$.role = 'gridcell';
			$.textContent = info ? String(info.date.getDate()) : '';
			$.ariaLabel = info?.date.toLocaleDateString(locale ?? active.localeName, {
				weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
			}) ?? null;
			$.toggleAttribute('today', info?.isToday ?? false);
			$.ariaCurrent = info?.isToday ? 'date' : null;
		}),
	],
});
