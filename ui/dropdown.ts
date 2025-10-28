import { component, create, attribute, get } from './component.js';
import { Icon } from './icon.js';
import { merge } from './rx.js';
import { css } from './theme.js';
import { on } from './dom.js';
import { ToggleBase } from './toggle.js';

declare module './component' {
	interface Components {
		'c-dropdown': Dropdown;
	}
}

/**
 *
 * @title Dropdown Navigation Item
 * @icon unfold_more
 * @tagName c-dropdown
 * @alpha
 * @see Tree
 */
export class Dropdown extends ToggleBase {
	/**
	 * Defines the icon for the dropdown indicator. Used to visually signal the expand/collapse affordance.
	 */
	icon = 'arrow_right';
}

component(Dropdown, {
	tagName: 'c-dropdown',
	init: [attribute('icon')],
	augment: [
		css(`
:host { display: flex; gap: 0; align-items: center; cursor: pointer; }
.icon { transition: rotate var(--cxl-speed); height:24px; width:24px; translate: -7px; margin-right: -6px; }
:host(:dir(rtl)) .icon { rotate: 180deg; }
:host([open]) .icon { rotate: 90deg; }
		`),
		$ => {
			const icon = create(Icon, { className: 'icon' });
			$.shadowRoot?.append(icon, create('slot'));

			return merge(
				get($, 'icon').tap(name => (icon.name = name)),
				on($, 'keydown').tap(ev => {
					if (ev.key === 'ArrowRight') $.open = true;
					else if (ev.key === 'ArrowLeft') $.open = false;
				}),
			);
		},
	],
});
