import {
	Component,
	Slot,
	component,
	create,
	numberAttribute,
} from './component.js';
import { ariaDescribed, role } from './a11y.js';
import { focused, hovered, on, onKeypress } from './dom.js';
import {
	be,
	combineLatest,
	defer,
	EMPTY,
	merge,
	observable,
	of,
	timer,
} from './rx.js';
import { positionElement } from './position.js';
import { popupManager } from './popup-manager.js';
import { css, font, surface } from './theme.js';

declare module './component.js' {
	interface Components {
		'c-tooltip': Tooltip;
		'c-tooltip-popup': TooltipPopup;
	}
}

/**
 * Displays the noninteractive content of a Tooltip.
 * @tagName c-tooltip-popup
 */
export class TooltipPopup extends Component {}

component(TooltipPopup, {
	tagName: 'c-tooltip-popup',
	augment: [
		role('tooltip'),
		Slot,
		css(`
:host {
	box-sizing: border-box;
	position: fixed;
	display: block;
	margin: 0;
	border: 0;
	border-radius: var(--cxl-shape-corner-xsmall);
	padding: 4px 8px;
	min-height: 24px;
	max-width: calc(100vw - 32px);
	${surface('inverse-surface')}
	${font('body-small')}
}
		`),
	],
});

/**
 * Shows supporting information when its parent is hovered or focused.
 * Escape dismisses the tooltip. Use concise content without interactive controls.
 * @tagName c-tooltip
 * @title Show Helpful Info On Hover Or Focus
 * @icon info
 * @demo
 * <c-button><c-tooltip>Supporting information</c-tooltip>Hover or focus me</c-button>
 * @example <caption>Custom Delays</caption>
 * <c-button><c-tooltip delayin="100" delayout="300">Quick to appear</c-tooltip>Custom delays</c-button>
 */
export class Tooltip extends Component {
	/**
	 * Delay in milliseconds before showing the tooltip.
	 * @attribute
	 */
	delayin = 500;

	/**
	 * Delay in milliseconds before hiding the tooltip.
	 * @attribute
	 */
	delayout = 100;
}

component(Tooltip, {
	tagName: 'c-tooltip',
	init: [numberAttribute('delayin', 0), numberAttribute('delayout', 0)],
	augment: [
		css(':host { display: none; }'),
		$ =>
			defer(() => {
				const parent = $.parentElement;
				if (!parent) return EMPTY;
				const description = parent.getAttribute('aria-describedby');
				const describedBy = be<Element>($);
				let clientX: number | undefined;
				let clientY: number | undefined;
				const popup = create(TooltipPopup, {
					$: observable(subscriber => {
						subscriber.signal.subscribe(() => {
							$.append(...popup.childNodes);
							describedBy.next($);
							clientX = clientY = undefined;
							if (popupManager.currentTooltip === popup)
								popupManager.currentTooltip = undefined;
						});
					}),
				});
				popup.popover = 'manual';

				function close() {
					popup.remove();
				}

				const open = () => {
					if (
						popup.isConnected ||
						parent.matches(
							':disabled,[disabled],[aria-disabled="true"]',
						) ||
						!parent.getClientRects().length
					)
						return;
					popup.append(...$.childNodes);
					popupManager.tooltipOpened(popup);
					positionElement({
						element: popup,
						relativeTo: parent,
						container: document.body,
						position(el) {
							el.showPopover();
							const rect = parent.getBoundingClientRect();
							const x =
								clientX ??
								rect.left + (rect.width - el.offsetWidth) / 2;
							const y = (clientY ?? rect.top) - el.offsetHeight;
							el.style.left = `${Math.max(0, Math.min(x, innerWidth - el.offsetWidth))}px`;
							el.style.top = `${Math.max(0, Math.min(y, innerHeight - el.offsetHeight))}px`;
						},
					});
					describedBy.next(popup);
				};

				return observable(subscriber => {
					const subscription = merge(
						describedBy.switchMap(by =>
							ariaDescribed(parent, by).tap(() => {
								if (description)
									parent.setAttribute(
										'aria-describedby',
										`${description} ${by.id}`,
									);
							}),
						),
						on(parent, 'mousemove').tap(ev => {
							if (!popup.isConnected) {
								clientX = ev.clientX;
								clientY = ev.clientY;
							}
						}),
						merge(
							combineLatest(
								describedBy.switchMap(by =>
									by === popup ? hovered(popup) : of(false),
								),
								hovered(parent),
								focused(parent),
							)
								.map(values => values.some(Boolean))
								.distinctUntilChanged()
								.map(show => ({
									show,
									delay: show ? $.delayin : $.delayout,
								})),
							onKeypress(window, 'escape').map(() => ({
								show: false,
								delay: 0,
							})),
						).switchMap(({ show, delay }) =>
							(delay ? timer(delay) : of(undefined)).tap(() =>
								show ? open() : close(),
							),
						),
					).subscribe({ next: subscriber.next, error: subscriber.error });
					subscriber.signal.subscribe(() => {
						subscription.unsubscribe();
						close();
						if (description === null)
							parent.removeAttribute('aria-describedby');
						else parent.setAttribute('aria-describedby', description);
					});
				});
			}),
	],
});
