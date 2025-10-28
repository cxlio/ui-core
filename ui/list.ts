import { Component, Slot, component } from './component.js';
import { css } from './theme.js';
import { navigationList } from './navigation-list.js';
import { role } from './a11y.js';

declare module './component' {
	interface Components {
		'c-list': List;
	}
}

export interface ItemBaseLike extends Component {
	disabled: boolean;
	touched: boolean;
	selected?: boolean;
}

/**
 * Displays a single-column list of interactive items, supporting selection and
 * navigation behaviors.
 *
 * Automatically manages focus and navigation for its items with roving tabindex.
 * Use with compatible children such as c-item components.
 *
 * Keyboard navigation: ArrowUp/ArrowDown to move focus.
 * Home/End keys move to first/last item respectively.
 * Supports dynamic addition/removal of items; updates ARIA attributes and
 * navigation states accordingly.
 *
 * @title Interactive Item Group
 * @icon format_list_bulleted
 * @tagName c-list
 * @demo
 * <c-list aria-label="Item List">
 *   <c-item><c-avatar alt=""></c-avatar> One Line Item</c-item>
 *   <c-item><c-avatar alt=""></c-avatar> One Line Item</c-item>
 *   <c-item><c-avatar alt=""></c-avatar> One Line Item</c-item>
 * </c-list>
 */
export class List extends Component {
	items: ItemBaseLike[] = [];
}

component(List, {
	tagName: 'c-list',
	augment: [
		css(`:host{display:block;padding:8px 0;}`),
		role('listbox'),
		Slot,
		navigationList,
	],
});
