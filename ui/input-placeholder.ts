import { Component, component, Slot, get } from './component.js';
import { css, stylesheet } from './theme.js';
import { onResize } from './dom.js';
import { fieldInput } from './field-input.js';
import { combineLatest } from './rx.js';

import type { InputWithValue } from './input.js';

declare module './component' {
	interface Components {
		'c-input-placeholder': InputPlaceholder;
	}
}

/**
 * A component that displays a placeholder text inside an input field.
 *
 * @tagName c-input-placeholder
 * @beta
 * @demo
	<c-field>
		<c-label>Input with Placeholder</c-label>
		<c-input-text></c-input-text>
		<c-input-placeholder>Placeholder</c-input-placeholder>
	</c-field>
 */

export class InputPlaceholder extends Component {}

component(InputPlaceholder, {
	tagName: 'c-input-placeholder',
	augment: [
		css(`
:host {
	display: inline-block;
	pointer-events: var(--cxl-override-pointer-events, none);
	color: var(--cxl-color-on-surface-variant);
	position: absolute;
	overflow: hidden;
	white-space: nowrap;
	text-overflow: ellipsis;
}
	`),
		Slot,
		host => {
			const style = stylesheet(host);
			host.shadowRoot?.adoptedStyleSheets.push(style);
			return fieldInput(host).switchMap(input =>
				combineLatest(
					onResize(input),
					get(input, 'value'),
					get(input as InputWithValue, 'inputValue'),
				).raf(() => {
					const value =
						(input as InputWithValue).inputValue ?? input.value;
					const isEmpty = value === undefined || value === '';

					style.replaceSync(
						`:host{top:${input.offsetTop}px;left:${
							input.offsetLeft
						}px;width:${input.offsetWidth}px;height:${
							input.offsetHeight
						}px;${isEmpty ? '' : 'display:none;'}`,
					);
				}),
			);
		},
	],
});
