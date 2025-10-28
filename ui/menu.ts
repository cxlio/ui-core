import { attribute, component, get } from './component.js';

import { role } from './a11y.js';
import { buildMenuStyles, css } from './theme.js';
import { Popup } from './popup.js';
import { navigationList } from './navigation-list.js';
import { getRoot } from './dom.js';

import type { Motion } from './motion.js';
import type { ItemBase } from './item.js';

declare module './component' {
	interface Components {
		'c-menu': Menu;
	}
}

/**
 * Represents a pop-up menu displaying interactive options as a list.
 *
 * Supports keyboard and pointer navigation, maintaining focus management.
 * The menu visually appears/disappears
 * using motion presets.
 *
 * The menu automatically focuses either the first enabled item or the
 * selected one when opened.
 *
 * The underlying role="menu" is always present for assistive technology support.
 *
 * Keyboard navigation follows expected conventions with arrow keys,
 * Home/End, and Tab support handled by the `navigationList` module.
 *
 * Directionality (LTR/RTL) is automatically respected per inherited DOM
 * settings.
 *
 * @title Menu – Interactive List of Actions
 * @icon menu
 * @tagName c-menu
 * @demo
 * <c-menu static open>
 *   <c-item disabled>Option disabled</c-item>
 *   <c-item selected>Option Selected</c-item>
 *   <c-item>Option 2</c-item>
 *   <c-hr></c-hr>
 *   <c-item>Option 3</c-item>
 * </c-menu>
 */
export class Menu extends Popup {
	'motion-in'?: Motion = 'fadeIn';
	'motion-out'?: Motion = 'fadeOut';

	items: ItemBase[] = [];

	/**
	 * Defines which item should receive focus when the menu is opened.
	 * 'first' focuses the first item; 'selected' focuses the selected item if present.
	 * Defaults to 'first'.
	 */
	focusstart?: 'first' | 'selected';

	setFocus() {
		const focused = getRoot(this)?.activeElement;
		if (focused && this.contains(focused)) return;

		if (this.focusstart === 'selected') {
			const selected = this.items.find(i => i.selected);
			if (selected) {
				selected.focus();
				return;
			}
		}

		this.items[0]?.focus();
	}
}

component(Menu, {
	tagName: 'c-menu',
	init: [attribute('focusstart')],
	augment: [
		role('menu'),
		css(buildMenuStyles()),
		navigationList,
		$ => {
			return get($, 'open').tap(visible => {
				if (visible) $.setFocus();
			});
		},
	],
});
