import { Component, component, Slot } from './component.js';
import { role } from './a11y.js';
import { displayContents } from './theme.js';

import { routerOutlet } from './router.js';

declare module './component' {
	interface Components {
		'c-router-outlet': RouterOutlet;
	}
}

/**
 * Container for swapping views based on current route, preserving layout.
 *
 * Use this component to display route-matched content as children.
 * Use with declarative router configuration.
 * @see Router
 *
 * @title App Routing Outlet
 * @icon compare_arrows
 * @tagName c-router-outlet
 * @beta
 */
export class RouterOutlet extends Component {}
component(RouterOutlet, {
	tagName: 'c-router-outlet',
	init: [],
	augment: [role('main'), displayContents, routerOutlet, Slot],
});
