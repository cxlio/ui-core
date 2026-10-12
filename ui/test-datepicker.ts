import { spec, triggerKeydown, type TestApi } from '@cxl/spec';
import { CalendarDate, CalendarCell, CalendarMonthInput, Datepicker, DatepickerPopup,
	InputDate, Field, Form, Menu, create, getRegisteredComponents, content } from './index.js';

const frame = () => new Promise<void>(resolve => requestAnimationFrame(() => resolve()));

function dates(calendar: CalendarMonthInput) {
	return Array.from(calendar.shadowRoot?.querySelectorAll<CalendarDate>('c-calendar-date') ?? []);
}

function monthInput(a: TestApi, picker: Datepicker) {
	const calendar = picker.shadowRoot?.querySelector('c-calendar-month-input');
	a.assert(calendar instanceof CalendarMonthInput);
	return calendar;
}

function button(a: TestApi, host: Datepicker | DatepickerPopup, selector: string) {
	const el = host.shadowRoot?.querySelector<HTMLElement>(selector);
	a.assert(el);
	return el;
}

export default spec('datepicker', (a: TestApi) => {
	a.test('registers every component through the public entry point', (a: TestApi) => {
		for (const [tag, ctor] of [
			['c-calendar-date', CalendarDate], ['c-calendar-cell', CalendarCell],
			['c-calendar-month-input', CalendarMonthInput], ['c-datepicker', Datepicker],
			['c-datepicker-popup', DatepickerPopup],
		] as const) {
			a.equal(getRegisteredComponents()[tag], ctor);
			a.ok(document.createElement(tag) instanceof ctor);
		}
	});

	a.test('updates cell labels, today and selection semantics, and clears stale metadata', (a: TestApi) => {
		const date = new Date(2024, 1, 29);
		const cell = create(CalendarDate, { locale: 'fr-FR', selected: true,
			date: { date, time: date.getTime(), isToday: true, isOutsideMonth: false } });
		a.dom.append(cell);
		a.equal(cell.textContent, '29');
		a.equal(cell.role, 'gridcell');
		a.equal(cell.ariaSelected, 'true');
		a.equal(cell.ariaCurrent, 'date');
		a.equal(cell.ariaLabel, date.toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }));
		cell.date = undefined;
		cell.selected = false;
		a.equal(cell.textContent, '');
		a.equal(cell.ariaLabel, null);
		a.equal(cell.ariaCurrent, null);
		a.ok(!cell.hasAttribute('today'));
		a.equal(cell.ariaSelected, 'false');
	});

	a.test('shows overflow counts and emits current date information', (a: TestApi) => {
		const cell = a.element(CalendarCell);
		const date = new Date(2024, 0, 1);
		const info = { date, time: date.getTime(), isToday: false, isOutsideMonth: false };
		cell.date = info;
		let detail: unknown;
		cell.onshowmore = ev => detail = ev.detail;
		cell.overflow = 3;
		const more = cell.shadowRoot?.querySelector<HTMLElement>('c-button-text');
		a.assert(more);
		a.equal(more.textContent, '3 More');
		more.click();
		a.equal(detail, info);
		cell.overflow = 0;
		a.equal(cell.shadowRoot?.querySelector('c-button-text'), null);
		cell.overflow = -1;
		a.equal(cell.shadowRoot?.querySelector('c-button-text'), null);
	});

	for (const [month, start, count, first, last] of [
		['2021-02', 1, 28, '2021-02-01', '2021-02-28'],
		['2024-02', 0, 35, '2024-01-28', '2024-03-02'],
		['2024-06', 1, 35, '2024-05-27', '2024-06-30'],
		['2024-09', 1, 42, '2024-08-26', '2024-10-06'],
	] as const) {
		a.test(`renders complete weeks for ${month}, starting ${start}`, (a: TestApi) => {
			const calendar = create(CalendarMonthInput, { weekstart: start });
			calendar.setAttribute('month', month);
			a.dom.append(calendar);
			const cells = dates(calendar);
			a.equal(cells.length, count);
			a.equal(cells[0]?.date?.date.getDay(), start);
			a.equal(cells[0]?.date?.time, new Date(`${first}T00:00`).getTime());
			a.equal(cells.at(-1)?.date?.time, new Date(`${last}T00:00`).getTime());
			a.equal(calendar.startDate?.getTime(), cells[0]?.date?.time);
			a.equal(calendar.shadowRoot?.querySelectorAll('[role=row]').length, count / 7 + 1);
		});
	}

	a.test('follows active locale and week start while honoring explicit overrides', async (a: TestApi) => {
		const active = content.locale.value;
		const calendar = create(CalendarMonthInput, { month: new Date(2024, 1, 1) });
		a.dom.append(calendar);
		try {
			content.locale.next({ ...active, localeName: 'fr-FR', weekStart: 1 });
			a.equal(dates(calendar)[0]?.date?.date.getDay(), 1);
			a.ok(dates(calendar)[0]?.ariaLabel?.includes('janvier'));
			calendar.locale = 'de-DE';
			calendar.weekstart = 0;
			a.equal(dates(calendar)[0]?.date?.date.getDay(), 0);
		} finally { content.locale.next(active); }
		await frame();
		const heading = calendar.shadowRoot?.querySelector('[role=columnheader]')?.textContent;
		a.ok(['Sonntag', 'So', 'S'].includes(heading ?? ''));
	});

	a.test('selects dates once, clears selection, and preserves keyboard focus', async (a: TestApi) => {
		const calendar = create(CalendarMonthInput, { month: new Date(2024, 1, 1), value: new Date(2024, 1, 15, 12) });
		let changes = 0;
		calendar.addEventListener('change', () => changes++);
		a.dom.append(calendar);
		await frame();
		a.equal(changes, 0);
		a.equal(dates(calendar).filter(el => el.selected).length, 1);
		calendar.focus();
		const selected = dates(calendar).find(el => el.selected);
		a.assert(selected);
		a.equal(calendar.shadowRoot?.activeElement, selected);
		triggerKeydown(selected, 'ArrowDown');
		a.equal((calendar.shadowRoot?.activeElement as CalendarDate).date?.date.getDate(), 22);
		triggerKeydown(calendar.shadowRoot?.activeElement ?? calendar, 'Home');
		a.equal((calendar.shadowRoot?.activeElement as CalendarDate).date?.date.getDate(), 18);
		triggerKeydown(selected, 'Enter');
		a.equal(calendar.value?.getDate(), 15);
		a.equal(calendar.value?.getHours(), 0);
		a.equal(changes, 1);
		calendar.value = undefined;
		a.equal(dates(calendar).filter(el => el.selected).length, 0);
		const first = dates(calendar)[0];
		a.assert(first);
		first.click();
		a.equal(changes, 2);
		calendar.disabled = true;
		first.click();
		triggerKeydown(first, 'Enter');
		a.equal(changes, 2);
		a.ok(dates(calendar).every(el => el.disabled && el.tabIndex < 0));
	});

	a.test('rejects invalid values and avoids rendering invalid months', (a: TestApi) => {
		const calendar = a.element(CalendarMonthInput);
		calendar.setAttribute('value', '2023-02-29');
		a.ok(!calendar.checkValidity());
		calendar.removeAttribute('value');
		a.ok(calendar.checkValidity());
		calendar.setAttribute('month', 'invalid');
		a.equal(dates(calendar).length, 0);
		calendar.setAttribute('month', '0099-02');
		a.equal(dates(calendar).find(el => !el.date?.isOutsideMonth)?.date?.date.getFullYear(), 99);
	});

	a.test('navigates from month end without rollover, using localized menus', (a: TestApi) => {
		const picker = create(Datepicker, { value: new Date(2024, 0, 31), locale: 'ar-EG', minyear: 2023, maxyear: 2025 });
		let changes = 0;
		picker.addEventListener('change', () => changes++);
		a.dom.append(picker);
		const calendar = monthInput(a, picker);
		button(a, picker, '[title="Next Month"]').click();
		a.equal(calendar.month?.getMonth(), 1);
		a.equal(picker.value?.getMonth(), 0);
		button(a, picker, '.header c-button-text.margin').click();
		const menus = picker.shadowRoot?.querySelectorAll<MenuElement>('c-menu');
		const year = menus?.[0];
		a.assert(year);
		const items = year.querySelectorAll<HTMLElement>('c-item');
		a.equal(items.length, 3);
		items[2]?.click();
		a.equal(calendar.month?.getFullYear(), 2025);
		a.equal(calendar.month?.getMonth(), 1);
		a.equal(year.open, false);
		button(a, picker, '.header c-button-text:not(.margin)').click();
		menus[1]?.querySelectorAll<HTMLElement>('c-item')[3]?.click();
		a.equal(calendar.month?.getMonth(), 3);
		a.equal(changes, 0);
		dates(calendar).find(el => !el.date?.isOutsideMonth)?.click();
		a.equal(changes, 1);
		a.equal(picker.value?.getFullYear(), 2025);
		picker.value = undefined;
		a.equal(dates(calendar).filter(el => el.selected).length, 0);
	});

	a.test('enforces year bounds and disabled controls, recovering after invalid input', (a: TestApi) => {
		const picker = create(Datepicker, { value: new Date(2024, 0, 1), minyear: 2024, maxyear: 2024 });
		a.dom.append(picker);
		const calendar = monthInput(a, picker);
		button(a, picker, '[title="Previous Month"]').click();
		a.equal(calendar.month?.getMonth(), 0);
		a.ok(dates(calendar).filter(el => el.date?.date.getFullYear() !== 2024).every(el => el.disabled), 'out of year cells disabled');
		picker.disabled = true;
		button(a, picker, '[title="Next Month"]').click();
		a.equal(calendar.month?.getMonth(), 0);
		a.equal(calendar.disabled, true);
		picker.disabled = false;
		picker.setAttribute('value', 'garbage');
		a.ok(!picker.checkValidity(), `invalid date ${String(picker.value)}, bounds ${picker.minyear}-${picker.maxyear}`);
		picker.value = new Date(2025, 0, 1);
		a.ok(!picker.checkValidity(), `invalid date ${String(picker.value)}, bounds ${picker.minyear}-${picker.maxyear}`);
		picker.value = new Date(2024, 11, 31);
		a.ok(picker.checkValidity(), `valid date ${String(picker.value)}, bounds ${picker.minyear}-${picker.maxyear}`);
		button(a, picker, '[title="Next Month"]').click();
		a.equal(calendar.month?.getMonth(), 11);
		picker.minyear = 2025;
		a.ok(!picker.checkValidity(), `invalid date ${String(picker.value)}, bounds ${picker.minyear}-${picker.maxyear}`);
		picker.maxyear = 2026;
		picker.value = new Date(2025, 0, 1);
		a.ok(picker.checkValidity(), `valid date ${String(picker.value)}, bounds ${picker.minyear}-${picker.maxyear}`);
	});

	for (const native of [true, false]) for (const ctor of [CalendarMonthInput, Datepicker]) {
		a.test(`${ctor.name} supports ${native ? 'native' : 'custom'} forms and reset`, (a: TestApi) => {
			const form = native ? document.createElement('form') : new Form();
			const initial = new Date(2024, 1, 29);
			const input = create<CalendarMonthInput | Datepicker>(ctor, { name: 'date', value: initial });
			form.append(input);
			a.dom.append(form);
			input.value = new Date(2024, 2, 1);
			if (form instanceof HTMLFormElement) a.equal(new FormData(form).get('date'), String(input.value));
			else a.equal(form.getFormData().date, input.value);
			input.value = new Date(NaN);
			a.ok(!form.checkValidity());
			input.touched = true;
			form.reset();
			a.equal(input.value, initial);
			a.equal(input.touched, false);
			a.ok(form.checkValidity());
		});
	}

	a.test('confirms or cancels a field date and synchronizes empty values and disabled state', async (a: TestApi) => {
		const initial = new Date(2024, 1, 29);
		const input = create(InputDate, { value: initial, locale: 'fr-FR' });
		const popup = create(DatepickerPopup, { static: true });
		const field = create(Field, undefined, input, popup);
		a.dom.append(field);
		await frame();
		popup.open = true;
		a.equal(popup.datepicker.value?.getTime(), initial.getTime());
		a.equal(popup.datepicker.locale, 'fr-FR');
		let changes = 0, inputs = 0;
		input.addEventListener('change', () => changes++);
		input.addEventListener('input', () => inputs++);
		popup.datepicker.value = new Date(2024, 2, 1);
		button(a, popup, '#footer c-button-text').click();
		a.equal(popup.open, false);
		a.equal(input.value, initial);
		a.equal(changes, 0);
		popup.open = true;
		popup.datepicker.value = new Date(2024, 2, 1);
		button(a, popup, '#footer c-button-text:last-child').click();
		a.equal(input.value?.getMonth(), 2);
		a.equal(changes, 1);
		a.equal(inputs, 1);
		input.value = undefined;
		a.equal(popup.datepicker.value, undefined);
		input.disabled = true;
		a.equal(popup.datepicker.disabled, true);
		popup.open = true;
		popup.datepicker.value = new Date(2024, 3, 1);
		button(a, popup, '#footer c-button-text:last-child').click();
		a.equal(input.value, undefined);
		input.disabled = false;
		field.remove();
		a.dom.append(field);
		await frame();
		popup.open = true;
		popup.datepicker.value = new Date(2024, 3, 1);
		button(a, popup, '#footer c-button-text:last-child').click();
		a.equal(changes, 2);
	});

	a.test('focuses selected menu items on open and returns focus on Escape', (a: TestApi) => {
		const picker = create(Datepicker, { value: new Date(2024, 1, 29), minyear: 2023, maxyear: 2025 });
		a.dom.append(picker);
		const yearButton = button(a, picker, '.header c-button-text.margin');
		yearButton.click();
		const menu = picker.shadowRoot?.querySelector('c-menu');
		a.assert(menu instanceof Menu);
		a.equal(picker.shadowRoot?.activeElement, menu.querySelector('[selected]'));
		triggerKeydown(menu, 'Escape');
		a.equal(menu.open, false);
		a.equal(picker.shadowRoot?.activeElement, yearButton);
		yearButton.click();
		a.equal(picker.shadowRoot?.activeElement, menu.querySelector('[selected]'));
	});

	a.test('validates bounded month values and reconnects without duplicate events', (a: TestApi) => {
		const calendar = create(CalendarMonthInput, { month: new Date(2024, 0, 1), minyear: 2024, maxyear: 2024 });
		a.dom.append(calendar);
		calendar.value = new Date(2023, 0, 1);
		a.ok(!calendar.checkValidity());
		calendar.value = undefined;
		a.ok(calendar.checkValidity());
		let changes = 0;
		calendar.addEventListener('change', () => changes++);
		calendar.remove();
		a.dom.append(calendar);
		dates(calendar).find(el => !el.disabled)?.click();
		a.equal(changes, 1);
	});

	a.test('shares one size observer and releases it on disconnect', (a: TestApi) => {
		const calendar = create(CalendarMonthInput, { month: new Date(2024, 1, 1) });
		const NativeResizeObserver = ResizeObserver;
		const observers = new Set<ResizeObserver>();
		a.mock(globalThis, 'ResizeObserver', class extends NativeResizeObserver {
			observe(target: Element, options?: ResizeObserverOptions) {
				if (target === calendar) observers.add(this);
				super.observe(target, options);
			}
			disconnect() {
				observers.delete(this);
				super.disconnect();
			}
		});
		a.dom.append(calendar);
		a.equal(observers.size, 1);
		calendar.remove();
		a.equal(observers.size, 0);
		a.dom.append(calendar);
		a.equal(observers.size, 1);
		calendar.remove();
		a.equal(observers.size, 0);
	});

	a.test('restores one date to the Tab order after re-enabling', async (a: TestApi) => {
		const calendar = create(CalendarMonthInput, { month: new Date(2024, 1, 1) });
		a.dom.append(calendar);
		await frame();
		a.equal(dates(calendar).filter(el => el.tabIndex === 0).length, 1, 'initial tab stop');
		calendar.disabled = true;
		a.ok(dates(calendar).every(el => el.tabIndex < 0));
		calendar.disabled = false;
		await frame();
		a.equal(dates(calendar).filter(el => el.tabIndex === 0).length, 1, 're-enabled tab stop');
	});

	a.test('discards draft dates on Escape and restores focus to the trigger', (a: TestApi) => {
		const input = create(InputDate, { value: new Date(2024, 1, 29) });
		const trigger = document.createElement('button');
		const popup = create(DatepickerPopup, { input, returnTo: trigger });
		a.dom.append(input, trigger, popup);
		popup.open = true;
		popup.datepicker.value = new Date(2024, 2, 1);
		triggerKeydown(popup, 'Escape');
		a.equal(popup.open, false);
		a.equal(document.activeElement, trigger);
		a.equal(input.value?.getMonth(), 1);
		popup.open = true;
		a.equal(popup.datepicker.value.getMonth(), 1);
		popup.open = false;
	});
});

type MenuElement = HTMLElement & { open: boolean };
