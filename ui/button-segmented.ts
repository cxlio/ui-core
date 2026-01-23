import { Component, Slot, component, create } from './component.js';
import {
	Size,
	sizeAttribute,
	css,
	font,
	disabledStyles,
	maskStyles,
} from './theme.js';
import { ripple } from './ripple.js';
import { SelectableHost, selectableNavigation } from './selectable-host.js';
import { focusable } from './focusable.js';
import { role } from './a11y.js';
import { Icon } from './icon.js';

declare module './component' {
	interface Components {
		'c-button-segmented': ButtonSegmented;
	}
}

/**
 * View for Segmented Button
 * @beta
 */
class ButtonSegmentedView extends Component {}

component(ButtonSegmentedView, {
	tagName: 'c-button-segmented-view',
	augment: [
		css(`
:host {
	display: flex;
	align-items: center;
	justify-content: center;
	column-gap: 8px;
	padding: calc(4px + (var(--cxl-size,0) * 4px)) calc(16px + (var(--cxl-size,0) * 4px));
	overflow: hidden;
	position: relative;
	cursor: pointer;
	white-space: nowrap;
	background-color: var(--cxl-color-surface);
	color: var(--cxl-color-on-surface);
	border-radius: var(--cxl-border-radius);
}
:host([selected]) {
	--cxl-color-surface: var(--cxl-color-secondary-container);
	--cxl-color-on-surface: var(--cxl-color-on-secondary-container);
}
:host([focused]) {
	background-image: var(--cxl-focused);
	outline: var(--cxl-focused-outline);
}
:host(:not([selected])) #check { display: none; }
:host(:not([selected])) { padding: 4px 32px; }
		`),
		maskStyles,
		ripple,
		() => create(Icon, { id: 'check', name: 'check' }),
		Slot,
	],
});

/**
 * `<c-button-segmented>` is a custom element for presenting a group of related, toggle-style options
 * as a compact, segmented button group. Each option is rendered as a visually cohesive segment,
 * and users can select a single option at a time. Options inside the group can show text, icons, or both.  
 *
 * ### Use Cases
 * - Allowing users to make simple choices between a few predefined options (e.g., 2-5 items).
 * - Options like selecting regions, categories, or toggling between modes (e.g., list/grid view).
 * - Use in forms, filters, or navigation where toggle-like inputs are needed.
 *
 * @title Segmented Button Group
 * @icon view_week
 * @tagName c-button-segmented
 * @demo
<c-button-segmented aria-label="Region">
	<c-option selected value="latam">Latin America</c-option>
	<c-option value="asia">Asia</c-option>
	<c-option value="africa">Africa</c-option>
</c-button-segmented>
 *
 * @demo <caption>With Icons</caption>
 * <c-button-segmented aria-label="View Options">
 *   <c-option aria-label="List View"><c-icon name="list" title="List View" role="img"></c-icon></c-option>
 *   <c-option aria-label="Grid View" selected><c-icon name="grid_view" title="Grid View" role="img"></c-icon></c-option>
 * </c-button-segmented>
 * @see Chip
 */
export class ButtonSegmented extends SelectableHost {
	/**
	 * Associates the segmented button group with its custom view component.
	 */
	readonly optionView = ButtonSegmentedView;

	size?: Size;
}

component(ButtonSegmented, {
	tagName: 'c-button-segmented',
	init: [
		sizeAttribute(
			'size',
			s => `{
			font-size: ${14 + s * 1}px;
			min-height: ${40 + s * 8}px;
		}`,
		),
	],
	augment: [
		role('listbox'),
		css(`
:host {
	display: grid;
	flex-shrink: 0;
	grid-auto-flow: column;
	grid-auto-columns: 1fr;
	box-sizing: border-box;
	outline: 1px solid var(--cxl-color-outline);
	border-radius: 50vh;
	min-height: 40px;
	column-gap: 1px;
	background-color: var(--cxl-color-outline);
	color: var(--cxl-color-on-surface);
	overflow: hidden;
	${font('label-large')}
}
:host(:focus-visible) {
	--cxl-mask-focus: color-mix(in srgb, var(--cxl-color-on-surface) 10%, transparent);
	--cxl-focused: linear-gradient(0, var(--cxl-mask-focus),var(--cxl-mask-focus));
	--cxl-focused-outline: 3px auto var(--cxl-color-secondary);
}
::slotted(:first-of-type) {
	--cxl-border-radius: 50vh 0 0 50vh;
}
::slotted(:last-of-type) {
	--cxl-border-radius: 0 50vh 50vh 0;
}
		`),
		disabledStyles,
		Slot,
		focusable,
		host => selectableNavigation({ host, axis: 'x' }),
	],
});
