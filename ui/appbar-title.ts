import { Component, Slot, component } from './component.js';
import { aria, role } from './a11y.js';
import { css } from './theme.js';

declare module './component' {
	interface Components {
		'c-appbar-title': AppbarTitle;
	}
}

/**
 * Represents the title section within an Appbar, typically used for displaying the primary text or heading.
 *
 * @see Appbar
 * @beta
 * @tagName c-appbar-title
 */
export class AppbarTitle extends Component {}

component(AppbarTitle, {
	tagName: 'c-appbar-title',
	augment: [
		role('heading'),
		aria('level', '1'),
		css(`
:host {
	display: block;
	flex-grow: 1;
	overflow-x: hidden;
	white-space: nowrap;
	text-overflow: ellipsis;
	width: 100%;
}
	`),
		Slot,
	],
});
