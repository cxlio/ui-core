import {
	Slot,
	Component,
	component,
	create,
	getShadow,
	styleAttribute,
} from './component.js';
import {
	buildMenuStyles,
	css,
	disabledStyles,
	surface,
	stylesheet,
	onFontsReady,
} from './theme.js';
import { role } from './a11y.js';
import { svgPath } from './svg.js';
import { popoverBehavior } from './popover.js';
import {
	SelectableBase,
	SelectableHost,
	selectableNavigation,
} from './selectable-host.js';
import { Option } from './option.js';
import { EMPTY, merge } from './rx.js';
import { on, onVisible } from './dom.js';
import { focusable } from './focusable.js';
import { FieldBase } from './field.js';

import type { Input } from './input.js';

declare module './component' {
	interface Components {
		'c-select': Select;
	}
}

export interface SelectLikeBase extends SelectableBase {
	open: boolean;
}

export interface SelectLike extends SelectLikeBase {
	disabled: boolean;
	touched: boolean;
}

export const selectInputStyles = css(`
:host {
	box-sizing: border-box;
	display: block;
	cursor: pointer;
	height: 20px;
	position: relative;
	padding-right: 28px;
	flex-grow: 1;
	text-align: start;
	outline: 0;
	-webkit-tap-highlight-color: transparent;
}
.caret {
	position: absolute;
	right: 0;
	top: 0;
	line-height: 0;
	width: 20px;
	height: 20px;
	fill: currentColor;
}
`);

export const selectMenuStyles = css(`
${buildMenuStyles('#menu')}
#menu { margin: 0; border: 0; box-sizing: border-box; }
:host {
	--cxl-mask-focus: color-mix(in srgb, var(--cxl-color-on-surface) 10%, transparent);
	--cxl-select-focused: linear-gradient(0, var(--cxl-mask-focus),var(--cxl-mask-focus));
}
`);

export function positionUnder(host: HTMLElement, target: HTMLElement) {
	return () => {
		const rect =
			host.parentElement instanceof FieldBase
				? host.parentElement.getContentRect()
				: host.getBoundingClientRect();
		target.style.top = `${rect.bottom}px`;
		target.style.left = `${rect.x}px`;
		target.style.minWidth = `${rect.width}px`;
		target.style.maxHeight = `${Math.min(
			window.innerHeight - rect.bottom - 16,
			280,
		)}px`;
	};
}

/*
 * Composes keyboard navigation, delayed blur-based closing, and popover toggling into one behavior.
 * Arrow keys move between options, a short debounce on blur lets option selection fire before closing,
 * and popoverBehavior handles positioning and open/close callbacks.
 */
export function selectBehavior({
	host,
	target,
	input,
	position,
	beforeToggle,
	onToggle,
	handleOther,
	axis,
}: {
	host: SelectLikeBase;
	target: HTMLElement;
	position?: () => void;
	input?: Input;
	beforeToggle?: (isOpen: boolean) => void;
	onToggle?: (isOpen: boolean) => void;
	handleOther?: boolean;
	axis?: 'x' | 'y';
}) {
	return merge(
		selectableNavigation({
			host,
			input: input,
			handleOther,
			axis,
		}),
		// Debounce here to allow options to emit selectable.action
		on(input ?? host, 'blur')
			.debounceTime(100)
			.tap(() => {
				host.open = false;
			}),
		popoverBehavior({
			host,
			target,
			position: position ?? positionUnder(host, target),
			beforeToggle,
			onToggle,
		}),
	);
}

export function selectComponent(options: {
	host: SelectLike;
	target: HTMLElement;
	position?: () => void;
	input?: Input;
	beforeToggle?: (isOpen: boolean) => void;
	onToggle?: (isOpen: boolean) => void;
	handleOther?: boolean;
}) {
	const { host } = options;

	return merge(
		selectInputStyles(host) ?? EMPTY,
		disabledStyles(host) ?? EMPTY,
		focusable(host),
		selectBehavior(options),
	);
}

/**
 * View for Select Options
 * @beta
 */
export class SelectOption extends Component {}

component(SelectOption, {
	tagName: 'c-select-option',
	augment: [
		css(`
:host {
	box-sizing: border-box;
	cursor: pointer;
	display: flex;
	column-gap: 16px;
	align-items: center;
	/*background-color: var(--cxl-color-surface);
	color: var(--cxl-color-on-surface);*/
	padding: var(--cxl-select-padding, 16px);
	position: relative;
	user-select: none;
	white-space: nowrap;
	overflow: hidden;
	-webkit-user-select: none;
	-webkit-tap-highlight-color: transparent;
}
:host([focused]) {
	background-image: var(--cxl-select-focused);
}
:host(:hover) { background-image: linear-gradient(0, var(--cxl-mask-hover),var(--cxl-mask-hover)); }
:host(:focus-visible) { background-image: linear-gradient(0, var(--cxl-mask-focus),var(--cxl-mask-focus)) }
		`),
		Slot,
	],
});

/**
 * Select dropdown component for single-option selection with menu surfacing,
 * and keyboard navigation.
 *
 * Displays a clickable input area that triggers an options menu positioned
 * beneath the field or according to parent alignment.
 *
 * Requires usage of `c-option` as children.
 *
 * @title Select Dropdown Component
 * @icon arrow_drop_down
 * @tagName c-select
 * @demo
 * <c-field-outlined style="margin: 56px 0">
 *   <c-select aria-label="Select Box with Icon">
 *     <c-option>
 *       <c-icon name="draft"></c-icon>
 *       Any
 *     </c-option>
 *     <c-option>
 *       <c-icon name="image"></c-icon>
 *       Image
 *     </c-option>
 *     <c-option>
 *       <c-icon name="csv"></c-icon>
 *       CSV
 *     </c-option>
 *   </c-select>
 * </c-field-outlined>
 */
export class Select extends SelectableHost {
	/**
	 * Controls the visibility of the associated menu.
	 * @attribute
	 */
	open = false;

	/**
	 * Designates the component responsible for rendering individual options
	 */
	readonly optionView = SelectOption;

	protected setSelected(option: Option | undefined) {
		super.setSelected(option); // ?? this.options[0]);
		if (!this.open) {
			for (const o of this.options) if (o !== option) o.slot = '';
			if (option) option.slot = 'selected';
		} else this.open = false;
	}
}

component(Select, {
	tagName: 'c-select',
	init: [styleAttribute('open')],
	augment: [
		role('listbox'),
		css(`
:host([open]) ::slotted([selected]) {
	--cxl-color-surface: var(--cxl-color-primary-container);
}
:host([open]) {
	--cxl-mask-focus: color-mix(in srgb, var(--cxl-color-on-surface) 10%, transparent);
	--cxl-mask-hover: color-mix(in srgb, var(--cxl-color-on-surface) 8%, transparent);
	--cxl-select-focused: linear-gradient(0, var(--cxl-mask-focus),var(--cxl-mask-focus));
}
:host(:not([open])) {
	--cxl-select-padding: 0;
	--cxl-mask-focus: transparent;
	--cxl-mask-hover: transparent;
}
slot[name=selected] {
	pointer-events: none;
	--cxl-color-surface: transparent;
}
.menu {
	position: fixed;
	padding: 8px 0;
	min-width: 112px;
	width: max-content;
	border-radius: var(--cxl-shape-corner-xsmall);
	visibility:hidden;
	margin: 0;
	transition: scale var(--cxl-speed);
	/** popover applies display:none if this is not set */
	display: block;
}
.menu.open {
	${surface('surface-container')}
	border: 0;
	transform-origin: top;
	overflow-y: auto;
	box-shadow: var(--cxl-elevation-2);
	visibility:visible;
}
		`),
		$ => {
			const menu = create('div', { className: 'menu' }, create('slot'));
			const selectedSlot = create('slot', { name: 'selected' });
			const style = menu.style;
			const hostStyle = stylesheet($);
			let closedHeight = 0;
			let openHeight = 0;
			getShadow($).append(
				menu,
				selectedSlot,
				svgPath({
					viewBox: '0 0 24 24',
					className: 'caret',
					d: 'M7 10l5 5 5-5z',
				}),
			);

			function setSize() {
				if ($.open) {
					openHeight = $.selected?.rendered?.offsetHeight ?? 0;
				} else {
					// find option with greatest minWidth
					style.cssText = '';
					const minWidth = $.options.reduce(
						(prev, curr) =>
							Math.max(prev, curr?.rendered?.offsetWidth ?? 0),
						0,
					);
					hostStyle.replaceSync(`:host{width:${minWidth}px}`);
				}
			}

			return merge(
				merge(onVisible($), onFontsReady()).raf(setSize),
				selectComponent({
					host: $,
					target: menu,
					handleOther: true,
					beforeToggle(isOpen) {
						setSize();
						const selected = $.selected;
						if (selected) selected.slot = isOpen ? '' : 'selected';
						menu.classList.toggle('open', isOpen);
					},
					onToggle(isOpen) {
						const selected = $.selected;
						if (!isOpen && selected)
							closedHeight = selected.rendered?.offsetHeight ?? 0;
					},
					position() {
						const parent = $.parentElement ?? $;
						//if (!parent) return;
						const pad = Math.round((openHeight - closedHeight) / 2);
						const option = $.selected?.rendered;
						const parentRect = parent.getBoundingClientRect();
						const rect = $.getBoundingClientRect();
						const maxTranslateY = rect.top - 14;

						let height: number;
						// Browsers can return different values for the offsetParent property
						// causing the alignment to fail.
						let translateY = option ? option.offsetTop : 0;

						if (translateY > maxTranslateY)
							translateY = maxTranslateY;

						height = menu.scrollHeight;
						// The maximum height needed to align the option with the select box.
						const maxHeight =
							window.innerHeight - rect.top + 8 + translateY;
						const top = rect.top - pad - translateY;

						if (height > maxHeight) {
							height = maxHeight;
						} else if (height < rect.height) {
							height = rect.height;
						}

						style.top = top + 'px';
						style.left = parentRect.left + 'px';
						style.maxHeight = height + 'px';
						style.minWidth = parentRect.width + 'px';
						style.transformOrigin = `${translateY}px`;
					},
				}),
			);
		},
	],
});
