import { Component, component, styleAttribute } from './component.js';
import { Spacing, css, spacingValues } from './theme.js';
import { role } from './a11y.js';

declare module './component' {
	interface Components {
		'c-hr': Hr;
	}
}

/**
 * Separates groups of UI items with a customizable visual divider, supporting both horizontal and vertical orientations.
 *
 * @tagName c-hr
 * @title Divider Line Separator
 * @icon horizontal_rule
 * @demo
 * <c-list aria-label="Item List">
 *   <c-item>Item 1</c-item>
 *   <c-hr></c-hr>
 *   <c-item>Item 2</c-item>
 * </c-list>
 */
export class Hr extends Component {
	/**
	 * Sets the spacing above and below the divider. Accepts values defined in Spacing.
	 */
	pad?: Spacing;

	/**
	 * Determines the orientation of the divider. When true, renders as a vertical separator.
	 */
	vertical = false;
}

component(Hr, {
	tagName: 'c-hr',
	init: [styleAttribute('pad'), styleAttribute('vertical')],
	augment: [
		role('separator'),
		css(`
:host {
	display: block;
	height: 1px;
	background-color: var(--cxl-color-outline-variant);
	grid-column: 1 / -1;
}
:host([vertical]) {
	height: auto;
	width: 1px;
	align-self: stretch;
	margin-top: 8px;
	margin-bottom: 8px;
}
${spacingValues.map(v => `:host([pad="${v}"]){margin:${v}px 0;}`).join('')}`),
	],
});
