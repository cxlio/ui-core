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
	| string;

interface PositionOptions {
	element: HTMLElement;
	relativeTo: Element;
	position: PopupPosition | ((el: HTMLElement) => void);
	container?: HTMLElement;
}

export function positionElement({
	element,
	relativeTo,
	position,
	container, //offsetX,
}: PositionOptions) {
	if (position === 'none') return;

	container ||=
		popupManager.currentPopupContainer ||
		popupManager.popupContainer ||
		document.body;

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

	style.left = style.top = style.width = style.transformOrigin = '';

	const isRTL = () => getComputedStyle(element).direction === 'rtl';

	let left = 0;
	let top = 0;
	let minWidth: number | undefined;

	if (position === 'auto' || !position) position = 'center bottom';

	for (const pos of position.split(' ')) {
		if (
			pos === 'right' ||
			(pos === 'end' && !isRTL()) ||
			(pos === 'start' && isRTL())
		) {
			left = rect.right;
		} else if (
			pos === 'left-to-right' ||
			(pos === 'start-to-end' && !isRTL())
		) {
			left = rect.left;
		} else if (
			pos === 'left' ||
			(pos === 'end' && isRTL()) ||
			(pos === 'start' && !isRTL())
		) {
			left = rect.left - element.offsetWidth;
		} else if (pos === 'center') {
			left = rect.left + rect.width / 2 - element.offsetWidth / 2;
		} else if (
			pos === 'right-to-left' ||
			(pos === 'end-to-start' && isRTL())
		) {
			left = rect.right - element.offsetWidth;
		} else if (pos === 'bottom') {
			top = rect.bottom;
		} else if (pos === 'top') {
			top = rect.top - element.offsetHeight;
		} else if (pos === 'middle') {
			top = rect.top + rect.height / 2 - element.offsetHeight / 2;
		} else if (pos === 'fill') {
			left = rect.left;
			minWidth = rect.width;
		} else if (pos === 'top-to-bottom') {
			top = rect.top;
		} else if (pos === 'bottom-to-top') {
			top = rect.bottom - element.offsetHeight;
		} else {
			throw new Error(`Invalid position "${pos}"`);
		}
	}

	if (left < 16) left = 16;
	else if (left > maxLeft) left = maxLeft;
	if (top < 16) top = 16;
	else if (top > maxTop) top = maxTop;

	style.left = `${left}px`;
	style.top = `${top}px`;
	if (minWidth) style.minWidth = `${minWidth}px`;
}
