import {
	component,
	create,
	get,
	getShadow,
	numberAttribute,
} from './component.js';
import { role } from './a11y.js';
import { onDrag } from './drag.js';
import { onKeypress, onResize } from './dom.js';
import { focusable } from './focusable.js';
import { Input } from './input.js';
import { merge } from './rx.js';
import { css, disabledStyles } from './theme.js';

declare module './component' {
	interface Components {
		'c-slider-reveal': SliderReveal;
	}
}

function clamp(value: number) {
	return Math.min(Math.max(value, 0), 1);
}

function sliderKeypress(
	host: SliderReveal,
	setValue: (value: number) => void,
) {
	return onKeypress(host).filter(event => {
		const oldValue = host.value;
		const modifier = event.shiftKey
			? 10
			: event.ctrlKey || event.altKey
				? 0.1
				: 1;
		const step = host.step * modifier;

		if (event.key === 'Home') setValue(0);
		else if (event.key === 'End') setValue(1);
		else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp')
			setValue(host.value - step);
		else if (event.key === 'ArrowRight' || event.key === 'ArrowDown')
			setValue(host.value + step);
		else return false;

		event.preventDefault();
		return host.value !== oldValue;
	});
}

/**
 * Component to reveal portions of overlapping content using a draggable slider.
 *
 * Place the content revealed on the right in the `before` slot and the content
 * revealed on the left in the `after` slot. Content in the default slot appears
 * above both layers.
 *
 * @title Content Reveal Slider
 * @icon compare_arrows
 * @tagName c-slider-reveal
 * @beta
 * @demo
 * <c-slider-reveal aria-label="content reveal slider" value="0.5" style="width:100%">
 *   <div slot="after" style="height:128px;background:var(--cxl-color-primary-container)"></div>
 *   <div slot="before" style="height:128px;background:var(--cxl-color-secondary-container)"></div>
 * </c-slider-reveal>
 */
export class SliderReveal extends Input {
	/** Position of the slider handle, between 0 and 1. */
	value = 0;

	/** Amount to move for each keyboard step. */
	step = 0.01;
}

component(SliderReveal, {
	tagName: 'c-slider-reveal',
	init: [numberAttribute('value', 0, 1), numberAttribute('step')],
	augment: [
		role('slider'),
		css(`
:host {
	display: grid; position: relative; box-sizing: border-box;
	touch-action: pan-y;
}
slot { display: block; grid-area: 1 / 1 / 2 / 2; }
slot:not([name]) { z-index: 1 }

#slider {
	width: 40px;
	box-sizing: border-box;
	cursor: col-resize;
	z-index: 5;
	translate: -50% 0;
	top: 0;
	bottom: 0;
	position: absolute;
	opacity: 0.75;
	border-width: 0 16px;
	border-color: transparent;
	border-style: solid;
	background-clip: content-box;
	touch-action: none;
}
:host(:hover) #slider {
	background-color: var(--cxl-color-outline);
}
		`),
		disabledStyles,
		host => {
			const slider = create('div', { id: 'slider', tabIndex: 0 });
			const before = create('slot', { name: 'before' });
			let startX = 0;

			function update() {
				const x = host.value * host.offsetWidth;
				before.style.clipPath = `inset(0 0 0 ${x}px)`;
				slider.style.left = `${x}px`;
				host.ariaValueNow = host.value.toString();
			}

			function setValue(value: number) {
				const nextValue = clamp(value);
				if (nextValue !== host.value) {
					host.value = nextValue;
					host.dispatchEvent(new Event('change', { bubbles: true }));
				}
			}

			slider.setAttribute('part', 'slider');
			host.focus = () => {
				if (!host.disabled) slider.focus();
			};
			host.ariaValueMin = '0';
			host.ariaValueMax = '1';
			host.ariaOrientation = 'horizontal';

			getShadow(host).append(
				create('slot', { name: 'after' }),
				before,
				create('slot'),
				slider,
			);

			return merge(
				focusable(host, slider),
				merge(get(host, 'value'), onResize(host)).raf(update),
				sliderKeypress(host, setValue),
				onDrag({ target: slider }).tap(event => {
					if (event.type === 'start') startX = slider.offsetLeft;
					else if (event.type === 'move')
						setValue(
							(startX + event.clientX - event.startX) /
								host.offsetWidth,
						);
				}),
			);
		},
	],
});
