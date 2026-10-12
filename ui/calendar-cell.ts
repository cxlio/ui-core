import { Component, Slot, component, create, event, get, property, numberAttribute } from './component.js';
import { renderIf } from './render.js';
import { ButtonText } from './button-text.js';
import { onAction, trigger } from './dom.js';
import { css } from './theme.js';
import type { DateInformation } from './calendar-date.js';

declare module './component.js' {
	interface Components {
		'c-calendar-cell': CalendarCell;
	}
}

/** Rendered calendar cell and its position within the date grid. */
export interface CalendarCellData {
	element: CalendarCell;
	index: number;
	overflow: number;
	date: Date;
}

/**
 * Contains a calendar date and optional slotted content.
 * Positive overflow counts display a More action that emits the current date information.
 * @tagName c-calendar-cell
 * @title Calendar Cell
 * @icon calendar_view_month
 * @see CalendarDate
 */
export class CalendarCell extends Component {
	/**
	 * Number of additional items represented by the More action. Zero hides the action.
	 * @attribute
	 */
	overflow = 0;

	/** Date information included in the showmore event. */
	date?: DateInformation;

	/**
	 * Called when More is activated and date information is available.
	 * The event detail contains this cell's DateInformation.
	 * @event
	 */
	onshowmore?: (ev: CustomEvent<DateInformation>) => void;
}

component(CalendarCell, {
	tagName: 'c-calendar-cell',
	init: [numberAttribute('overflow'), property('date'), event('showmore')],
	augment: [
		css(`
:host { position: relative; text-align: center; }
.showmore {
	position: absolute;
	bottom: 0;
	padding: 0 4px;
	margin: 0;
	min-height: 14px;
	white-space: nowrap;
}
		`),
		Slot,
		$ => renderIf(get($, 'overflow').map(n => n > 0 ? n : 0), count => create(ButtonText, {
			className: 'showmore',
			$: el => onAction(el).tap(() => {
				if ($.date) trigger($, 'showmore', { detail: $.date });
			}),
		}, count, ' More'))($),
	],
});
