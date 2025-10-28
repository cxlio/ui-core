import { on, getRoot, isHidden } from './dom.js';
import { EMPTY, Observable, merge, of } from './rx.js';

declare module './dom.js' {
	interface CustomEventMap {
		navigate: 'left' | 'right' | 'up' | 'down';
	}
}

export interface NavigationOptions<T extends Element> {
	host: EventTarget;
	goFirst(): T | null | undefined;
	goFirstColumn?(): T | null | undefined;
	goLastColumn?(): T | null | undefined;
	goLast(): T | null | undefined;
	goLeft?(): T | null | undefined;
	goRight?(): T | null | undefined;
	goUp?(): T | null | undefined;
	goDown?(): T | null | undefined;
	other?(ev: KeyboardEvent): T | null | undefined;
}

export function handleListArrowKeys(
	o: NavigationOptions<Element>,
	ev: KeyboardEvent,
) {
	let el: Element | null | undefined;
	const key = ev.key;
	if (key === 'ArrowDown' && o.goDown) el = o.goDown();
	else if (key === 'ArrowRight' && o.goRight) el = o.goRight();
	else if (key === 'ArrowUp' && o.goUp) el = o.goUp();
	else if (key === 'ArrowLeft' && o.goLeft) el = o.goLeft();
	else if (key === 'Home')
		el = ev.ctrlKey && o.goFirstColumn ? o.goFirstColumn() : o.goFirst();
	else if (key === 'End')
		el = ev.ctrlKey && o.goLastColumn ? o.goLastColumn() : o.goLast();
	else if (o.other) el = o.other(ev);
	else return null;

	ev.stopPropagation();
	if (el) ev.preventDefault();

	return el;
}

/**
 * Sets up navigation on a container element, listening for 'keydown' events
 * to handle arrow key navigation logic. Emits the new selected element
 * if a valid navigation action is performed.
 */
export function navigation<T extends Element>(options: NavigationOptions<T>) {
	return on(options.host, 'keydown')
		.map(ev => handleListArrowKeys(options, ev))
		.filter(el => !!el) as Observable<T>;
}

export function overrideFocusMethod(host: HTMLElement) {
	return new Observable<void>(subs => {
		const old = host.focus;
		host.focus = () => {
			old.call(host);
			subs.next();
		};
		subs.signal.subscribe(() => (host.focus = old));
	});
}

/**
 * This function handles managing focus within the list. It sets `tabIndex` to -1 for all
 * focusable elements to prevent them from being focused by tabbing.
 * It keeps track of the currently focused element. Whenever the children of the host element change
 * (due to DOM updates), it resets the `tabIndex` for all elements and sets it to 0 for the first
 * focusable element.
 * It also listens for `focusin` event on the host element to update the `focusedChild` whenever focus
 * moves within the grid using other methods.
 */
export function manageFocus({
	host,
	observe,
	getFocusable,
	getSelected,
	getActive = () => getHostActive(host),
}: {
	host: Node;
	getFocusable: () => HTMLElement[];
	getActive?: () => HTMLElement | undefined | null;
	getSelected?: () => HTMLElement | undefined;
	observe?: Observable<unknown>;
}) {
	let items: (HTMLElement & { disabled?: boolean })[] = [];

	function activateFirst() {
		const first = items.find(i => !i.disabled && !i.hidden && !isHidden(i));
		if (first) first.tabIndex = 0;
	}

	return merge(
		on(host, 'focusin').tap(() => {
			const item = getActive();
			let found = false;
			for (const child of items)
				child.tabIndex = child === item ? ((found = true), 0) : -1;

			// Ensure there's always a focusable item
			if (!found) activateFirst();
		}),
		(observe ?? of(true)).tap(() => {
			items = getFocusable();
			const active = items.find(i => i.tabIndex === 0);
			if (active) return;
			const selected = getSelected?.();
			if (selected) selected.tabIndex = 0;
			else activateFirst();
		}),
		host instanceof HTMLElement
			? overrideFocusMethod(host).tap(() => {
					const items = getFocusable();
					const next =
						items?.find(i => i.tabIndex === 0) ?? items?.[0];
					next?.focus();
			  })
			: EMPTY,
	).ignoreElements();
}

export function getHostActive(host: Node) {
	return (getRoot(host)?.activeElement ??
		document.activeElement ??
		undefined) as HTMLElement | undefined;
}

export function buildGo({
	getFocusable,
	getActive,
}: {
	getFocusable: () => HTMLElement[];
	getActive: () => HTMLElement | undefined;
}) {
	return (offset = 1, startIndex?: number, predicate = isHidden) => {
		const active = getActive();
		const items = getFocusable();
		let i = startIndex ?? (active ? items.indexOf(active) : -1);

		let item;
		do {
			item = items[(i += offset)];
		} while (item && predicate(item));

		return item;
	};
}

export function navigationItems(options: {
	host: Node;
	orientation?: 'vertical' | 'horizontal';
	getFocusable: () => HTMLElement[];
	getActive: () => HTMLElement | undefined;
	getSelected?: () => HTMLElement | undefined;
	customKey?: (ev: KeyboardEvent) => Element | undefined;
	observe?: Observable<void>;
}) {
	const { host, getFocusable, orientation, observe } = options;
	const go = buildGo(options);
	let items: HTMLElement[] = [];

	function focus(item: Element) {
		if (item instanceof HTMLElement)
			item.focus({ focusVisible: true } as FocusOptions);
	}

	return merge(
		(observe ?? of(true)).tap(() => (items = getFocusable())),
		manageFocus(options),
		navigation({
			host,
			...(orientation === 'horizontal'
				? {
						goRight: () => go(1),
						goLeft: () => go(-1),
				  }
				: {
						goDown: () => go(1),
						goUp: () => go(-1),
				  }),
			goFirst: () => go(1, -1),
			goLast: () => go(-1, items.length),
			other: options.customKey,
		}).tap(focus),
	);
}
