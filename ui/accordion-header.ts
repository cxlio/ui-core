import {
	Component,
	component,
	get,
	getShadow,
	styleAttribute,
} from './component.js';
import { css, font, disabledStyles } from './theme.js';
import { Icon } from './icon.js';
import { buttonBehavior } from './button.js';
import { EMPTY, merge } from './rx.js';
import { getAriaId, role } from './a11y.js';

import { AccordionPanel } from './accordion-panel.js';

declare module './component' {
	interface Components {
		'c-accordion-header': AccordionHeader;
	}
}

/**
 * The `<c-accordion-header>` component serves as the interactive toggle button for expanding
 * or collapsing its associated content within a `<c-accordion-panel>`.
 * It is designed to be used as a child of `<c-accordion-panel>`.
 *
 * @tagName c-accordion-header
 * @title Accordion Header Interactive Disclosure Control
 * @icon expansion_panels
 * @demo <caption>With Icon</caption>
 * <c-accordion style="width:280px;">
 *   <c-accordion-panel open>
 *     <c-accordion-header>
 *       <c-flex gap="16" middle>
 *         <c-icon name="settings"></c-icon>
 *         Settings
 *       </c-flex>
 *.    </c-accordion-header>
 *     <c-c pad="16"><c-t>Learn how to set up your account and begin using our services.</c-t></c-c>
 *   </c-accordion-panel>
 * </c-accordion>
 *
 * @see Accordion
 * @see AccordionPanel
 */
export class AccordionHeader extends Component {
	/**
	 * Indicates whether the accordion header is disabled.
	 * @attribute
	 */
	disabled = false;

	/**
	 * Tracks whether the header component has been interacted with.
	 * @attribute
	 */
	touched = false;
}

component(AccordionHeader, {
	tagName: 'c-accordion-header',
	init: [styleAttribute('disabled')],
	augment: [
		role('button'),
		css(`
:host {
	${font('title-small')}
	line-height: unset;
	display: flex;
	align-items: center;
	padding: 16px;
	padding-inline-end: 44px;
	cursor: pointer;
	position: relative;
	overflow: hidden;
}	
#icon {
	position: absolute;
	inset-inline-end: 12px;
	transition: rotate var(--cxl-speed);
}
#icon.open {
	rotate: -180deg;
}
:host([disabled]) {
	color: color-mix(in srgb, var(--cxl-color--on-surface) 38%, transparent);
}
		`),
		disabledStyles,
		$ => {
			const icon = new Icon();
			icon.name = 'keyboard_arrow_down';
			icon.id = 'icon';
			icon.role = 'none';
			$.slot ||= 'header';
			getShadow($).append(icon, document.createElement('slot'));
			const panel = $.parentElement;

			return panel instanceof AccordionPanel
				? merge(
						getAriaId(panel).tap(id =>
							$.setAttribute('aria-controls', id),
						),
						get(panel, 'open').tap(v => {
							icon.classList.toggle('open', v);
							$.ariaExpanded = String(v);
						}),
				  )
				: EMPTY;
		},
		buttonBehavior,
	],
});
