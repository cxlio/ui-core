import { component, create, get, getShadow, property } from './component.js';
import { css } from './theme.js';
import { fieldInput } from './field-input.js';
import { on, onAction } from './dom.js';
import { content } from './locale.js';
import { merge, EMPTY } from './rx.js';
import { InputDateBase } from './input-date.js';
import { Datepicker } from './datepicker.js';
import { Toolbar } from './toolbar.js';
import { ButtonText } from './button-text.js';
import { Popup } from './popup.js';

declare module './component.js' {
	interface Components {
		'c-datepicker-popup': DatepickerPopup;
	}
}

/**
 * Opens a date-selection panel for an associated InputDate field.
 * Follows the field's value, locale, and disabled state. Edits remain a draft
 * until OK updates the field and emits input and change. Cancel or Escape
 * discards the draft. OK and Cancel return focus to the trigger or associated input;
 * Escape returns focus to returnTo when configured.
 * Finds the date input through the enclosing Field, or accepts an explicit input property.
 * @tagName c-datepicker-popup
 * @title Datepicker Popup
 * @icon calendar_today
 * @see InputDate
 * @see Datepicker
 * @example
 * <c-field>
 *   <c-label>Date</c-label>
 *   <c-input-date value="2024-02-29"></c-input-date>
 *   <c-toggle-popup slot="trailing" target="_next">
 *     <c-icon-button icon="calendar_today" aria-label="Choose date"></c-icon-button>
 *   </c-toggle-popup>
 *   <c-datepicker-popup></c-datepicker-popup>
 * </c-field>
 */
export class DatepickerPopup extends Popup {
	/** Date-selection panel used to edit the draft and configure year bounds. */
	readonly datepicker = create(Datepicker);

	/** Explicit date input to synchronize. When omitted, uses the enclosing Field's input. */
	input?: InputDateBase;
}

component(DatepickerPopup, {
	tagName: 'c-datepicker-popup',
	init: [property('input')],
	augment: [
		css(`
:host { border-radius: var(--cxl-shape-corner-large); overflow: hidden; }
#footer { margin: 0 24px; }
#footer :first-child { margin-inline-start: auto; }
		`),
		$ => on($, 'click').tap(ev => ev.stopPropagation()),
		$ => {
			let input: InputDateBase | undefined;
			function sync() {
				$.datepicker.value = input?.value && !isNaN(input.value.getTime()) ? new Date(input.value) : undefined;
			}
			function close(confirm: boolean) {
				if (confirm && input && !input.disabled && $.datepicker.checkValidity()) {
					input.value = $.datepicker.value;
					input.dispatchEvent(new Event('input', { bubbles: true }));
					input.dispatchEvent(new Event('change', { bubbles: true }));
				}
				$.open = false;
				($.returnTo ?? input)?.focus();
			}
			getShadow($).append($.datepicker, create(Toolbar, { id: 'footer' },
				create(ButtonText, { $: el => onAction(el).tap(() => close(false)) }, content.get('core.cancel')),
				create(ButtonText, {
					disabled: get($.datepicker, 'disabled'),
					$: el => onAction(el).tap(() => { if (!el.disabled) close(true); }),
				}, content.get('core.ok')),
			));
			return merge(
				merge(get($, 'input'), fieldInput($)).switchMap(value => {
					input = value instanceof InputDateBase ? value : undefined;
					sync();
					if (!input) return EMPTY;
					return merge(
						get(input, 'value').tap(sync),
						get(input, 'locale').tap(locale => $.datepicker.locale = locale),
						get(input, 'disabled').tap(disabled => $.datepicker.disabled = disabled),
					);
				}),
				get($, 'open').tap(open => { sync(); if (open) $.datepicker.focus(); }),
				on($.datepicker, 'change').tap(ev => ev.stopPropagation()),
			);
		},
	],
});
