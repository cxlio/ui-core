import {
	Slot,
	attribute,
	attributeChanged,
	component,
	get,
	styleAttribute,
} from './component.js';
import { on } from './dom.js';
import { EMPTY, merge } from './rx.js';
import {
	ToggleTargetBase,
	toggleTargetBehavior,
	toggleTargetStyles,
} from './toggle-target.js';
import { popupManager } from './popup-manager.js';
import { css, surface } from './theme.js';

declare module './component' {
	interface Components {
		'c-popup': Popup;
	}
}

export const popupStyles = css(`
:host {
	position: fixed;
	margin: 0;
	padding: 0;
	outline: 0;
	border: 0;
	display: block;
	border-radius: var(--cxl-shape-corner-xsmall);
	box-shadow: var(--cxl-elevation-2);
	${surface('surface-container')}
}
::backdrop { overflow: hidden; }
:host([static]) { position: static; }
	`);

export function popupBehavior($: Popup) {
	function open() {
		if ($.exclusive && !$.static)
			popupManager.popupOpened({
				element: $,
				close: () => ($.open = false),
			});

		if (!$.static) {
			$.popover ??= 'auto';
			$.showPopover();
		}
	}

	return get($, 'open').switchMap(val => {
		if (val) {
			open();
			return merge(
				// Safari needs keydown preventDefault so it doesn't break fullscreen browser
				on($, 'keydown').tap(ev => {
					if (ev.key === 'Escape') {
						$.open = false;
						$.returnTo?.focus();
						ev.preventDefault();
						ev.stopPropagation();
					}
				}),
				on($, 'toggle').tap(ev => {
					const isOpen = (ev as ToggleEvent).newState === 'open';
					if (!isOpen) $.open = isOpen;
				}),
				attributeChanged($, 'open').tap(open => {
					if (!open && $.popover) $.hidePopover();
				}),
				on($, 'close').tap(ev => {
					if (ev.target === $ && $.popover) $.hidePopover();
				}),
			);
		}
		return EMPTY;
	});
}

/**
 * The Popup component serves as the foundation for creating popup elements.
 * It manages the visibility state of the popup and provides animations for opening and closing.
 * @tagName c-popup
 * @beta
 */
export class Popup extends ToggleTargetBase {
	/**
	 * Indicates whether this popup should close other open popups when activated.
	 * @attribute
	 */
	exclusive = true;

	/**
	 * This attribute determines if the popup avoids being placed in the browser's top-layer stack.
	 * @attribute
	 */
	static = false;

	trigger?: Element;

	returnTo?: HTMLElement;
}

component(Popup, {
	tagName: 'c-popup',
	init: [attribute('exclusive'), styleAttribute('static')],
	augment: [
		Slot,
		toggleTargetStyles,
		popupStyles,
		toggleTargetBehavior,
		popupBehavior,
	],
});
