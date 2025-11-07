import { Component, component, Slot } from './component.js';
import { role } from './a11y.js';
import { css, font } from './theme.js';

declare module './component' {
	interface Components {
		'c-table': Table;
	}
}

/**
 * Displays structured tabular data using custom row and cell components 
 * as children. Designed for listing records or comparing values 
 * across multiple columns efficiently.
 *
 * All direct children must be c-tr elements. For cells, use c-th 
 * for headers and c-td for regular data rows. 
 *
 * @title Data Table Component
 * @icon table_chart
 * @tagName c-table
 * @example
<c-table>
	<c-tr>
		<c-th style="width:100px">Header 1</c-th>
		<c-th>Header 2</c-th>
		<c-th>Header 3</c-th>
	</c-tr>
	<c-tr>
		<c-td>Cell 1</c-td>
		<c-td>Cell 2</c-td>
		<c-td>Cell 3</c-td>
	</c-tr>
</c-table>
 * @see Tr
 * @see Td
 */
export class Table extends Component {}

component(Table, {
	tagName: 'c-table',
	augment: [
		role('table'),
		css(`
:host {
	--cxl-color-outline: var(--cxl-color-outline-variant);
	box-sizing: border-box;
	display: table;
	width: 100%;
	/* Hide overflow for draggable columns */
	overflow: hidden;
	outline: 1px solid var(--cxl-color-outline);
	border-bottom: 0;
	border-radius: 24px;
	${font('body-large')}
	background-color: var(--cxl-color-surface);
	color: var(--cxl-color-on-surface);
	outline-offset: -1px;
}
		`),
		Slot,
	],
});
