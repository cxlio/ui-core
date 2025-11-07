import {
	Component,
	attribute,
	component,
	create,
	get,
	getShadow,
} from './component.js';
import { css } from './theme.js';
import { merge } from './rx.js';
import { bindHref } from './router.js';
import { toggleClose } from './toggle.js';

/**
 * Component for navigation links with support for routing and optional external targets.
 * @beta
 */
export class RouterLink extends Component {
	href?: string;
	focusable = false;
	external = false;
	dismiss = false;
	target?: '_blank';
}

component(RouterLink, {
	tagName: 'c-router-link',
	init: [
		attribute('href'),
		attribute('focusable'),
		attribute('external'),
		attribute('target'),
		attribute('dismiss'),
	],
	augment: [
		css(`
:host {
  display: contents;
  text-decoration: none;
}
.link {
  display: contents;
  outline: 0;
  text-decoration: inherit;
  color: inherit;
  cursor: pointer;
}
	`),
		host => {
			const el = create('a', { className: 'link' }, create('slot'));
			getShadow(host).append(el);

			return merge(
				get(host, 'focusable').tap(val => (el.tabIndex = val ? 0 : -1)),
				toggleClose(host),
				bindHref(host, el),
			);
		},
	],
});
