import {
	attribute,
	component,
	create,
	internals,
	styleAttribute,
} from './component.js';
import { Input } from './input.js';
import { buttonBehavior } from './button.js';
import { role } from './a11y.js';
import { css, disabledStyles, buildMask } from './theme.js';
import { checkedBehavior } from './checkbox.js';

declare module './component' {
	interface Components {
		'c-switch': Switch;
	}
}

/**
 * Offers a toggle control for binary choices in forms or settings panels.
 *
 * By default, toggling changes the `checked` state and modifies the
 * `value` submitted with forms if present. Use for scenarios where a
 * user must make a yes/no or on/off decision.
 *
 * Sets `role="switch"` automatically for assistive tech support.
 *
 * Accepts custom values for form submission with the `value` attribute,
 * not just true/false.
 * Checked state populates the form field with the value
 * string, otherwise nothing is submitted.
 *
 * @title Toggle Switch
 * @icon toggle_on
 * @see Checkbox
 * @tagName c-switch
 * @example
 * <c-switch aria-label="demo switch"></c-switch>
 * <c-switch checked aria-label="checked switch"></c-switch>
 * <c-switch disabled aria-label="disabled switch"></c-switch>
 *
 * @demo <caption>With c-field-frame</caption>
 * <div style="width: 300px">
 * <c-field-frame>
 *   <c-label>Camera Access</c-label>
 *   <c-t font="title-small">App has access to your camera</c-t>
 *   <c-switch slot="trailing"></c-slider-bar>
 * </c-field-frame>
 * <c-field-frame>
 *   <c-label>High Contrast Mode</c-label>
 *   <c-switch slot="trailing"></c-slider-bar>
 * </c-field-frame>
 * </div>
 *
 */

export class Switch extends Input {
	/**
	 * Stores the current value of the switch; can be boolean or custom type depending on usage.
	 * @attribute
	 */
	value: unknown = 'on';

	/**
	 * Indicates whether the switch is in the "on" position.
	 * @attribute
	 */
	checked = false;

	/**
	 * Value set at initialization
	 */
	protected defaultChecked = false;

	static {
		component(Switch, {
			tagName: 'c-switch',
			init: [attribute('value'), styleAttribute('checked')],
			augment: [
				role('switch'),
				buttonBehavior,
				css(`
:host {
	position: relative;
	box-sizing: border-box;
	display: inline-flex;
	align-items: center;
	cursor: pointer;
	width: 52px;
	height: 32px;
	border: 2px solid var(--cxl-color-outline);
	border-radius: var(--cxl-shape-corner-full);
	background-color: var(--cxl-color-surface-container-highest);
}
:host([checked]) {
	border-color: var(--cxl-color-primary);
	background-color: var(--cxl-color-primary);
}
.knob {
	transition: scale var(--cxl-speed), translate var(--cxl-speed);
	width: 28px;
	height: 28px;
	border-radius: var(--cxl-shape-corner-full);
	background-color: var(--cxl-color-outline);
	scale: 0.5714;
}
:host([checked]) .knob {
	background-color: var(--cxl-color-on-primary);
	scale: 0.8571;
	translate: 20px 0;
}
:host(:active) .knob {
	width: 28px;
	height: 28px;
	scale: 1;
}
:host([disabled]) .knob { opacity: 38%; }
:host([disabled]) {
	background-color: color-mix(in srgb, var(--cxl-color-surface-container-highest) 12%, transparent);
	border-color: color-mix(in srgb, var(--cxl-color-on-surface) 12%, transparent);
}
:host([disabled][active]) {
	background-color: color-mix(in srgb, var(--cxl-color-on-surface) 12%, transparent);
}
.mask {
	transition: translate var(--cxl-speed);
	display: block;
	position: absolute;
	left: -8px;
	width: 40px; height: 40px;
	border-radius: 100%;
	overflow: hidden;
}
${buildMask('.mask')}
:host([checked]) .mask { translate: 20px 0; }
		`),
				$ => {
					$.defaultChecked = $.checked;
				},
				disabledStyles,
				() => create('div', { className: 'knob' }),
				() => create('div', { className: 'mask' }),
				checkedBehavior,
			],
		});
	}

	/** Resets the input value to its initial value when the form is reset. */
	formResetCallback() {
		this.checked = this.defaultChecked;
		this.touched = false;
	}

	protected setFormValue(val: unknown) {
		internals(this).setFormValue(this.checked ? (val as string) : null);
	}
}
