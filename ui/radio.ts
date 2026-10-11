import {
	component,
	attribute,
	styleAttribute,
	create,
	getShadow,
	attributeChanged,
	internals,
} from './component.js';
import { Observable, merge } from './rx.js';
import { on, onAction, nodeSort } from './dom.js';
import { Input } from './input.js';
import { findForm } from './form-submit.js';
import { css, buildMask, disabledStyles, font } from './theme.js';
import { buttonBehavior } from './button.js';
import { role } from './a11y.js';
import { hasValue, type ValidationResult } from './validation.js';

declare module './component.js' {
	interface Components {
		'c-radio': Radio;
	}
}

const radios = new Set<Radio>();

/**
 * Selects one option from a group of radio buttons with the same name.
 * Groups are scoped to their form or DOM root; unnamed radios are independent.
 * Only the checked radio contributes its value to form submission.
 *
 * Arrow keys move focus and selection within the group, skipping disabled radios.
 * Space and Enter select the focused radio. Set rules="required" to require a
 * selection in the group. Form reset restores the initial checked state.
 *
 * ### Slots
 *
 * - default: Label content. Use aria-label when the radio has no visible label.
 *
 * @tagName c-radio
 * @title Radio Button
 * @icon radio_button_checked
 * @example <caption>Radio Group</caption>
 * <c-fieldset>
 *   <c-label>Delivery option</c-label>
 *   <c-radio name="delivery" value="standard" checked>Standard</c-radio>
 *   <c-radio name="delivery" value="express">Express</c-radio>
 * </c-fieldset>
 * @demo <caption>Error State</caption>
 * <c-radio aria-label="Invalid selection" checked invalid touched></c-radio>
 * @demo <caption>Disabled State</caption>
 * <c-radio disabled>Unavailable option</c-radio>
 */
export class Radio extends Input {
	/**
	 * Whether this radio is selected. Selecting it unchecks other radios in its group.
	 * @attribute
	 */
	checked = false;

	/**
	 * The value submitted when this radio is checked. Defaults to 'on'.
	 * @attribute
	 */
	value: unknown = 'on';
	protected defaultChecked = false;
	protected defaultTabIndex = 0;
	protected groupOwner?: Node;
	protected groupName?: string;

	static {
		component(Radio, {
			tagName: 'c-radio',
			init: [styleAttribute('checked'), attribute('value')],
			augment: [
				role('radio'),
				css(`
:host {
	position: relative;
	cursor: pointer;
	display: flex;
	align-items: center;
	outline: none;
	${font('body-large')}
	line-height: 18px;
	column-gap: 16px;
	text-align: start;
	padding: 15px;
}
:host(:empty) {
  margin: -15px;
  background-color: transparent;
}
.box {
	--cxl-color-on-surface: var(--cxl-color-on-surface-variant);
	border: 2px solid var(--cxl-color-on-surface);
	width: 18px;
	height: 18px;
	box-sizing: border-box;
	flex-shrink: 0;
	display: inline-block;
	border-radius: 14px;
	position: relative;
}
.box::after {
	position: absolute;
	display: block;
	content: '';
	border-radius: 10px;
	width: 10px;
	height: 10px;
	transition: scale var(--cxl-speed);
	scale: 0;
	margin: 2px 0 0 2px;
	background-color: var(--cxl-color-on-surface);
}
.box::before {
	position: absolute;
	display: block;
	content: '';
	width: 40px; height: 40px;
	border-radius: 100%;
	translate: -13px -13px;
}
${buildMask('.box::before')}
:host([checked]) .box::after {
	scale: 1;
}
:host([checked]) .box {
	--cxl-color-on-surface: var(--cxl-color-primary);
}
:host([invalid][touched]) .box {
	--cxl-color-on-surface: var(--cxl-color-error);
}
:host([disabled]) .box, :host(:disabled) .box {
	--cxl-color-on-surface: var(--cxl-color--on-surface);
	opacity: 0.38;
}
		`),
				disabledStyles,
				host => {
					host.defaultTabIndex = host.hasAttribute('tabindex')
						? host.tabIndex
						: 0;
					return buttonBehavior(host);
				},
				host => {
					host.defaultChecked = host.checked;
					getShadow(host).append(
						create('div', { className: 'box' }),
						create('slot'),
					);
					return new Observable<void>(subscriber => {
						radios.add(host);
						host.syncGroups();
						merge(
							merge(
								attributeChanged(host, 'checked'),
								attributeChanged(host, 'name'),
								attributeChanged(host, 'disabled'),
								attributeChanged(host, 'value'),
							).tap(() => host.syncGroups()),
							onAction(host).tap(() => host.select()),
							on(host, 'keydown').tap(ev => {
								if (
									host.isDisabled() ||
									!['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(ev.key)
								) return;
								ev.preventDefault();
								ev.stopPropagation();
								const group = host.group().filter(radio => !radio.isDisabled());
								const direction = ev.key === 'ArrowUp' || ev.key === 'ArrowLeft'
									? -1 : 1;
								const next = group[
									(group.indexOf(host) + direction + group.length) % group.length
								];
								next?.focus();
								next?.select();
							}),
						).subscribe({ signal: subscriber.signal });
						subscriber.signal.subscribe(() => {
							radios.delete(host);
							host.syncGroups(false);
						});
					});
				},
			],
		});
	}

	formAssociatedCallback() {
		this.syncGroups();
	}

	/** Restores the initial checked state and clears touched state. */
	formResetCallback() {
		this.checked = this.defaultChecked;
		this.touched = false;
	}

	protected scope() {
		const form = findForm(this);
		return !this.hasAttribute('form') && form && !(form instanceof HTMLFormElement)
			? form
			: internals(this).form ?? this.getRootNode();
	}

	protected group() {
		if (!this.name) return [this];
		const scope = this.scope();
		return [...radios]
			.filter(radio => radio.name === this.name && radio.scope() === scope)
			.sort(nodeSort);
	}

	protected syncGroups(select = this.checked) {
		const group = this.group();
		const affected = new Set(group);
		for (const radio of radios)
			if (this.groupName && radio.name === this.groupName && radio.scope() === this.groupOwner)
				affected.add(radio);
		this.groupOwner = this.scope();
		this.groupName = this.name;
		if (select)
			for (const radio of group)
				if (radio !== this) radio.checked = false;
		const updated = new Set<Radio>();
		for (const radio of affected) {
			if (!radios.has(radio) || updated.has(radio)) continue;
			const members = radio.group();
			const enabled = members.filter(item => !item.isDisabled());
			const active = enabled.find(item => item.checked) ?? enabled[0];
			for (const member of members) {
				updated.add(member);
				member.ariaChecked = String(member.checked);
				member.ariaDisabled = member.isDisabled() ? 'true' : null;
				member.setFormValue(member.value);
				member.tabIndex = member === active ? member.defaultTabIndex : -1;
				const required = member.validMap.required;
				if (required) member.setValidity(required, members);
			}
		}
	}

	protected isDisabled() {
		return this.disabled || this.matches(':disabled');
	}

	protected select() {
		if (this.isDisabled() || this.checked) return;
		this.checked = this.touched = true;
		this.dispatchEvent(new Event('change', { bubbles: true }));
	}

	protected setValidity(result: ValidationResult, group = this.group()) {
		if (result.key === 'required')
			result = {
				...result,
				valid: group.some(radio => radio.checked && hasValue(radio.value)),
			};
		return super.setValidity(result);
	}

	protected formDisabledCallback() {
		this.syncGroups(false);
	}

	protected setFormValue(value: Radio['value']) {
		internals(this).setFormValue(this.checked ? String(value) : null);
	}
}
