import { component, attribute, create } from './component.js';
import { $valueProxy } from './input-proxy.js';
import { InputTextBase, inputTextBase } from './input-text.js';

declare module './component' {
	interface Components {
		'c-input-password': InputPassword;
	}
}

/**
 * Enables secure password entry with support for form integration, validation
 * feedback, and programmatic value updates. Input is visually masked to
 * prevent shoulder surfing.
 *
 * @tagName c-input-password
 * @title Password Input
 * @icon vpn_key
 * @example
 * <c-field floating>
 *   <c-label>Password</c-label>
 *   <c-input-password value="password"></c-input-password>
 * </c-field>
 */
export class InputPassword extends InputTextBase {
	/**
	 * A string representing the current value of the input field.
	 * @attribute
	 */
	value = '';

	/**
	 * This element serves as the main interface for user text input.
	 */
	protected readonly inputEl: HTMLInputElement = create('input', {
		type: 'password',
		className: 'input',
	});

	static {
		component(InputPassword, {
			tagName: 'c-input-password',
			init: [attribute('value')],
			augment: [
				...inputTextBase,
				$ => $.append($.inputEl),
				host => $valueProxy({ host, input: host.inputEl }),
			],
		});
	}
}
