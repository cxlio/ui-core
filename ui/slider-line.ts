import { Component, component, Slot, get } from './component.js';
import { css } from './theme.js';
import { merge, of } from './rx.js';
import { SliderKnob } from './slider-knob.js';
import { on } from './dom.js';

declare module './component.js' {
	interface Components {
		'c-slider-line': SliderLine;
	}
}

function findKnob(
	el: Element,
	direction:
		| 'nextElementSibling'
		| 'previousElementSibling' = 'nextElementSibling',
) {
	let node: Element | null = el;

	while ((node = node[direction])) {
		if (node instanceof SliderKnob) return node;
	}
}

/**
 * Displays the interactive section of a slider where the active region is
 * visually highlighted between two knobs or from one knob to the edge. Can be
 * used for single-value or range-based sliders to indicate the currently
 * selected value(s).
 *
 * Automatically adjusts its left and right boundaries to match the positions of
 * neighboring slider knobs, scaling responsively as their values change or as
 * the container is resized. If placed at the start or end of a slider, it fills
 * to the edge, visually emphasizing completion. No manual positioning is
 * required from users.
 *
 * @title Slider Active Region
 * @icon horizontal_rule
 * @tagName c-slider-line
 * @demo
 * <c-slider-bar>
 *   <c-slider-line></c-slider-line>
 *   <c-slider-knob aria-label="knob 1" value="0.5"></c-slider-knob>
 * </c-slider-bar>
 * <c-slider-bar>
 *   <c-slider-knob aria-label="knob 1" value="0.5"></c-slider-knob>
 *   <c-slider-line></c-slider-line>
 * </c-slider-bar>
 * <c-slider-bar>
 *   <c-slider-knob aria-label="knob 1" value="0.25"></c-slider-knob>
 *   <c-slider-line></c-slider-line>
 *   <c-slider-knob aria-label="knob 2" value="0.75"></c-slider-knob>
 * </c-slider-bar>
 *
 * @see SliderBar
 */
export class SliderLine extends Component {}

component(SliderLine, {
	tagName: 'c-slider-line',
	augment: [
		css(`
:host {
	height: 16px;
	top:-8px;
	background-color: var(--cxl-color-primary);
	position: absolute;
}
	`),
		Slot,
		$ => {
			const slot = $.parentElement?.shadowRoot?.querySelector('slot');
			return merge(of(undefined), ...(slot ? [on(slot, 'slotchange')] : []))
				.switchMap(() => {
					const prev = findKnob($, 'previousElementSibling');
					const next = findKnob($);
					return merge(prev ? get(prev, 'value') : of(0), next ? get(next, 'value') : of(1))
						.raf(() => {
							const min = prev?.value ?? 0;
							const max = next?.value ?? 1;
							$.style.insetInlineStart = `${min * 100}%`;
							$.style.width = `${Math.max(0, max - min) * 100}%`;
							$.style.borderStartStartRadius = $.style.borderEndStartRadius = prev ? '0' : '50vh';
							$.style.borderStartEndRadius = $.style.borderEndEndRadius = next ? '0' : '50vh';
						});
				});
		},
	],
});
