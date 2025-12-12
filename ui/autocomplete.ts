import {
	Component,
	component,
	styleAttribute,
	attributeChanged,
	create,
	get,
	getShadow,
	numberAttribute,
} from './component.js';
import { selectableHost } from './selectable-host.js';
import { SelectOption, selectBehavior, selectMenuStyles } from './select.js';
import { fieldInput } from './field-input.js';
import { merge } from './rx.js';
import { on, onKeyAction } from './dom.js';
import { ariaId, role } from './a11y.js';
import { InputOption } from './input-option.js';
import { displayContents } from './theme.js';
import { svgPath } from './svg.js';

import type { InputWithValue } from './input.js';
import type { Option } from './option.js';

declare module './component' {
	interface Components {
		'c-autocomplete': Autocomplete;
	}
}
export function prefixMatcher(term: string) {
	return substringMatcher(term, '^');
}

export function substringMatcher(term: string, prefix = '') {
	if (term === '') return () => true;
	const regex = getSearchRegex(term, prefix);
	return (option: Option) =>
		option.textContent ? regex.test(option.textContent) : false;
}

export function getSearchRegex(term: string, prefix = '', flags = 'i') {
	return new RegExp(
		prefix + term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'),
		flags,
	);
}

/**
 * The `<c-autocomplete>` component provides an intelligent suggestion dropdown as users type input,
 * primarily for selecting from a set of options.
 *
 * Each child `<c-option>` within `<c-autocomplete>` defines an item the user can choose.
 *
 * The component performs real-time filtering of available options. By default, matching is case-insensitive
 * on the `textContent` of options, but a custom matcher function can be supplied for advanced scenarios
 * (e.g., substring, fuzzy, or accent-insensitive matching).
 *
 * Designed to pair with `<c-input-option>` inside a `<c-field>`.
 *
 * ### Slots
 *
 * - `empty`: Displayed when no results match the user's typed input. Useful for custom messaging
 *   or actions (e.g., “No results found”, “Add new item”).
 *   This slot is rendered inside the dropdown menu only if no items match; otherwise, it is hidden.
 *
 * @tagName c-autocomplete
 * @title Autocomplete Input Dropdown
 * @icon search
 * @demo
 * <c-field style="margin-bottom: 180px">
 *   <c-label>Auto Complete List</c-label>
 *   <c-input-option></c-input-option>
 *   <c-autocomplete aria-label="autocomplete list">
 *     <c-option value="green">Green</c-option>
 *     <c-option value="red">Red</c-option>
 *     <c-option value="blue">Blue</c-option>
 *     <c-option value="white">White</c-option>
 *     <c-c style="text-align:center;" pad="16" slot="empty">No match found</c-c>
 *   </c-autocomplete>
 * </c-field>
 *
 * @see InputOption
 * @see Field
 */
export class Autocomplete extends Component {
	/**
	 * The component used to render individual options in the dropdown
	 */
	readonly optionView = SelectOption;

	/**
	 * Controls whether the autocomplete dropdown is displayed
	 * @attribute
	 */
	open = false;

	/**
	 * Specifies the debounce delay in milliseconds for processing user input events,
	 * reducing the frequency of filtering and dropdown updates for performance and UX.
	 */
	debounce = 100;

	/**
	 * Holds all available <c-option> elements for the autocomplete.
	 * This array is dynamically updated to reflect the set of current
	 * options, which are filtered and displayed based on user input.
	 */
	readonly options: Option[] = [];

	/**
	 * Defines the matching strategy for filtering options in the dropdown.
	 * Accepts `'prefix'`, `'substring'`, or a custom function that returns a predicate for option matching.
	 * Defaults to 'substring'.
	 */
	matcher:
		| 'prefix'
		| 'substring'
		| ((term: string) => (option: Option) => boolean) = substringMatcher;

	static {
		component(Autocomplete, {
			tagName: 'c-autocomplete',
			init: [styleAttribute('open'), numberAttribute('debounce')],
			augment: [
				role('listbox'),
				selectMenuStyles,
				displayContents,
				$ => {
					const emptySlot = create('slot', {
						name: 'empty',
					});
					const menu = create(
						'div',
						{ id: 'menu', tabIndex: -1 },
						create('slot'),
						emptySlot,
					);
					const caret = svgPath({
						viewBox: '0 0 24 24',
						id: 'caret',
						d: 'M7 10l5 5 5-5z',
						width: 20,
						height: 20,
						fill: 'currentColor',
					});

					caret.style.cursor = 'pointer';
					emptySlot.style.display = 'none';

					function open(input: InputWithValue) {
						$.open = true;
						search(input);
					}

					function setFocused(
						input: InputWithValue,
						newFocused: Option,
					) {
						input.setAria('activedescendant', ariaId(newFocused));
						newFocused.rendered?.scrollIntoView({
							block: 'nearest',
						});
					}

					function search(input: InputWithValue) {
						const term = input.inputValue ?? input.value;
						const matcher =
							$.matcher === 'substring'
								? substringMatcher
								: $.matcher === 'prefix'
								? prefixMatcher
								: $.matcher;
						const match = term ? matcher(String(term)) : undefined;

						let count = 0;
						for (const op of $.options) {
							const hidden = match ? !match(op) : false;
							op.hidden = hidden;
							op.focused = !(hidden || count++ > 0);
							if (op.focused) setFocused(input, op);
						}
						emptySlot.style.display = count ? 'none' : '';
					}

					getShadow($).append(menu, caret);

					return merge(
						fieldInput($).switchMap(input => {
							input.setAria('autocomplete', 'list');

							input.role = 'combobox';
							input.setAria('controls', ariaId($));
							input.setAria('haspopup', $.role);
							input.setAttribute('autocomplete', 'off');

							return merge(
								get($, 'open').tap(v => {
									if (v) {
										caret.tabIndex = -1;
										open(input);
									} else {
										for (const op of $.options)
											op.focused = false;
										caret.tabIndex = 0;
										input.setAria('activedescendant', null);
									}

									input.setAria('expanded', String(v));
								}),
								merge(
									onKeyAction(caret),
									// We use mousedown here to prevent the blur event,
									// which would otherwise close the menu before the user can interact with it.
									on(caret, 'mousedown'),
								)
									.tap(ev => {
										ev.preventDefault();
										ev.stopPropagation();
										input.focus();
									})
									// Add debounce to prevent the popover from closing the menu too quickly
									.debounceTime(100)
									.tap(() => {
										$.open = true;
									}),
								get($, 'debounce').switchMap(v =>
									on(input, 'input')
										.debounceTime(v)
										.tap(() =>
											$.open
												? search(input)
												: open(input),
										),
								),
								on($, 'change').tap(ev => {
									if (ev.target === $)
										input.dispatchEvent(
											new Event('change', {
												bubbles: true,
											}),
										);
								}),
								selectBehavior({
									host: $,
									target: menu,
									input,
								}),
								merge(
									selectableHost($),
									attributeChanged(input, 'value').map(
										value => {
											for (const o of $.options)
												if (o.value === value) return o;
										},
									),
								).tap(option => {
									for (const o of $.options)
										o.focused = o.selected = false;
									if (option) option.selected = true;

									if (input instanceof InputOption)
										input.selected = option;
									else input.value = option?.value;
									$.open = false;
								}),
							);
						}),
					);
				},
			],
		});
	}
}
