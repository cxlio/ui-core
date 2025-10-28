import { Component, Slot, attribute, component, get } from './component.js';
import { css, font } from './theme.js';

declare module './component' {
	interface Components {
		'c-field-help': FieldHelp;
	}
}

/**
 * Displays helper text or error messages below input fields.
 * Place within a Field component.
 * Use the invalid property to denote invalid field states.
 *
 * When shown, the text is intended to assist or inform users about validation results or input requirements.
 * Use within form-related components to guide, instruct, or alert users for specific fields.
 *
 * @tagName c-field-help
 * @title Helper or Error Text for Input Fields
 * @icon help
 * @example <caption>Error State</caption>
 * <c-field>
 *   <c-label>Field Label</c-label>
 *   <c-icon role="none" name="search" slot="leading"></c-icon>
 *   <c-input-text touched invalid value="Input Value"></c-input-text>
 *   <c-field-help invalid>Field Error Text</c-field-help>
 *   <c-icon role="none" name="cancel" slot="trailing"></c-icon>
 * </c-field>
 *
 */
export class FieldHelp extends Component {
	/**
	 * Indicates whether the helper text should only appear when the input field is invalid.
	 * If set to a string, it should represent a validation result key.
	 */
	invalid: string | boolean = false;
}

component(FieldHelp, {
	tagName: 'c-field-help',
	init: [attribute('invalid')],
	augment: [
		css(`
:host {
	display: flex;
	align-items: center;
	column-gap: 8px;
	${font('body-small')}
}
	`),
		Slot,
		$ => {
			$.slot ||= 'help';
			return get($, 'invalid').tap(invalid => {
				$.ariaLive ??= invalid ? 'assertive' : 'polite';
			});
		},
	],
});
