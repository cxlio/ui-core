import { component, create, attribute, get, getShadow, numberAttribute } from './component.js';
import { be, combineLatest, merge, EMPTY } from './rx.js';
import { on, onAction } from './dom.js';
import { role } from './a11y.js';
import { css, disabledStyles } from './theme.js';
import { Input } from './input.js';
import { CalendarMonthInput } from './calendar-month-input.js';
import { parseCalendarDate } from './calendar-date.js';
import { content, registerText } from './locale.js';
import { IconButton } from './icon-button.js';
import { ButtonText } from './button-text.js';
import { Toolbar } from './toolbar.js';
import { Item } from './item.js';
import { Menu } from './menu.js';
import { disabledAttribute, focusableEvents } from './focusable.js';
import { render } from './render.js';

declare module './component.js' {
	interface Components {
		'c-datepicker': Datepicker;
	}
}

const text = registerText({
	'datepicker.nextYear': 'Next Year',
	'datepicker.nextMonth': 'Next Month',
	'datepicker.previousYear': 'Previous Year',
	'datepicker.previousMonth': 'Previous Month',
});

/**
 * Selects a calendar date with month and year navigation and selection menus.
 * Navigation changes the displayed month without changing the selected value.
 * Choosing a date emits change; programmatic value updates emit update.
 * Supports native and custom forms, validation, and reset through Input.
 * @tagName c-datepicker
 * @title Calendar Date Picker
 * @icon calendar_month
 * @see CalendarMonthInput
 * @see DatepickerPopup
 * @example
 * <c-datepicker value="2024-02-29" minyear="2023" maxyear="2025"></c-datepicker>
 */
export class Datepicker extends Input {
	/**
	 * Selected local calendar date. Undefined clears selection.
	 * The attribute accepts YYYY-MM-DD or YYYY-MM, which selects the first day.
	 * Invalid dates and dates outside the year bounds prevent form submission.
	 * @attribute
	 */
	value: Date | undefined = undefined;

	/**
	 * Earliest selectable year and first year in the menu, inclusive. Defaults to 1900.
	 * @attribute
	 */
	minyear = 1900;

	/**
	 * Latest selectable year and last year in the menu, inclusive. Defaults to 2100.
	 * @attribute
	 */
	maxyear = 2100;

	/**
	 * BCP 47 locale for date labels and month and year names.
	 * Defaults to the active content locale.
	 * @attribute
	 */
	locale?: string;

	/**
	 * First weekday, from 0 (Sunday) to 6 (Saturday).
	 * Defaults to the registered locale's week start, or Sunday when unavailable.
	 * @attribute
	 */
	weekstart?: number;
	protected monthInput?: CalendarMonthInput;

	static {
		component(Datepicker, {
			tagName: 'c-datepicker',
			init: [attribute('value', { parse: parseCalendarDate }),
				numberAttribute('minyear', 1, 9999), numberAttribute('maxyear', 1, 9999),
				attribute('locale'), numberAttribute('weekstart', 0, 6)],
			augment: [
				role('group'),
				css(`
:host {
	box-sizing: border-box;
	display: block;
	background-color: var(--cxl-color-surface);
	color: var(--cxl-color-on-surface);
	padding: 8px 12px;
	min-width: 360px;
}
.header { padding: 0 12px; gap: 8px; flex-wrap: nowrap; }
.header c-button-text { margin: 0; padding: 8px; }
.margin { margin-inline-start: auto; }
.body { position: relative; }
.menu {
	position: absolute;
	inset: 0;
	box-shadow: none;
	overflow: hidden auto;
	z-index: 1;
}
				`),
				disabledStyles, disabledAttribute, focusableEvents,
				host => {
					const viewDate = be(new Date());
					const locale = combineLatest(get(host, 'locale'), content.locale).map(([id, active]) => id ?? active.localeName);
					const yearMenu = create(Menu, { static: true, className: 'menu', focusstart: 'selected' });
					const monthMenu = create(Menu, { static: true, className: 'menu', focusstart: 'selected' });
					const menusOpen = combineLatest(get(yearMenu, 'open'), get(monthMenu, 'open')).map(([a, b]) => a || b);
					const bounds = combineLatest(get(host, 'minyear'), get(host, 'maxyear'));
					function inBounds(date: Date) {
						return Number.isInteger(host.minyear) && Number.isInteger(host.maxyear) &&
							host.minyear >= 1 && host.maxyear <= 9999 &&
							date.getFullYear() >= host.minyear && date.getFullYear() <= host.maxyear;
					}
					function move(months: number) {
						const date = new Date(viewDate.value);
						date.setMonth(date.getMonth() + months);
						return date;
					}
					function navigate(months: number) {
						const date = move(months);
						if (!host.disabled && inBounds(date)) viewDate.next(date);
					}
					function choose(date: Date, menu: Menu) {
						if (host.disabled || !inBounds(date)) return;
						viewDate.next(date);
						menu.open = false;
						host.focus();
					}
					const monthButton = create(ButtonText, {
						ariaHasPopup: 'menu',
						ariaExpanded: get(monthMenu, 'open').map(String),
						disabled: combineLatest(get(host, 'disabled'), get(yearMenu, 'open')).map(([a, b]) => a || b),
						$: el => onAction(el).tap(() => { if (!el.disabled) { monthMenu.open = !monthMenu.open; if (monthMenu.open) monthMenu.setFocus(); } }),
					}, combineLatest(viewDate, locale).map(([date, locale]) => date.toLocaleDateString(locale, { month: 'short' })));
					const yearButton = create(ButtonText, {
						className: 'margin', ariaHasPopup: 'menu',
						ariaExpanded: get(yearMenu, 'open').map(String),
						disabled: combineLatest(get(host, 'disabled'), get(monthMenu, 'open')).map(([a, b]) => a || b),
						$: el => onAction(el).tap(() => { if (!el.disabled) { yearMenu.open = !yearMenu.open; if (yearMenu.open) yearMenu.setFocus(); } }),
					}, combineLatest(viewDate, locale).map(([date, locale]) => date.toLocaleDateString(locale, { year: 'numeric' })));
					yearMenu.returnTo = yearButton;
					monthMenu.returnTo = monthButton;
					function navButton(months: number, title: 'datepicker.previousMonth' | 'datepicker.nextMonth' | 'datepicker.previousYear' | 'datepicker.nextYear') {
						return create(IconButton, {
							icon: months < 0 ? 'chevron_left' : 'chevron_right', title: text(title),
							hidden: menusOpen,
							disabled: combineLatest(viewDate, bounds, get(host, 'disabled')).map(() => host.disabled || !inBounds(move(months))),
							$: el => onAction(el).tap(() => navigate(months)),
						});
					}
					const monthInput = host.monthInput = create(CalendarMonthInput, {
						month: viewDate, value: get(host, 'value'), locale: get(host, 'locale'),
						weekstart: get(host, 'weekstart'), disabled: get(host, 'disabled'),
						minyear: get(host, 'minyear'), maxyear: get(host, 'maxyear'),
						$: el => on(el, 'change').tap(ev => {
							ev.stopPropagation();
							if (host.disabled) return;
							host.value = el.value;
							host.dispatchEvent(new Event('change', { bubbles: true }));
						}),
					});
					getShadow(host).append(
						create(Toolbar, { className: 'header' },
							navButton(-1, 'datepicker.previousMonth'), monthButton,
							navButton(1, 'datepicker.nextMonth'), navButton(-12, 'datepicker.previousYear'),
							yearButton, navButton(12, 'datepicker.nextYear')),
						create('div', { className: 'body' }, monthInput, yearMenu, monthMenu),
					);
					monthMenu.append(render({
						source: get(monthMenu, 'open').switchMap(open => open ? locale : EMPTY),
						renderFn: locale => Array.from({ length: 12 }, (_, month) => create(Item, {
							selected: viewDate.map(date => date.getMonth() === month),
							disabled: get(host, 'disabled'),
							$: el => onAction(el).tap(() => {
								const date = new Date(viewDate.value);
								date.setMonth(month);
								choose(date, monthMenu);
							}),
						}, new Date(2000, month, 1).toLocaleDateString(locale, { month: 'long' }))),
					})(host));
					yearMenu.append(render({
						source: get(yearMenu, 'open').switchMap(open => open ? combineLatest(bounds, locale) : EMPTY),
						renderFn: ([[min, max], locale]) => {
							const items: Item[] = [];
							if (!Number.isInteger(min) || !Number.isInteger(max) || min < 1 || max > 9999) return items;
							for (let year = min; year <= max; year++) {
								const date = new Date(0);
								date.setFullYear(year, 0, 1);
								items.push(create(Item, {
									selected: viewDate.map(date => date.getFullYear() === year),
									disabled: get(host, 'disabled'),
									$: el => onAction(el).tap(() => {
										const date = new Date(viewDate.value);
										date.setFullYear(year);
										choose(date, yearMenu);
									}),
								}, date.toLocaleDateString(locale, { year: 'numeric' })));
							}
							return items;
						},
					})(host));
					return merge(
						combineLatest(get(host, 'value'), bounds).tap(([value]) => {
							host.setValidity({ key: 'date', valid: !value || (!isNaN(value.getTime()) && inBounds(value)) });
							const date = new Date(value && !isNaN(value.getTime()) ? value : new Date());
							date.setDate(1);
							date.setHours(0, 0, 0, 0);
							if (Number.isInteger(host.minyear) && Number.isInteger(host.maxyear) && host.minyear <= host.maxyear)
								date.setFullYear(Math.max(host.minyear, Math.min(host.maxyear, date.getFullYear())));
							if (viewDate.value.getTime() !== date.getTime()) viewDate.next(date);
						}),
						get(host, 'disabled').tap(disabled => {
							if (disabled) yearMenu.open = monthMenu.open = false;
						}),
					);
				},
			],
		});
	}

	/** Focuses the selected enabled date, or the first enabled date. */
	focus() {
		if (!this.disabled) this.monthInput?.focus();
	}
}
