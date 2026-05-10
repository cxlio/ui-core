import { popupManager } from './popup-manager.js';

export type InlinePosition =
	| 'start'
	| 'end'
	| 'left'
	| 'right'
	| 'center'
	| 'start-to-end'
	| 'end-to-start'
	| 'left-to-right'
	| 'right-to-left'
	| 'fill';
export type BlockPosition =
	| 'top'
	| 'middle'
	| 'bottom'
	| 'top-to-bottom'
	| 'bottom-to-top';
export type PopupPosition =
	| BlockPosition
	| InlinePosition
	| 'none'
	| 'auto'
	| `${InlinePosition} ${BlockPosition}`
	| `${BlockPosition} ${InlinePosition}`;

interface PositionOptions {
	element: HTMLElement;
	relativeTo: Element;
	position: PopupPosition | ((el: HTMLElement) => void);
	container?: HTMLElement;
}

interface PositionState {
	left: number;
	top: number;
	minWidth?: number;
}

function isRTL(element: HTMLElement) {
	return getComputedStyle(element).direction === 'rtl';
}

function applyInlinePosition(
	position: string,
	rect: DOMRect,
	element: HTMLElement,
	rtl: boolean,
	state: PositionState,
) {
	if (
		position === 'right' ||
		(position === 'end' && !rtl) ||
		(position === 'start' && rtl)
	) {
		state.left = rect.right;
		return true;
	}

	if (position === 'left-to-right' || (position === 'start-to-end' && !rtl)) {
		state.left = rect.left;
		return true;
	}

	if (
		position === 'left' ||
		(position === 'end' && rtl) ||
		(position === 'start' && !rtl)
	) {
		state.left = rect.left - element.offsetWidth;
		return true;
	}

	if (position === 'center') {
		state.left = rect.left + rect.width / 2 - element.offsetWidth / 2;
		return true;
	}

	if (position === 'right-to-left' || (position === 'end-to-start' && rtl)) {
		state.left = rect.right - element.offsetWidth;
		return true;
	}

	if (position === 'fill') {
		state.left = rect.left;
		state.minWidth = rect.width;
		return true;
	}

	return false;
}

function applyBlockPosition(
	position: string,
	rect: DOMRect,
	element: HTMLElement,
	state: PositionState,
) {
	if (position === 'bottom') {
		state.top = rect.bottom;
		return true;
	}

	if (position === 'top') {
		state.top = rect.top - element.offsetHeight;
		return true;
	}

	if (position === 'middle') {
		state.top = rect.top + rect.height / 2 - element.offsetHeight / 2;
		return true;
	}

	if (position === 'top-to-bottom') {
		state.top = rect.top;
		return true;
	}

	if (position === 'bottom-to-top') {
		state.top = rect.bottom - element.offsetHeight;
		return true;
	}

	return false;
}

function clamp(value: number, min: number, max: number) {
	return Math.min(Math.max(value, min), max);
}

export function positionElement({
	element,
	relativeTo,
	position,
	container, //offsetX,
}: PositionOptions) {
	if (position === 'none') return;

	container ??=
		popupManager.currentPopupContainer ?? popupManager.popupContainer;

	// Popup are assigned a container by the popupManager when connected.
	// if no parent is set, use the default container
	if (!element.parentNode) container.appendChild(element);

	if (typeof position === 'function') return position(element);

	const rect = relativeTo.getBoundingClientRect();
	const style = element.style;
	const maxLeft = Math.max(
		container.offsetWidth - element.offsetWidth - 16,
		16,
	);
	const maxTop = Math.max(
		container.offsetHeight - element.offsetHeight - 16,
		16,
	);

	style.left =
		style.top =
		style.width =
		style.minWidth =
		style.transformOrigin =
			'';

	if (position === 'auto') position = 'center bottom';

	const state: PositionState = { left: 0, top: 0 };
	const rtl = isRTL(element);

	for (const pos of position.split(' ')) {
		if (
			!applyInlinePosition(pos, rect, element, rtl, state) &&
			!applyBlockPosition(pos, rect, element, state)
		) {
			throw new Error(`Invalid position "${pos}"`);
		}
	}

	state.left = clamp(state.left, 16, maxLeft);
	state.top = clamp(state.top, 16, maxTop);

	style.left = `${state.left}px`;
	style.top = `${state.top}px`;
	if (state.minWidth) style.minWidth = `${state.minWidth}px`;
}
