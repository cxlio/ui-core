import {
	Component,
	component,
	get,
	property,
	internals,
	setAttribute,
} from './component.js';
import { on, onAttributeMutation } from './dom.js';
import { EMPTY, Observable, defer, merge } from './rx.js';
import { focusable } from './focusable.js';

import { Input } from './input.js';

import type { AriaProperties, AriaProperty } from './a11y.js';

function proxyAttr<T extends Component>($: T, el: HTMLElement, attr: string) {
	return get($, attr as Extract<keyof T, string>).tap(v =>
		setAttribute(el, attr, v as string),
	);
}

export interface ValueProxyOptions<T extends InputProxy> {
	host: T;
	input: HTMLInputElement | HTMLTextAreaElement;
	update?: Observable<unknown>;
	toText?(value: T['value'], old: string): string;
	toValue?(value: string): T['value'];
}

export const proxyStyle = `display:block;border:0;padding:0;font:inherit;color:inherit;outline:0;width:100%;min-height:20px;background-color:transparent;text-align:start;white-space:pre-wrap;max-height:100%;resize:inherit;`;

export function $valueProxy<T extends InputProxy>({
	host,
	input: el,
	toText,
	toValue,
	update,
}: ValueProxyOptions<T>) {
	el.className = 'cxl-native-input';
	el.setAttribute('style', proxyStyle);
	// Set value attribute so the form reset action works
	el.setAttribute('form', '__cxl_ignore__');

	function updateValue(ev: Event) {
		host.value = toValue ? toValue(el.value || '') : el.value;
		ev.stopPropagation();
		host.dispatchEvent(new Event(ev.type, { bubbles: true }));
	}
	function apply() {
		const val = host.value;
		const newVal = toText ? toText(val, el.value) : (val as string) || '';
		if (el.value !== newVal) host.setInputValue(newVal);
	}
	function updateLabel() {
		el.ariaLabel = host.ariaLabel;
		const by = host.getAttribute('aria-labelledby');
		if (by) el.setAttribute('aria-labelledby', by);
		else el.removeAttribute('aria-labelledby');
	}

	return merge(
		focusable(host, el),
		defer(() => {
			updateLabel();
			return el.form ? on(el.form, 'reset').tap(updateValue) : EMPTY;
		}),
		get(host, 'value' as Extract<keyof T, string>).tap(() => {
			// Prevent formatting to reset cursor
			// TODO can conflict with programatically setting value
			if (toText && el.matches(':focus')) return;
			apply();
		}),
		on(el, 'blur').tap(apply),
		on(el, 'input').tap(updateValue),
		on(el, 'change').tap(updateValue),
		proxyAttr(host, el, 'disabled'),
		proxyAttr(host, el, 'name'),
		proxyAttr(host, el, 'autocomplete'),
		proxyAttr(host, el, 'spellcheck'),
		proxyAttr(host, el, 'autofocus'),
		onAttributeMutation(host, ['aria-label', 'aria-labelledby']).tap(
			updateLabel,
		),
		update ? update.tap(apply) : EMPTY,
		on(el, 'blur').tap(() => host.dispatchEvent(new Event('blur'))),
		on(el, 'focus').tap(() => host.dispatchEvent(new Event('focus'))),
	);
}

/**
 * The ProxiedInputBase class extends the CustomInputBase class, offering a foundation for
 * custom input components that utilize Shadow DOM for encapsulation and leverage a proxied
 * HTML input element for core input functionality.
 */
export abstract class InputProxy extends Input {
	/**
	 * A property reflecting the actual input element's value,
	 */
	readonly inputValue = '';

	/**
	 * An abstract property requiring child classes to define an HTMLInputElement that
	 * serves as the internal input element within the Shadow DOM.
	 */
	protected abstract readonly inputEl: HTMLInputElement | HTMLTextAreaElement;

	static {
		component(InputProxy, {
			init: [property('inputValue')],
			augment: [
				$ => {
					($.inputValue as string) = $.inputEl.value;
					return on($.inputEl, 'input').tap(() => {
						($.inputValue as string) = $.inputEl.value;
					});
				},
			],
		});
	}

	constructor() {
		super();
		this.attachShadow({
			mode: 'open',
			delegatesFocus: true,
		});
	}

	get role() {
		return this.inputEl.role;
	}

	/**
	 * Returns a string representing a message that describes the validation constraints that the control does not satisfy (if any).
	 */
	get validationMessage(): string {
		return this.inputEl.validationMessage || '';
	}

	/**
	 * Provides a read-only `ValidityState` that reflects the validity of the internal input element.
	 */
	get validity(): ValidityState | null {
		return this.inputEl.validity || null;
	}

	set role(v: string | null) {
		this.inputEl.role = v;
	}

	/**
	 * Delegates the focus call to the `inputEl`, ensuring focus is set on the internal input element.
	 */
	focus() {
		this.inputEl.focus();
	}

	setAria<T extends AriaProperty>(prop: T, value: AriaProperties[T] | null) {
		if (!value) this.inputEl.removeAttribute(`aria-${prop}`);
		else this.inputEl.setAttribute(`aria-${prop}`, value);
	}

	setInputValue(value: string) {
		this.inputEl.value = value;
		(this.inputValue as string) = this.inputEl.value;
	}

	protected applyValidity(invalid: boolean, msg?: string) {
		internals(this).setValidity(
			{ customError: invalid },
			msg,
			this.inputEl,
		);
		this.inputEl.setCustomValidity(invalid ? msg || 'Invalid Field' : '');
	}
}
