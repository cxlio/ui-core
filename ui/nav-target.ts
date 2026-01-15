import { component } from './component.js';
import { ToggleTarget } from './toggle-target.js';
import { css } from './theme.js';
import { role } from './a11y.js';

declare module './component.js' {
	interface Components {
		'c-nav-target': NavTarget;
	}
}

/**
 * Contains the collapsible content for nested navigation elements, allowing
 * parent navigation items to toggle visibility of its children.
 *
 * When used inside a navigation structure, this component presents section
 * content that may be shown or hidden by interacting with the parent trigger.
 * It automatically manages focusability to ensure all items inside are accessible
 * when expanded. It is intended to wrap navigation items placed within dropdowns
 * or expandable menus.
 *
 * @title Navigation Dropdown Target
 * @icon unfold_more
 * @tagName c-nav-target
 * @see Tree
 * @see NavDropdown
 */
export class NavTarget extends ToggleTarget {}

component(NavTarget, {
	tagName: 'c-nav-target',
	augment: [
		role('group'),
		css(`:host{display:block;padding-inline-start:12px;}`),
	],
});
