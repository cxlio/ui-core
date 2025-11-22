import { component } from './component.js';
import { IconButton } from './icon-button.js';
import { fieldInput } from './field-input.js';
import { onAction } from './dom.js';
import { registerText } from './locale.js';
import { ariaLabel } from './a11y.js';

declare module './component' {
	interface Components {
		'c-input-clear': InputClear;
	}
}

const text = registerText({
	'input.clear': 'Clear input value',
});

/**
 * An inline icon button designed to reset or clear the value of an associated input element, rendered adjacent to the input field.
 *
 * When activated, it immediately empties the input's value and does not dispatch an additional change event.
 * This component is typically rendered inside text fields, search components, or other input containers that
 * use custom field handling.
 *
 * The clear button's visibility and placement are inherited from its parent styling and usage context;
 * it is not interactive unless programmatically attached to a corresponding input.
 *
 * Specialized accessibility labeling, such as `aria-label`, should be set by the parent or hosting framework
 * to provide context-appropriate descriptions (e.g., "Clear search" or "Clear input").
 *
 * If integrated in a form, clearing does not trigger form submission or validation.
 *
 * The `icon` property can be overridden to provide context-specific icons if needed by extending this component.
 *
 * @title Input Clear Button
 * @icon close
 *
 * @tagName c-input-clear
 * @demo
 * <c-field>
 *   <c-label>Text Input</c-label>
 *   <c-input-text value="Value"></c-input-text>
 *   <c-input-clear slot="trailing"></c-input-clear>
 * </c-field>
 */
export class InputClear extends IconButton {
	icon = 'close';
}

component(InputClear, {
	tagName: 'c-input-clear',
	augment: [
		$ => ariaLabel($, text('input.clear')),
		$ =>
			fieldInput($).switchMap(input =>
				onAction($).tap(() => (input.value = '')),
			),
	],
});
