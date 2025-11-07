import { Component, component, Slot } from './component.js';
import { role } from './a11y.js';
import { css } from './theme.js';

declare module './component' {
	interface Components {
		'c-td': Td;
	}
}

/**
 * Represents a generic table cell element for use inside custom table row
 * components.
 *
 * This component should be used as a direct child of custom table row elements
 * to ensure correct layout and accessibility.
 *
 * @title Table Cell Element
 * @icon grid_on
 * @tagName c-td
 * @demo
<c-table>
	<c-tr>
		<c-td>Cell 1</c-td>
		<c-td>Cell 2</c-td>
		<c-td>Cell 3</c-td>
	</c-tr>
</c-table>
 */
export class Td extends Component {}
component(Td, {
	tagName: 'c-td',
	augment: [
		role('cell'),
		css(`
:host {
	box-sizing: border-box;
	display: table-cell;
	padding: 0 16px;
	height: 51px;
	vertical-align: middle;
	border-bottom: 1px solid var(--cxl-color-outline);
}
		`),
		Slot,
	],
});
