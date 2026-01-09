import { component } from './component.js';
import { Details } from './details.js';
import { css } from './theme.js';
import { role } from './a11y.js';
import { registable } from './registable.js';

declare module './component' {
	interface Components {
		'c-accordion-panel': AccordionPanel;
	}
}

/**
 * The `<c-accordion-panel>` component provides a user-friendly way to present content in collapsible
 * sections, enhancing organization and readability, especially in content-heavy interfaces.
 *
 * The `open` attribute determines if the panel is expanded by default.
 *
 * Typically, you pair this component with `<c-accordion-header>`, which acts as the clickable
 * header to toggle the panel’s visibility.
 *
 * The default slot displays the main content inside the panel. You can use the "header" slot to show
 * content like a title or control.
 * If you use `<c-accordion-header>`, it gets automatically placed in the "header" slot for you.
 *
 * @tagName c-accordion-panel
 * @icon expansion_panels
 * @title Accordion Panel Component
 * @demo
 *   <c-accordion-panel style="width:280px" open>
 *     <c-accordion-header>Getting Started</c-accordion-header>
 *     <c-c pad="16"><c-t>Learn how to set up your account and begin using our services.</c-t></c-c>
 *   </c-accordion-panel>
 *
 * @see Accordion
 * @see AccordionHeader
 */
export class AccordionPanel extends Details {
	constructor() {
		super();
		this['motion-in'] = 'openY';
		this['motion-out'] = 'closeY';
	}
}

component(AccordionPanel, {
	tagName: 'c-accordion-panel',
	augment: [
		role('region'),
		css(`
:host {
	background-color: var(--cxl-color-surface);
	color: var(--cxl-color-on-surface);
	border-bottom: 1px solid var(--cxl-color-outline-variant);
}
#body {
	display: block;
	overflow: hidden;
}
		`),
		$ => registable('accordion', $),
	],
});
