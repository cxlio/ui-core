import { Component, component, create, get } from './component.js';
import { css } from './theme.js';
import { on } from './dom.js';
import { merge } from './rx.js';
import { setSliderValue, sliderPointerValue, updateSlider } from './slider-knob.js';
import { registableHostOrdered } from './registable.js';

import type { SliderKnob } from './slider-knob.js';

declare module './registable.js' {
	interface RegistableMap {
		slider: SliderKnob;
	}
}

declare module './component.js' {
	interface Components {
		'c-slider-bar': SliderBar;
	}
}

export const sliderBarStyles = css(`
:host {
	display: flex;
	align-items: center;
	height: 48px;
	user-select: none;
	flex-grow: 1;
	position: relative;
	-webkit-user-select: none;
}
#background {
	background-color: var(--cxl-color-secondary-container);
	border-radius: var(--cxl-shape-corner-full);
	height: 16px;
	width: 100%;
}
:host([invalid][touched]) #background {
	background-color: var(--cxl-color-error-container);
}
slot {
	position: absolute;
	display: block;
	inset-inline: 6px;
}
	`);

/**
 * Horizontal slider track that enables value selection by hosting one or more
 * interactive knobs.
 *
 * Provides a container for slider knob elements to represent and update values.
 * Supports keyboard, pointer, and assistive technology interaction via knobs.
 *
 * Handles clicks on the bar to set the knob value directly if only one is present and not disabled.
 *
 * @title Horizontal Value Track
 * @icon horizontal_rule
 * @tagName c-slider-bar
 * @demo
 * <c-slider-bar>
 *   <c-slider-knob aria-label="knob 1" value="0.5"></c-slider-knob>
 * </c-slider-bar>
 *
 * @see SliderKnob
 * @see SliderTooltip
 */
export class SliderBar extends Component {
	/** Knobs registered in DOM order; updates as knobs connect or disconnect. */
	readonly knobs: SliderKnob[] = [];
}

component(SliderBar, {
	tagName: 'c-slider-bar',
	augment: [
		sliderBarStyles,
		() => {
			const div = create('div', { id: 'background' });
			div.setAttribute('part', 'background');
			return div;
		},
		() => create('slot'),
		$ => registableHostOrdered('slider', $, $.knobs)
			.switchMap(() => merge(...$.knobs.map(knob => get(knob, 'value'))))
			.tap(() => $.knobs.forEach(knob => updateSlider(knob))),
		$ => on($, 'click').tap(event => {
			const knob = $.knobs.length === 1 ? $.knobs[0] : undefined;
			if (!knob || knob.disabled || event.composedPath().includes(knob)) return;
			knob.focus();
			setSliderValue(knob, sliderPointerValue(knob, event.clientX, $));
		}),
	],
});
