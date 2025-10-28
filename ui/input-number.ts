import { Slot, component, create, attribute } from './component.js';
import { $valueProxy } from './input-proxy.js';
import { InputTextBase, inputTextStyles } from './input-text.js';

declare module './component' {
	interface Components {
		'c-input-number': InputNumber;
	}
}

/**
 * The InputNumberBase class provides functionalities for numeric input components.
 * It offers features like value formatting, validation logic tailored to numeric inputs,
 * and seamless integration with the `InputProxy`.
 *
 */
export abstract class InputNumberBase extends InputTextBase {
	/**
	 * A number representing the current value of the input field.
	 * @attribute
	 */
	value: number | undefined = undefined;

	/** Formatting function for displaying values as strings. */
	formatter = defaultFormatter;

	readonly inputEl: HTMLInputElement = create('input', {
		className: 'input',
	});

	static {
		component(InputNumberBase, {
			init: [attribute('value')],
			augment: [
				Slot,
				$ => $.append($.inputEl),
				$ =>
					$valueProxy({
						host: $,
						input: $.inputEl,
						toText: (val: number | undefined, old: string) => {
							if (val !== undefined && isNaN(val)) return old;
							return $.formatter(val);
						},
						toValue: (str: string) => {
							if (str === '') {
								$.setValidity({ key: 'number', valid: true });
								return undefined;
							}
							const value = Number(str);
							$.setValidity({
								key: 'number',
								valid: !isNaN(value),
							});
							return value;
						},
					}),
			],
		});
	}
}

/**
 * The InputNumber component provides a basic input field for entering and editing numeric values.
 *
 * Enables users to enter and edit numeric values with support for real-time
 * validation and custom formatting. Invalid or incomplete numeric input will not
 * be committed to the component value.
 *
 * When cleared, the field value becomes
 * undefined.
 *
 * Custom display formatting can be provided by overriding the formatter property.
 *
 * To allow only valid numeric entries, the underlying input automatically
 * disables entry of arbitrary text, and notifies validity state accordingly.
 *
 *
 * @title Number Input Field
 * @icon looks_one
 * @tagName c-input-number
 * @see Field
 * @example
 * <c-field>
 * 	 <c-label>Number Input</c-label>
 * 	 <c-input-number value="10"></c-input-number>
 * </c-field>
 */
export class InputNumber extends InputNumberBase {}

component(InputNumber, {
	tagName: 'c-input-number',
	augment: [...inputTextStyles],
});

/**
 * Default formatter used for displaying numeric values.
 * Converts undefined or NaN to an empty string, and valid numbers to their string equivalents.
 */
function defaultFormatter(n: number | undefined) {
	return n === undefined || isNaN(n) ? '' : n.toString();
}
