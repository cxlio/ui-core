import {
	Component,
	component,
	create,
	getShadow,
	property,
	styleAttribute,
	onMessage,
	get,
	attributeChanged,
} from './component.js';
import { on } from './dom.js';
import { EMPTY, be, merge, of } from './rx.js';
import { Size, css, font, buildMask, sizeAttribute } from './theme.js';
import { ariaId } from './a11y.js';
import { registableHost } from './registable.js';
import { FieldHelp } from './field-help.js';

import type { Input } from './input.js';

declare module './registable.js' {
	interface RegistableMap {
		field: (field: FieldLike) => void;
	}
}

declare module './component' {
	interface Components {
		'c-field': Field;
	}
}

export interface FieldLike extends Component {
	readonly input?: Input;
	getContentRect: () => DOMRect;
}

export const fieldLayoutStyles = css(`
:host {
  display: block;
  position: relative;
  text-align: start;
  ${font('body-large')}
}
:host([invalid]),:host([invalid]) slot[name=label],:host([invalid]) slot[name=trailing] {
	--cxl-color-primary: var(--cxl-color-error);
	--cxl-field-invalid: var(--cxl-color-error);
	color: var(--cxl-color-error);
}
.content {
	position: relative;
	box-sizing: border-box;
	display: flex;
	column-gap: 12px;
	align-items: center;
	padding: 8px 12px 8px 12px;
}
::slotted([slot=help]) { margin-top: 4px; }
.help {
	${font('body-small')}
	padding: 0 16px;
	display: flex;
	flex-direction: column;
}
.body {
	display:flex;
	flex-direction: column;
	flex-grow: 1;
	justify-content: center;
	margin: 0 4px;
}
slot[name=label] {
	display:block;
}
#bodyslot { display: flex; column-gap: 16px; align-items: center; }
.indicator { position:absolute; }
`);

export const fieldBaseStyles = css(`
:host(:focus-within) slot[name=label] { color: var(--cxl-color-primary); }
slot[name=label] {
	${font('body-small')}
	height: 16px;
}
:host([floating]) slot[name=label] {
	display:none;
	transition: font var(--cxl-speed), height var(--cxl-speed), top var(--cxl-speed), left var(--cxl-speed);
}
:host([floating]) slot[name=label].novalue, :host([floating]) slot[name=label].value { display:block; }
`);

export const fieldStyles = css(`
:host {
	border-radius: var(--cxl-shape-corner-xsmall) var(--cxl-shape-corner-xsmall) 0 0;
}
:host([floating]:not(:focus-within)) slot[name=label].novalue {
	${font('body-large')}
	height: 0;
}
:host([inputdisabled]) {
  filter: saturate(0);
  opacity: 0.6;
  pointer-events: var(--cxl-override-pointer-events, none);
}
.content {
	--cxl-color-on-surface: var(--cxl-color-on-surface-variant);
	--cxl-color-surface: var(--cxl-color-surface-container-highest);
	color: var(--cxl-color-on-surface);
	background-color: var(--cxl-color-surface);
	min-height: 56px;
	padding: 8px 12px 8px 12px;
}
.indicator {
	background-color: var(--cxl-field-invalid, var(--cxl-color-on-surface-variant));
	bottom: 0; height: 1px; left: 0; right: 0;
	transition: scale var(--cxl-speed);
	transform-origin: bottom;
}
:host(:focus-within) .indicator {
	scale: 1 3;
	background-color: var(--cxl-color-primary);
}

${buildMask('.content')}
	`);

export function inputContainer(host: FieldBase) {
	return merge(
		onMessage(host, 'registable.form', false).tap(ev => {
			if (ev.id === 'form') {
				(host.input as Input) = ev.target as Input;
			}
		}),
		registableHost('field', host).tap(ev => {
			if (ev.type === 'connect') ev.target(host);
		}),
	);
}

export const fieldLayout = () =>
	create(
		'div',
		{ className: 'content' },
		create('slot', { name: 'leading' }),
		create(
			'div',
			{ className: 'body' },
			create('slot', { name: 'label' }),
			create('slot', { id: 'bodyslot' }),
		),
		create('slot', { name: 'trailing' }),
		create('div', { className: 'indicator' }),
	);

export function fieldBehavior(host: FieldBase) {
	function validity(input: Input) {
		invalid.next(input.touched && input.invalid);
		host.toggleAttribute('invalid', invalid.value);

		let shown = 0;
		const describedby = [];

		for (const node of helpSlot.assignedNodes()) {
			if (!(node instanceof HTMLElement) || node === fieldHelp) continue;
			if ('invalid' in node && node.invalid) {
				if (
					invalid.value &&
					(node.invalid === true ||
						node.invalid === input.validationResult?.key)
				) {
					shown++;
					node.style.display = '';
					describedby.push(ariaId(node));
				} else node.style.display = 'none';
			} else describedby.push(ariaId(node));
		}

		const noHelp = !invalid.value || shown > 0;

		fieldHelp.textContent = noHelp ? '' : input.validationMessage;

		if (noHelp) fieldHelp.remove();
		else {
			if (!fieldHelp.parentElement) host.append(fieldHelp);
			describedby.push(ariaId(fieldHelp));
		}

		if (describedby.length)
			input.setAria('describedby', describedby.join(' '));
		else input.setAria('describedby', null);
	}

	function update(ev?: Event) {
		const input = host.input;
		if (input) {
			host.toggleAttribute('inputdisabled', input.disabled);
			validity(input);

			if (!ev) return;
			if (ev.type === 'focus') focused.next(true);
			else if (ev.type === 'blur') focused.next(false);
		}
	}

	function onChange() {
		const value = host.input?.value;
		const noValue =
			!host.input?.hasAttribute('autofilled') &&
			(!value || (value as string).length === 0);

		labelSlot?.classList.toggle('novalue', noValue);
		labelSlot?.classList.toggle('value', !noValue);
	}

	const invalid = be(false);
	const focused = be(false);
	const helpSlot = create('slot', { name: 'help' });
	const labelSlot = host.contentElement.children[1]?.children[0] as
		| HTMLSlotElement
		| undefined;
	const fieldHelp = create(FieldHelp, { ariaLive: 'polite' });

	getShadow(host).append(create('div', { className: 'help' }, helpSlot));

	return merge(
		get(host, 'input').switchMap(input =>
			input
				? merge(
						of(undefined).tap(() => {
							update();
							queueMicrotask(onChange);
						}),
						on(input, 'focusable.change').tap(update).tap(onChange),
						on(input, 'focus').tap(update),
						on(input, 'invalid').tap(update),
						on(input, 'update').tap(onChange),
						attributeChanged(input, 'touched').tap(() => update()),
						merge(
							on(input, 'blur'),
							on(helpSlot, 'slotchange'),
						).raf(update),
						on(host.contentElement, 'click').tap(() => {
							if (
								document.activeElement !== input &&
								!host.matches(':focus-within') &&
								!focused.value
							) {
								input.focus();
							}
						}),
				  )
				: EMPTY,
		),
		inputContainer(host),
	);
}

/**
 * Field Base
 * @beta
 */
export class FieldBase extends Component {
	/**
	 * Sets the field to have a floating label that animates when the field is focused or has a value.
	 * @attribute
	 */
	floating = false;

	/**
	 * A reference to the underlying input component being used within the field.
	 */
	readonly input?: Input;

	/**
	 * Size of the field, dynamically affecting layout spacing and appearance.
	 *
	 * @demo
	 * <c-field-outlined floating size="-2">
	 *   <c-label>Label</c-label>
	 *   <c-input-text></c-input-text>
	 * </c-field-outlined>
	 * <c-field floating size="1">
	 *   <c-label>Label</c-label>
	 *   <c-input-text></c-input-text>
	 * </c-field>
	 */
	size?: Size;

	readonly contentElement = fieldLayout();

	static {
		component(FieldBase, {
			init: [
				styleAttribute('floating'),
				property('input'),
				sizeAttribute(
					'size',
					s => ` .content{min-height: ${56 + s * 8}px;}`,
				),
			],
			augment: [$ => $.contentElement, fieldBehavior],
		});
	}

	getContentRect() {
		return this.contentElement.getBoundingClientRect();
	}
}

/**
 * The Field component serves as a container for form input elements.
 * It allows you to customize the appearance (floating label, leading icon)
 * and layout of the field.
 *
 * ### Slots
 *
 * - label: Place a label component or node to describe the form field.
 * - leading: Insert an icon or custom element before the main input. Commonly used for decorative or contextual icons.
 * - trailing: Insert an icon or custom element after the main input, typically for actions (e.g., clear, reveal).
 * - default: Main content area, typically a form input element (`<c-input-text>` or similar).
 * - help: Place a help or supporting text component. Will visually indicate errors if present and marked `invalid`.
 *
 * @tagName c-field
 * @title Form Field Container
 * @icon input
 * @example
 * <c-field>
 *   <c-label>Label Text</c-label>
 *   <c-input-text></c-input-text>
 *   <c-field-help>Supporting Text</c-field-help>
 * </c-field>
 *
 * @demo <caption>Floating Label</caption>
 * <c-field floating>
 *   <c-label>Label Text</c-label>
 *   <c-input-text></c-input-text>
 *   <c-field-help>Supporting Text</c-field-help>
 * </c-field>
 *
 * @demo <caption>Leading Icon</caption>
 * <c-field floating>
 *   <c-label>Label Text</c-label>
 *   <c-icon role="none" name="search" slot="leading"></c-icon>
 *   <c-input-text value="Input Text"></c-input-text>
 *   <c-field-help>Supporting Text</c-field-help>
 * </c-field>
 *
 * @demo <caption>Trailing Icon</caption>
 * <c-field floating>
 *   <c-label>Label Text</c-label>
 *   <c-icon role="none" name="cancel" slot="trailing"></c-icon>
 *   <c-input-text value="Input Text"></c-input-text>
 *   <c-field-help>Supporting Text</c-field-help>
 * </c-field>
 *
 * @demo <caption>RTL Support</caption>
 * <c-field dir="rtl" floating>
 *   <c-label>Label Text</c-label>
 *   <c-icon role="none" name="search" slot="leading"></c-icon>
 *   <c-icon role="none" name="cancel" slot="trailing"></c-icon>
 *   <c-input-text value="Input Text"></c-input-text>
 *   <c-field-help>Supporting Text</c-field-help>
 * </c-field>
 */
export class Field extends FieldBase {}

component(Field, {
	tagName: 'c-field',
	augment: [fieldLayoutStyles, fieldBaseStyles, fieldStyles],
});
