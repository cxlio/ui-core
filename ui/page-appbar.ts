import { Appbar } from './appbar.js';
import { Component, component, messageProxy, tsx } from './component.js';
import { Drawer } from './drawer.js';
import { NavbarToggle } from './navbar-toggle.js';
import { R } from './r.js';
import { css, media } from './theme.js';
import { Toolbar } from './toolbar.js';

declare module './component' {
	interface Components {
		'c-page-appbar': PageAppbar;
	}
}

/**
 * Page appbar preset for marketing pages and documentation pages.
 *
 * @tagName c-page-appbar
 * @title Page Appbar
 * @demo
 * <c-page style="min-height:240px">
 *   <c-page-appbar>
 *     <span aria-label="Home page">
 *       <c-t font="title-large">Coaxial</c-t>
 *     </span>
 *     <span style="margin-left:auto">
 *       <c-button-text>Features</c-button-text>
 *     </span>
 *     <span>
 *       <c-button-text>Pricing</c-button-text>
 *     </span>
 *     <span>
 *       <c-button-text>Docs</c-button-text>
 *     </span>
 *     <span slot="navbar">
 *       <c-button-text>Features</c-button-text>
 *     </span>
 *     <span slot="navbar">
 *       <c-button-text>Pricing</c-button-text>
 *     </span>
 *     <span slot="navbar">
 *       <c-button-text>Docs</c-button-text>
 *     </span>
 *   </c-page-appbar>
 * </c-page>
 */
export class PageAppbar extends Component {}

component(PageAppbar, {
	tagName: 'c-page-appbar',
	augment: [
		css(`
:host { display: contents; }
#appbar { padding-top: 20px; padding-bottom: 20px; }
#toolbar { max-width: 1200px; width: 100%; margin: auto; gap: 16px; }
${media('small', '#toolbar { gap: 24px; }')}
		`),
		$ => {
			const drawer = tsx(
				Drawer,
				{ id: 'drawer' },
				tsx('nav', undefined, tsx('slot', { name: 'navbar' })),
			);

			return tsx(
				Appbar,
				{
					$: () => messageProxy($, 'toggle.close', drawer, true),
					id: 'appbar',
					sticky: true,
				},
				tsx(
					Toolbar,
					{ id: 'toolbar' },
					tsx(
						R,
						{ xs: true, md: 0 },
						tsx(NavbarToggle, {
							ariaLabel: 'Toggle navigation menu',
							target: drawer,
						}),
					),
					tsx('slot'),
				),
				drawer,
			);
		},
	],
});
