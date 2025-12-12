import {
	Component,
	attribute,
	component,
	property,
	message,
	onMessage,
} from './component.js';
import { on, onKeypress } from './dom.js';
import { Observable, merge } from './rx.js';
import { registableHostOrdered } from './registable.js';
import { Input } from './input.js';
import { navigation } from './navigation.js';
import { ariaId } from './a11y.js';

import type { Option } from './option.js';

export interface SelectableBase extends Component {
	disabled?: boolean;
	options: Option[];
	optionView: new () => Component;
	value?: unknown;
	defaultValue?: unknown;
}

export function selectableNavigation({
	host: $,
	input,
	handleOther = false,
	axis,
}: {
	host: SelectableBase & { open?: boolean };
	input?: Input;
	handleOther?: boolean;
	axis?: 'x' | 'y';
}) {
	const getFocused = () =>
		$.querySelector<Option>('[focused]') ?? $.querySelector('[selected]');

	function openOrGo(offset = 1) {
		if ($.open === false) {
			$.open = true;
			const active = getFocused();
			requestAnimationFrame(() => {
				if (active?.focused) setFocused(active);
			});
		} else return go(offset);
	}

	function go(offset = 1, startIndex?: number) {
		const active = getFocused();
		let i = startIndex ?? (active ? $.options.indexOf(active) : -1);

		let item;
		do {
			item = $.options[(i += offset)] as Option | undefined;
		} while (item?.hidden);

		return item;
	}

	function other(ev: KeyboardEvent) {
		const key = ev.key;
		if (/^\w$/.test(key)) {
			const first = getFocused();
			let i = first ? $.options.indexOf(first) : -1;
			if (i === -1) return;
			const start = i;
			if (start + 1 >= $.options.length) i = 0;

			const regex = new RegExp(`^\\s*${key}`, 'i');
			let next: Option | undefined;

			while ((next = $.options[++i] as Option | undefined)) {
				if (next.hidden) continue;
				if (next.textContent.match(regex)) return next;
			}
			if (start === 0) return;
			i = 0;
			while (i < start && (next = $.options[i++] as Option | undefined)) {
				if (next.hidden) continue;
				if (next.textContent.match(regex)) return next;
			}
		}
	}
	const findFocused = () => $.options.find(o => o.focused);

	function setFocused(newFocused: Option | null | undefined) {
		for (const o of $.options) o.focused = false;

		if (newFocused) {
			newFocused.focused = true;
			input?.setAria('activedescendant', ariaId(newFocused));
			newFocused.rendered?.scrollIntoView({ block: 'nearest' });
		} else input?.setAria('activedescendant', null);
	}
	const select = (el: Option) => message(el, 'selectable.action', el);

	return merge(
		navigation<Option>({
			host: input ?? $,
			...(axis === 'x'
				? {
						goLeft: () => openOrGo(-1),
						goRight: () => openOrGo(1),
				  }
				: {
						goDown: () => openOrGo(1),
						goUp: () => openOrGo(-1),
				  }),
			goFirst: () => ($.open !== false ? go(1, -1) : undefined),
			goLast: () =>
				$.open !== false ? go(-1, $.options.length) : undefined,
			other: handleOther ? other : undefined,
		}).tap(el => {
			if ($.open === false) select(el);
			else setFocused(el);
		}),
		on(input ?? $, 'focus').tap(() => setFocused(getFocused())),
		onKeypress(input ?? $, 'Enter').tap(ev => {
			const focused = findFocused();

			if ($.open !== false && focused) {
				ev.stopPropagation();
				select(focused);
			} else if ($.open === false) {
				$.open = true;
			}
		}),
	);
}

/**
 * Handles element selection events. Emits everytime a new item is selected.
 */
export function selectableHost(host: SelectableBase) {
	return new Observable<Option | undefined>(subscriber => {
		merge(
			registableHostOrdered('selectable', host, host.options, ev => {
				if (ev.type === 'connect') {
					ev.target.view = host.optionView;
					if (ev.target.selected) {
						if (host.defaultValue === undefined)
							host.defaultValue = ev.target.value;

						return subscriber.next(ev.target);
					}
				}

				let newSelected;

				for (const o of host.options) {
					if (o.hidden || !o.parentNode) continue;
					if (o.selected) {
						if (newSelected) o.selected = false;
						else newSelected = o;
					}
				}

				subscriber.next(newSelected);
			}),
			onMessage(host, 'selectable.action').tap(target => {
				if (!host.disabled && host.options.includes(target)) {
					const hasChanged = host.value !== target.value;
					subscriber.next(target);
					if (hasChanged) {
						host.dispatchEvent(
							new Event('change', { bubbles: true }),
						);
						host.dispatchEvent(
							new Event('input', { bubbles: true }),
						);
					}
				}
			}),
		).subscribe({ signal: subscriber.signal });
	});
}
const Unselected = {};

/**
 * Represents a base class for selectable components.
 * This class manages a collection of options, tracks selected values,
 * and ensures synchronization between user interactions and internal state.
 *
 * The `SelectableHost` setup ensures that changes to the selection are handled
 * and broadcasted, while also maintaining consistency between the selected option and its value.
 *
 * @beta
 */
export abstract class SelectableHost extends Input {
	/**
	 * Stores the set of available options.
	 */
	readonly options: Option[] = [];

	protected _value: unknown;
	protected _selected?: Option | typeof Unselected = Unselected;

	/**
	 * Defines the visual representation for each option.
	 */
	abstract readonly optionView: new () => Component;

	static {
		component(SelectableHost, {
			init: [attribute('value'), property('selected')],
			augment: [
				$ => {
					return selectableHost($)
						.tap(selected => {
							if (!selected || selected !== $.selected)
								$.setSelected(selected);
						})
						.raf(() => {
							if ($.selected?.selected === false)
								$.setSelected($.selected);
						});
				},
			],
		});
	}

	get value() {
		return this._selected === Unselected
			? this.options[0]?.value
			: this._value;
	}

	/**
	 * Holds the currently selected option from the `options` set.
	 * This reflects the user's choice and updates when the selection changes.
	 * If `undefined`, no option is currently selected.
	 */
	get selected(): Option | undefined {
		if (this._selected === Unselected && this.options[0])
			return this.options[0];
		return this._selected as Option | undefined;
	}

	set value(val: unknown) {
		if (
			this._selected &&
			this._selected !== Unselected &&
			(this._selected as Option).value === val
		) {
			this._value = val;
			return;
		} else
			for (const o of this.options)
				if (o.value === val) {
					this._value = val;
					this.setSelected(o);
					return;
				}
		if (this._selected !== Unselected) {
			this._value = undefined;
			this._selected = undefined;
		} else this._value = val;
	}

	formResetCallback() {
		super.formResetCallback();
		if (!this.selected && this.options.length)
			this.setSelected(this.options[0]);
	}

	protected setSelected(option: Option | undefined) {
		for (const o of this.options) o.focused = o.selected = false;
		if (option) {
			option.selected = true;
			this._selected = option;
			this.value = option.value;
		} else if (this._selected !== Unselected) {
			if (
				!this._selected ||
				this.options.includes(this._selected as Option)
			)
				this._selected = undefined;
			else this._selected = Unselected;
		}
	}
}
