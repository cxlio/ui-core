import { Component, component } from './component.js';
import { registableHost } from './registable.js';
import { on } from './dom.js';

import type { Details } from './details.js';

declare module './registable.js' {
	interface RegistableMap {
		accordion: Details;
	}
}

declare module './component' {
	interface Components {
		'c-accordion': Accordion;
	}
}

/**
 * Serves as the root component for the accordion pattern, grouping panel children and
 * managing their open state to ensure only one panel is expanded at a time.
 *
 * You can include multiple <c-accordion> components on the same page.
 * Each instance manages only its `<c-accordion-panel>` children and operates independently from others.
 *
 * @tagName c-accordion
 * @title Single-Open Panel Accordion for Grouping Expandable Sections
 * @icon expansion_panels
 * @see AccordionPanel
 * @see AccordionHeader
 *
 * @example
 * <c-accordion style="width:280px;">
 *   <c-accordion-panel open>
 *     <c-accordion-header>Getting Started</c-accordion-header>
 *     <c-c pad="16"><c-t>Learn how to set up your account and begin using our services.</c-t></c-c>
 *   </c-accordion-panel>
 *   <c-accordion-panel>
 *     <c-accordion-header>Account Settings</c-accordion-header>
 *     <c-c pad="16"><c-t>Manage your profile, password, and notification preferences here.</c-t></c-c>
 *   </c-accordion-panel>
 *   <c-accordion-panel>
 *     <c-accordion-header disabled>Support</c-accordion-header>
 *     <c-c pad="16"><c-t>Find FAQs, contact information, and troubleshooting tips.</c-t></c-c>
 *   </c-accordion-panel>
 * </c-accordion>
 *
 * @desc
 * By default, only one panel can be open at a time within a single `<c-accordion>`.
 * If you want multiple panels open simultaneously, place `<c-accordion-panel>` components outside
 * of any `<c-accordion>`. These will behave independently and can all be open at once.
 *
 * @demo <caption>Multiple Panels Open Without c-accordion</caption>
 *
 * <div style="width:280px">
 *   <c-accordion-panel open>
 *     <c-accordion-header>Getting Started</c-accordion-header>
 *     <c-c pad="16"><c-t>Learn how to set up your account and begin using our services.</c-t></c-c>
 *   </c-accordion-panel>
 *   <c-accordion-panel open>
 *     <c-accordion-header>Account Settings</c-accordion-header>
 *     <c-c pad="16"><c-t>Manage your profile, password, and notification preferences here.</c-t></c-c>
 *   </c-accordion-panel>
 * </div>
 *
 * @demo <caption>Nested Accordions</caption>
    <c-accordion style="width:350px">
      <c-accordion-panel open>
        <c-accordion-header>Parent Section 1</c-accordion-header>
        <c-c pad="16">
          <c-t>Content for parent section 1.</c-t><br/>
          <c-accordion style="width:100%; margin-top: 8px;">
            <c-accordion-panel>
              <c-accordion-header>Child Section A</c-accordion-header>
              <c-c pad="16"><c-t>Nested content for child section A.</c-t></c-c>
            </c-accordion-panel>
            <c-accordion-panel>
              <c-accordion-header>Child Section B</c-accordion-header>
              <c-c pad="16"><c-t>Nested content for child section B.</c-t></c-c>
            </c-accordion-panel>
          </c-accordion>
        </c-c>
      </c-accordion-panel>
      <c-accordion-panel>
        <c-accordion-header>Parent Section 2</c-accordion-header>
        <c-c pad="16"><c-t>Content for parent section 2.</c-t></c-c>
      </c-accordion-panel>
    </c-accordion>
 *
 */
export class Accordion extends Component {
	/**
	 * A Set containing references to all child Panel components within the group.
	 */
	panels = new Set<Details>();
}

component(Accordion, {
	tagName: 'c-accordion',
	augment: [
		$ => registableHost('accordion', $, $.panels),
		$ =>
			on($, 'toggle', { capture: true }).tap(ev => {
				const target = ev.target as Details | null;
				if (target && target.open && $.panels.has(target)) {
					for (const panel of $.panels)
						if (panel !== target) panel.open = false;
				}
			}),
	],
});
