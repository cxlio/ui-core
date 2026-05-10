import {
	Component,
	component,
	create,
	getShadow,
	//messageProxy,
} from './component.js';
import { Menu } from './menu.js';
import { Icon } from './icon.js';
import { css } from './theme.js';
import { EMPTY, combineLatest, merge } from './rx.js';
import { debounceRaf, hovered, on, onAction } from './dom.js';
import { positionElement } from './position.js';

declare module './component.js' {
	interface Components {
		'c-item-menu': ItemMenu;
	}
}

/**
 * Displays a submenu trigger arrow in an item and manages a nested menu's
 * open/close state.
 *
 * Offers keyboard and mouse interaction to open child menu
 * placement relative to its parent and closes menu on outside interaction.
 *
 * Works as a nested child for an item; appears as a right-arrow icon that flips
 * in RTL based on document or parent direction. Automatically positions the
 * submenu to the "end" of the parent and aligns vertically.
 *
 * Supports exclusive menu stacking with parent elements, and coordinates open/
 * close state so only one child c-item-menu stays open at a time among siblings.
 *
 * When embedded in RTL hierarchies, the arrow flips visually and keybindings
 * adapt accordingly to match flow direction. Handles popover positioning on
 * open events, using end-aligned, vertical placement relative to the parent.
 *
 * Any slotted content inside <c-item-menu> is automatically rendered as the menu
 * content.
 *
 * @title Submenu · Nested Item Menu
 * @icon arrow_right
 * @tagName c-item-menu
 * @demo
 * <c-item>
 *   <c-icon fill style="color: #2196f3" name="description"></c-icon>
 *   Document
 *   <c-item-menu>
 *      <c-item>Blank Document</c-item>
 *      <c-item>From a Template</c-item>
 *   </c-item-menu>
 * </c-item>
 *
 * @demo <caption>RTL Support</caption>
 * <c-item dir="rtl">
 *   <c-icon fill style="color: #2196f3" name="description"></c-icon>
 *   Document
 *   <c-item-menu>
 *      <c-item>Blank Document</c-item>
 *      <c-item>From a Template</c-item>
 *   </c-item-menu>
 * </c-item>
 *
 */
export class ItemMenu extends Component {}

component(ItemMenu, {
	tagName: 'c-item-menu',
	augment: [
		css(`
:host {
	margin-inline-start: auto;
	margin-inline-end: -8px;
	display: inline-block;
	overflow: hidden;
	/* prevents scroll on container */
	position:relative;
}
:host(:dir(rtl)) .icon { scale: -1 1; }
		`),
		$ => {
			const menu = create(Menu, { exclusive: false }, create('slot'));
			const icon = create(Icon, {
				name: 'arrow_right',
				className: 'icon',
			});

			getShadow($).append(icon, menu);

			menu.popover = 'manual';

			const parent = $.parentElement;
			if (!parent) return EMPTY;

			const handleVisibility = debounceRaf((show: boolean) => {
				if (menu.open === show) return;

				menu.trigger = parent;
				menu.open = show;
				menu.returnTo = parent;
				if (show) {
					positionElement({
						element: menu,
						relativeTo: parent,
						position: 'end top-to-bottom',
					});
				} else parent.focus();
			});

			return merge(
				combineLatest(hovered(menu), hovered(parent)).tap(([v1, v2]) =>
					handleVisibility(v1 || v2),
				),
				//messageProxy($, 'registable.list', menu),
				onAction(parent).tap(() => handleVisibility(true)),
				// On touch devices, focus can lag behind, which might cause the menu to close too early.
				on(parent, 'focus').tap(() => {
					if (menu.open) menu.setFocus();
				}),
				// Close if parent closes
				on(window, 'close', { capture: true }).tap(ev => {
					if (ev.target instanceof Node && ev.target.contains($))
						handleVisibility(false);
				}),
				on(parent, 'keydown').tap(ev => {
					const isRTL = getComputedStyle($).direction === 'rtl';
					if (
						ev.key === ' ' ||
						ev.key === 'Enter' ||
						ev.key === (isRTL ? 'ArrowLeft' : 'ArrowRight')
					) {
						if (!menu.open) {
							handleVisibility(true);
							ev.stopPropagation();
						}
					} else if (
						menu.open &&
						(ev.key === (isRTL ? 'ArrowRight' : 'ArrowLeft') ||
							ev.key === 'Escape')
					) {
						handleVisibility(false);
						ev.stopPropagation();
						parent.focus();
					} else return;
					ev.preventDefault();
				}),
			);
		},
	],
});
