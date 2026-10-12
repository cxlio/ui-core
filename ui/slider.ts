import { component, create, get, getShadow, numberAttribute } from './component.js';
import { knobStyle, sliderKnobBehavior, sliderPointerValue, setSliderValue } from './slider-knob.js';
import { sliderBarStyles } from './slider-bar.js';
import { SliderTooltip } from './slider-tooltip.js';
import { Input } from './input.js';
import { css, disabledStyles } from './theme.js';
import { on } from './dom.js';
import { merge } from './rx.js';
import { role } from './a11y.js';
import { focusable } from './focusable.js';

declare module './component.js' {
	interface Components {
		'c-slider': Slider;
	}
}

/**
 * Interactive slider for selecting a value within a normalized range (0–1).
 *
 * Users can adjust the value via mouse/touch drag or keyboard arrow keys.
 * Keyboard right/down increases and left/up decreases the value based on `step`.
 *
 * Displays a tooltip above the knob showing the current value during interaction.
 *
 * For multi-thumb sliders, see `SliderBar` and `SliderKnob` to customize how each thumb behaves.
 *
 * @title Range Slider Component
 * @icon tune
 * @tagName c-slider
 * @see SliderBar
 * @see SliderKnob
 * @demo
 * <c-slider aria-label="Demo Slider" value="0.25" style="margin-top:60px;"></c-slider>
 *
 * @demo <caption>Error State</caption>
 * <c-slider aria-label="Invalid Value Slider" invalid touched value="0.25" style="margin-top:60px;"></c-slider>
 */
export class Slider extends Input {
	/**
	 * The current value of the knob, between 0 and 1.
	 * @attribute
	 */
	value = 0;

	/**
	 * The amount by which the value changes when using the keyboard arrows. Pointer dragging changes the value continuously.
	 * @attribute
	 */
	step = 0.05;
}

component(Slider, {
	tagName: 'c-slider',
	init: [numberAttribute('value', 0, 1), numberAttribute('step', 0, 1)],
	augment: [
		role('slider'),
		sliderBarStyles,
		disabledStyles,
		focusable,
		css(`
:host { outline: none }
:host([disabled]) #background {
	background-color: color-mix(in srgb, var(--cxl-color-on-surface) 12%, transparent);
}
:host([disabled])  {
	--cxl-color-primary: color-mix(in srgb, var(--cxl-color-on-surface) 38%, transparent);
}
.knob { ${knobStyle} }
:host(:dir(rtl)) .knob { translate: 50% -50%; }
#background { display: flex; align-items: center; }
:host(:focus-visible) .knob, :host(:active) .knob { width: 2px; border-left-width: 7px; border-right-width: 7px; }
:host([invalid][touched]) { --cxl-color-primary: var(--cxl-color-error); }
#active {
	height: 16px;
	background-color: var(--cxl-color-primary);
	inset-inline-start:0; border-radius:50vh;
}
#track {
	position: absolute;
	inset-inline: 6px;
}
		`),
		$ => {
			const knob = create(
				'span',
				{ className: 'knob' },
				create(SliderTooltip, { knob: $ }),
			);
			const line = create('div', { id: 'active' });
			const track = create('div', { id: 'track' }, knob);
			const bar = create('div', { id: 'background' }, line, track);

			bar.setAttribute('part', 'background');

			getShadow($).append(bar);

			return merge(
				sliderKnobBehavior($, knob),
				on(bar, 'click').tap(ev => {
					if ($.disabled || ev.composedPath().includes(knob)) return;
					$.focus();
					setSliderValue($, sliderPointerValue($, ev.clientX, bar));
				}),
				get($, 'value').raf(() => {
					line.style.width = `${$.value * 100}%`;
				}),
			);
		},
	],
});
