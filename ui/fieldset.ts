import { Component, component, create, getShadow, styleAttribute } from './component.js';
import { css, font } from './theme.js';
import { role, getAriaId } from './a11y.js';
import { registableHost } from './registable.js';
import { on } from './dom.js';
import { EMPTY, merge, of } from './rx.js';

declare module './component.js' {
	interface Components {
		'c-fieldset': Fieldset;
	}
}

/**
 * Groups related form controls with an optional accessible label.
 * Controls flow horizontally and wrap when space is limited. Set vflex to
 * stack them vertically. A c-label automatically occupies the label slot
 * and provides the group's accessible name.
 *
 * ### Slots
 *
 * - label: The legend or heading describing the group.
 * - default: The form controls belonging to the group.
 *
 * @tagName c-fieldset
 * @title Form Fieldset
 * @icon group
 * @example <caption>Radio Buttons</caption>
 * <c-fieldset>
 *   <c-label>Preferred contact method</c-label>
 *   <c-radio name="contact" value="email" checked>Email</c-radio>
 *   <c-radio name="contact" value="phone">Phone</c-radio>
 * </c-fieldset>
 * @demo <caption>Vertical Checkboxes</caption>
 * <c-fieldset vflex>
 *   <c-label>Features</c-label>
 *   <c-checkbox name="performance">Performance</c-checkbox>
 *   <c-checkbox name="design">Design</c-checkbox>
 * </c-fieldset>
 */
export class Fieldset extends Component {
	/**
	 * Whether to stack controls vertically instead of arranging them horizontally.
	 * @attribute
	 */
	vflex = false;

	getContentRect() {
		return this.getBoundingClientRect();
	}
}

component(Fieldset, {
	tagName: 'c-fieldset',
	init: [styleAttribute('vflex')],
	augment: [
		role('group'),
		css(`
:host { display: block; }
slot[name=label] {
	display: block; ${font('body-large')}
	margin-bottom: 16px;
}
#bodyslot { display: flex; flex-wrap: wrap; gap: 8px 16px; }
:host([vflex]) #bodyslot { flex-direction: column; }
`),
		host => registableHost('field', host).tap(ev => {
			if (ev.type === 'connect') ev.target(host);
		}),
		host => {
			const slot = create('slot', { name: 'label' });
			getShadow(host).append(slot, create('slot', { id: 'bodyslot' }));
			return merge(of(undefined), on(slot, 'slotchange')).switchMap(() => {
				const label = slot.assignedElements()[0];
				host.removeAttribute('aria-labelledby');
				return label
					? getAriaId(label).tap(id => host.setAttribute('aria-labelledby', id))
					: EMPTY;
			});
		},
	],
});
