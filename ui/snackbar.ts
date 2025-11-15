import {
	component,
	create,
	styleAttribute,
	attribute,
	get,
	numberAttribute,
} from './component.js';
import { css } from './theme.js';
import { toggleTargetBehavior, toggleTargetStyles } from './toggle-target.js';
import { Motion } from './motion.js';
import { on } from './dom.js';

import { Alert } from './alert.js';

declare module './component' {
	interface Components {
		'c-snackbar': Snackbar;
	}
}

/**
 * Shows a transient notification at the bottom of the viewport, typically used
 * for brief messages requiring minimal user interaction. Can display actions to
 * let users immediately respond, such as undo or dismiss.
 *
 * ### Usage Notes
 *
 * - The `open` attribute controls visibility and can be toggled by scripts to
 *   show or hide the snackbar.
 * - `duration` defines how long the snackbar stays visible (in milliseconds).
 *   Setting to `Infinity` disables auto-hide until manually closed.
 * - When closed (manually or automatically), the component is removed from the DOM.
 * - Animations for showing and hiding are customizable using `motion-in` and
 *   `motion-out` attributes.
 * - Only one snackbar should be visible at a time for best UX; manage multiple
 *   instances carefully.
 *
 * ### Slots
 *
 * - action: Place interactive elements (buttons or links) here for user actions.
 *
 * @title Snackbar Notification
 * @icon notifications
 * @see SnackbarContainer
 * @tagName c-snackbar
 * @example
 * <c-snackbar static open duration="Infinity">
 *   Snackbar Content
 * </c-snackbar>
 *
 * @example <caption>Snackbar with Action</caption>
 * <c-snackbar static open duration="Infinity">
 *   Snackbar Content
 *   <c-button-text slot="action">Undo</c-button-text>
 * </c-snackbar>
 *
 * @example <caption>Two-Line Snackbar</caption>
 * <c-snackbar static open duration="Infinity">
 *   Two-line snackbar<br/>
 *   with action.
 *   <c-button-text slot="action">Action</c-button-text>
 * </c-snackbar>
 *
 * @example <caption>RTL Support</caption>
 * <c-snackbar static dir="rtl" open duration="Infinity">
 *   Two-line snackbar<br/>
 *   with action.
 *   <c-button-text slot="action">Action</c-button-text>
 * </c-snackbar>
 */
export class Snackbar extends Alert {
	/**
	 * Defines the duration (in milliseconds) for which the snackbar will be displayed before
	 * automatically hiding. Defaults to 4000ms (4 seconds).
	 * Can be set to Infinity to disable the auto-hide behavior, keeping the snackbar visible indefinitely.
	 *
	 * @attribute
	 */
	duration = 4000;

	/**
	 * Sets the animation to be used when the snackbar appears on the screen.
	 * @attribute
	 */
	'motion-in': Motion = 'slideInUp,fadeIn';

	/**
	 * Defines the animation to be used when the snackbar disappears from the screen.
	 * @attribute
	 */
	'motion-out': Motion = 'fadeOut';

	/**
	 * Indicates whether the snackbar is currently visible or not.
	 * When set to `true`, the snackbar is displayed; when `false`, it is hidden.
	 *
	 * @attribute
	 */
	open = false;

	/**
	 * Determines whether the snackbar should persist
	 * within the layout (i.e., not managed by the popover).
	 */
	static = false;
}

component(Snackbar, {
	tagName: 'c-snackbar',
	init: [
		styleAttribute('open'),
		numberAttribute('duration'),
		attribute('motion-in'),
		attribute('motion-out'),
		attribute('static'),
	],
	augment: [
		css(`
:host {
	display: inline-flex;
	justify-content: left;
	margin: 16px auto;
	border: 0; outline: 0;
	top: auto;
}
slot[name=action] { margin-inline-start: auto; display: block; }
	`),
		() => create('slot', { name: 'action' }),
		$ =>
			get($, 'open').tap(v => {
				if (v && !$.static) {
					$.popover = 'manual';
					$.showPopover();
				}
			}),
		toggleTargetStyles,
		toggleTargetBehavior,
		$ => on($, 'close').tap(() => $.remove()),
	],
});
