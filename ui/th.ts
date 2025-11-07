import { Component, component, Slot } from './component.js';

import { role } from './a11y.js';
import { css, font } from './theme.js';

declare module './component' {
	interface Components {
		'c-th': Th;
	}
}

/**
 * Header cell component for use within table layouts.
 *
 * @title Table Header Cell
 * @icon view_week
 * @tagName c-th
 * @demo
<c-table>
	<c-tr>
		<c-th width="100px">Header 1</c-th>
		<c-th>Header 2</c-th>
		<c-th>Header 3</c-th>
	</c-tr>
</c-table>
 */

export class Th extends Component {}
component(Th, {
	tagName: 'c-th',
	augment: [
		role('columnheader'),
		css(`
:host {
	box-sizing: border-box;
	display: table-cell;
	${font('title-medium')}
	color: var(--cxl-color-on-surface-variant);
	padding: 16px;
	white-space: nowrap;
	height: 55px;
	vertical-align: middle;
	border-bottom: 1px solid var(--cxl-color-outline);
	position: relative;
}`),
		Slot,
	],
});
