import {
	Component,
	component,
	attribute,
	create,
	property,
	styleAttribute,
	get,
	getShadow,
} from './component.js';
import { css } from './theme.js';
import { changeEvent } from './input.js';
import { selectable } from './selectable.js';
import { EMPTY, merge } from './rx.js';
import { role } from './a11y.js';

declare module './component' {
	interface Components {
		'c-option': Option;
	}
}

/**
 * Represents a selectable element usable in dropdowns, lists, and menus with a
 * configurable view component for advanced content rendering.
 *
 * @title Option Item Component
 * @icon event_list
 * @tagName c-option
 * @see Select
 * @see Multiselect
 */
export class Option extends Component {
	/**
	 * An attribute specifying the unique value associated with the option.
	 * @attribute
	 */
	value: unknown;

	/**
	 * An attribute referencing another component class that defines how the option should be rendered visually.
	 * @attribute
	 */
	view?: new () => Component;

	/**
	 * A boolean style attribute indicating whether the option is currently selected.
	 * @attribute
	 */
	selected = false;

	/**
	 * A boolean style attribute indicating whether the option should be hidden.
	 * @attribute
	 */
	hidden = false;

	/**
	 * A boolean style attribute indicating whether the option is currently focused.
	 * @attribute
	 */
	focused = false;

	rendered?: Component;

	focus() {
		this.rendered?.focus();
	}
}

component(Option, {
	tagName: 'c-option',
	init: [
		attribute('value'),
		property('view'),
		styleAttribute('selected'),
		styleAttribute('hidden'),
		styleAttribute('focused'),
	],
	augment: [
		role('option'),
		css(`:host{display:contents} :host([hidden]){display:none;}`),
		changeEvent,
		selectable,
		$ => {
			let el: Component | undefined;
			return merge(
				get($, 'view').switchMap(view => {
					if (view) {
						el?.remove();
						$.rendered = el = new view();
						el.appendChild(create('slot'));
						getShadow($).append(el);
						return merge(
							get($, 'selected').tap(
								v => el?.toggleAttribute('selected', v),
							),
							get($, 'focused').tap(
								v => el?.toggleAttribute('focused', v),
							),
						);
					}
					$.rendered = el = undefined;
					return EMPTY;
				}),
			);
		},
	],
});
