import {
	Subject,
	Subscription,
	EMPTY,
	Observable,
	of,
	merge,
	be,
	from,
} from './rx.js';
import { on } from './dom.js';

export interface DragOptions {
	target: HTMLElement;
	moveTarget?: HTMLElement;
	delay?: number;
}

export type DragEffectsOptions = DragOptions;

export interface DragMoveOptions extends DragOptions {
	axis?: 'x' | 'y';
}

interface DragLikeEvent {
	target: EventTarget | null;
	clientX: number;
	clientY: number;
}

interface CustomDragEvent {
	target: HTMLElement;
	clientX: number;
	clientY: number;
	startX: number;
	startY: number;
	type: 'start' | 'move' | 'end';
}

export interface DragOverEvent extends DragLikeEvent {
	target: HTMLElement;
	type: 'over';
	relatedTarget: HTMLElement;
}
export interface DragOutEvent {
	target: HTMLElement;
	type: 'out';
}
export interface CustomDropEvent extends DragLikeEvent {
	target: HTMLElement;
	type: 'drop';
	relatedTarget: HTMLElement;
}
export type DragDropEvent =
	| CustomDragEvent
	| DragOverEvent
	| CustomDropEvent
	| DragOutEvent;

export interface TouchGesture {
	type: 'swipe-left' | 'swipe-right';
}

function getTouchId(ev: TouchEvent) {
	for (const touch of ev.changedTouches)
		if (touch.target === ev.target) return touch.identifier;
}

function findTouch(ev: TouchEvent, touchId: number) {
	for (const touch of ev.changedTouches)
		if (touch.identifier === touchId) return touch;
}

function toEvent(
	type: 'start' | 'end' | 'move',
	{ target, clientX, clientY }: MouseEvent | Touch,
	startX: number,
	startY: number,
): CustomDragEvent {
	if (!target) throw new Error('Invalid Event Target');
	return {
		type,
		target: target as HTMLElement,
		clientX,
		clientY,
		startX,
		startY,
	};
}

function DragState() {
	const elements: Record<
		string,
		{ element: HTMLElement; event: CustomDragEvent }
	> = {};
	const dragging = be(elements);
	const dropping = new Subject<{
		element: HTMLElement;
		event: DragLikeEvent;
	}>();

	return {
		dragging,
		dropping,
		elements,
		next: () => dragging.next(elements),
	};
}

const dragState = DragState();

export function onTouchSwipe({
	target,
}: DragOptions): Observable<TouchGesture> {
	let startTime: number, startX: number, startY: number;
	return touchEvents(target).switchMap(ev => {
		if (ev.type === 'start') {
			startX = ev.clientX;
			startY = ev.clientY;
			startTime = Date.now();
		} else if (ev.type === 'end') {
			const dx = ev.clientX - startX;
			const dy = ev.clientY - startY;
			const duration = Date.now() - startTime;
			if (
				duration < 1000 &&
				Math.abs(dx) > 30 &&
				Math.abs(dx) > Math.abs(dy)
			) {
				const type = dx > 0 ? 'swipe-right' : 'swipe-left';
				return of({ type });
			}
		}
		return EMPTY;
	});
}

function abstractDrag(onEvent: (el: HTMLElement) => Observable<PointerEvent>) {
	return ({ target, moveTarget, delay }: DragOptions) => {
		let ready = false,
			timeout = 0;
		delay ??= 60;
		const dropTarget = moveTarget || target;
		const style = target.style;
		let { userSelect, transition } = style;

		return new Observable<CustomDragEvent>(subscriber => {
			function endDrag(event: CustomDragEvent, drop = true) {
				if (ready) {
					ready = false;
					dropTarget.style.transition = transition;
					escapeSubs?.unsubscribe();
					subscriber.next(event);
					//toEvent('end', event, startX, startY));
					delete dragState.elements.mouse;
					if (drop)
						dragState.dropping.next({
							element: dropTarget,
							event,
						});
					dragState.next();
				} else clearTimeout(timeout);
			}

			let startX = 0;
			let startY = 0;

			userSelect = style.userSelect;
			style.userSelect = 'none';
			let escapeSubs: Subscription | undefined;
			const subscription = merge(
				onEvent(target)
					.switchMap(event => {
						if (event.type === 'pointerdown') {
							transition = dropTarget.style.transition;

							event.preventDefault();
							startX = event.clientX;
							startY = event.clientY;
							const pointerId = event.pointerId;

							ready = false;

							timeout = setTimeout(() => {
								dropTarget.style.transition = 'none';
								if (!target.isConnected) return;

								try {
									target.setPointerCapture(pointerId);
								} catch (e) {
									console.error(e);
								}
								ready = true;
								subscriber.next(
									toEvent('start', event, startX, startY),
								);
								escapeSubs = on(window, 'keydown')
									.tap(ev => {
										if (ready && ev.key === 'Escape') {
											ev.preventDefault();
											endDrag(
												{
													type: 'end',
													target,
													clientX: 0,
													clientY: 0,
													startX,
													startY,
												},
												true,
											);
										}
									})
									.subscribe();
							}, delay);
						} else if (event.type === 'pointermove') {
							if (ready) {
								const moveEvent = toEvent(
									'move',
									event,
									startX,
									startY,
								);
								subscriber.next(moveEvent);
								dragState.elements.mouse = {
									element: dropTarget,
									event: moveEvent,
								};
								dragState.next();
							}
						} else {
							clearTimeout(timeout);
							return of(event);
						}
						return EMPTY;
					})
					// Debounce to allow click prevention to fire
					.debounceTime()
					.tap(ev => endDrag(toEvent('end', ev, startX, startY))),
				on(target, 'click', { capture: true }).tap(ev => {
					if (ready && ev.target === target)
						ev.stopImmediatePropagation();
				}),
			).subscribe();

			subscriber.signal.subscribe(() => {
				subscription.unsubscribe();
				escapeSubs?.unsubscribe();
				style.userSelect = userSelect;
			});
		});
	};
}

export function pointerEvents(element: HTMLElement) {
	// This is needed so touch events work correctly
	if (!element.style.touchAction) element.style.touchAction = 'none';
	return on(element, 'pointerdown').switchMap(ev => {
		if (!ev.currentTarget) return EMPTY;
		//ev.preventDefault();
		//element.setPointerCapture(ev.pointerId);

		//const startX = ev.clientX;
		//const startY = ev.clientY;
		return new Observable<PointerEvent>(sub => {
			sub.next(ev); //toEvent('start', ev, startX, startY));
			const subs = merge(
				on(window, 'pointermove').tap(ev => sub.next(ev)),
				merge(on(window, 'pointercancel'), on(window, 'pointerup')).tap(
					ev => {
						sub.next(ev);
						subs.unsubscribe();
					},
				),
			).subscribe();
			sub.signal.subscribe(() => subs.unsubscribe());
		});
	});
}

export function touchEvents(element: HTMLElement) {
	if (!element.style.touchAction) element.style.touchAction = 'none';
	return on(element, 'touchstart', { passive: true }).switchMap(ev => {
		const touchId = getTouchId(ev);
		if (touchId === undefined) return EMPTY;

		const touch = findTouch(ev, touchId);
		if (!touch) return EMPTY;

		ev.stopPropagation();
		const startX = touch.clientX,
			startY = touch.clientY;

		return new Observable<CustomDragEvent>(sub => {
			sub.next(toEvent('start', touch, startX, startY));
			const inner = merge(
				on(window, 'touchmove', { passive: true }).tap(ev => {
					const touch = findTouch(ev, touchId);
					if (touch) sub.next(toEvent('move', touch, startX, startY));
				}),
				on(window, 'touchend').tap(ev => {
					const touch = findTouch(ev, touchId);
					inner.unsubscribe();
					if (touch) sub.next(toEvent('end', touch, startX, startY));
				}),
			).subscribe();

			sub.signal.subscribe(() => inner.unsubscribe());
		});
	});
}

export const onPointerDrag = abstractDrag(pointerEvents);
//export const onTouchDrag = abstractDrag(touchEvents);

export function onDrag(options: DragOptions) {
	return onPointerDrag(options);
}

/**
 * Converts drag events into relative percentages within the target's bounding rectangle, maintaining initial
 * touch points for drag-and-drop interactions. This is especially useful for implementing,
 * interactive UI components that respond to gesture-based position changes.
 */
export function dragInside(target: HTMLElement) {
	let rect: DOMRect;
	return onDrag({
		target,
		delay: 0,
	}).map<CustomDragEvent>(ev => {
		if (ev.type === 'start') rect = target.getBoundingClientRect();
		const clientX = (ev.clientX - rect.x) / rect.width;
		const clientY = (ev.clientY - rect.y) / rect.height;

		return {
			type: ev.type,
			target,
			clientX,
			clientY,
			startX: rect.x,
			startY: rect.y,
		};
	});
}

function isInside(box: DOMRect, event: DragLikeEvent) {
	const x = event.clientX,
		y = event.clientY;
	return box.left < x && box.right > x && box.top < y && box.bottom > y;
}

function getDragElements(el: HTMLElement) {
	const els = dragState.elements;
	const elements: DragOverEvent[] = [];
	let box;

	for (const id in els) {
		const entry = els[id];
		if (!entry) continue;

		const { event, element } = entry;
		if (element !== el) {
			box ||= el.getBoundingClientRect();
			if (isInside(box, event))
				elements.push({
					type: 'over',
					target: el,
					relatedTarget: element,
					clientX: event.clientX,
					clientY: event.clientY,
				});
		}
	}
	return elements;
}

export function dragOverElements(el: HTMLElement) {
	let lastCount = 0;
	return dragState.dragging.switchMap(() => {
		const elements = getDragElements(el);
		if (lastCount === 0 && elements.length === 0) return EMPTY;
		lastCount = elements.length;
		return of(elements);
	});
}

export function onDragOver(target: HTMLElement) {
	return dragOverElements(target).switchMap<DragOverEvent | DragOutEvent>(
		els => {
			if (els.length === 0)
				return of({ type: 'out', target, clientX: 0, clientY: 0 });
			return from(els);
		},
	);
}

export function onDrop(el: HTMLElement) {
	return dragState.dropping.switchMap<CustomDropEvent>(
		({ element, event }) =>
			el !== element && isInside(el.getBoundingClientRect(), event)
				? of({
						type: 'drop',
						target: el,
						clientX: event.clientX,
						clientY: event.clientY,
						relatedTarget: element,
				  })
				: EMPTY,
	);
}

export function onDropNative(el: HTMLElement) {
	return merge(
		on(el, 'dragover')
			.tap(ev => ev.preventDefault())
			.ignoreElements(),
		on(el, 'drop').map(() => {
			const result = dragState.elements.drag?.element;
			delete dragState.elements.drag;
			return result;
		}),
	);
}

function getStart(el: HTMLElement, event: DragLikeEvent) {
	return {
		width: el.offsetWidth,
		height: el.offsetHeight,
		x: event.clientX,
		y: event.clientY,
		sx: event.clientX / el.offsetWidth,
		sy: event.clientY / el.offsetHeight,
	};
}

export interface DragMoveEvent {
	event: CustomDragEvent;
	x: number;
	y: number;
	sx: number;
	sy: number;
}

export function mapDragMove({ target, moveTarget, axis }: DragMoveOptions) {
	let start:
		| {
				width: number;
				height: number;
				x: number;
				y: number;
				sx: number;
				sy: number;
		  }
		| undefined;
	return (event: CustomDragEvent) => {
		const el = moveTarget || target;

		if (event.type === 'start') start = getStart(el, event);
		else if (event.type === 'end') {
			el.style.transform = ``;
			start = undefined;
		} else if (start) {
			const x =
				axis === 'y' ? 0 : (event.clientX - start.x) / start.width;
			const y =
				axis === 'x' ? 0 : (event.clientY - start.y) / start.height;

			return of({ event, x, y, sx: start.sx, sy: start.sy });
		}
		return EMPTY;
	};
}

export function dragMoveApply(o: DragMoveOptions) {
	return ({ x, y }: DragMoveEvent) => {
		const style = (o.moveTarget || o.target).style;
		style.transform = `translate(${x * 100}%, ${y * 100}%)`;
	};
}

export function onDragMove(options: DragMoveOptions) {
	return onDrag(options).switchMap(mapDragMove(options));
}

export function dragMove(o: DragMoveOptions) {
	return onDragMove(o).tap(dragMoveApply(o));
}

export interface DragPositionInfo {
	dragPositionY: 'top' | 'bottom';
}

export function getDragPosition(element: HTMLElement, ev: DragLikeEvent) {
	const box = element.getBoundingClientRect();
	return {
		dragPositionY: ev.clientY - box.top > box.height / 2 ? 'bottom' : 'top',
		dragPositionX: ev.clientX - box.left > box.width / 2 ? 'right' : 'left',
	};
}

/*export function dragNative({
	axis,
	target,
}: DragMoveOptions): Observable<DragInsideEvent> {
	target.draggable = true;
	return merge(on(target, 'dragstart'), on(target, 'dragend')).switchMap(
		ev => {
			if (target)
				ev.dataTransfer?.setDragImage(target, ev.offsetX, ev.offsetY);
			const start = getStart(target, ev);

			return ev.type === 'dragstart'
				? on(target, 'drag').map(event => {
						dragState.elements.drag = {
							element: target,
							event: toEvent('move', event),
						};
						const clientX =
							axis === 'y' ? 0 : event.clientX - start.x;
						const clientY =
							axis === 'x' ? 0 : event.clientY - start.y;

						dragState.next();
						return {
							target,
							type: 'move',
							clientX,
							clientY,
							startX: start.sx,
							startY: start.sy,
						};
				  })
				: EMPTY;
		},
	);
}*/

/**
 * Applies the dragover attribute for drop targets
 */
export function dropTarget<T extends HTMLElement>($: T) {
	let count = 0;
	return merge(
		on($, 'dragenter').tap(ev => {
			if (++count === 1) $.setAttribute('dragover', '');
			ev.stopPropagation();
		}),
		on($, 'dragleave').tap(() => {
			if (--count === 0) $.removeAttribute('dragover');
		}),
		on($, 'dragover').tap(ev => ev.preventDefault()),
		on($, 'drop').tap(ev => {
			ev.preventDefault();
			ev.stopPropagation();
			$.removeAttribute('dragover');
			count = 0;
		}),
	).filter(ev => ev.type === 'drop');
}

export function swapChildren(a: Element, b: Element) {
	const anchorA = a.previousElementSibling;
	const anchorB = b.previousElementSibling;

	if (!anchorA) {
		a.before(b);
		anchorB?.after(a);
	} else if (!anchorB) {
		b.before(a);
		anchorA.after(b);
	} else if (anchorA === b) a.after(b); //b.before(a);
	else if (anchorB === a) anchorA.after(b);
	else {
		anchorA.after(b);
		anchorB.after(a);
	}

	a.removeAttribute('dragover');
}

/*
 * Manages visual and interactive drag state effects by toggling attributes reflecting
 * dragging and dragover statuses, applying movement transforms, and emitting drop events.
 * This orchestrates the user feedback and interaction flow during drag-and-drop sequences.
 */
export function dragEffects(op: DragEffectsOptions) {
	const element = op.moveTarget || op.target;
	return merge(
		onDrag(op)
			.tap(ev => {
				if (ev.type === 'start')
					element.toggleAttribute('dragging', true);
				else if (ev.type === 'end')
					element.toggleAttribute('dragging', false);
			})
			.switchMap(mapDragMove(op))
			.tap(dragMoveApply(op))
			.ignoreElements(),
		onDragOver(element).tap(ev =>
			element.toggleAttribute('dragover', ev.type === 'over'),
		),
		onDrop(element),
	);
}

export function dragging(el: Element) {
	return dragState.dragging
		.map(elements => {
			for (const entry in elements)
				if (elements[entry]?.element === el) return true;
			return false;
		})
		.distinctUntilChanged();
}

export function dragSwap(op: DragOptions) {
	return dragEffects(op).tap(ev => {
		if (ev.type === 'drop') swapChildren(op.target, ev.relatedTarget);
	});
}
