import { on, onResize, onVisibility } from './dom.js';
import { EMPTY, Observable, merge } from './rx.js';

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

	function validate(el: ScrollRect) {
		const size = el[heightProp];
		const position = el[topProp];

		if (
			!Number.isFinite(size) ||
			size <= 0 ||
			!Number.isFinite(position) ||
			!Number.isFinite(position + size)
		)
			invalid(el);

		return el;
	}

	function renderRange(start: number, intra: number, maxHeight: number) {
		let index = start;
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

		if (start > 0) {
			const pre = validate(render(index - 1, count++, 'pre'));
			preSize = pre[heightProp];
			offset = -(sizeIndex.get(start - 1) + intra);
			prePosition = position(pre);
		}

		while (index < dataLength) {
			const currentIndex = index++;
			const current = validate(render(currentIndex, count++, 'on'));
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

			if (endPos - startPos - intra >= maxHeight) break;
		}

		if (index === dataLength && previousIndex !== undefined)
			sizeIndex.update(previousIndex, previousSize);

		return {
			count,
			endPos,
			index,
			lastIndex: previousIndex,
			lastPosition: previousPosition,
			lastSize: previousSize,
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
		if (needsResize) resize();

		const physicalScroll = getLogicalScroll(scrollElement, scrollProp, rtl);
		lastPhysicalScroll = scrollElement[scrollProp];
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
		const anchor = sizeIndex.find(virtualOffset);
		const maxHeight = reachedNativeEnd ? Infinity : viewportSize;
		function renderMeasuredRange(start: number, intra: number) {
			const range = renderTailRange(
				start,
				intra,
				maxHeight,
				reachedNativeEnd,
			);
			let { count } = range;

			// Render one more item so the final visible item includes its trailing gap.
			if (
				range.index < dataLength &&
				range.lastIndex !== undefined &&
				range.lastPosition !== undefined
			) {
				const post = validate(render(range.index, count++, 'post'));
				const stride = position(post) - range.lastPosition;
				sizeIndex.update(
					range.lastIndex,
					measuredExtent(stride, range.lastSize),
				);
			}

			return { range, count };
		}

		let anchorIndex = anchor.index;
		let anchorIntra = anchor.offset;
		let measured = renderMeasuredRange(anchorIndex, anchorIntra);

		if (!reachedNativeEnd) {
			while (
				anchorIndex < dataLength - 1 &&
				anchorIntra >= sizeIndex.get(anchorIndex)
			) {
				anchorIntra -= sizeIndex.get(anchorIndex++);
			}
			if (anchorIndex !== anchor.index)
				measured = renderMeasuredRange(anchorIndex, anchorIntra);
		}

		const { range, count } = measured;
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
	const estimateSize = options.estimateSize ?? 50;
	if (!Number.isFinite(estimateSize) || estimateSize <= 0)
		throw new Error('estimateSize must be a positive finite number.');
	validateIndexOption(options.dataLength, 'dataLength');

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
	let lastPhysicalScroll = NaN;
	const scroll$ = on(scrollElement, 'scroll', {
		passive: true,
	});

	return merge(
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
			lastPhysicalScroll = NaN;
		}) ?? EMPTY,
		onVisibility(scrollElement).switchMap(v =>
			v
				? merge(
						onResize(scrollElement).tap(() => (needsResize = true)),
						scroll$,
					).raf()
				: EMPTY,
		),
	)
		.filter(
			() =>
				needsResize || lastPhysicalScroll !== scrollElement[scrollProp],
		)
		.map(scroll);
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
	const scrollProp = axis === 'x' ? 'scrollLeft' : 'scrollTop';
	const scrollSizeProp = axis === 'x' ? 'scrollWidth' : 'scrollHeight';
	const clientSizeProp = axis === 'x' ? 'clientWidth' : 'clientHeight';

	const scroller = document.createElement('div');
	const cssProp = axis === 'x' ? 'width' : 'height';
	scroller.style.position = 'absolute';
	scroller.style.width = scroller.style.height = '1px';
	scroller.style.top = scroller.style.left = '0';
	(options.scrollContainer ?? scrollElement).appendChild(scroller);
	host.style.position = 'sticky';

	host.style.top = host.style.left = '0';

	if (translate) host.style.translate = '0 0';

	let lastSize = 0;
	let offsetSet = false;
	let lastRenderedScroll = NaN;
	let lastDataLength = options.dataLength;
	let snappingToEnd = false;
	const rtl = isHorizontalRtl(axis, scrollElement);
	const getScroll = () => getLogicalScroll(scrollElement, scrollProp, rtl);
	const setScroll = (value: number) =>
		setLogicalScroll(scrollElement, scrollProp, rtl, value);

	return virtualScrollRender({ ...options, scrollElement })
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
			}

			const settledMaxScroll = Math.max(
				scrollElement[scrollSizeProp] - scrollElement[clientSizeProp],
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
		.finalize(() => scroller.remove());
}
