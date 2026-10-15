import { Slot, component, get, numberAttribute } from './component.js';
import { css, disabledStyles } from './theme.js';
import { Input } from './input.js';
import { onKeypress } from './dom.js';
import { role } from './a11y.js';
import { onDrag } from './drag.js';
import { EMPTY, merge, type Observable } from './rx.js';
import { focusable } from './focusable.js';
import { registable } from './registable.js';

import { SliderBar } from './slider-bar.js';

declare module './component.js' {
	interface Components {
		'c-slider-knob': SliderKnob;
	}
}

export const knobStyle = `
	display: inline-block;
	position: absolute;
	z-index: 1;
	border-left: 6px solid var(--cxl-color-surface);
	border-right: 6px solid var(--cxl-color-surface);
	background-color: var(--cxl-color-primary);
	width: 4px;
	height: 44px;
	cursor: pointer;
	border-radius: 2px;
	outline: 0;
	translate: -50% -50%;
	touch-action: none;
	user-select: none;
	-webkit-user-select: none;
`;

export const sliderKnobStyles = css(`
:host { ${knobStyle} }
:host(:dir(rtl)) { translate: 50% -50%; }
:host(:focus-visible), :host(:active) { width: 2px; border-left-width: 7px; border-right-width: 7px; }
:host([invalid][touched]) { background-color: var(--cxl-color-error); }
`);

interface SliderControl extends Input {
	value: number;
	step: number;
	min?: number;
	max?: number;
}

function clamp(value: number, min = 0, max = 1) {
	return Math.min(max, Math.max(min, Number.isNaN(value) ? min : value));
}

function sliderBounds(host: SliderControl) {
	const parent = host.parentElement;
	const knobs = parent instanceof SliderBar ? parent.knobs : undefined;
	const index = knobs?.indexOf(host) ?? -1;
	const min = clamp(host.min ?? (index > 0 ? knobs?.[index - 1]?.value : 0) ?? 0);
	const max = clamp(host.max ?? (index >= 0 ? knobs?.[index + 1]?.value : 1) ?? 1, min);
	return { min, max };
}

export function updateSlider(host: SliderControl, knob: HTMLElement = host) {
	const { min, max } = sliderBounds(host);
	const value = clamp(host.value, min, max);
	if (host.value !== value) host.value = value;
	knob.style.insetInlineStart = `${value * 100}%`;
	host.ariaValueMin = String(min);
	host.ariaValueMax = String(max);
	host.ariaValueNow = String(value);
	host.ariaOrientation = 'horizontal';
}

export function setSliderValue(host: SliderControl, value: number) {
	if (host.disabled) return;
	const { min, max } = sliderBounds(host);
	const next = clamp(value, min, max);
	if (next !== host.value) {
		host.value = next;
		host.dispatchEvent(new Event('change', { bubbles: true }));
	}
}

function sliderTrackRect(track: HTMLElement) {
	const rect = track.getBoundingClientRect();
	const scale = track.offsetWidth ? rect.width / track.offsetWidth : 1;
	return { left: rect.left + 6 * scale, width: Math.max(0, rect.width - 12 * scale) };
}

export function sliderPointerValue(host: SliderControl, clientX: number, track: HTMLElement) {
	const rect = sliderTrackRect(track);
	const value = rect.width ? (clientX - rect.left) / rect.width : 0;
	return getComputedStyle(host).direction === 'rtl' ? 1 - value : value;
}

export function sliderOnKeypress(host: SliderControl, setValue: (n: number) => void) {
	return onKeypress(host).filter(event => {
		if (host.disabled) return false;
		const oldValue = host.value;
		const modifier = event.shiftKey ? 10 : event.ctrlKey || event.altKey ? 0.1 : 1;
		const step = host.step * modifier;
		const rtl = getComputedStyle(host).direction === 'rtl';
		const { min, max } = sliderBounds(host);

		if (event.key === 'Home') setValue(min);
		else if (event.key === 'End') setValue(max);
		else if (event.key === 'ArrowLeft') setValue(host.value + (rtl ? step : -step));
		else if (event.key === 'ArrowRight') setValue(host.value + (rtl ? -step : step));
		else if (event.key === 'ArrowUp') setValue(host.value - step);
		else if (event.key === 'ArrowDown') setValue(host.value + step);
		else return false;

		event.preventDefault();
		return host.value !== oldValue;
	});
}

export function sliderKnobBehavior(host: SliderControl, knob: HTMLElement = host): Observable<unknown> {
	let startValue = 0;
	let width = 0;
	let direction = 1;
	return merge(
		sliderOnKeypress(host, value => setSliderValue(host, value)),
		get(host, 'disabled').switchMap(disabled => disabled ? EMPTY : onDrag({ target: knob, delay: 0 }).tap(event => {
			if (event.type === 'start') {
				host.focus();
				startValue = host.value;
				const track = knob === host ? host.parentElement : host;
				width = track ? sliderTrackRect(track).width : 0;
				direction = getComputedStyle(host).direction === 'rtl' ? -1 : 1;
			} else if (event.type === 'move' && width > 0)
				setSliderValue(host, startValue + direction * (event.clientX - event.startX) / width);
		})),
		merge(get(host, 'value'), get(host, 'min'), get(host, 'max')).tap(() => updateSlider(host, knob)),
	);
}

/**
 * Draggable knob for precise value selection in a slider bar. Designed for
 * keyboard and drag interaction, supporting both incremental and fine-
 * tuned adjustments.
 *
 * Supports value ranges normalized between 0 and 1.
 *
 * Keyboard interaction:
 * - Right/Down increases and Left/Up decreases (horizontal arrows reverse in RTL).
 * - Ctrl/Alt applies a tenth of the step; Shift applies ten steps.
 * - Home/End keys for min/max jumps.
 *
 * Value and step can both be set as attributes or properties and respond to
 * dynamic changes.
 *
 * If you use multiple knobs in a single slider bar, they should be arranged in the order of their values.
 * This lets the auto min and max logic work correctly.
 *
 * @title Slider Knob Component
 * @icon tune
 * @see SliderBar
 * @see SliderTooltip
 * @see SliderLine
 * @tagName c-slider-knob
 * @demo
 * <c-slider-bar>
 *   <c-slider-knob aria-label="knob 0" value="0"></c-slider-knob>
 *   <c-slider-knob aria-label="knob 1" value="0.5"></c-slider-knob>
 *   <c-slider-knob aria-label="knob 2" value="1"></c-slider-knob>
 * </c-slider-bar>
 * @demo <caption>Price Range Slider</caption>
 * <c-slider-bar style="margin-top:80px">
 *   <c-slider-knob aria-label="Minimum Price" value="0.25">
 *     <c-slider-tooltip id="minEl" keepopen></c-slider-tooltip>
 *   </c-slider-knob>
 *   <c-slider-line></c-slider-line>
 *   <c-slider-knob aria-label="Maximum Price" value="0.5">
 *     <c-slider-tooltip id="maxEl" keepopen></c-slider-tooltip>
 *   </c-slider-knob>
 * </c-slider-bar>
 * <script type="module">
 * minEl.format = maxEl.format = v => `$ ${(v * 100).toFixed(2)}`;
 * </script>
 */
export class SliderKnob extends Input {
	/**
	 * The current value of the knob, between 0 and 1.
	 * @attribute
	 */
	value = 0;

	/**
	 * The amount by which the value changes when using the keyboard arrows. Pointer dragging changes the value continuously.
	 * @attribute
	 */
	step = 0.01;

	/**
	 * The minimum value. If not set, the knob will automatically pick a value that prevents overlap
	 * with other knobs in the slider bar.
	 * @attribute
	 */
	min?: number;

	/**
	 * The maximum value. If not set, the knob will automatically pick a value that prevents overlap
	 * with other knobs in the slider bar.
	 * @attribute
	 */
	max?: number;
}

component(SliderKnob, {
	tagName: 'c-slider-knob',
	init: [
		numberAttribute('value', 0, 1),
		numberAttribute('step', 0, 1),
		numberAttribute('max'),
		numberAttribute('min'),
	],
	augment: [
		role('slider'),
		Slot,
		sliderKnobStyles,
		disabledStyles,
		focusable,
		sliderKnobBehavior,
		$ => registable('slider', $),
	],
});
