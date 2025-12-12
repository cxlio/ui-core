import {
	Component,
	attribute,
	component,
	create,
	get,
	getShadow,
} from './component.js';
import { aria, role } from './a11y.js';
import { SurfaceColorKey, colorAttribute, css } from './theme.js';
import { changeEvent } from './input.js';
import { animate } from './animation.js';

declare module './component' {
	interface Components {
		'c-progress': Progress;
	}
}

/**
 * Displays a horizontal progress bar to indicate completion or loading state of a
 * process. Accepts both static and animated (indeterminate) progress display, and
 * can be styled through built-in theming options.
 *
 * ### Features
 * - Determinate Mode: Use a `value` attribute to indicate progress (ranging from 0 to 1, where 0 is 0% and 1 is 100%).
 * - Indeterminate Mode: By setting the `value` attribute to `Infinity`, the component animates continuously, representing an unmeasured progress state.
 * - Custom Colors: Supports theme customization via the `color` attribute and themable CSS variables.
 *
 * ### Use Cases
 * - Display progress of file uploads or downloads.
 * - Indicate the progress of a long-running task, such as data processing.
 * - Provide feedback for steps in multi-step UI workflows.
 *
 * @title Linear Progress Bar Component
 * @icon horizontal_rule
 * @tagName c-progress
 * @example
 * <div style="width:100%">
 * <c-progress aria-label="indeterminate progress bar"></c-progress><br/>
 * <c-progress aria-label="progress bar" value="0.5"></c-progress>
 * </div>
 *
 * @demo <caption>RTL Support</caption>
 * <div dir="rtl" style="width:100%">
 * <c-progress aria-label="indeterminate progress bar"></c-progress><br/>
 * <c-progress aria-label="progress bar" value="0.25"></c-progress>
 * </div>
 *
 * @see ProgressCircular
 */
export class Progress extends Component {
	/**
	 * Controls the progress level (0-1 for definite progress, Infinity for indeterminate).
	 * @attribute
	 */
	value = Infinity;

	/**
	 * The `color` attribute allows customization of the progress bar's visual style by
	 * linking it to a predefined theme color key. If omitted, the default theme color is used.
	 * @attribute
	 */
	color?: SurfaceColorKey;
}
const options: KeyframeAnimationOptions = {
	duration: 2000,
	iterations: Infinity,
	easing: 'cubic-bezier(0.4, 0, 0.6, 1)',
};

component(Progress, {
	tagName: 'c-progress',
	init: [attribute('value'), colorAttribute('color', 'primary', '.bar')],
	augment: [
		role('progressbar'),
		aria('valuemax', '1'),
		css(`
:host {
	position:relative;
	display:block; height: 4px; 
	background-color:var(--cxl-color-secondary-container);
	border-radius: 2px; overflow:hidden;
	border-inline-end: 4px solid var(--cxl-color-primary);
}
:host([indeterminate]) { border-inline-end: 0; }
.bar { height: 100%; will-change: transform; }
:host(:not([indeterminate])) .bar { transform-origin: left center; }
:host(:dir(rtl):not([indeterminate])) .bar { transform-origin: right center; }
	`),
		host => {
			let an1: Animation | undefined, an2: Animation | undefined;
			const el = create('div', { className: 'bar' });
			const el2 = create('div', { className: 'bar' });
			getShadow(host).append(el, el2);
			return get(host, 'value').tap(val => {
				if (val !== Infinity && val > 1) val = 1;
				else if (val < 0) val = 0;

				host.ariaValueNow = val === Infinity ? null : String(val);
				host.ariaBusy = String(val !== 1);
				host.toggleAttribute('indeterminate', val === Infinity);

				// Handle indeterminate state
				if (val === Infinity) {
					an1 = animate({
						target: el,
						animation: {
							kf: {
								transform: [
									'translateX(-100%) scaleX(0.3)',
									'translateX(0%) scaleX(0.8)',
									'translateX(100%) scaleX(0.3)',
								],
							},
							options,
						},
					});
					an2 = animate({
						target: el2,
						animation: {
							kf: {
								transform: [
									'translate(-150%, -100%) scaleX(0.4)',
									'translate(-50%, -100%) scaleX(0.6)',
									'translate(100%, -100%) scaleX(0.4)',
								],
							},
							options,
						},
					});
				} else {
					an1?.cancel();
					an2?.cancel();
				}

				el.style.transform =
					val === Infinity ? '' : 'scaleX(' + val + ')';
			});
		},
		changeEvent,
	],
});
