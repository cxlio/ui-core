import {
	Component,
	attribute,
	component,
	get,
	getShadow,
	property,
} from './component.js';
import { css, font } from './theme.js';
import { EMPTY, combineLatest, merge } from './rx.js';
import { hovered, focused } from './dom.js';
import { dragging } from './drag.js';
import { popover } from './popover.js';

import { SliderKnob } from './slider-knob.js';
import type { Slider } from './slider.js';

declare module './component.js' {
	interface Components {
		'c-slider-tooltip': SliderTooltip;
	}
}

/**
 * Shows the current slider value above its knob while hovered, focused, or dragged.
 * Set `keepopen` to keep the label visible while the slider is enabled.
 *
 * Place the tooltip inside a SliderKnob, or set `knob` to a Slider or SliderKnob.
 * Set `format` to customize the displayed value. The label is hidden from assistive
 * technology because the slider already exposes its value through ARIA.
 *
 * @title Slider Tooltip Value Label
 * @icon tooltip
 * @tagName c-slider-tooltip
 * @see Slider
 * @see SliderKnob
 * @see SliderBar
 * @demo
 * <c-slider-bar style="margin-top:60px">
 *   <c-slider-knob aria-label="Value" value="0.5">
 *     <c-slider-tooltip id="sliderLabel" keepopen></c-slider-tooltip>
 *   </c-slider-knob>
 * </c-slider-bar>
 * <script type="module">
 * sliderLabel.format = value => `${Math.round(value * 100)}%`;
 * </script>
 */
export class SliderTooltip extends Component {
	/**
	 * The Slider or SliderKnob associated with this tooltip.
	 * This is used to access the current slider value and other interactions.
	 * If not set, it will default to using the parent element.
	 */
	knob?: SliderKnob | Slider;

	/**
	 * Whether to keep the tooltip visible at all times, even when the user is not hovering,
	 * focusing, or dragging the knob. When set to true, the tooltip will remain visible
	 * while the associated slider is enabled.
	 * @attribute
	 */
	keepopen = false;

	/**
	 * This property allows custom formatting of the tooltip's displayed value.
	 * If provided, it should be a function that receives a number and returns it as a formatted string.
	 */
	format = (n: number) => Number(n).toFixed(2);
}

component(SliderTooltip, {
	tagName: 'c-slider-tooltip',
	init: [property('knob'), property('format'), attribute('keepopen')],
	augment: [
		css(`
:host {
	box-sizing: border-box;
	color: var(--cxl-color-on-inverse-surface);
	background-color: var(--cxl-color-inverse-surface);
	border-radius: 16px;
	translate: calc(-50%) 0;
	padding: 12px 16px;
	border: 0; margin: 0;
	${font('label-medium')}
}
		`),
		$ => {
			const text = new Text();
			getShadow($).append(text);
			$.popover = 'manual';
			$.ariaHidden = 'true';

			return get($, 'knob')
				.map(knob => knob ?? ($.parentElement instanceof SliderKnob ? $.parentElement : undefined))
				.switchMap(slider => {
					if (!slider) return EMPTY;
					const position = () => {
						const anchor = slider instanceof SliderKnob ? slider : slider.shadowRoot?.querySelector('.knob') ?? slider;
						const rect = anchor.getBoundingClientRect();
						const label = $.getBoundingClientRect();
						const scale = label.width / parseFloat(getComputedStyle($).width) || 1;
						$.style.left = `${(rect.left + rect.width / 2) / scale}px`;
						$.style.top = `${(rect.top - label.height) / scale - 8}px`;
					};
					const onPopover = popover({ host: slider, target: $, position });
					return merge(
						combineLatest(get($, 'keepopen'), get(slider, 'disabled'), hovered(slider), focused(slider), dragging(slider))
							.raf()
							.switchMap(([keepopen, disabled, hover, focus, drag]) => onPopover(!disabled && (keepopen || hover || focus || drag))),
						merge(get(slider, 'value'), get($, 'format')).raf(() => {
							text.textContent = $.format(slider.value);
							if ($.matches(':popover-open')) position();
						}),
					).finalize(() => {
						if ($.isConnected) $.hidePopover();
					});
				});
		},
	],
});
