import { component } from './component.js';
import { FieldBase, fieldLayoutStyles, fieldBaseStyles } from './field.js';
import { SizeValues, css, font } from './theme.js';

declare module './component' {
	interface Components {
		'c-field-outlined': FieldOutlined;
	}
}

/**
 * Provides a form field container styled with an outlined appearance, including visual feedback for focus,
 * hover, and error states.
 *
 * Designed to wrap form controls such as labels, inputs, and supporting (help/error) text,
 * and supports optional leading/trailing slots for icons or actions.
 *
 * Use when enhanced distinction and clarity are needed for input fields, while maintaining
 * clear accessibility structure and visual consistency.
 *
 * Floating label behavior is supported via the `floating` attribute, allowing properly positioned
 * labels even before input interaction. Works with left-to-right and right-to-left layouts.
 *
 * ### Slots
 *
 * - label: Place a label component or node to describe the form field.
 * - leading: Insert an icon or custom element before the main input. Commonly used for decorative or contextual icons.
 * - trailing: Insert an icon or custom element after the main input, typically for actions (e.g., clear, reveal).
 * - default: Main content area, typically a form input element (`<c-input-text>` or similar).
 * - help: Place a help or supporting text component. Will visually indicate errors if present and marked `invalid`.
 *
 * @tagName c-field-outlined
 * @title Outlined Form Field
 * @icon border_outer
 * @example
 * <c-field-outlined>
 *   <c-label>Label Text</c-label>
 *   <c-input-text></c-input-text>
 *   <c-field-help>Supporting Text</c-field-help>
 * </c-field-outlined>
 *
 * @demo <caption>Floating Label</caption>
 * <c-field-outlined floating>
 *   <c-label>Label Text</c-label>
 *   <c-input-text></c-input-text>
 *   <c-field-help>Supporting Text</c-field-help>
 * </c-field-outlined>
 *
 * @demo <caption>Leading Icon</caption>
 * <c-field-outlined floating>
 *   <c-label>Label Text</c-label>
 *   <c-icon role="none" name="search" slot="leading"></c-icon>
 *   <c-input-text value="Input Text"></c-input-text>
 *   <c-field-help>Supporting Text</c-field-help>
 * </c-field-outlined>
 *
 * @demo <caption>Trailing Icon</caption>
 * <c-field-outlined floating>
 *   <c-label>Label Text</c-label>
 *   <c-icon role="none" name="cancel" slot="trailing"></c-icon>
 *   <c-input-text value="Input Text"></c-input-text>
 *   <c-field-help>Supporting Text</c-field-help>
 * </c-field-outlined>
 *
 * @demo <caption>RTL Support</caption>
 * <c-field-outlined dir="rtl" floating>
 *   <c-label>Label Text</c-label>
 *   <c-icon role="none" name="search" slot="leading"></c-icon>
 *   <c-icon role="none" name="cancel" slot="trailing"></c-icon>
 *   <c-input-text value="Input Text"></c-input-text>
 *   <c-field-help>Supporting Text</c-field-help>
 * </c-field-outlined>
 *
 * @example <caption>Error State</caption>
 * <c-field-outlined>
 *   <c-label>Field Label</c-label>
 *   <c-icon role="none" name="search" slot="leading"></c-icon>
 *   <c-input-text touched invalid value="Input Value"></c-input-text>
 *   <c-field-help invalid>Field Error Text</c-field-help>
 *   <c-icon role="none" name="cancel" slot="trailing"></c-icon>
 * </c-field-outlined>
 *
 * @example <caption>Disabled</caption>
 * <c-flex vflex gap="16">
 * <c-field-outlined>
 *   <c-label>Field Label</c-label>
 *   <c-select disabled>
 *     <c-option>
 *       <c-icon name="image"></c-icon>
 *       Image
 *     </c-option>
 *   </c-select>
 *   <c-field-help>Help Text</c-field-help>
 * </c-field-outlined>
 * <c-field-outlined>
 *   <c-label>Field Label</c-label>
 *   <c-icon role="none" name="search" slot="leading"></c-icon>
 *   <c-input-text disabled value="Input Value"></c-input-text>
 *   <c-field-help>Field Help</c-field-help>
 *   <c-icon role="none" name="cancel" slot="trailing"></c-icon>
 * </c-field-outlined>
 * </c-flex>
 */
export class FieldOutlined extends FieldBase {}

component(FieldOutlined, {
	tagName: 'c-field-outlined',
	augment: [
		fieldLayoutStyles,
		fieldBaseStyles,
		css(`
:host { margin-top: 4px; }
.content {
	background-color: var(--cxl-color-surface);
	color: var(--cxl-color-on-surface);
	border: 1px solid var(--cxl-color-outline);
	border-radius: var(--cxl-shape-corner-xsmall);
	transition: outline calc(var(--cxl-speed) / 2);
	outline: 0 solid var(--cxl-color-primary);
}
.indicator { display: none; }
slot[name=label] {
	position: absolute;	
	background-color: var(--cxl-color-surface);
	inset-inline-start: 12px;
	top: -8px;
}
::slotted([slot="label"]) { margin: 0 4px; }
:host([floating]:not(:focus-within)) slot[name=label].novalue {
	${font('body-large')}
	height: 0;
	top: var(--cxl-field-outlined-label-top, 16px);
	inset-inline-start: unset;
}
${SizeValues.map(
	n =>
		`:host([size="${n}"]) { --cxl-field-outlined-label-top: ${
			16 + n * 4
		}px }`,
)}
:host([invalid]) .content { border-color: var(--cxl-color-error); }
:host(:hover) .content, :host(:focus) .content { background-image: none; }
:host(:focus-within) .content {
	outline-width: 2px;
}
:host([inputdisabled]) {
	color: color-mix(in srgb, var(--cxl-color-on-surface) 38%, transparent);
}
:host([inputdisabled]) .content {
	border-color: color-mix(in srgb, var(--cxl-color-on-surface) 12%, transparent);
	color: color-mix(in srgb, var(--cxl-color-on-surface) 38%, transparent);
}
		`),
	],
});
