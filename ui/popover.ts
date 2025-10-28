import { Component, get } from './component.js';
import { Observable, EMPTY, merge } from './rx.js';
import { onResize, onAction, on } from './dom.js';

export function popover({
	host,
	target,
	position,
	onToggle,
	whenClosed = EMPTY,
}: {
	host: Element;
	target: HTMLElement;
	position: () => void;
	onToggle?: (isOpen: boolean) => void;
	whenClosed?: Observable<unknown>;
}) {
	return (v: boolean) => {
		target.popover ??= 'auto';
		target.togglePopover(v);
		onToggle?.(v);
		return v
			? merge(
					onResize(host),
					on(window, 'resize'),
					on(window, 'scroll', {
						capture: true,
						passive: true,
					}),
			  ).tap(position)
			: whenClosed;
	};
}

export function popoverBehavior(config: {
	host: Component & { open: boolean };
	target: HTMLElement;
	position: () => void;
	beforeToggle?: (isOpen: boolean) => void;
	onToggle?: (isOpen: boolean) => void;
}) {
	const { host, beforeToggle, target } = config;
	const onPopover = popover({
		...config,
		whenClosed: onAction(host).tap(() => {
			host.open = true;
		}),
	});
	return merge(
		on(target, 'toggle').tap(ev => {
			const isOpen = (ev as ToggleEvent).newState === 'open';
			host.open = isOpen;
		}),
		get(host, 'open')
			.raf()
			.switchMap(v => {
				beforeToggle?.(v);
				host.ariaExpanded = v ? 'true' : 'false';
				return onPopover(v);
			}),
	);
}
