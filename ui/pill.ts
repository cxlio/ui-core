import { Component, Slot, component, create } from './component.js';
import {
	Size,
	colorAttribute,
	sizeAttribute,
	css,
	font,
	SurfaceColorValue,
} from './theme.js';

declare module './component.js' {
	interface Components {
		'c-pill': Pill;
	}
}

/****
 * Displays a compact, inline label with optional leading and trailing content.
 *
 * Use for static status, category, or metadata that should not receive focus.
 * If the pill triggers an action, use a focusable control instead (e.g., c-chip)
 * and provide an accessible name.
 *
 * @title Pill
 * @icon label
 * @slot `leading`  Optional content shown before the label (e.g., icon, avatar).
 * @slot `default`  Main label/content of the pill.
 * @slot `trailing` Optional content shown after the label (e.g., count, icon).
 */
export class Pill extends Component {
	/**
	 * Sets the background and text color.
	 * @attribute
	 */
	color?: SurfaceColorValue;

	/**
	 * Controls the size of the component, affecting dimensions and font size.
	 * @attribute
	 */
	size: Size = 0;
}

component(Pill, {
	tagName: 'c-pill',
	init: [
		colorAttribute('color', 'surface-container-low'),
		sizeAttribute(
			'size',
			s => `{
			padding: 2px ${s < 0 ? 2 : 8}px;
			font-size: ${14 + s * 2}px;
			height: ${32 + s * 6}px;
		}`,
		),
	],
	augment: [
		css(`
:host {
	box-sizing: border-box;
	border: 1px solid var(--cxl-color-outline-variant);
	border-radius: var(--cxl-shape-corner-small);
	${font('label-large')}
	display: inline-flex;
	align-items: center;
 	position: relative;
	overflow: hidden;
 	column-gap: 8px;
	flex-shrink: 0;
	flex-wrap: nowrap;
	align-self: center;
}
slot[name] { display: inline-block; }
		`),
		() => create('slot', { name: 'leading' }),
		Slot,
		() => create('slot', { name: 'trailing' }),
	],
});
