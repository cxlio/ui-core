import {
	Component,
	attribute,
	component,
	create,
	getShadow,
	get,
	attributeChanged,
	internals,
} from './component.js';
import { combineLatest, merge } from './rx.js';
import { onAction } from './dom.js';
import { role } from './a11y.js';
import { Input } from './input.js';
import { buildMask, css, font, disabledStyles } from './theme.js';
import { svgPath } from './svg.js';
import { buttonBehavior } from './button.js';
import { ripple } from './ripple.js';

declare module './component' {
	interface Components {
		'c-checkbox': Checkbox;
	}
}

export type Checkable = Component & {
	value: unknown;
	checked: boolean;
	indeterminate?: boolean;
	disabled: boolean;
};

export function checkedBehavior(host: Checkable) {
	return merge(
		combineLatest(get(host, 'indeterminate'), get(host, 'checked')).map(
			([indeterminate, checked]) => {
				return (host.ariaChecked = indeterminate
					? 'mixed'
					: String(checked));
			},
		),
		merge(
			onAction(host).tap(() => {
				if (host.disabled) return;
				if (host.indeterminate) host.indeterminate = false;
				host.checked = !host.checked;
			}),
			get(host, 'checked').tap(() => {
				internals(host).setFormValue?.(
					host.checked ? String(host.value) : null,
				);
			}),
			attributeChanged(host, 'checked').tap(() => {
				host.dispatchEvent(new Event('change', { bubbles: true }));
			}),
		).ignoreElements(),
	);
}

/**
 * The Checkbox component represents a checkbox UI element that allows users to select one or more options from a set.
 * It can be used to turn an option on or off.
 *
 * Without any content, the checkbox displays as an inline-block element. Once you add content,
 * it switches to a block layout with padding to accommodate the label or other elements.
 *
 * It doesn't require wrapping inside a c-field component.
 *
 * @tagName c-checkbox
 * @icon check_box
 * @example
 * <c-checkbox aria-label="Checked" checked></c-checkbox>
 * <c-checkbox aria-label="Unchecked"></c-checkbox>
 * <c-checkbox aria-label="Indeterminate" indeterminate></c-checkbox>
 * @demo <caption>Error State</caption>
 * <c-checkbox aria-label="Checked" checked invalid touched></c-checkbox>
 * <c-checkbox aria-label="Unchecked" invalid touched></c-checkbox>
 * <c-checkbox aria-label="Indeterminate" indeterminate invalid touched></c-checkbox>
 * @demo <caption>Disabled State</caption>
 * <c-checkbox aria-label="Checked" checked disabled></c-checkbox>
 * <c-checkbox aria-label="Unchecked" disabled></c-checkbox>
 * <c-checkbox aria-label="Indeterminate" indeterminate disabled></c-checkbox>
 * @demo <caption>With Label</caption>
 * <c-checkbox checked>Checked</c-checkbox>
 * <c-checkbox invalid touched>Unchecked</c-checkbox>
 * <c-checkbox indeterminate disabled>Indeterminate</c-checkbox>
 */
export class Checkbox extends Input {
	/**
	 * This attribute represents the underlying value of the checkbox.
	 * The value is submitted with the form if the checkbox is checked.
	 * Defaults to 'on', but can be set to any serializable value.
	 * @attribute
	 */
	value: unknown = 'on';

	/**
	 * Represents the current checked state of the checkbox, reflecting the user's selection.
	 * @attribute
	 */
	checked = false;

	/**
	 * Indicates whether the checkbox is in an indeterminate state,
	 * typically used to represent a partially selected state in hierarchical selections.
	 * Useful for cases where the checkbox doesn't reflect a simple true/false value.
	 * @attribute
	 */
	indeterminate?: boolean = false;

	/**
	 * Value set at initialization
	 */
	protected defaultChecked = false;

	static {
		component(Checkbox, {
			tagName: 'c-checkbox',
			init: [
				attribute('value'),
				attribute('checked'),
				attribute('indeterminate'),
			],
			augment: [
				role('checkbox'),
				css(`
:host {
	position: relative;
	display: flex;
	column-gap: 16px;
	align-items: center;
	outline: none;
	cursor: pointer;
	text-align: start;
	padding: 15px;
	${font('body-large')}
	line-height: 18px;
}
:host(:empty) {
  margin: -15px;
  background-color: transparent;
}
:host(:empty) slot { display: none; }
:host([invalid][touched]) .box {
  border-color: var(--cxl-color-error);
  background-color: var(--cxl-color-error);
  color: var(--cxl-color-on-error);
}
:host([invalid][touched]) .box[state=false] {
  background-color: var(--cxl-color-surface);
}
.box {
	--cxl-color-on-surface: var(--cxl-color-on-surface-variant);
	position: relative;
	box-sizing: border-box;
	flex-shrink: 0;
	width: 18px;
	height: 18px;
	border-radius: 2px;
	border: 2px solid var(--cxl-color-on-surface);
	background-color: var(--cxl-color-surface);
}
.mask {
	display: block;
	position: absolute;
	top: -13px; left: -13px;
	width: 40px; height: 40px;
	border-radius: 100%;
	overflow: hidden;
}
${buildMask('.mask')}
svg { display:none; stroke-width:4px;fill:currentColor;stroke:currentColor;width:14px;height:14px; }

.box[state=mixed] .minus { display: block; }
.box[state=true] .check { display: block; }

.box[state=true],.box[state=mixed]  {
	--cxl-color-on-surface: var(--cxl-color-primary);
	background-color: var(--cxl-color-on-surface);
	color: var(--cxl-color-on-primary);
}
:host([invalid][touched]) .box {
	--cxl-color-on-surface: var(--cxl-color-error);
}
:host([disabled]) .box {
	--cxl-color-on-surface: var(--cxl-color--on-surface);
	opacity: 0.38;
}
`),
				buttonBehavior,
				disabledStyles,
				host => {
					host.defaultChecked = host.checked;
					const mask = create('div', { className: 'mask' });
					const body = create(
						'div',
						{ className: 'box' },
						svgPath({
							className: 'check',
							viewBox: '0 0 24 24',
							d: 'M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z',
						}),
						svgPath({
							className: 'minus',
							viewBox: '0 0 24 24',
							d: 'M19 13H5v-2h14v2z',
						}),
						// Needs to be inside box for surface color
						mask,
					);

					getShadow(host).append(body, create('slot'));

					return merge(
						ripple(mask, host),
						checkedBehavior(host).tap(val =>
							body.setAttribute('state', val),
						),
					);
				},
			],
		});
	}

	/** Resets the input value to its initial value when the form is reset. */
	formResetCallback() {
		this.checked = this.defaultChecked;
		this.touched = false;
	}

	protected setFormValue(val: unknown) {
		internals(this).setFormValue?.(this.checked ? (val as string) : null);
	}
}
