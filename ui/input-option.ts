import {
	attribute,
	component,
	create,
	attributeChanged,
	property,
} from './component.js';
import { InputTextBase, inputTextBase } from './input-text.js';
import { $valueProxy } from './input-proxy.js';

import type { Option } from './option.js';

declare module './component' {
	interface Components {
		'c-input-option': InputOption;
	}
}

function scrollInputToEnd(input: HTMLInputElement) {
	const isRTL = getComputedStyle(input).direction === 'rtl';
	if (isRTL) {
		// Safe trick: temporarily set very large scrollLeft
		input.scrollLeft = 1e6; // ends up at the left edge in RTL
	} else {
		input.scrollLeft = input.scrollWidth;
	}
}

/**
 * A form field control supporting both free-text entry and option selection.
 * Allows assignment of an Option element to set the field’s value and display
 * text, but also permits manual typing for custom values. Integrates
 * with option picker components for autocompletion or selection.
 *
 * Value updates both when users type or an option is selected. The `selected`
 * property tracks the chosen Option element when relevant. When an option is
 * selected, the displayed text and value reflect the option's content; when
 * typing, the value is the entered string.
 *
 * @title Option Input Field
 * @icon looks_one
 * @tagName c-input-option
 * @see Field
 * @see Autocomplete
 */
export class InputOption extends InputTextBase {
	/**
	 * Holds the currently selected Option element if available, enabling the component to track selection state
	 * for integrations like autocomplete or option pickers.
	 */
	selected?: Option;

	/**
	 * Represents the current value of the field, which synchronizes with
	 * an assigned option.
	 */
	value: unknown;

	/**
	 * This element serves as the main interface for user text input.
	 */
	protected readonly inputEl: HTMLInputElement = create('input', {
		className: 'input',
	});

	static {
		component(InputOption, {
			tagName: 'c-input-option',
			init: [attribute('value'), property('selected')],
			augment: [
				...inputTextBase,
				$ => $.append($.inputEl),
				host =>
					$valueProxy({
						host,
						input: host.inputEl,
						toText: () => host.selected?.textContent ?? '',
						toValue: val =>
							val !== '' ? host.selected?.value : undefined,
					}),
				$ => {
					return attributeChanged($, 'selected').tap(val => {
						const text = $.selected?.textContent;
						$.value = val?.value;
						$.setInputValue(text ?? '');
						scrollInputToEnd($.inputEl);
					});
				},
			],
		});
	}
}
