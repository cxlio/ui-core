import { component } from './component.js';
import { Toolbar } from './toolbar.js';
import { css, elevation } from './theme.js';

/**
 * A floating toolbar container designed to host action items and controls
 * overlaid on content surfaces. Inherits all behavior and keyboard support
 * from `Toolbar`, while adding a distinctive elevated style and rounded shape.
 *
 * Use this component when you need a persistent set of controls that hovers
 * above page content.
 *
 * @title Floating Toolbar
 * @icon vertical_align_top
 * @tagName c-toolbar-floating
 * @alpha
 */
export class ToolbarFloating extends Toolbar {}

component(ToolbarFloating, {
	tagName: 'c-toolbar-floating',
	augment: [
		css(`
:host {
	background-color: var(--cxl-color-surface-container);
	color: var(--cxl-color-on-surface-variant);
	border-radius: var(--cxl-shape-corner-full);
	padding: 8px 24px;
	height: 64px;
	${elevation(3)}
}
		`),
	],
});
