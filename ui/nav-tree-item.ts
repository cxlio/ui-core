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
import { ToggleIcon } from './toggle-icon.js';
import { ToggleTargetLike } from './toggle-target.js';
import { getTargets } from './toggle.js';
import { css, Size, sizeAttribute } from './theme.js';
import { EMPTY, merge } from './rx.js';
import { on } from './dom.js';
import { ariaControls, role } from './a11y.js';

declare module './component.js' {
	interface Components {
		'c-nav-tree-item': NavTreeItem;
	}
}

/**
 * Interactive dropdown navigation item for hierarchical menus. Expands to reveal
 * sub-items when activated. Expand/collapse state is controlled by the `open`
 * property and visually indicated by a rotating icon.
 *
 * Set the `target` property to reference sub-navigation content, which will be
 * shown or hidden based on the expand/collapse state. The dropdown adapts to
 * both left-to-right and right-to-left layouts. Users can toggle open state via
 * mouse click or using Left/Right arrow keys. The icon and popup appear only if
 * sub-items exist in the provided target.
 *
 * Keyboard navigation:
 * - Right Arrow opens dropdown (sets `open` to true if sub-items exist)
 * - Left Arrow closes dropdown (sets `open` to false)
 *
 * Accessibility:
 * - Expanded/collapsed state is indicated with `aria-expanded`
 * - If sub-items exist, ARIA popup and controls relationships are set for assistive
 *   technologies.
 *
 * @demo
 * <c-nav-dropdown open target="_next" iconalign="end">Navigation Items</c-nav-dropdown>
 * <c-toggle-target>
 *   <c-nav-item>Navigation Item 1</c-nav-item>
 *   <c-nav-item>Navigation Item 2</c-nav-item>
 * </c-toggle-target>
 *
 * @title Dropdown Navigation Item
 * @icon unfold_more
 * @tagName c-nav-dropdown
 * @see NavTarget
 * @see Tree
 */
export class NavTreeItem extends ItemBase {
	/**
	 * Defines the icon for the dropdown indicator. Used to visually signal the expand/collapse affordance.
	 */
	icon = 'arrow_right';

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

component(NavTreeItem, {
	tagName: 'c-nav-tree-item',
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
:host { padding-inline-start: 20px; }
.icon { position: absolute; inset-inline-start: 0px; transition: rotate var(--cxl-speed); height:24px;width:24px; }
:host(:dir(rtl)) .icon { rotate: 180deg; }
:host([open]) .icon { rotate: 90deg; }
		`),
		$ => {
			const icon = create(ToggleIcon, { className: 'icon' });
			getShadow($).append(icon);

			function hasSubItems(
				targets: ToggleTargetLike | ToggleTargetLike[] | undefined,
			) {
				if (Array.isArray(targets)) {
					for (const t of targets)
						if (t.childNodes.length) return true;
				} else if (targets?.childNodes.length) return true;

				return false;
			}

			return merge(
				get($, 'icon').tap(name => (icon.icon = name)),
				get($, 'open').tap(open => {
					$.ariaExpanded = String(open);
					icon.open = open;
				}),
				get($, 'target').switchMap(() => {
					const targets = getTargets($);
					const hasPopup = hasSubItems(targets);
					icon.style.display = hasPopup ? '' : 'none';
					icon.target = targets;
					return targets
						? ariaControls(
								$,
								Array.isArray(targets) ? targets : [targets],
							)
						: EMPTY;
				}),
				get(icon, 'open').tap(open => ($.open = open)),
				on($, 'keydown').tap(ev => {
					if (ev.key === 'ArrowRight') $.open = true;
					else if (ev.key === 'ArrowLeft') $.open = false;
				}),
			);
		},
	],
});
