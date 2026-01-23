import {
	component,
	create,
	attribute,
	get,
	getShadow,
	styleAttribute,
} from './component.js';
import { navItemComponent } from './nav-item.js';
import { ItemBase } from './item.js';
import { Icon } from './icon.js';
import { ToggleTargetLike } from './toggle-target.js';
//import { getTargets } from './toggle.js';
import { css, Size, sizeAttribute } from './theme.js';
import { merge } from './rx.js';
import { role } from './a11y.js';
import { toggleComponent } from './toggle.js';

declare module './component.js' {
	interface Components {
		'c-nav-dropdown': NavDropdown;
	}
}

/**
 * Toggleable nav item that expands/collapses a linked target container.
 *
 * Requires a `target` that supports `.open` (e.g., `c-toggle-target`) or a
 * selector resolving to such an element.
 *
 * If `target` is an array, all targets receive the same `open` state.
 *
 * Indicator icon is rendered inside the component and rotates when `open`
 * is present.
 *
 * @demo
 * <div>
 * <c-nav-dropdown open target="_next" iconalign="end">Navigation Items</c-nav-dropdown>
 * <c-toggle-target>
 *   <c-nav-item>Navigation Item 1</c-nav-item>
 *   <c-nav-item>Navigation Item 2</c-nav-item>
 * </c-toggle-target>
 * </div>
 *
 * @title Dropdown Navigation Item
 * @icon unfold_more
 * @tagName c-nav-dropdown
 * @see NavTarget
 * @see Tree
 */
export class NavDropdown extends ItemBase {
	/**
	 * Defines the icon for the dropdown indicator. Used to visually signal the expand/collapse affordance.
	 */
	icon = 'arrow_drop_down';

	/**
	 * Indicates whether the dropdown is expanded to reveal its nested sub-items.
	 * When `open` is true, sub-items and the indicator icon rotate to show an expanded state.
	 * Controls both visual presentation and accessibility state for hierarchical navigation.
	 */
	open = false;

	/**
	 * Specifies the content or element(s) controlled by this dropdown. Used to identify
	 * which sub-navigation section(s) should be shown or hidden as the dropdown expands or collapses.
	 * Accepts a selector string, ToggleTarget-like object, or an array thereof for flexibility in referencing targets.
	 */
	target?: string | ToggleTargetLike | ToggleTargetLike[];

	/**
	 * Adjusts overall dropdown component size, affecting minimum height and spacing,
	 * to support visual alignment and accessibility across different UI contexts.
	 */
	size?: Size;
}

component(NavDropdown, {
	tagName: 'c-nav-dropdown',
	init: [
		attribute('icon'),
		attribute('target'),
		styleAttribute('open'),
		sizeAttribute('size', size => `{min-height:${56 + size * 8}px}`),
	],
	augment: [
		role('treeitem'),
		...navItemComponent,
		css(`
:host { padding-inline: 16px 36px; }
.icon { position: absolute; inset-inline-end: 8px; transition: rotate var(--cxl-speed); height:24px;width:24px; }
:host([open]) .icon { rotate: 180deg; }
		`),
		$ => toggleComponent($).raf(({ target, open }) => (target.open = open)),
		$ => {
			const icon = create(Icon, { className: 'icon' });
			getShadow($).append(icon);

			return merge(get($, 'icon').tap(name => (icon.name = name)));
		},
	],
});
