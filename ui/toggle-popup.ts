import {
	Component,
	Slot,
	component,
	styleAttribute,
	attribute,
	attributeChanged,
} from './component.js';
import { isHidden, onResize, on } from './dom.js';
import { EMPTY, merge } from './rx.js';
import { css } from './theme.js';
import { toggleComponent } from './toggle.js';
import { PopupPosition, positionElement } from './position.js';
import { getTargetById } from './util.js';

import type { ToggleTargetLike } from './toggle-target.js';

export function popupToggleBehavior($: TogglePopup) {
	const onPosition = merge(
		attributeChanged($, 'position'),
		on(window, 'scroll', { capture: true, passive: true }),
	);
	const position = (element: HTMLElement) =>
		positionElement({
			element,
			relativeTo:
				(typeof $.relative === 'string'
					? getTargetById($, $.relative)
					: $.relative) ??
				$.firstElementChild ??
				$,
			position: $.position || 'auto',
			container: document.body,
		});

	return toggleComponent($).switchMap(({ target, open }) => {
		if (target.open && open) {
			// We need to close the popup so its bindings are also closed.
			target.open = false;
		}
		if (target.trigger !== $) return EMPTY;

		target.open = open;

		if (open) {
			const targetEl = target.dialog ?? target;
			const trigger = $.firstElementChild;
			if (target.dialog) targetEl.style.margin = '0';
			// Position first to prevent flickering.
			position(targetEl);
			return merge(onResize(targetEl), onPosition).raf(() => {
				if (trigger && isHidden(trigger as HTMLElement)) $.open = false;
				else position(targetEl);
			});
		}
		return EMPTY;
	});
}

/**
 * This component, c-popup-toggle, manages the visibility of a popup container based on user interaction.
 *
 * @beta
 * @demo
 * <c-popup-toggle target="popup">
 *   <c-button>Open</c-button>
 * </c-popup-toggle>
 * <c-popup aria-label="target popup" id="popup">
 *   <c-c pad32 elevation="3">Popup</c-c>
 * </c-popup>
 */
export class TogglePopup extends Component {
	/**
	 * A boolean style attribute indicating the popup's current visibility state (opened or closed).
	 * @attribute
	 */
	open = false;

	/**
	 * An attribute referencing the ID of the popup element it controls or a ToggleTarget object.
	 * @attribute
	 */
	target?: string | ToggleTargetLike;

	/*
	 * The `position` attribute allows customization of how the popup is positioned
	 * relative to its related element. It can be a predefined PopupPosition value
	 * to specify a fixed positioning behavior,
	 * or a function that receives the popup element for dynamic positioning logic.
	 */
	position?: PopupPosition | ((el: HTMLElement) => void);

	/**
	 * An element to position the popup relative to.
	 * @attribute
	 */
	relative?: string | Element;

	trigger?: 'hover' | 'click';
}

component(TogglePopup, {
	tagName: 'c-toggle-popup',
	init: [
		styleAttribute('open'),
		attribute('target'),
		attribute('position'),
		attribute('relative'),
		attribute('trigger'),
	],
	augment: [popupToggleBehavior, Slot, css(':host{display:contents}')],
});
