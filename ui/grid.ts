import {
	Component,
	Slot,
	component,
	attribute,
	getShadow,
	get,
} from './component.js';
import { css, media } from './theme.js';

declare module './component' {
	interface Components {
		'c-grid': Grid;
	}
}

export function gridColumns($: Component & { columns: number | 'auto-fill' }) {
	const styles = new CSSStyleSheet();
	getShadow($).adoptedStyleSheets.push(styles);

	return get($, 'columns').raf(() => {
		const colTemplate = `repeat(${$.columns}, minmax(0,1fr))`;
		styles.replaceSync(`:host{grid-template-columns:${colTemplate}}`);
	});
}

/**
 * The Grid component is a responsive layout grid that adapts to screen sizes and orientation,
 * ensuring consistency across layouts. You can use it to create grid-based layouts that can
 * arrange the content in rows and columns, with different sizes and alignments.
 *
 * By default the Grid component uses a 12-column grid.
 *
 * @tagName c-grid
 * @beta
 * @example
 * <c-grid style="font:var(--cxl-font-body-large)" columns="3">
 *   <c-c xs="1" style="background:#a00; padding:2px">1</c-c>
 *   <c-c xs="1" style="background:#0a0; padding:2px">2</c-c>
 *   <c-c xs="1" style="background:#0a0; padding:2px">3</c-c>
 *   <c-c xs="2" style="background:#00a; padding:2px">4</c-c>
 *   <c-c xs="1" style="background:#00a; padding:2px">5</c-c>
 * </c-grid>
 */
export class Grid extends Component {
	/**
	 * A number attribute specifying the number of rows in the grid.
	 * @attribute
	 */
	rows?: number;

	/**
	 * A number or string attribute defining the number of columns (e.g., 12)
	 * or using the special value "auto-fill" to distribute available space evenly.
	 * Defaults to 12 columns.
	 * @attribute
	 */
	columns: number | 'auto-fill' = 12;

	/*
	 * A string attribute for defining a custom column template using CSS grid syntax
	 * (e.g., "repeat(4, 1fr)" for four equal-width columns).
	 */
	//@Attribute()
	//coltemplate?: string;
}
component(Grid, {
	tagName: 'c-grid',
	init: [attribute('columns'), attribute('rows')],
	augment: [
		Slot,
		css(`
:host{display:grid;gap:16px;box-sizing:border-box;}
${media('medium', ':host{gap:24px}')}
`),
		gridColumns,
	],
});
