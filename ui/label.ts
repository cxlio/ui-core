import { Component, Slot, component, get } from './component.js';
import { fieldRegistable } from './field-input.js';
import { EMPTY, observable } from './rx.js';
import { css } from './theme.js';
import { AriaProperty, AriaProperties, getAriaId } from './a11y.js';

declare module './component' {
	interface Components {
		'c-label': Label;
	}
}

type SetAria<T extends AriaProperty> = (
	prop: T,
	value: AriaProperties[T] | null,
) => void;

function setLabel(
	label: HTMLElement | string | undefined,
	host: Component & { setAria?: SetAria<AriaProperty> },
) {
	if (!label) return EMPTY;

	if (typeof label === 'string') {
		host.setAttribute('aria-label', label);
		return EMPTY;
	}

	return getAriaId(label)
		.tap(id => {
			if (label.textContent) {
				//if (host.setAria) host.setAria('labelledby', id);
				host.setAttribute('aria-labelledby', id);
			}
		})
		.finalize(() => {
			//if (host.setAria) host.setAria('labelledby', null);
			host.removeAttribute('aria-labelledby');
		});
}

/**
 * The Label component is a visually distinct element designed to clarify the expected input for users.
 * It is typically used within a Field component and placed directly before the corresponding input field.
 *
 * @tagName c-label
 * @title Accessible Label for Inputs
 * @icon label
 */
export class Label extends Component {}

component(Label, {
	tagName: 'c-label',
	augment: [
		css(`
:host {
	display: inline-block;
}`),
		Slot,
		host =>
			fieldRegistable(host).switchMap(field =>
				'input' in field
					? get(field, 'input').switchMap(input =>
							input ? setLabel(host, input) : EMPTY,
					  )
					: setLabel(host, field),
			),
		$ =>
			observable(() => {
				$.slot = 'label';
			}),
	],
});
