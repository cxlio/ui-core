import { Component, Slot, component } from './component.js';
import { css } from './theme.js';

declare module './component' {
	interface Components {
		'c-nav-headline': NavHeadline;
	}
}

/**
 * This component serves as a title or headline within a navigation context.
 *
 * @tagName c-nav-headline
 * @beta
 */
export class NavHeadline extends Component {}

component(NavHeadline, {
	tagName: 'c-nav-headline',
	augment: [
		css(`
:host{
	color:var(--cxl-color-on-surface-variant);
	font:var(--cxl-font-title-small);
	letter-spacing:var(--cxl-letter-spacing-title-small);
	min-height:48px;
	display:flex;
	align-items: center;
	padding: 0 16px;
}
`),
		Slot,
	],
});
