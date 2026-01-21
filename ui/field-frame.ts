import { component } from './component.js';
import { FieldBase, fieldLayoutStyles } from './field.js';
import { css, font } from './theme.js';

declare module './component.js' {
	interface Components {
		'c-field-frame': FieldFrame;
	}
}

/**
 * Defines a lightweight field component primarily for layout styling.
 * It's suitable for interactive elements like sliders or any custom component that relies on structured field designs.
 *
 * @tagName c-field-frame
 * @title Field Frame Container
 * @icon web_asset
 * @example
 * <c-field-frame style="width:80%">
 *   <c-label>Call Volume</c-label>
 *   <c-icon name="volume_up" slot="leading"></c-icon>
 *   <c-slider-bar>
 *     <c-slider-knob value="0.5"></c-slider-knob>
 *   </c-slider-bar>
 * </c-field-frame>
 * @demo <caption>With Switch</caption>
 * <c-field-frame style="width:300px">
 *   <c-label>High Contrast Mode</c-label>
 *   <c-switch slot="trailing"></c-slider-bar>
 * </c-field-frame>
 */
export class FieldFrame extends FieldBase {}

component(FieldFrame, {
	tagName: 'c-field-frame',
	augment: [
		css(`
slot[name=label] { ${font('body-large')} }
		`),
		fieldLayoutStyles,
	],
});
