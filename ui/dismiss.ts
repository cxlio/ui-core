import { Component, Slot, component, attribute } from './component.js';
import { onAction } from './dom.js';
import { displayContents } from './theme.js';
import { EMPTY } from './rx.js';
import { Motion, motion } from './motion.js';
import { getTarget } from './util.js';

declare module './component' {
	interface Components {
		'c-dismiss': Dismiss;
	}
}

/**
 * Provides an action slot that, when activated, dismisses a targeted ancestor or designated element.
 *
 * Designed for use in banners, snackbars, dialogs, or similar interactive components that require a
 * user-driven close or dismiss action.
 *
 * @tagName c-dismiss
 * @title Dismiss Button for Interactive Alerts and Banners
 * @icon close
 * @demo
 * <c-snackbar static open delay="Infinity">
 *   Single-line Snackbar with action
 *   <c-dismiss slot="action" target="_parent" animation="fadeOut"><c-button-text>Dismiss</c-button-text></c-dismiss>
 * </c-snackbar>
 *
 * @see Snackbar
 */
export class Dismiss extends Component {
	/**
	 * Holds the animation key or a space-separated string of animation keys that dictate
	 * the visual effect during the dismissal of the target element. If not set, the target
	 * will be removed immediately without any animation.
	 * @attribute
	 */
	motion?: Motion;

	/**
	 * Specifies the target for dismissal. It can be an HTMLElement, a string representing
	 * the id of an element, or "_parent" to refer to the parentElement.
	 * @attribute
	 */
	target?: HTMLElement | string;
}

component(Dismiss, {
	tagName: 'c-dismiss',
	init: [attribute('motion'), attribute('target')],
	augment: [
		displayContents,
		Slot,
		$ =>
			getTarget($, 'target').switchMap(target =>
				target
					? onAction($).tap(() => {
							if ($.motion)
								motion($, target, $.motion)
									.finalize(() => target.remove())
									.subscribe();
							else target.remove();
					  })
					: EMPTY,
			),
	],
});
