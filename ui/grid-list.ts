import { Component, Slot, component } from './component.js';
import { navigation } from './navigation.js';
import { buildListGo, manageFocusList } from './navigation-list.js';
import { getRoot } from './dom.js';
import { css } from './theme.js';
import { merge } from './rx.js';
import { role } from './a11y.js';

import type { ItemBase } from './item.js';

declare module './component' {
	interface Components {
		'c-grid-list': GridList;
	}
}

/**
 * Provides arrow-key navigation in all directions over a collection of items, highlighting the currently focusable item while skipping hidden elements, and ensuring the correct tabIndex management for accessibility compliance.
 */
export function gridNavigation($: GridList) {
	const go = buildListGo($);

	function left(item: HTMLElement) {
		return Math.round(item.getBoundingClientRect().left);
	}

	return merge(
		manageFocusList($),
		navigation({
			host: $,
			goRight: () => go(1),
			goLeft: () => go(-1),
			goFirst: () => go(1, -1),
			goLast: () => go(-1, $.items.length),
			goUp: () => {
				const start = getRoot($)?.activeElement as ItemBase | undefined;
				const startLeft = start && left(start);
				return go(
					-1,
					undefined,
					startLeft !== undefined
						? n => left(n) !== startLeft
						: undefined,
				);
			},
			goDown: () => {
				const start = getRoot($)?.activeElement as ItemBase | undefined;
				const startLeft = start && left(start);
				return go(
					1,
					undefined,
					startLeft !== undefined
						? n => left(n) !== startLeft
						: undefined,
				);
			},
		}).tap(item => item.focus()),
	);
}

/**
 * Displays an interactive grid list for managing and displaying multiple item elements with support
 * for keyboard-based navigation in all four directions (up, down, left, right), focus management, and selection tracking.
 *
 * Navigation between grid cells is handled through arrow keys, allowing users to move efficiently
 * across the grid without losing focus context.
 *
 * The component maintains correct focus order, skipping hidden elements, and ensures that only one item is focusable
 * at a time by updating the `tabIndex` properties as needed. When there is no selected item,
 * the first item becomes focusable by default.
 *
 * Items are dynamically registered and ordered inside the grid to preserve correct tab flow and alignment.
 * The component handles focus movement for both linear (row) and columnar (up/down) navigation, ensuring
 * that movement is consistent with both LTR and RTL layouts.
 *
 * Consumers can programmatically invoke `.focus()` on the component to set focus to the currently selected item,
 * or the first item if none are selected.
 * It is expected that `ItemBase` elements in `items` implement `focus()` and maintain a `selected` state.
 *
 * The component exposes all item elements through the `items` readonly property for additional manipulation if required.
 *
 * @tagName c-grid-list
 * @title Grid List UI Component—Keyboard Navigable Item Grid
 * @icon grid_on
 */
export class GridList extends Component {
	/**
	 * Holds all the grid list's registered item elements in their navigable order, enabling the component
	 * to track, manage, and update focus and selection state efficiently as the user interacts with the list.
	 */
	readonly items: ItemBase[] = [];
}

component(GridList, {
	tagName: 'c-grid-list',
	augment: [
		role('grid'),
		css(':host{display:grid;box-sizing:border-box;}'),
		Slot,
		gridNavigation,
	],
});
