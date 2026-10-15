import { attribute, component, get, styleAttribute } from './component.js';
import { IconButton } from './icon-button.js';
import { onAction } from './dom.js';
import { combineLatest } from './rx.js';
import { ariaValue } from './a11y.js';
import { css } from './theme.js';

declare module './component.js' {
	interface Components {
		'c-icon-button-toggle': IconButtonToggle;
	}
}

/**
 * An icon button that toggles its open state on click, Enter, or Space.
 * Uses iconoff when off and iconon when on, falling back to iconoff if iconon is unset.
 * Provide a stable accessible name with aria-label or aria-labelledby;
 * aria-pressed communicates the current state.
 *
 * @tagName c-icon-button-toggle
 * @title Icon Button Toggle
 * @icon toggle_on
 * @example
 * <div style="display:flex;padding:16px">
 * <c-icon-button-toggle iconoff="search" iconon="notifications" aria-label="Search"></c-icon-button-toggle>
 * </div>
 */
export class IconButtonToggle extends IconButton {
	/**
	 * Whether the button is on. Reflected as the open attribute.
	 * @attribute
	 */
	open = false;

	/**
	 * Optional icon to display when open. Defaults to iconoff when unset or empty.
	 * @attribute
	 */
	iconon?: string;

	/**
	 * Icon to display when the button is off.
	 * @attribute
	 */
	iconoff = '';
}

component(IconButtonToggle, {
	tagName: 'c-icon-button-toggle',
	init: [styleAttribute('open'), attribute('iconon'), attribute('iconoff')],
	augment: [
		css(`
:host([open]:not([disabled])) {
	background-color: var(--cxl-color--secondary-container);
	color: var(--cxl-color--on-secondary-container);
}
`),
		$ => get($, 'open').pipe(ariaValue($, 'pressed')),
		$ =>
			combineLatest(
				get($, 'open'),
				get($, 'iconon'),
				get($, 'iconoff'),
			).tap(([open, iconon, iconoff]) =>
				($.icon = open ? iconon || iconoff : iconoff),
			),
		$ =>
			onAction($)
				.filter(() => !$.disabled)
				.tap(() => ($.open = !$.open)),
	],
});
