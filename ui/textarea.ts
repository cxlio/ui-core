import { component, attribute, Slot, get } from './component.js';
import { onResize } from './dom.js';
import { merge } from './rx.js';
import { InputTextBase } from './input-text.js';
import { $valueProxy } from './input-proxy.js';
import { disabledStyles, onFontsReady } from './theme.js';

declare module './component' {
	interface Components {
		'c-textarea': TextArea;
	}
}

/**
 * Multi-line text input field suitable for capturing large or formatted text
 * entries, such as comments, descriptions, or messages.
 *
 * Supports auto-resizing vertically to fit content as the user types.
 * Handles programmatic updates to the `value` prop and updates UI accordingly.
 * The input can be focused and edited using standard keyboard interactions.
 *
 * Supports usage inside responsive layouts; occupies available width/height.
 * Integrates with label and form field components for accessible labeling and
 * validation.
 *
 * @title Flexible Textarea Input
 * @icon subject
 * @tagName c-textarea
 * @example
 * <c-field style="width:100%">
 *   <c-label>Prefilled Text Area</c-label>
 *   <c-textarea value="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."></c-textarea>
 * </c-field>
 */
export class TextArea extends InputTextBase {
	/**
	 * This attribute specifies the initial value displayed within the text area.
	 */
	value = '';

	/**
	 * This property provides a reference to the underlying textarea element.
	 */
	inputEl = document.createElement('textarea');
}

component(TextArea, {
	tagName: 'c-textarea',
	init: [attribute('value')],
	augment: [
		Slot,
		$ => $.append($.inputEl),
		$ => $valueProxy({ host: $, input: $.inputEl }),
		disabledStyles,
		$ => {
			const css = new CSSStyleSheet();
			css.replaceSync(':host{flex-grow:1;position:relative;}');
			$.shadowRoot?.adoptedStyleSheets.push(css);
			return merge(
				get($, 'value'),
				onResize($.inputEl),
				onFontsReady(),
			).raf(() => {
				const style = $.inputEl.style;
				style.height = '0';
				const newHeight = $.inputEl.scrollHeight;
				css.replaceSync(
					`:host{flex-grow:1;position:relative;height:${newHeight}px}`,
				);
				style.height = '100%';
			});
		},
	],
});
