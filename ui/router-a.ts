import { component } from './component.js';
import { css } from './theme.js';

import { RouterLink } from './router-link.js';

/**
 * A router link component.
 * @beta
 */
export class RouterA extends RouterLink {
	focusable = true;
}

component(RouterA, {
	tagName: 'c-router-a',
	augment: [
		css(`
:host{text-decoration:underline;}
.link { display:inline-block; }
:host(:focus-within) .link { outline:var(--cxl-color-primary) auto 1px; }
`),
	],
});
