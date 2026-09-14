import { on, onResize, onVisibility } from './dom.js';
import { EMPTY, Observable, defer, merge } from './rx.js';

export type ScrollRect = {
	offsetTop: number;
	offsetWidth: number;
	offsetHeight: number;
	offsetLeft: number;
};

export interface VirtualScrollBaseOptions {
	/**
	 * Number of total records
	 */
	dataLength: number;

	/**
	 * Estimated item extent, including spacing to the next item. Defaults to 50px.
	 */
	estimateSize?: number;

	overscan?: number;

	/**
	 * Scrolling axis. `y` by default.
	 */
	axis?: 'y' | 'x';

	/**
	 * Callback function. Called each time for every item that needs to be rendered.
	 */
	render: (
		index: number,
		order: number,
		type: 'pre' | 'post' | 'on',
	) => ScrollRect;

	/**
	 * Optional callback for cleaning up or reusing DOM elements that are no longer needed after rendering.
	 * Receives the first unused render order; that element and any following elements are no longer active.
	 */
	remove?: (firstUnusedOrder: number) => void;

	/**
	 * Signals the renderer to recalculate item dimensions. Use `resetFrom` at
	 * or before the first index whose cached geometry is no longer valid.
	 */
	refresh?: Observable<
		void | { dataLength: number; resetFrom?: number }
	>;
}

export interface VirtualScrollRenderOptions extends VirtualScrollBaseOptions {
	/**
	 * Scrollable element used to display the scroll bar.
	 */
	scrollElement: HTMLElement;
}

export interface VirtualScrollOptions extends VirtualScrollBaseOptions {
	/**
	 * Element where scrolling styles are applied.
	 */
	host: HTMLElement;

	/**
	 * Scrollable element used to display the scroll bar. Defaults to the parent element of `host`
	 */
	scrollElement?: HTMLElement;

	/**
	 * Optional container where the scroll placeholder element will be inserted.
	 * Allows flexibility in where virtual scroll sizing elements are attached,
	 * which is useful for advanced scrolling setups or custom DOM layouts.
	 */
	scrollContainer?: Node;

	/**
	 * Enables optional transformation-based positioning of the scrolling content container.
	 */
	translate?: boolean;
}

export interface VirtualScrollEvent {
	/**
	 * Current number of data records, including refresh updates.
	 */
	dataLength: number;

	/**
	 * Start index of items rendered.
	 */
	start: number;
	/**
	 * End index of items rendered (non-inclusive, i.e., items rendered for indices: start <= i < end).
	 */
	end: number;

	/**
	 * Physical spacer size in pixels, capped to the browser-safe maximum.
	 */
	totalSize: number;

	/**
	 * Number of items rendered
	 */
	count: number;

	/**
	 * Offset used to position the item container once it reaches the end of the scrolling window
	 */
	offset: number;

	/**
	 * Whether the physical scroll position was at the native end before this render.
	 */
	atEnd: boolean;

	/**
	 * Normalized physical scroll position after applying current measurements.
	 * @internal
	 */
	scrollRatio: number;
}

type ScrollPositionProperty = 'scrollTop' | 'scrollLeft';

function getLogicalScroll(
	element: HTMLElement,
	property: ScrollPositionProperty,
	rtl: boolean,
) {
	const value = element[property];
	return rtl ? -value : value;
}

function setLogicalScroll(
	element: HTMLElement,
	property: ScrollPositionProperty,
	rtl: boolean,
	value: number,
) {
	element[property] = rtl ? -value : value;
}

function isHorizontalRtl(axis: 'x' | 'y' | undefined, element: HTMLElement) {
	return axis === 'x' && getComputedStyle(element).direction === 'rtl';
}

function measuredExtent(stride: number, fallback: number) {
	return Number.isFinite(stride) && stride > 0 ? stride : fallback;
}

function validateIndexOption(value: number, name: string) {
	if (!Number.isSafeInteger(value) || value < 0)
		throw new Error(`${name} must be a non-negative safe integer.`);
}

function validateOptions(options: VirtualScrollBaseOptions) {
	const estimateSize = options.estimateSize ?? 50;
	if (!Number.isFinite(estimateSize) || estimateSize <= 0)
		throw new Error('estimateSize must be a positive finite number.');
	const overscan = options.overscan ?? 0;
	if (!Number.isFinite(overscan) || overscan < 0)
		throw new Error('overscan must be a non-negative finite number.');
	validateIndexOption(options.dataLength, 'dataLength');
	return { estimateSize, overscan };
}

function lowBit(value: number) {
	const low = value >>> 0;
	if (low !== 0) return (low & -low) >>> 0;
	const high = Math.floor(value / 0x1_0000_0000);
	return ((high & -high) >>> 0) * 0x1_0000_0000;
}

class VirtualSizeIndex {
	private tree = new Map<number, number>();
	private measured = new Map<number, number>();
	private totalDelta = 0;

	constructor(
		private length: number,
		private readonly estimate: number,
	) {}

	get totalSize() {
		return this.length * this.estimate + this.totalDelta;
	}

	get(index: number) {
		return this.measured.get(index) ?? this.estimate;
	}

	update(index: number, size: number) {
		if (
			index < 0 ||
			index >= this.length ||
			!Number.isFinite(size) ||
			size <= 0
		)
			return false;
		const previous = this.get(index);
		if (previous === size) return false;
		if (size === this.estimate) this.measured.delete(index);
		else this.measured.set(index, size);
		const delta = size - previous;
		this.totalDelta += delta;
		this.add(index, delta);
		return true;
	}

	offsetOf(end: number) {
		end = Math.max(Math.min(end, this.length), 0);
		let delta = 0;
		for (let i = end; i > 0; i -= lowBit(i))
			delta += this.tree.get(i) ?? 0;
		return end * this.estimate + delta;
	}

	find(offset: number) {
		if (this.length === 0) return { index: 0, offset: 0 };
		offset = Math.max(Math.min(offset, this.totalSize), 0);
		let index = 0;
		let prefix = 0;
		let bit = 1;
		while (bit * 2 <= this.length) bit *= 2;

		for (; bit >= 1; bit /= 2) {
			const next = index + bit;
			if (next > this.length) continue;
			const candidate =
				prefix + bit * this.estimate + (this.tree.get(next) ?? 0);
			if (candidate <= offset) {
				index = next;
				prefix = candidate;
			}
		}

		if (index >= this.length)
			return {
				index: this.length - 1,
				offset: this.get(this.length - 1),
			};
		return { index, offset: offset - prefix };
	}

	resize(length: number) {
		if (length === this.length) return;
		this.length = length;
		for (const index of this.measured.keys())
			if (index >= length) this.measured.delete(index);
		this.rebuild();
	}

	reset(from = 0) {
		for (const index of this.measured.keys())
			if (index >= from) this.measured.delete(index);
		this.rebuild();
	}

	private add(index: number, delta: number) {
		for (let i = index + 1; i <= this.length; i += lowBit(i)) {
			const value = (this.tree.get(i) ?? 0) + delta;
			if (Math.abs(value) < 1e-9) this.tree.delete(i);
			else this.tree.set(i, value);
		}
	}

	private rebuild() {
		this.tree.clear();
		this.totalDelta = 0;
		for (const [index, size] of this.measured) {
			const delta = size - this.estimate;
			this.totalDelta += delta;
			this.add(index, delta);
		}
	}
}

/**
 * Provides basic vertical and horizontal virtual scroll functionality.
 * @beta
 */
export function virtualScrollRender(
	options: VirtualScrollRenderOptions,
): Observable<VirtualScrollEvent> {
	const { estimateSize, overscan } = validateOptions(options);
	return defer(() =>
		createVirtualScrollRender(options, estimateSize, overscan),
	);
}

function createVirtualScrollRender(
	options: VirtualScrollRenderOptions,
	estimateSize: number,
	overscan: number,
): Observable<VirtualScrollEvent> {
	function resize() {
		clientSize = scrollElement[heightProp];
		const style = getComputedStyle(scrollElement);
		paddingStart = parseFloat(style[paddingStartProp]) || 0;
		paddingEnd = parseFloat(style[paddingEndProp]) || 0;
		viewportSize = Math.max(clientSize - paddingStart - paddingEnd, 0);
		rtl = axis === 'x' && style.direction === 'rtl';
		needsResize = false;
	}

	function position(el: ScrollRect) {
		const value = el[topProp];
		return rtl ? -value : value;
	}

	function invalid(el: ScrollRect) {
		console.error(
			`Faulty element detected: 
The provided element has an invalid or unmeasurable size. Check that the "${heightProp}" of the element is not zero or negative. Make sure the element is styled properly and any necessary dimensions are set correctly before rendering.`,
		);
		console.log(el);
		throw new Error(`Rendered element size returned invalid value.`);
	}

	function validate(el: ScrollRect, index: number) {
		const size = el[heightProp];
		const position = el[topProp];

		if (
			!Number.isFinite(size) ||
			size <= 0 ||
			!Number.isFinite(position) ||
			!Number.isFinite(position + size)
		)
			invalid(el);
		if (el instanceof Element) {
			frameElements.add(el);
			const record = observedElements.get(el);
			if (record) {
				record.index = index;
				record.rect = el;
				record.size = size;
			}
			else {
				observedElements.set(el, { index, rect: el, size });
				itemResizeObserver?.observe(el);
			}
		}

		return el;
	}

	function syncObservedElements() {
		for (const element of observedElements.keys()) {
			if (frameElements.has(element)) continue;
			itemResizeObserver?.unobserve(element);
			observedElements.delete(element);
		}
	}

	function renderRange(start: number, intra: number, maxHeight: number) {
		let count = 0;
		let offset = -intra;
		let startPos = 0;
		let endPos = 0;
		let prePosition: number | undefined;
		let preSize = 0;
		let previousPosition: number | undefined;
		let previousSize = 0;
		let previousIndex: number | undefined;
		let rangeRendered = 0;
		const items: ScrollRect[] = [];
		let pre: ScrollRect | undefined;

		if (start > 0) pre = render(start - 1, count++, 'pre');

		let plannedSize = -intra;
		let index = start;
		const planningSize = sizeIndex.get(start);
		while (
			index < dataLength &&
			(items.length === 0 || plannedSize < maxHeight)
		) {
			items.push(render(index, count++, 'on'));
			plannedSize += Math.min(sizeIndex.get(index++), planningSize);
		}
		if (index < dataLength)
			items.push(render(index, count++, 'post'));
		let rangeEnd = start;
		let following: ScrollRect | undefined;

		if (pre) {
			validate(pre, start - 1);
			preSize = pre[heightProp];
			offset = -(sizeIndex.get(start - 1) + intra);
			prePosition = position(pre);
		}

		for (let itemIndex = 0; itemIndex < items.length; itemIndex++) {
			const item = items[itemIndex];
			if (!item) break;
			const currentIndex = start + itemIndex;
			const current = validate(item, currentIndex);
			const currentPosition = position(current);
			const currentSize = current[heightProp];

			if (rangeRendered === 0) {
				startPos = currentPosition;
				if (prePosition !== undefined) {
					const stride = currentPosition - prePosition;
					const extent = measuredExtent(stride, preSize);
					sizeIndex.update(start - 1, extent);
					offset = -(extent + intra);
				}
			}

			if (previousPosition !== undefined && previousIndex !== undefined) {
				const stride = currentPosition - previousPosition;
				sizeIndex.update(
					previousIndex,
					measuredExtent(stride, previousSize),
				);
			}

			previousPosition = currentPosition;
			previousSize = currentSize;
			previousIndex = currentIndex;
			endPos = currentPosition + currentSize;
			rangeRendered++;
			rangeEnd = currentIndex + 1;

			if (endPos - startPos - intra >= maxHeight) {
				following = items[itemIndex + 1];
				break;
			}
		}

		if (rangeEnd === dataLength && previousIndex !== undefined)
			sizeIndex.update(previousIndex, previousSize);
		else if (
			following &&
			previousIndex !== undefined &&
			previousPosition !== undefined
		) {
			const next = validate(following, rangeEnd);
			const stride = position(next) - previousPosition;
			sizeIndex.update(
				previousIndex,
				measuredExtent(stride, previousSize),
			);
		}

		return {
			count:
				(start > 0 ? 1 : 0) + rangeRendered + (following ? 1 : 0),
			endPos,
			index: rangeEnd,
			offset,
			rendered: rangeRendered,
			startPos,
		};
	}

	function renderTailRange(
		initialStart: number,
		intra: number,
		maxHeight: number,
		atEnd: boolean,
	) {
		let start = initialStart;
		let range = renderRange(start, intra, maxHeight);

		while (
			atEnd &&
			start > 0 &&
			range.endPos - range.startPos < viewportSize
		) {
			const missingSize = viewportSize - (range.endPos - range.startPos);
			const backfill = Math.max(
				Math.ceil(missingSize / estimateSize),
				range.rendered,
				1,
			);
			const nextStart = Math.max(start - backfill, 0);
			if (nextStart === start) break;
			start = nextStart;
			range = renderRange(start, 0, maxHeight);
		}

		return { ...range, start };
	}

	function scroll() {
		frameElements.clear();
		if (needsResize) resize();

		const physicalScroll = getLogicalScroll(scrollElement, scrollProp, rtl);
		const scrollDelta = physicalScroll - lastLogicalScroll;
		lastLogicalScroll = physicalScroll;
		const nativeMaxScroll = Math.max(
			scrollElement[scrollSizeProp] - clientSize,
			0,
		);
		const reachedNativeEnd =
			!firstRun && nativeMaxScroll > 0 && physicalScroll >= nativeMaxScroll - 1;
		const virtualMaxScroll = Math.max(virtualTotalSize - viewportSize, 0);
		const virtualOffset = reachedNativeEnd
			? virtualMaxScroll
			: nativeMaxScroll > 0
				? Math.max(
						Math.min(physicalScroll / nativeMaxScroll, 1),
						0,
					) * virtualMaxScroll
				: 0;
		let overscanBefore = overscan / 2;
		let overscanAfter = overscan / 2;
		if (scrollDelta > 0) {
			overscanBefore = overscan / 4;
			overscanAfter = overscan - overscanBefore;
		} else if (scrollDelta < 0) {
			overscanAfter = overscan / 4;
			overscanBefore = overscan - overscanAfter;
		}
		const anchor = sizeIndex.find(virtualOffset);
		let renderStart = sizeIndex.find(
			Math.max(virtualOffset - overscanBefore, 0),
		).index;
		const renderIntra = virtualOffset - sizeIndex.offsetOf(renderStart);
		const maxHeight = reachedNativeEnd
			? Infinity
			: viewportSize + overscanAfter;
		let anchorIndex = anchor.index;
		let anchorIntra = anchor.offset;
		let range = renderTailRange(
			renderStart,
			renderIntra,
			maxHeight,
			reachedNativeEnd,
		);

		if (!reachedNativeEnd) {
			while (
				anchorIndex < dataLength - 1 &&
				anchorIntra >= sizeIndex.get(anchorIndex)
			) {
				anchorIntra -= sizeIndex.get(anchorIndex++);
			}
			if (anchorIndex !== anchor.index) {
				renderStart =
					overscan === 0
						? anchorIndex
						: sizeIndex.find(
								Math.max(virtualOffset - overscanBefore, 0),
							).index;
				range = renderTailRange(
					renderStart,
					overscan === 0
						? anchorIntra
						: virtualOffset - sizeIndex.offsetOf(renderStart),
					maxHeight,
					reachedNativeEnd,
				);
			}
		}

		const { count } = range;
		let { offset } = range;

		remove?.(count);

		const anchorSize = sizeIndex.get(anchorIndex);
		const correctedIntra = Math.min(anchorIntra, anchorSize);
		if (!reachedNativeEnd && range.start === anchorIndex)
			offset += anchorIntra - correctedIntra;

		// If we reach the end, we must adjust the offset so the last item is always at the bottom
		if (range.rendered > 0 && reachedNativeEnd) {
			offset = viewportSize - range.endPos;
			if (offset > 0) offset = 0;
		}

		let correctedVirtualOffset =
			sizeIndex.offsetOf(anchorIndex) + correctedIntra;
		if (reachedNativeEnd) virtualTotalSize = sizeIndex.totalSize;
		else {
			const measuredTotal = sizeIndex.totalSize;
			virtualTotalSize = Math.max(
				measuredTotal,
				correctedVirtualOffset + viewportSize +
					(correctedVirtualOffset + viewportSize >= measuredTotal ? 1 : 0),
			);
		}
		const correctedVirtualMax = Math.max(
			virtualTotalSize - viewportSize,
			0,
		);
		if (reachedNativeEnd) correctedVirtualOffset = correctedVirtualMax;
		const totalSize = Math.min(
			Math.ceil(virtualTotalSize),
			MAX_TOTAL_SIZE,
		);
		firstRun = false;
		syncObservedElements();

		return {
			dataLength,
			start: range.start,
			end: range.index,
			totalSize,
			count: range.rendered,
			offset,
			atEnd: reachedNativeEnd,
			scrollRatio:
				correctedVirtualMax > 0
					? correctedVirtualOffset / correctedVirtualMax
					: 0,
		};
	}

	const { axis, scrollElement, render, refresh, remove } = options;
	const heightProp = axis === 'x' ? 'offsetWidth' : 'offsetHeight';
	const topProp = axis === 'x' ? 'offsetLeft' : 'offsetTop';
	const scrollProp = axis === 'x' ? 'scrollLeft' : 'scrollTop';
	const scrollSizeProp = axis === 'x' ? 'scrollWidth' : 'scrollHeight';
	const paddingStartProp = axis === 'x' ? 'paddingLeft' : 'paddingTop';
	const paddingEndProp = axis === 'x' ? 'paddingRight' : 'paddingBottom';
	const MAX_TOTAL_SIZE = 5e6;

	let dataLength = options.dataLength;
	const sizeIndex = new VirtualSizeIndex(dataLength, estimateSize);
	let virtualTotalSize = sizeIndex.totalSize;
	let clientSize = 0;
	let viewportSize = 0;
	let paddingStart = 0;
	let paddingEnd = 0;
	let rtl = false;
	let firstRun = true;
	let needsResize = true;
	let lastLogicalScroll = NaN;
	let visible = false;
	let itemResizeObserver: ResizeObserver | undefined;
	const frameElements = new Set<Element>();
	const observedElements = new Map<
		Element,
		{ index: number; rect: ScrollRect; size: number }
	>();
	const itemResize$ = new Observable<void>(subscriber => {
		itemResizeObserver = new ResizeObserver(entries => {
			if (!visible) return;
			let changed = false;
			for (const entry of entries) {
				const record = observedElements.get(entry.target);
				if (!record) continue;
				const size = record.rect[heightProp];
				if (!Number.isFinite(size) || size <= 0 || size === record.size)
					continue;
				const extent = sizeIndex.get(record.index) + size - record.size;
				record.size = size;
				changed = sizeIndex.update(record.index, extent) || changed;
			}
			if (changed) {
				virtualTotalSize = sizeIndex.totalSize;
				lastLogicalScroll = NaN;
				subscriber.next();
			}
		});
		subscriber.signal.subscribe(() => {
			itemResizeObserver?.disconnect();
			itemResizeObserver = undefined;
			observedElements.clear();
		});
	});
	const scroll$ = on(scrollElement, 'scroll', {
		passive: true,
	});

	const invalidations = merge(
		refresh?.tap(v => {
			if (v?.dataLength !== undefined) {
				validateIndexOption(v.dataLength, 'dataLength');
				if (v.resetFrom !== undefined)
					validateIndexOption(v.resetFrom, 'resetFrom');
				dataLength = v.dataLength;
				sizeIndex.resize(dataLength);
				if (v.resetFrom !== undefined)
					sizeIndex.reset(Math.max(Math.min(v.resetFrom, dataLength), 0));
				virtualTotalSize = sizeIndex.totalSize;
				needsResize = true;
			}
			lastLogicalScroll = NaN;
		}) ?? EMPTY,
		onVisibility(scrollElement).tap(value => {
			visible = value;
			if (value) needsResize = true;
		}),
		onResize(scrollElement).tap(() => (needsResize = true)),
		itemResize$,
		scroll$,
	).filter(() => visible);

	return new Observable<VirtualScrollEvent>(subscriber => {
		let frame = 0;
		invalidations.subscribe({
			next() {
				if (frame) return;
				frame = requestAnimationFrame(() => {
					frame = 0;
					if (
						!needsResize &&
						lastLogicalScroll ===
							getLogicalScroll(scrollElement, scrollProp, rtl)
					)
						return;
					try {
						subscriber.next(scroll());
					} catch (error) {
						subscriber.error(error);
					}
				});
			},
			error: subscriber.error,
			signal: subscriber.signal,
		});
		subscriber.signal.subscribe(() => {
			if (frame) cancelAnimationFrame(frame);
		});
	});
}

/**
 * Virtual scrolling is a technique used to optimize the rendering of large amounts of data.
 * It allows users to scroll through a list of items without having to load the entire list into memory
 * or render it on the page at once. Instead, only the visible portion of the list is rendered,
 * and as the user scrolls, additional items are loaded and rendered as needed.
 *
 * @beta
 */
export function virtualScroll(options: VirtualScrollOptions) {
	const { axis, host, translate = true } = options;
	const scrollElement = options.scrollElement || host.parentElement;
	if (!scrollElement) throw 'scrollElement option could not be resolved.';
	const { estimateSize, overscan } = validateOptions(options);
	const scrollProp = axis === 'x' ? 'scrollLeft' : 'scrollTop';
	const scrollSizeProp = axis === 'x' ? 'scrollWidth' : 'scrollHeight';
	const clientSizeProp = axis === 'x' ? 'clientWidth' : 'clientHeight';
	const cssProp = axis === 'x' ? 'width' : 'height';

	return defer(() => {
		const originalPosition = host.style.position;
		const originalTop = host.style.top;
		const originalLeft = host.style.left;
		const originalTranslate = host.style.translate;
		const scroller = document.createElement('div');
		scroller.style.position = 'absolute';
		scroller.style.width = scroller.style.height = '1px';
		scroller.style.top = scroller.style.left = '0';
		(options.scrollContainer ?? scrollElement).appendChild(scroller);
		host.style.position = 'sticky';
		host.style.top = host.style.left = '0';
		const ownedPosition = host.style.position;
		const ownedTop = host.style.top;
		const ownedLeft = host.style.left;
		let ownedTranslate = host.style.translate;
		if (translate) {
			host.style.translate = '0 0';
			ownedTranslate = host.style.translate;
		}

		let lastSize = 0;
		let offsetSet = false;
		let lastRenderedScroll = NaN;
		let lastDataLength = options.dataLength;
		let snappingToEnd = false;
		const rtl = isHorizontalRtl(axis, scrollElement);
		const getScroll = () => getLogicalScroll(scrollElement, scrollProp, rtl);
		const setScroll = (value: number) =>
			setLogicalScroll(scrollElement, scrollProp, rtl, value);

		return createVirtualScrollRender(
			{ ...options, scrollElement },
			estimateSize,
			overscan,
		)
			.tap(({ dataLength, totalSize, offset, atEnd, scrollRatio }) => {
				const currentScroll = getScroll();
				if (lastSize !== totalSize) {
					scroller.style[cssProp] = `${totalSize}px`;
					lastSize = totalSize;
				}
				const scrollDelta = Number.isNaN(lastRenderedScroll)
					? 0
					: currentScroll - lastRenderedScroll;
				const movingBackward = scrollDelta < -1;
				const movingTowardEnd = scrollDelta > 1;
				const lengthChanged = dataLength !== lastDataLength;

				if (movingBackward && !lengthChanged) snappingToEnd = false;

				if (translate) {
					if (offset !== 0) {
						const off = rtl ? -offset : offset;
						host.style.translate =
							axis === 'x' ? `${off}px 0` : `0 ${off}px`;
						offsetSet = true;
					} else if (offsetSet) {
						host.style.translate = '0 0';
						offsetSet = false;
					}
					ownedTranslate = host.style.translate;
				}

				const settledMaxScroll = Math.max(
					scrollElement[scrollSizeProp] -
						scrollElement[clientSizeProp],
					0,
				);
				const shouldSnapToEnd =
					atEnd &&
					(lengthChanged ||
						snappingToEnd ||
						movingTowardEnd ||
						Number.isNaN(lastRenderedScroll));

				if (shouldSnapToEnd) {
					if (translate) {
						host.style.translate = '0 0';
						offsetSet = false;
						ownedTranslate = host.style.translate;
					}
					snappingToEnd = true;
				}

				const correctedScroll = shouldSnapToEnd
					? settledMaxScroll
					: scrollRatio * settledMaxScroll;
				if (Math.abs(getScroll() - correctedScroll) > 0.5)
					setScroll(correctedScroll);

				lastDataLength = dataLength;
				lastRenderedScroll = getScroll();
			})
			.finalize(() => {
				scroller.remove();
				if (host.style.position === ownedPosition)
					host.style.position = originalPosition;
				if (host.style.top === ownedTop) host.style.top = originalTop;
				if (host.style.left === ownedLeft) host.style.left = originalLeft;
				if (translate && host.style.translate === ownedTranslate)
					host.style.translate = originalTranslate;
			});
	}).share();
}
