import { Component, Slot, component } from './component.js';
import { buildGo, manageFocus, navigation } from './navigation.js';
import { itemHost } from './navigation-list.js';
import { observeChildren } from './dom.js';
import { css } from './theme.js';
import { Observable, merge } from './rx.js';
import { role } from './a11y.js';

import type { ItemBase } from './item.js';

type GridItem = HTMLElement & { disabled?: boolean };

export interface GridNavigationOptions<T extends GridItem> {
	host: HTMLElement;
	getFocusable: () => T[];
	getActive: () => HTMLElement | undefined;
	getSelected?: () => T | undefined;
	observe?: Observable<unknown>;
	columns?: number;
}

declare module './component' {
	interface Components {
		'c-grid-list': GridList;
	}
}

/**
 * Provides arrow-key navigation in all directions over a collection of items, highlighting the currently focusable item while skipping hidden elements, and ensuring the correct tabIndex management for accessibility compliance.
 */
export function gridNavigation<T extends GridItem>(
	options: GridNavigationOptions<T>,
) {
	const { host, getActive, getSelected } = options;
	const columns = options.columns
		? Math.max(1, Math.floor(options.columns))
		: undefined;
	let items: T[] = [];
	const observe = (options.observe ?? observeChildren(host)).tap(() => {
		items = options.getFocusable();
	});
	const getFocusable = () => items;
	const go = buildGo({ getFocusable, getActive });

	function vertical(direction: -1 | 1) {
		if (columns) return go(direction * columns);
		const active = getActive();
		if (!active) return;
		const start = active.getBoundingClientRect();
		const startX = start.left + start.width / 2;
		const startY = start.top + start.height / 2;
		let next: T | undefined;
		let nextDistance = Infinity;

		for (const item of items) {
			if (item === active || item.disabled || !item.checkVisibility())
				continue;
			const rect = item.getBoundingClientRect();
			const x = rect.left + rect.width / 2;
			const y = rect.top + rect.height / 2;
			const distanceY = (y - startY) * direction;
			if (distanceY <= 0) continue;
			const distance = distanceY ** 2 + (x - startX) ** 2;
			if (distance < nextDistance) {
				next = item;
				nextDistance = distance;
			}
		}
		return next;
	}

	function rowEdge(end: boolean) {
		if (!columns) return;
		const active = getActive();
		const index = items.findIndex(item => item === active);
		if (index === -1) return;
		const row = index - (index % columns);
		return items[
			Math.min(row + (end ? columns - 1 : 0), items.length - 1)
		];
	}

	return merge(
		manageFocus({
			host,
			getFocusable,
			getActive,
			getSelected,
			observe,
		}),
		navigation({
			host,
			goRight: () => {
				const active = getActive();
				const index = items.findIndex(item => item === active);
				return columns && index % columns === columns - 1
					? undefined
					: go(1);
			},
			goLeft: () => {
				const active = getActive();
				const index = items.findIndex(item => item === active);
				return columns && index % columns === 0 ? undefined : go(-1);
			},
			goFirst: () => go(1, -1),
			goLast: () => go(-1, items.length),
			goFirstColumn: () => rowEdge(false),
			goLastColumn: () => rowEdge(true),
			goUp: () => vertical(-1),
			goDown: () => vertical(1),
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
		$ =>
			gridNavigation({
				host: $,
				getFocusable: () => $.items,
				getActive: () =>
					$.items.find(item =>
						item.matches(':focus,:focus-within'),
					),
				getSelected: () => $.items.find(item => item.selected),
				observe: itemHost($),
			}),
	],
});
