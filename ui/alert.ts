import { styleAttribute, component, Component, Slot } from './component.js';

import { role } from './a11y.js';
import {
	OutlineColorStyles,
	SurfaceColorValue,
	colorAttribute,
	css,
	font,
} from './theme.js';

declare module './component' {
	interface Components {
		'c-alert': Alert;
	}
}

/**
 * The `c-alert` component provides a visually distinct container for important messages,
 * such as errors, warnings, and status updates. It supports themes with a `color` attribute,
 * allowing for contextual messages like "success," "warning," or "error." The `outline`
 * attribute can be set to visually emphasize the alert's boundary.
 *
 * The alert is static and intended for messages that remain on the page until the user
 * navigates away or closes it using an embedded control (such as a button placed in a slot).
 * It is not a timed or auto-dismissing notification; for transient alerts, use the Snackbar component.
 *
 * @tagName c-alert
 * @title Alert Component
 * @icon warning
 * @example
 * <c-alert><c-icon alt="" name="warning"></c-icon> Default Alert</c-alert>
 *
 * @demoonly <caption>Dismissable Alert</caption>
 * <c-alert><c-dismiss target="_parent" motion="shakeX"><c-button-text>Dismiss with custom animation</c-button-text></c-dismiss></c-alert>
 *
 * @see Snackbar
 * @see SnackbarContainer
 * @see Dismiss
 */
export class Alert extends Component {
	/**
	 * Adds an outline style to the alert, emphasizing its boundaries.
	 * @example
	 * <c-alert color="error" outline><c-icon alt="" name="error"></c-icon> Error Message!</c-alert>
	 * @attribute
	 */
	outline = false;

	/**
	 * Determines the background color of the alert.
	 *
	 * @example
	 * <c-alert color="success">Success!</c-alert>
	 * <c-alert color="warning">
	 *   <c-icon name="warning"></c-icon>
	 *   Warning!
	 * </c-alert>
	 * @attribute
	 */
	color?: SurfaceColorValue;
}

component(Alert, {
	tagName: 'c-alert',
	init: [
		styleAttribute('outline'),
		colorAttribute('color', 'inverse-surface'),
	],
	augment: [
		role('alert'),
		css(`
:host {
	box-sizing: border-box;
	display: flex;
	align-items: center;
	column-gap: 8px;
	justify-content: center;
	padding: 14px 16px;
	min-height: 48px;
	min-width: min(340px, 100%);
	border-radius: 4px;
	${font('body-medium')}
}
	${OutlineColorStyles('[outline]')}`),
		Slot,
	],
});
