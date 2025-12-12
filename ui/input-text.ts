import {
	Slot,
	component,
	attribute,
	create,
	styleAttribute,
	message,
} from './component.js';
import { on } from './dom.js';
import { css, disabledStyles } from './theme.js';
import { InputProxy, $valueProxy } from './input-proxy.js';

declare module './component' {
	interface Components {
		'c-input-text': InputText;
	}
}

declare global {
	interface ShadowRoot {
		getSelection?(): Selection;
	}
}

export const inputTextStyles = [
	css(`
:host{display: block; flex-grow: 1; /*color: var(--cxl-color-on-surface);*/ position:relative;}
`),
	disabledStyles,
];

export const inputTextBase = [...inputTextStyles, Slot];

/**
 * The InputTextBase class provides functionalities for text input components.
 * It offers features for handling autofill behavior, managing selection state,
 * and interacting with the browser's text selection API.
 *
 * Extend InputTextBase to create custom text input components that leverage
 * browser's autofill behavior and provide programmatic control over text selection.
 */
export abstract class InputTextBase extends InputProxy {
	/** A boolean style attribute indicating whether the input field is currently autofilled by the browser  */
	autofilled = false;

	/** A string attribute specifying the type of autocomplete behavior for the input field. */
	autocomplete?: string;

	abstract value: unknown;

	static {
		component(InputTextBase, {
			init: [styleAttribute('autofilled'), attribute('autocomplete')],
			augment: [
				$ =>
					on($.inputEl, 'animationstart').tap(ev => {
						if (
							ev.animationName === 'cxl-onautofillstart' ||
							ev.animationName === 'cxl-onautofillend'
						) {
							$.autofilled =
								ev.animationName === 'cxl-onautofillstart';
							message($, 'focusable.change');
							($.inputValue as string) = $.inputEl.value;
						}
					}),
			],
		});
	}

	/** Gets the starting index of the current selection. */
	get selectionStart() {
		return this.inputEl.selectionStart;
	}
	/** Gets the ending index of the current selection within the input field. */
	get selectionEnd() {
		return this.inputEl.selectionEnd;
	}

	/** Sets the starting index of the current selection. */
	set selectionStart(n: number | null) {
		this.inputEl.selectionStart = n;
	}
	/** Sets the ending index of the current selection. */
	set selectionEnd(n: number | null) {
		this.inputEl.selectionEnd = n;
	}

	/** Sets the selection range within the input field. */
	setSelectionRange(start: number | null, end: number | null) {
		this.inputEl.setSelectionRange(start, end);
	}

	/** Retrieves the current selection object from the window or shadow root */
	protected getWindowSelection() {
		return this.shadowRoot?.getSelection?.() ?? getSelection();
	}

	/** Checks if the current selection originates from within the component's input element. */
	protected getOwnSelection() {
		const sel = this.getWindowSelection();
		return !sel ||
			(sel.focusNode !== this.inputEl &&
				!this.inputEl.contains(sel.focusNode))
			? undefined
			: sel;
	}
}

/**
 * InputText provides an inline text entry field for accepting and editing string
 * values within forms or UI sections.
 *
 * Supports browser autofill detection and
 * programmatic selection control.
 *
 * Selection positions can be queried or set using properties or method. Value
 * changes sync automatically with the UI and can be proxied externally.
 *
 * @title InputText – Basic Inline Text Input Field
 * @icon short_text
 * @tagName c-input-text
 * @see Field
 * @example
 * <c-field>
 * 	<c-label>Email Address</c-label>
 * 	<c-input-text value="email&#64;address.com"></c-input-text>
 * </c-field>
 */
export class InputText extends InputTextBase {
	/**
	 * A string representing the current value of the input field.
	 * @attribute
	 */
	value = '';

	/**
	 * This element serves as the main interface for user text input.
	 */
	readonly inputEl: HTMLInputElement = create('input', {
		className: 'input',
	});
}

component(InputText, {
	tagName: 'c-input-text',
	init: [attribute('value')],
	augment: [
		...inputTextBase,
		$ => $.append($.inputEl),
		host => $valueProxy({ host, input: host.inputEl }),
	],
});
