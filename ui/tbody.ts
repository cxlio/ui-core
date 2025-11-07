import { Component, Slot, component } from './component.js';
import { role } from './a11y.js';
import { css } from './theme.js';

declare module './component' {
	interface Components {
		'c-tbody': Tbody;
	}
}

/**
 * Represents the body section of a table, enabling organized display of data
 * rows within a tabular structure.
 *
 * @tagName c-tbody
 * @title Table body section
 * @icon table_rows
 * @see Table
 */
export class Tbody extends Component {}

component(Tbody, {
	tagName: 'c-tbody',
	augment: [role('rowgroup'), css(`:host{display:table-row-group}`), Slot],
});
