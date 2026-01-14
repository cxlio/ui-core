import { component, attribute, get, getShadow } from './component.js';
import { ToggleBase } from './toggle.js';
import { AnimationKey, animate } from './animation.js';
import { AnimationDefinition, getIcon } from './theme.js';
import { merge } from './rx.js';

declare module './component.js' {
	interface Components {
		'c-toggle-icon': ToggleIcon;
	}
}

/**
 * A custom toggle component with an optional icon and motion attributes.
 *
 * @tagName c-toggle-icon
 * @beta
 */
export class ToggleIcon extends ToggleBase {
	/**
	 * Specifies the name of the icon used for the toggle.
	 * @attribute
	 */
	icon = 'more_vert';

	/**
	 * Specifies the motion or animation effect applied to the toggle icon.
	 * @attribute
	 */
	motion?: AnimationKey | AnimationDefinition;
}

component(ToggleIcon, {
	tagName: 'c-toggle-icon',
	init: [attribute('icon')],
	augment: [
		$ => {
			let icon: SVGSVGElement | undefined;
			return merge(
				get($, 'icon').raf(name => {
					if (!name) return icon?.remove();
					icon = getIcon(name);
					getShadow($).append(icon);
				}),
				get($, 'open').raf(() => {
					if (icon && $.motion)
						animate({
							target: icon,
							animation: $.motion,
							options: {
								direction: $.open ? 'normal' : 'reverse',
								fill: 'both',
							},
						});
				}),
			);
		},
	],
});
