import { Component, Slot, component } from './component.js';
import { metaBehavior } from './meta.js';
import { css, surface } from './theme.js';

/**
 * Page element.
 *
 * @tagName c-page
 * @alpha
 */
export class Page extends Component {}

component(Page, {
	tagName: 'c-page',
	augment: [
		metaBehavior,
		css(`
:host {
	box-sizing:border-box;
	display: flex;
	flex-direction: column;
	/* height:100% affects sticky appbar positioning */
	min-height: 100vh;
	padding-top: 0; padding-bottom: 0;
	${surface('background')}
}`),
		Slot,
	],
});
