import { component, create, get, getShadow } from './component.js';
import { css } from './theme.js';
import { ToggleTargetBase, toggleTargetBehavior } from './toggle-target.js';
import { toggleBehavior } from './toggle.js';
import { merge } from './rx.js';

declare module './component' {
	interface Components {
		'c-details': Details;
	}
}

/**
 * A collapsible panel component that exposes toggle behavior and slotted header/body content.
 *
 * @tagName c-details
 * @beta
 * @demo
 * <c-details>
 *   <c-button slot="header">Open Panel</c-button>
 *   <c-c pad="32">Panel Contents</c-c>
 * </c-details>
 */
export class Details extends ToggleTargetBase {}

component(Details, {
	tagName: 'c-details',
	augment: [
		css(`
:host { display: block; }
:host(:not([open],[motion-out-on])) #body {display:none}
		`),
		$ => {
			const body = create('slot', { id: 'body' });
			const header = create('slot', { id: 'header', name: 'header' });
			getShadow($).append(header, body);

			return merge(
				toggleBehavior(
					header,
					() => [$],
					() => $.open,
					get($, 'open'),
				).raf(({ open }) => {
					$.open = open;
				}),
				toggleTargetBehavior($, () => body),
			);
		},
	],
});
