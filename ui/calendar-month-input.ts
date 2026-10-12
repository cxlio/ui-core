import { component, attribute, create, get, getShadow, numberAttribute } from './component.js';
import { toIsoDate } from './datetime.js';
import { role } from './a11y.js';
import { breakpoint, css, disabledStyles, font } from './theme.js';
import { observeChildren, onMutation, onAction } from './dom.js';
import { disabledAttribute, focusableEvents } from './focusable.js';
import { render } from './render.js';
import { content } from './locale.js';
import { combineLatest, merge, EMPTY } from './rx.js';
import { gridNavigation } from './grid-list.js';
import { Span } from './span.js';
import { Input } from './input.js';
import { CalendarDate, normalizeDate, parseCalendarDate, type DateInformation } from './calendar-date.js';
import { CalendarCell, type CalendarCellData } from './calendar-cell.js';

declare module './component.js' {
	interface Components {
		'c-calendar-month-input': CalendarMonthInput;
	}
}

function monthDates(month: Date, weekStart: number): DateInformation[] {
	if (isNaN(month.getTime())) return [];
	const start = new Date(month);
	start.setDate(1);
	start.setHours(0, 0, 0, 0);
	start.setDate(1 - (start.getDay() - weekStart + 7) % 7);
	const end = new Date(month);
	end.setDate(1);
	end.setMonth(end.getMonth() + 1);
	end.setHours(0, 0, 0, 0);
	end.setDate(1 + (weekStart - end.getDay() + 7) % 7);
	const dates: DateInformation[] = [];
	const today = normalizeDate(new Date());
	for (const date = start; date < end; date.setDate(date.getDate() + 1)) {
		const time = date.getTime();
		dates.push({ date: new Date(date), time, isToday: time === today,
			isOutsideMonth: date.getMonth() !== month.getMonth() });
	}
	return dates;
}

/**
 * Selects a date from a month grid with localized weekday and date labels.
 * Arrow keys move between dates; Home and End move to row edges.
 * Enter or Space selects the focused date and emits change. Programmatic value
 * updates emit update, and undefined clears the selection.
 * Supports native and custom forms, validation, and reset through Input.
 * @tagName c-calendar-month-input
 * @title Calendar Month Date Picker
 * @icon event
 * @see Datepicker
 * @example
 * <c-calendar-month-input month="2024-02" value="2024-02-29" weekstart="1"></c-calendar-month-input>
 */
export class CalendarMonthInput extends Input {
	/**
	 * Displayed month. The attribute accepts YYYY-MM or YYYY-MM-DD.
	 * Undefined displays the current month; an invalid Date renders no date cells.
	 * @attribute
	 */
	month: Date | undefined = new Date();

	/**
	 * Selected local calendar date. Undefined clears selection.
	 * The attribute accepts YYYY-MM-DD or YYYY-MM, which selects the first day.
	 * Invalid dates and dates outside the year bounds prevent form submission.
	 * @attribute
	 */
	value: Date | undefined = undefined;

	/**
	 * BCP 47 locale for weekday and date labels. Defaults to the active content locale.
	 * @attribute
	 */
	locale?: string;

	/**
	 * First weekday, from 0 (Sunday) to 6 (Saturday).
	 * Defaults to the registered locale's week start, or Sunday when unavailable.
	 * @attribute
	 */
	weekstart?: number;

	/**
	 * Earliest selectable year, inclusive. Defaults to 1.
	 * @attribute
	 */
	minyear = 1;

	/**
	 * Latest selectable year, inclusive. Defaults to 9999.
	 * @attribute
	 */
	maxyear = 9999;
	protected cells: Record<string, CalendarCellData> = {};
	protected grid?: HTMLDivElement;

	static {
		component(CalendarMonthInput, {
			tagName: 'c-calendar-month-input',
			init: [attribute('month', { parse: parseCalendarDate }),
				attribute('value', { parse: parseCalendarDate }), attribute('locale'),
				numberAttribute('weekstart', 0, 6), numberAttribute('minyear'), numberAttribute('maxyear')],
			augment: [
				role('group'),
				css(`
:host { display: block; }
#grid { display: grid; grid-template-columns: repeat(7, minmax(0, 1fr)); width: 100%; }
.day { text-align: center; padding: 16px 0; ${font('body-large')} }
.row { display: contents; }
.cell { padding: 4px; }
.date { margin: 0; ${font('body-large')} }
.outside { opacity: .38; }
				`),
				disabledStyles, disabledAttribute, focusableEvents,
				$ => {
					const grid = $.grid = create('div', { id: 'grid', role: 'grid' });
					const size = breakpoint($).share();
					getShadow($).append(grid);
					grid.append(render({
						source: combineLatest(get($, 'month'), get($, 'locale'), get($, 'weekstart'), content.locale),
						renderFn: ([month, localeId, weekstart, active]) => {
							const locale = localeId ?? active.localeName;
							const registered = localeId ? content.registeredLocales[localeId] ?? content.registeredLocales[localeId.split('-')[0] ?? ''] : active;
							const start = Number.isInteger(weekstart) && weekstart !== undefined && weekstart >= 0 && weekstart < 7 ? weekstart : registered?.weekStart ?? 0;
							const fragment = new DocumentFragment();
							const header = create('div', { role: 'row', className: 'row' });
							for (let i = 0; i < 7; i++) header.append(create(Span, {
								role: 'columnheader', className: 'day',
							}, size.map(size => new Date(2024, 0, 7 + (start + i) % 7).toLocaleDateString(locale, {
								weekday: size === 'xsmall' ? 'narrow' : size === 'small' ? 'short' : 'long',
							}))));
							fragment.append(header);
							$.cells = {};
							const dates = monthDates(month ?? new Date(), start);
							for (let i = 0; i < dates.length; i += 7) {
								const row = create('div', { role: 'row', className: 'row' });
								for (const [offset, info] of dates.slice(i, i + 7).entries()) {
									const button = create(CalendarDate, {
										date: info, locale, tabIndex: -1,
										className: `date${info.isOutsideMonth ? ' outside' : ''}`,
										selected: get($, 'value').map(date => !!date && normalizeDate(date) === info.time),
										disabled: combineLatest(get($, 'disabled'), get($, 'minyear'), get($, 'maxyear')).map(([disabled, min, max]) => disabled || info.date.getFullYear() < min || info.date.getFullYear() > max),
										$: el => onAction(el).tap(() => {
											if (!el.disabled) $.onClickDate(info);
										}),
									});
									const element = create(CalendarCell, { className: 'cell', date: info }, button);
									$.cells[toIsoDate(info.date)] = { element, index: i + offset, overflow: 0, date: info.date };
									row.append(element);
								}
								fragment.append(row);
							}
							return fragment;
						},
					})($));
					const dates = () => Array.from(grid.querySelectorAll<CalendarDate>('c-calendar-date'));
					return merge(
						combineLatest(get($, 'value'), get($, 'minyear'), get($, 'maxyear')).tap(([date, min, max]) => $.setValidity({ key: 'date', valid: !date || (!isNaN(date.getTime()) && date.getFullYear() >= min && date.getFullYear() <= max) })),
						get($, 'disabled').tap(disabled => { if (disabled) dates().forEach(el => el.tabIndex = -1); }).switchMap(disabled => disabled ? EMPTY : gridNavigation({
							host: grid, columns: 7, getFocusable: dates,
							getActive: () => dates().find(el => el.matches(':focus,:focus-within')),
							getSelected: () => dates().find(el => el.selected && !el.disabled),
							observe: merge(
								observeChildren(grid, { subtree: true }),
								onMutation(grid, { attributes: true, attributeFilter: ['disabled'], subtree: true }),
							),
						})),
					);
				},
			],
		});
	}

	/** First date in the rendered grid, including dates from the previous month. */
	get startDate() {
		return Object.values(this.cells)[0]?.date;
	}

	/** Focuses the selected enabled date, or the first enabled date. */
	focus() {
		if (this.disabled) return;
		const dates = Array.from(this.grid?.querySelectorAll<CalendarDate>('c-calendar-date') ?? []);
		const target = dates.find(el => el.selected && !el.disabled) ?? dates.find(el => !el.disabled);
		target?.focus();
	}

	protected onClickDate(info: DateInformation) {
		this.value = new Date(info.date);
		this.dispatchEvent(new Event('change', { bubbles: true }));
	}
}
