import { component } from './component.js';
import { css, media } from './theme.js';
import { Flex } from './flex.js';

declare module './component' {
	interface Components {
		'c-toolbar': Toolbar;
	}
}

/**
 * This component provides a customizable toolbar element for organizing actions and buttons within your application
 *
 * - Horizontal layout with flexbox for responsive design.
 * - Automatic spacing between elements for better readability.
 * - Ability to wrap content onto multiple lines if necessary.
 *
 * @beta
 * @tagName c-toolbar
 * @example
 * <c-toolbar>
 *   <c-icon-button alt="save" icon="save"></c-icon-button>
 *   <c-icon-button alt="palette" icon="palette"></c-icon-button>
 *   <c-button flat>Text Button</c-button>
 * </c-toolbar>
 */
export class Toolbar extends Flex {}

component(Toolbar, {
	tagName: 'c-toolbar',
	augment: [
		css(`
:host {
	grid-column-end: span 12;
	column-gap: 24px;
	row-gap: 8px;
	align-items: center;
	min-height: 48px;
	flex-wrap: wrap;
	flex-shrink: 0;
}
${media('small', ':host{column-gap:24px}')}
		`),
	],
});
