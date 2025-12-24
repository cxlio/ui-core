import { Component, Slot, component } from './component.js';
import { displayContents } from './theme.js';
import { onAction } from './dom.js';
import { Input } from './input.js';
import { EMPTY, defer, merge } from './rx.js';

declare module './component' {
	interface Components {
		'c-form-submit': FormSubmit;
	}
}

export function findForm(host: HTMLElement) {
	let parent = host.parentElement;
	while (parent) {
		if (parent.tagName === 'FORM' || parent.tagName === 'C-FORM')
			return parent as HTMLFormElement;
		parent = parent.parentElement;
	}
}

/**
 * Triggers the submission workflow for its containing form element on click or keyboard interaction.
 *
 * Supports use within both native `<form>` and custom `<c-form>` containers.
 * Handles propagation of "touched" state on custom input components, facilitates programmatic
 * submission with form validation, and ensures first invalid input is focused for accessibility.
 *
 * If nested within a form, captures "Enter" keypresses across the form as a submit action,
 * enabling keyboard-based form submission from any input.
 *
 * Automatically updates custom form elements' validation state when submitting.
 *
 * Designed as a composition wrapper: does not render visible elements or apply button styles,
 * but expects a button or interface control as a slotted child.
 *
 * @tagName c-form-submit
 * @title Form Submit Element
 * @icon send
 * @see Form
 *
 * @demoonly
 * <c-form>
 *   <c-flex vflex gap="16">
 *   <c-field>
 *     <c-label>E-mail Address</c-label>
 *     <c-input-text rules="required email"></c-input-text>
 *   </c-field>
 *   <c-toolbar>
 *     <c-form-submit>
 *       <c-button>Submit</c-button>
 *     </c-form-submit>
 *   </c-toolbar>
 *   </c-flex>
 * </c-form>
 */
export class FormSubmit extends Component {}

component(FormSubmit, {
	tagName: 'c-form-submit',
	augment: [
		displayContents,
		Slot,
		$ =>
			defer(() => {
				const form = findForm($);
				return form
					? merge(
							//onKeypress(form, 'enter').tap(() => $.click()),
							onAction($).tap(() => {
								if (form.tagName === 'FORM') {
									let focus: Input | undefined;
									for (const el of form.elements)
										if (el instanceof Input) {
											if (el.invalid) focus ??= el;
											el.touched = true;
										}
									focus?.focus();
								}

								form.requestSubmit();
							}),
					  )
					: EMPTY;
			}),
	],
});
