import { Component, component, Slot } from './component.js';
import { role } from './a11y.js';
import { SurfaceColorKey, colorAttribute, css } from './theme.js';

declare module './component' {
	interface Components {
		'c-tr': Tr;
	}
}

/**
 * Acts as a customizable row within a table to align tabular data.
 *
 * Use this component inside supported table structures to define custom rows.
 * The `color` attribute can be set to a supported surface color key to visually
 * differentiate specific rows.
 *
 * @title Table Row Component
 * @icon view_headline
 * @tagName c-tr
 * @see Table
 */
export class Tr extends Component {
	/*
	 * Defines an optional `color` attribute to allow customization of the row's surface color.
	 * @attribute
	 */
	color?: SurfaceColorKey;
}

component(Tr, {
	tagName: 'c-tr',
	init: [colorAttribute('color')],
	augment: [
		role('row'),
		// table-row display does not support minHeight
		css(`:host{display:table-row;height:53px;}`),
		Slot,
	],
});
