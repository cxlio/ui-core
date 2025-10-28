import {
	Component,
	component,
	get,
	numberAttribute,
	getShadow,
} from './component.js';

import { aria, role } from './a11y.js';
import { svg } from './svg.js';
import { css } from './theme.js';
import { EMPTY, merge } from './rx.js';
import { animation } from './animation.js';
import { changeEvent } from './input.js';

declare module './component' {
	interface Components {
		'c-progress-circular': ProgressCircular;
	}
}

/**
 * Displays a circular progress indicator. Accepts both definite (0–1 range) and
 * indeterminate (Infinity value) states. The indicator shows progress visually
 * as a portion of a circle, and animates continuously when indeterminate.
 *
 * @tagName c-progress-circular
 * @title Circular Progress Spinner
 * @icon sync
 * @example
 * <c-progress-circular aria-label="Spinner Demo"></c-progress-circular>
 */
export class ProgressCircular extends Component {
	/**
	 * Controls the progress level (0-1 for definite progress, Infinity for indeterminate).
	 * @attribute
	 * @demo
	 * <c-progress-circular aria-label="Spinner Demo" value="0.35"></c-progress-circular>
	 * <c-progress-circular aria-label="Spinner Demo" value="0.50"></c-progress-circular>
	 * <c-progress-circular aria-label="Spinner Demo" value="0.75"></c-progress-circular>
	 */
	value = Infinity;
}

component(ProgressCircular, {
	tagName: 'c-progress-circular',
	init: [numberAttribute('value')],
	augment: [
		role('progressbar'),
		aria('valuemax', '1'),
		css(`
:host {
	display: inline-block;
	width: 48px;
	height: 48px;
}
svg { width: 100%; height: 100% }
		`),
		$ => {
			const el = svg('svg', { viewBox: '0 0 100 100' });
			const circleBg = svg('circle', {
				cx: '50%',
				cy: '50%',
				r: '45',
				style: 'stroke:var(--cxl-color-secondary-container);fill:transparent;stroke-width:10%;stroke-dasharray:282.743px',
			});
			const circle = svg('circle', {
				cx: '50%',
				cy: '50%',
				r: '45',
				style: 'stroke:var(--cxl-color-primary);fill:transparent;transition:stroke-dashoffset var(--cxl-speed);stroke-width:10%;transform-origin:center;stroke-dasharray:282.743px',
			});
			el.append(circleBg, circle);
			getShadow($).append(el);
			return get($, 'value').switchMap(val => {
				$.ariaValueNow = val === Infinity ? null : String(val);
				$.ariaBusy = String(val !== 1);

				if (val !== Infinity) {
					const progress = Math.max(0, Math.min(1, val));
					const dashoffset = 282.743 - 282.743 * progress;
					circle.style.strokeDashoffset = `${dashoffset}px`;
					circle.style.transform = 'rotate(-90deg)';
				}

				return val === Infinity
					? merge(
							animation({
								target: $,
								animation: 'spin',
								options: {
									iterations: Infinity,
									duration: 2000,
									easing: 'linear',
								},
							}),
							animation({
								target: circle,
								animation: {
									options: {
										duration: 4000,
										iterations: Infinity,
										easing: 'cubic-bezier(.35,0,.25,1)',
									},
									kf: (($start, $end) => [
										{
											offset: 0,
											strokeDashoffset: $start,
											transform: 'rotate(0)',
										},
										{
											offset: 0.125,
											strokeDashoffset: $end,
											transform: 'rotate(0)',
										},
										{
											offset: 0.12501,
											strokeDashoffset: $end,
											transform:
												'rotateX(180deg) rotate(72.5deg)',
										},
										{
											offset: 0.25,
											strokeDashoffset: $start,
											transform:
												'rotateX(180deg) rotate(72.5deg)',
										},
										{
											offset: 0.2501,
											strokeDashoffset: $start,
											transform: 'rotate(270deg)',
										},
										{
											offset: 0.375,
											strokeDashoffset: $end,
											transform: 'rotate(270deg)',
										},
										{
											offset: 0.37501,
											strokeDashoffset: $end,
											transform:
												'rotateX(180deg) rotate(161.5deg)',
										},
										{
											offset: 0.5,
											strokeDashoffset: $start,
											transform:
												'rotateX(180deg) rotate(161.5deg)',
										},
										{
											offset: 0.5001,
											strokeDashoffset: $start,
											transform: 'rotate(180deg)',
										},
										{
											offset: 0.625,
											strokeDashoffset: $end,
											transform: 'rotate(180deg)',
										},
										{
											offset: 0.62501,
											strokeDashoffset: $end,
											transform:
												'rotateX(180deg) rotate(251.5deg)',
										},
										{
											offset: 0.75,
											strokeDashoffset: $start,
											transform:
												'rotateX(180deg) rotate(251.5deg)',
										},
										{
											offset: 0.7501,
											strokeDashoffset: $start,
											transform: 'rotate(90deg)',
										},
										{
											offset: 0.875,
											strokeDashoffset: $end,
											transform: 'rotate(90deg)',
										},
										{
											offset: 0.87501,
											strokeDashoffset: $end,
											transform:
												'rotateX(180deg) rotate(341.5deg)',
										},
										{
											offset: 1,
											strokeDashoffset: $start,
											transform:
												'rotateX(180deg) rotate(341.5deg)',
										},
									])(
										(282.743 * (1 - 0.05)).toString(),
										(282.743 * (1 - 0.8)).toString(),
									),
								},
							}),
					  )
					: EMPTY;
			});
		},
		changeEvent,
	],
});
