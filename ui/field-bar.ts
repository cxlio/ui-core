import { component } from './component.js';
import { css, font, surface } from './theme.js';
import { FieldBase, fieldLayoutStyles } from './field.js';

declare module './component' {
	interface Components {
		'c-field-bar': FieldBar;
	}
}

/**
 * Defines a field component with a flexible layout and optional compact styling.
 *
 * @tagName c-field-bar
 * @beta
 * @demo
	<c-field-bar size="-1" style="min-width: 300px">
		<c-icon name="search"></c-icon>
		<c-input-placeholder
			>Search in Drive</c-input-placeholder
		>
		<c-input-text aria-label="Search in Drive">
		</c-input-text>
		<c-icon-button
			title="Advanced Search"
			icon="tune"
		></c-icon-button>
	</c-field-bar>
 */
export class FieldBar extends FieldBase {}

component(FieldBar, {
	tagName: 'c-field-bar',
	augment: [
		fieldLayoutStyles,
		css(`
:host {
	box-sizing: border-box;
	${surface('surface-container-high')}
	${font('body-large')}
	border-radius: var(--cxl-shape-corner-xlarge);
}
.content { padding: 4px 12px; }
		`),
	],
});
