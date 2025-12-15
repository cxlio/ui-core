import {
	component,
	Component,
	styleAttribute,
	get,
	create,
	numberAttribute,
} from './component.js';
import { render } from './render.js';
import { role } from './a11y.js';
import { css } from './theme.js';
import { Icon } from './icon.js';

declare module './component' {
	interface Components {
		'c-rating': Rating;
	}
}

export function getStars<T extends HTMLElement>(
	n: number,
	cls: string,
	createStar: (index: number) => HTMLElement = () =>
		create(Icon, { name: 'star', fill: true }),
) {
	const stars: T[] = [];
	let star: T | undefined,
		i = 0;
	for (; i < n; i++) {
		star = createStar(i) as unknown as T;
		star.classList.add(cls);
		stars.push(star);
	}
	if (n !== i) {
		const diff = n + 1 - i;
		if (star && diff) {
			const d = `${diff * 100}%`;
			star.style.clipPath = `polygon(0 0, ${d} 0, ${d} 100%, 0 100%)`;
		}
	}
	return stars;
}

/**
 * Displays a star rating using filled and partially filled star icons.
 *
 * - Supports setting a maximum number of stars
 * - Supports setting the current rating value (can be fractional).
 * - Includes an alt attribute for providing alternative text for accessibility.
 *
 * @tagName c-rating
 * @icon star_half
 * @demo
 * <c-rating rating="3.5" aria-label="3.5 rating"></c-rating>
 */

export class Rating extends Component {
	/**
	 * The maximum number of stars.
	 * @demo
	 * <c-rating rating="4.25" aria-label="4.25" max="10"></c-rating>
	 */
	max = 5;

	/** The current rating value */
	rating = 0;

	/** The alternative text for the rating */
	alt?: string;
}

component(Rating, {
	tagName: 'c-rating',
	init: [
		numberAttribute('max'),
		numberAttribute('rating'),
		styleAttribute('alt'),
	],
	augment: [
		role('img'),
		css(`
:host {
  display: inline-block;
  position: relative;
  color: #faaf00;
  stroke: currentColor;
}
.group {
  position: absolute;
  left: 0;
  top: 0;
}
.bgstar {
  color: var(--cxl-color-outline-variant);
}
	`),
		$ =>
			render({
				source: get($, 'max'),
				renderFn: () =>
					create('span', undefined, ...getStars($.max, 'bgstar')),
			})($),
		$ =>
			render({
				source: get($, 'rating'),
				renderFn: val =>
					create(
						'span',
						{ className: 'group' },
						...getStars(
							Number(val) > $.max ? $.max : Number(val),
							'star',
						),
					),
			})($),
	],
});
