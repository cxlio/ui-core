import { component, Component, Slot } from './component.js';
import { on, trigger } from './dom.js';

import { role } from './a11y.js';
import { registableHost } from './registable.js';
import { displayContents } from './theme.js';

import type { Input } from './input.js';

declare module './registable.js' {
	interface RegistableMap {
		form: Input;
	}
}

declare module './component' {
	interface Components {
		'c-form': Form;
	}
}

export type FormValue = { [k: string]: unknown };

/**
 * The Form component serves as a container for managing user input and form submission within
 * your application. It provides a structured way to group input elements, handle form validation,
 * and submit data to your backend.
 *
 * Typical Uses:
 * - Building login forms, registration forms, and other data collection forms.
 * - Grouping related input fields for better organization and user experience.
 * - Handling form submission logic, including validation and data processing.
 *
 * The Form component acts as a central hub for its child input elements.
 * If an invalid input exists,
 * it sets the focus to the first invalid element and prevents further form submission propagation.
 *
 * Emits a `submit` event when form submission is triggered.
 *
 * @tagName c-form
 * @title Form container component providing input aggregation, validation, and submission event handling.
 * @icon dynamic_form
 * @example
 * <c-form>
 *   <c-flex vflex gap="16">
 *   <c-field>
 *     <c-label>E-mail Address</c-label>
 *     <c-input-text rules="required email"></c-input-text>
 *   </c-field>
 *   <c-field>
 *     <c-label>Password</c-label>
 *     <c-input-password rules="required"></c-input-password>
 *   </c-field>
 *   <c-toolbar>
 *     <c-form-submit>
 *       <c-button>Submit</c-button>
 *     </c-form-submit>
 *   </c-toolbar>
 *   </c-flex>
 * </c-form>
 */
export class Form extends Component {
	/**
	 * Contains all currently registered supported input elements. Elements are registered and deregistered automatically as they are attached/removed in the DOM.
	 */
	readonly elements = new Set<Input>();

	protected initialValue?: FormValue;

	static {
		component(Form, {
			tagName: 'c-form',
			augment: [
				role('form'),
				displayContents,
				host =>
					on(host, 'submit', { capture: true }).tap(ev => {
						ev.preventDefault();
						let focus: Input | undefined;
						for (const el of host.elements) {
							if (el.invalid) focus ??= el;
							el.touched = true;
						}

						// Form is invalid if 'focus' is set
						if (focus) {
							focus.focus();
							//ev.cancelBubble = true;
							ev.stopPropagation();
							ev.stopImmediatePropagation();
						}
					}),
				host =>
					registableHost('form', host, host.elements).tap(ev => {
						const target = ev.target;
						const name = target.name;
						const value = host.initialValue;
						if (value && name && name in value) {
							target.value = value[name] as string;
						}
					}),
				Slot,
			],
		});
	}

	/**
	 * Calling this method marks every registered input element as "touched" and checks their validity state synchronously.
	 * Returns true if all inputs are valid. (Inputs must provide an `invalid` property.)
	 */
	checkValidity() {
		let isValid = true;
		for (const el of this.elements) {
			if (el.invalid) isValid = false;
			el.touched = true;
		}
		return isValid;
	}

	/**
	 * Calls the reset method for each registered input, if available, to restore their initial values and touched state.
	 * The exact reset logic is defined by the individual input components.
	 */
	reset() {
		for (const el of this.elements) el.formResetCallback();
	}

	/**
	 * Triggers the `submit` event programmatically, following full validation and event cancellation if invalid fields exist.
	 */
	submit() {
		trigger(this, 'submit');
	}

	/**
	 * Alias for `submit()`. Invokes form submission logic programmatically, matching other frameworks' patterns.
	 */
	requestSubmit() {
		this.submit();
	}

	/**
	 * Looks up and returns a registered input element matching a specific `name` property.
	 * Returns undefined if no input by this name exists or is currently registered.
	 */
	getElementByName(name: string) {
		for (const el of this.elements) if (el.name === name) return el;
	}

	/**
	 * Iterates all registered input elements and sets their `touched` property to the provided boolean value.
	 * Useful for batch UI error visibility control.
	 */
	setTouched(val: boolean) {
		for (const el of this.elements) el.touched = val;
	}

	/**
	 * Stores an initial data object and assigns its values to inputs with matching `name` properties.
	 * Unmatched data keys are ignored.
	 */
	setFormData(data: FormValue) {
		this.initialValue = data;
		for (const key in data) {
			const el = this.getElementByName(key);
			if (el) el.value = data[key];
		}
	}

	/**
	 * Produces a new plain object aggregating each registered input's current `value`, keyed by their `name` property.
	 * Unnamed inputs are omitted from the result.
	 */
	getFormData(): FormValue {
		const result: Record<string, unknown> = {};
		for (const el of this.elements) {
			const value =
				'checked' in el
					? el.checked
						? el.value
						: undefined
					: el.value;
			if (el.name) result[el.name] = value;
		}
		return result;
	}
}
