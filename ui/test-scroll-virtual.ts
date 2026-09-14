import { spec, type TestApi } from '@cxl/spec';
import { firstValueFrom, subject } from './rx.js';
import { virtualScroll, virtualScrollRender } from './scroll-virtual.js';

export default spec('scroll-virtual', a => {
	const rendered = subject<void>();

	function keepVisible(container: HTMLElement) {
		container.style.position = 'fixed';
		container.style.inset = '0';
		container.style.pointerEvents = 'none';
	}

	function record<T>(events: T[]) {
		return (event: T) => {
			events.push(event);
			rendered.next();
		};
	}

	async function dispatchScroll<T>(scrollElement: HTMLElement, events: T[]) {
		const eventCount = events.length;
		scrollElement.dispatchEvent(new Event('scroll'));
		await waitFor(() => events.length > eventCount);
	}

	async function waitFor(condition: () => boolean) {
		if (!condition()) await firstValueFrom(rendered.filter(condition));
	}

	async function waitForScrollable(
		scrollElement: HTMLElement,
		axis: 'x' | 'y' = 'y',
	) {
		await waitFor(
			() =>
				axis === 'x'
					? scrollElement.scrollWidth > scrollElement.clientWidth
					: scrollElement.scrollHeight > scrollElement.clientHeight,
		);
	}

	function eventLog<T>() {
		const events: T[] = [];
		const waiters = new Set<{
			from: number;
			predicate: (event: T) => boolean;
			resolve: (event: T) => void;
		}>();
		const push = (event: T) => {
			events.push(event);
			rendered.next();
			for (const waiter of waiters) {
				if (events.length <= waiter.from || !waiter.predicate(event)) continue;
				waiters.delete(waiter);
				waiter.resolve(event);
			}
		};
		const waitFor = (
			predicate: (event: T) => boolean = () => true,
			from = 0,
		) => {
			const event = events.slice(from).find(predicate);
			if (event !== undefined) return Promise.resolve(event);
			return new Promise<T>(resolve => waiters.add({ from, predicate, resolve }));
		};
		return { events, push, waitFor };
	}

	function positionsFor(sizes: number[]) {
		let total = 0;
		return sizes.map(size => {
			const position = total;
			total += size;
			return position;
		});
	}

	function valueAt<T>(values: T[], index: number) {
		const value = values.at(index);
		if (value === undefined) throw new Error(`Missing value at ${index}.`);
		return value;
	}

	a.test('throws when scrollElement cannot be resolved', (t: TestApi) => {
		const host = document.createElement('div');

		t.throws(() =>
			virtualScroll({
				host,
				dataLength: 1,
				render: () => ({
					offsetTop: 0,
					offsetLeft: 0,
					offsetHeight: 1,
					offsetWidth: 1,
				}),
			}),
		);
	});

	a.test('rejects non-finite item measurements', async (t: TestApi) => {
		const scrollElement = document.createElement('div');

		scrollElement.style.position = 'fixed';
		scrollElement.style.inset = '0';
		scrollElement.style.height = '100px';
		scrollElement.style.overflow = 'auto';
		t.dom.append(scrollElement);

		const errors = subject<Error>();
		const renderError = firstValueFrom(errors);
		const sub = virtualScrollRender({
			scrollElement,
			dataLength: 1,
			render: () => ({
				offsetTop: 0,
				offsetLeft: 0,
				offsetHeight: Number.NaN,
				offsetWidth: 1,
			}),
		}).subscribe({
			error: error =>
				errors.next(
					error instanceof Error ? error : new Error(String(error)),
				),
		});

		try {
			t.ok((await renderError) instanceof Error);
		} finally {
			sub.unsubscribe();
		}
	});

	a.test('rejects invalid estimated item sizes', (t: TestApi) => {
		const scrollElement = document.createElement('div');
		const render = () => ({
			offsetTop: 0,
			offsetLeft: 0,
			offsetHeight: 1,
			offsetWidth: 1,
		});

		t.throws(() =>
			virtualScrollRender({
				scrollElement,
				dataLength: 1,
				estimateSize: Number.NaN,
				render,
			}),
		);
		t.throws(() =>
			virtualScrollRender({
				scrollElement,
				dataLength: 1,
				estimateSize: 0,
				render,
			}),
		);
		t.throws(() =>
			virtualScrollRender({
				scrollElement,
				dataLength: 1,
				overscan: -1,
				render,
			}),
		);
		t.throws(() =>
			virtualScrollRender({
				scrollElement,
				dataLength: 1,
				overscan: Number.POSITIVE_INFINITY,
				render,
			}),
		);
		const host = document.createElement('div');
		t.throws(() =>
			virtualScroll({
				host,
				scrollElement,
				dataLength: 1,
				overscan: -1,
				render,
			}),
		);
	});

	a.test('renders with the real browser DOM', async (t: TestApi) => {
		const container = t.dom;
		keepVisible(container);
		const scrollElement = document.createElement('div');
		const host = document.createElement('div');
		const calls: Array<[number, number, 'pre' | 'post' | 'on']> = [];
		const log = eventLog<{
			start: number;
			end: number;
			totalSize: number;
			count: number;
			offset: number;
		}>();
		const { events } = log;

		container.innerHTML = '';
		container.appendChild(scrollElement);
		scrollElement.style.height = '100px';
		scrollElement.style.overflow = 'auto';
		scrollElement.style.position = 'relative';
		scrollElement.appendChild(host);

		const sub = virtualScroll({
			host,
			scrollElement,
			dataLength: 10,
			render: (index, order, type) => {
				calls.push([index, order, type]);
				return {
					offsetTop: index * 50,
					offsetLeft: index * 50,
					offsetHeight: 50,
					offsetWidth: 50,
				};
			},
		}).subscribe(log.push);

		try {
			const first = await log.waitFor();
			t.equal(first.start, 0);
			t.equal(first.end, 2);
			t.equal(first.count, 2);
			t.equal(first.totalSize, 500);
			t.equal(first.offset, 0);
			t.equal(host.style.position, 'sticky');
			t.equal(host.style.top, '0px');
			t.equal(host.style.left, '0px');
			t.equal(host.style.translate, '0px');
			t.equal(scrollElement.children.length, 2);
			t.equal(
				(scrollElement.lastElementChild as HTMLElement | null)?.style.height,
				'500px',
			);
			t.equal(
				JSON.stringify(calls),
				JSON.stringify([
					[0, 0, 'on'],
					[1, 1, 'on'],
					[2, 2, 'post'],
				]),
			);

			const eventCount = events.length;
			scrollElement.scrollTop = 100;
			await dispatchScroll(scrollElement, events);

			const second = await log.waitFor(() => true, eventCount);
			t.equal(second.start, 2);
			t.equal(second.end, 4);
			t.equal(second.count, 2);
			t.equal(second.offset, -50);
			t.equal(host.style.translate, '0px -50px');
			t.equal(
				JSON.stringify(calls.slice(3)),
				JSON.stringify([
					[1, 0, 'pre'],
					[2, 1, 'on'],
					[3, 2, 'on'],
					[4, 3, 'post'],
				]),
			);
			sub.unsubscribe();
			t.equal(scrollElement.children.length, 1);
		} finally {
			sub.unsubscribe();
		}
	});

	a.test(
		'vertical end alignment matches the padded viewport size',
		async (t: TestApi) => {
		const container = t.dom;
		keepVisible(container);
		const scrollElement = document.createElement('div');
		const host = document.createElement('div');
		const events: Array<{
			start: number;
			end: number;
			totalSize: number;
			count: number;
			offset: number;
		}> = [];
		const sizes = [40, 80, 24, 72, 32, 96, 28, 64, 36, 88];

		container.innerHTML = '';
		container.appendChild(scrollElement);
		scrollElement.style.height = '120px';
		scrollElement.style.overflow = 'auto';
		scrollElement.style.position = 'relative';
		scrollElement.style.padding = '16px';
		scrollElement.appendChild(host);
		host.style.display = 'flex';
		host.style.flexDirection = 'column';

		const sub = virtualScroll({
			host,
			scrollElement,
			dataLength: sizes.length,
			remove(index) {
				const div = host.children[index] as HTMLElement | undefined;
				if (div) div.style.display = 'none';
			},
			render(index, order) {
				let div = host.children[order] as HTMLElement | undefined;
				if (!div) {
					div = document.createElement('div');
					host.append(div);
				}
				div.style.display = '';
				div.style.display = 'flex';
				div.style.alignItems = 'center';
				div.style.border = '1px solid';
				div.style.borderRadius = '8px';
				div.style.padding = '4px 8px';
				div.style.flexShrink = '0';
				div.style.height = `${sizes[index]}px`;
				div.textContent = `${index}`;
				return div;
			},
		}).subscribe(record(events));

		try {
			await waitForScrollable(scrollElement);

			scrollElement.scrollTop =
				scrollElement.scrollHeight - scrollElement.clientHeight;
			await dispatchScroll(scrollElement, events);

			const visible = Array.from(host.children).filter(
				(el): el is HTMLElement => (el as HTMLElement).style.display !== 'none',
			);
			const last = events.at(-1);
			const lastItem = visible.at(-1);
			t.assert(last, 'Missing end render event');
			t.assert(lastItem, 'Missing last rendered item');

			t.equal(last.end, 10);
			t.equal(lastItem.textContent, '9');
			t.ok(last.count > 0);
		} finally {
			sub.unsubscribe();
		}
		},
	);

	a.test(
		'keeps the last vertical item exactly at the padded bottom edge',
		async (t: TestApi) => {
		const container = t.dom;
		keepVisible(container);
		const scrollElement = document.createElement('div');
		const host = document.createElement('div');
		const events: Array<{
			start: number;
			end: number;
			totalSize: number;
			count: number;
			offset: number;
		}> = [];
		const sizes = [24, 56, 80, 32, 72, 40, 64, 28, 88, 36];

		container.innerHTML = '';
		container.appendChild(scrollElement);
		scrollElement.style.height = '120px';
		scrollElement.style.overflow = 'auto';
		scrollElement.style.position = 'relative';
		scrollElement.style.padding = '16px';
		scrollElement.appendChild(host);
		host.style.display = 'flex';
		host.style.flexDirection = 'column';

		const sub = virtualScroll({
			host,
			scrollElement,
			dataLength: sizes.length,
			remove(index) {
				for (; index < host.children.length; index++) {
					const el = host.children[index] as HTMLElement | undefined;
					if (el) el.style.display = 'none';
				}
			},
			render(index, order) {
				let el = host.children[order] as HTMLElement | undefined;
				if (!el) {
					el = document.createElement('div');
					host.append(el);
				}
				el.style.display = 'flex';
				el.style.alignItems = 'center';
				el.style.border = '1px solid';
				el.style.borderRadius = '8px';
				el.style.padding = '4px 8px';
				el.style.flexShrink = '0';
				el.style.height = `${sizes[index]}px`;
				el.textContent = `${index}`;
				return el;
			},
		}).subscribe(record(events));

		try {
			await waitForScrollable(scrollElement);

			scrollElement.scrollTop =
				scrollElement.scrollHeight - scrollElement.clientHeight;
			await dispatchScroll(scrollElement, events);

			const last = events.at(-1);
			const visible = Array.from(host.children).filter(
				(el): el is HTMLElement => (el as HTMLElement).style.display !== 'none',
			);
			const lastItem = visible.at(-1);
			t.assert(last, 'Missing end render event');
			t.assert(lastItem, 'Missing last rendered item');
			const style = getComputedStyle(scrollElement);
			const paddingBottom = parseFloat(style.paddingBottom) || 0;
			const scrollRect = scrollElement.getBoundingClientRect();
			const lastRect = lastItem.getBoundingClientRect();
			const contentBottom = Math.round(scrollRect.bottom - paddingBottom);

			t.equal(
				scrollElement.scrollTop,
				scrollElement.scrollHeight - scrollElement.clientHeight,
			);
			t.equal(last.end, 10);
			t.ok(last.count > 0);
			t.equal(lastItem.textContent, '9');
			t.equal(Math.round(lastRect.bottom), contentBottom);
			t.equal(host.style.translate, '0px');
		} finally {
			sub.unsubscribe();
		}
		},
	);

	a.test(
		'vertical end alignment with gap matches the padded viewport size',
		async (t: TestApi) => {
		const container = t.dom;
		keepVisible(container);
		const scrollElement = document.createElement('div');
		const host = document.createElement('div');
		const events: Array<{
			start: number;
			end: number;
			totalSize: number;
			count: number;
			offset: number;
		}> = [];
		const sizes = [48, 64, 28, 76, 36, 84, 32, 68, 44, 92];

		container.innerHTML = '';
		container.appendChild(scrollElement);
		scrollElement.style.height = '120px';
		scrollElement.style.overflow = 'auto';
		scrollElement.style.position = 'relative';
		scrollElement.style.padding = '16px';
		scrollElement.appendChild(host);
		host.style.display = 'flex';
		host.style.flexDirection = 'column';
		host.style.gap = '16px';

		const sub = virtualScroll({
			host,
			scrollElement,
			dataLength: sizes.length,
			remove(index) {
				const div = host.children[index] as HTMLElement | undefined;
				if (div) div.style.display = 'none';
			},
			render(index, order) {
				let div = host.children[order] as HTMLElement | undefined;
				if (!div) {
					div = document.createElement('div');
					host.append(div);
				}
				div.style.display = '';
				div.style.display = 'flex';
				div.style.alignItems = 'center';
				div.style.border = '1px solid';
				div.style.borderRadius = '8px';
				div.style.padding = '4px 8px';
				div.style.flexShrink = '0';
				div.style.height = `${sizes[index]}px`;
				div.textContent = `${index}`;
				return div;
			},
		}).subscribe(record(events));

		try {
			await waitForScrollable(scrollElement);

			scrollElement.scrollTop =
				scrollElement.scrollHeight - scrollElement.clientHeight;
			await dispatchScroll(scrollElement, events);

			const visible = Array.from(host.children).filter(
				(el): el is HTMLElement => (el as HTMLElement).style.display !== 'none',
			);
			const last = events.at(-1);
			const lastItem = visible.at(-1);
			t.assert(last, 'Missing end render event');
			t.assert(lastItem, 'Missing last rendered item');
			const style = getComputedStyle(scrollElement);
			const paddingBottom = parseFloat(style.paddingBottom) || 0;
			const scrollRect = scrollElement.getBoundingClientRect();
			const lastRect = lastItem.getBoundingClientRect();
			const contentBottom = Math.round(scrollRect.bottom - paddingBottom);

			t.equal(last.end, 10);
			t.equal(lastItem.textContent, '9');
			t.equal(Math.round(lastRect.bottom), contentBottom);
			t.equal(host.style.translate, '0px');
		} finally {
			sub.unsubscribe();
		}
	});

	a.test(
		'keeps the last vertical item exactly at the padded bottom edge with gap',
		async (t: TestApi) => {
		const container = t.dom;
		keepVisible(container);
		const scrollElement = document.createElement('div');
		const host = document.createElement('div');
		const events: Array<{
			start: number;
			end: number;
			totalSize: number;
			count: number;
			offset: number;
		}> = [];
		const sizes = [28, 60, 84, 36, 76, 44, 68, 32, 92, 40];

		container.innerHTML = '';
		container.appendChild(scrollElement);
		scrollElement.style.height = '120px';
		scrollElement.style.overflow = 'auto';
		scrollElement.style.position = 'relative';
		scrollElement.style.padding = '16px';
		scrollElement.appendChild(host);
		host.style.display = 'flex';
		host.style.flexDirection = 'column';
		host.style.gap = '16px';

		const sub = virtualScroll({
			host,
			scrollElement,
			dataLength: sizes.length,
			remove(index) {
				for (; index < host.children.length; index++) {
					const el = host.children[index] as HTMLElement | undefined;
					if (el) el.style.display = 'none';
				}
			},
			render(index, order) {
				let el = host.children[order] as HTMLElement | undefined;
				if (!el) {
					el = document.createElement('div');
					host.append(el);
				}
				el.style.display = 'flex';
				el.style.alignItems = 'center';
				el.style.border = '1px solid';
				el.style.borderRadius = '8px';
				el.style.padding = '4px 8px';
				el.style.flexShrink = '0';
				el.style.height = `${sizes[index]}px`;
				el.textContent = `${index}`;
				return el;
			},
		}).subscribe(record(events));

		try {
			await waitForScrollable(scrollElement);

			scrollElement.scrollTop =
				scrollElement.scrollHeight - scrollElement.clientHeight;
			await dispatchScroll(scrollElement, events);

			const last = events.at(-1);
			const visible = Array.from(host.children).filter(
				(el): el is HTMLElement => (el as HTMLElement).style.display !== 'none',
			);
			const lastItem = visible.at(-1);
			t.assert(last, 'Missing end render event');
			t.assert(lastItem, 'Missing last rendered item');
			const style = getComputedStyle(scrollElement);
			const paddingBottom = parseFloat(style.paddingBottom) || 0;
			const scrollRect = scrollElement.getBoundingClientRect();
			const lastRect = lastItem.getBoundingClientRect();
			const contentBottom = Math.round(scrollRect.bottom - paddingBottom);

			t.equal(
				scrollElement.scrollTop,
				scrollElement.scrollHeight - scrollElement.clientHeight,
			);
			t.equal(last.end, 10);
			t.ok(last.count > 0);
			t.equal(lastItem.textContent, '9');
			t.equal(Math.round(lastRect.bottom), contentBottom);
			t.equal(host.style.translate, '0px');
		} finally {
			sub.unsubscribe();
		}
	});

	a.test('can leave the vertical end after reaching the bottom', async (t: TestApi) => {
		const container = t.dom;
		keepVisible(container);
		const scrollElement = document.createElement('div');
		const host = document.createElement('div');
		const events: Array<{
			start: number;
			end: number;
			totalSize: number;
			count: number;
			offset: number;
		}> = [];
		const sizes = [48, 60, 72, 56, 68, 52, 64, 58, 70, 54];

		container.innerHTML = '';
		container.appendChild(scrollElement);
		scrollElement.style.height = '120px';
		scrollElement.style.overflow = 'auto';
		scrollElement.style.position = 'relative';
		scrollElement.style.padding = '16px';
		scrollElement.appendChild(host);
		host.style.display = 'flex';
		host.style.flexDirection = 'column';
		host.style.gap = '16px';

		const sub = virtualScroll({
			host,
			scrollElement,
			dataLength: sizes.length,
			remove(index) {
				for (; index < host.children.length; index++) {
					const el = host.children[index] as HTMLElement | undefined;
					if (el) el.style.display = 'none';
				}
			},
			render(index, order) {
				let el = host.children[order] as HTMLElement | undefined;
				if (!el) {
					el = document.createElement('div');
					host.append(el);
				}
				el.style.display = 'flex';
				el.style.alignItems = 'center';
				el.style.border = '1px solid';
				el.style.borderRadius = '8px';
				el.style.padding = '4px 8px';
				el.style.flexShrink = '0';
				el.style.height = `${sizes[index]}px`;
				el.textContent = `${index}`;
				return el;
			},
		}).subscribe(record(events));

		try {
			await waitForScrollable(scrollElement);

			scrollElement.scrollTop =
				scrollElement.scrollHeight - scrollElement.clientHeight;
			await dispatchScroll(scrollElement, events);
			const bottom = events.at(-1);
			const bottomScrollTop = scrollElement.scrollTop;
			const bottomVisible = Array.from(host.children).filter(
				(el): el is HTMLElement => (el as HTMLElement).style.display !== 'none',
			);
			const bottomLastItem = bottomVisible.at(-1);
			t.assert(bottom, 'Missing bottom render event');
			t.assert(bottomLastItem, 'Missing bottom last item');
			const bottomLastText = bottomLastItem.textContent;

			scrollElement.scrollTop = Math.max(
				bottomScrollTop - scrollElement.clientHeight,
				0,
			);
			await dispatchScroll(scrollElement, events);
			const up = events.at(-1);
			const upScrollTop = scrollElement.scrollTop;
			t.assert(up, 'Missing upward render event');
			const settledScrollTop = scrollElement.scrollTop;

			t.equal(bottom.end, sizes.length);
			t.equal(bottomLastText, `${sizes.length - 1}`);
			t.ok(upScrollTop < bottomScrollTop);
			t.equal(settledScrollTop, upScrollTop);
			t.ok(up.start <= bottom.start);
		} finally {
			sub.unsubscribe();
		}
	});

	a.test(
		'keeps vertical translate when leaving the bottom but still rendering the last item',
		async (t: TestApi) => {
			const container = t.dom;
			keepVisible(container);
			const scrollElement = document.createElement('div');
			const host = document.createElement('div');
			const events: Array<{
				start: number;
				end: number;
				totalSize: number;
				count: number;
				offset: number;
			}> = [];
			const sizes = [100, 100, 20, 20, 20, 20, 20, 20, 20, 20];
			const positions = positionsFor(sizes);

			container.innerHTML = '';
			container.appendChild(scrollElement);
			scrollElement.style.height = '100px';
			scrollElement.style.overflow = 'auto';
			scrollElement.style.position = 'relative';
			scrollElement.appendChild(host);

			const sub = virtualScroll({
				host,
				scrollElement,
				dataLength: sizes.length,
				render: index => ({
					offsetTop: valueAt(positions, index),
					offsetLeft: valueAt(positions, index),
					offsetHeight: valueAt(sizes, index),
					offsetWidth: valueAt(sizes, index),
				}),
			}).subscribe(record(events));

			try {
				await waitForScrollable(scrollElement);

				scrollElement.scrollTop =
					scrollElement.scrollHeight - scrollElement.clientHeight;
				await dispatchScroll(scrollElement, events);
				scrollElement.scrollTop =
					scrollElement.scrollHeight - scrollElement.clientHeight;
				await dispatchScroll(scrollElement, events);

				scrollElement.scrollTop = Math.max(scrollElement.scrollTop - 10, 0);
				await dispatchScroll(scrollElement, events);

				const last = events.at(-1);
				t.assert(last, 'Missing render event');
				const translated = Number.parseFloat(
					host.style.translate.split(' ')[1] ?? '',
				);

				t.equal(last.end, sizes.length);
				t.ok(scrollElement.scrollTop < scrollElement.scrollHeight);
				t.ok(last.offset !== 0);
				t.ok(Math.abs(translated - last.offset) < 0.001);
			} finally {
				sub.unsubscribe();
			}
		},
	);

	a.test('can leave the horizontal end after reaching the right edge', async (t: TestApi) => {
		const container = t.dom;
		keepVisible(container);
		const scrollElement = document.createElement('div');
		const host = document.createElement('div');
		const events: Array<{
			start: number;
			end: number;
			totalSize: number;
			count: number;
			offset: number;
		}> = [];
		const sizes = [48, 60, 72, 56, 68, 52, 64, 58, 70, 54];

		container.innerHTML = '';
		container.appendChild(scrollElement);
		scrollElement.style.width = '120px';
		scrollElement.style.height = '80px';
		scrollElement.style.overflow = 'auto';
		scrollElement.style.position = 'relative';
		scrollElement.style.padding = '16px';
		scrollElement.appendChild(host);
		host.style.display = 'flex';
		host.style.flexDirection = 'row';
		host.style.gap = '16px';

		const sub = virtualScroll({
			host,
			scrollElement,
			axis: 'x',
			dataLength: sizes.length,
			remove(index) {
				for (; index < host.children.length; index++) {
					const el = host.children[index] as HTMLElement | undefined;
					if (el) el.style.display = 'none';
				}
			},
			render(index, order) {
				let el = host.children[order] as HTMLElement | undefined;
				if (!el) {
					el = document.createElement('div');
					host.append(el);
				}
				el.style.display = 'flex';
				el.style.alignItems = 'center';
				el.style.justifyContent = 'center';
				el.style.border = '1px solid';
				el.style.borderRadius = '8px';
				el.style.padding = '8px 4px';
				el.style.flexShrink = '0';
				el.style.width = `${sizes[index]}px`;
				el.style.height = '48px';
				el.textContent = `${index}`;
				return el;
			},
		}).subscribe(record(events));

		try {
			await waitForScrollable(scrollElement, 'x');

			scrollElement.scrollLeft =
				scrollElement.scrollWidth - scrollElement.clientWidth;
			await dispatchScroll(scrollElement, events);
			const end = events.at(-1);
			const endScrollLeft = scrollElement.scrollLeft;
			const endVisible = Array.from(host.children).filter(
				(el): el is HTMLElement => (el as HTMLElement).style.display !== 'none',
			);
			const endLastItem = endVisible.at(-1);
			t.assert(end, 'Missing end render event');
			t.assert(endLastItem, 'Missing end last item');
			const endLastText = endLastItem.textContent;

			scrollElement.scrollLeft = Math.max(
				endScrollLeft - scrollElement.clientWidth,
				0,
			);
			await dispatchScroll(scrollElement, events);
			const left = events.at(-1);
			const leftScrollLeft = scrollElement.scrollLeft;
			t.assert(left, 'Missing left render event');
			const settledScrollLeft = scrollElement.scrollLeft;

			t.equal(end.end, sizes.length);
			t.equal(endLastText, `${sizes.length - 1}`);
			t.ok(leftScrollLeft < endScrollLeft);
			t.equal(settledScrollLeft, leftScrollLeft);
			t.ok(left.start <= end.start);
		} finally {
			sub.unsubscribe();
		}
	});

	a.test('keeps the correct trailing items visible at the end', async (t: TestApi) => {
		const container = t.dom;
		keepVisible(container);
		const scrollElement = document.createElement('div');
		const host = document.createElement('div');
		const calls: number[] = [];
		const events: Array<{
			start: number;
			end: number;
			totalSize: number;
			count: number;
			offset: number;
		}> = [];
		const sizes = Array.from({ length: 10 }, (_, i) => (i < 6 ? 100 : 20));
		const positions = positionsFor(sizes);

		container.innerHTML = '';
		container.appendChild(scrollElement);
		scrollElement.style.height = '100px';
		scrollElement.style.overflow = 'auto';
		scrollElement.style.position = 'relative';
		scrollElement.appendChild(host);

		const sub = virtualScroll({
			host,
			scrollElement,
			dataLength: sizes.length,
			render: (index, _order, _type) => {
				calls.push(index);
				return {
					offsetTop: valueAt(positions, index),
					offsetLeft: valueAt(positions, index),
					offsetHeight: valueAt(sizes, index),
					offsetWidth: valueAt(sizes, index),
				};
			},
		}).subscribe(record(events));

		try {
			await waitForScrollable(scrollElement);
			calls.length = 0;

			scrollElement.scrollTop =
				scrollElement.scrollHeight - scrollElement.clientHeight;
			await dispatchScroll(scrollElement, events);

			const last = events.at(-1);
			t.assert(last, 'Missing end render event');
			t.equal(last.end, 10);
			t.ok(last.start <= 6);
			t.ok(last.count >= 4);
			t.equal(last.offset, -580);
			t.equal(host.style.translate, '0px');
			t.equal(
				(scrollElement.lastElementChild as HTMLElement | null)?.style.height,
				`${last.totalSize}px`,
			);
			t.equal(JSON.stringify(calls.slice(-4)), JSON.stringify([6, 7, 8, 9]));
		} finally {
			sub.unsubscribe();
		}
	});

	a.test('preserves the measured item anchor before the real end', async (t: TestApi) => {
		const container = t.dom;
		keepVisible(container);
		const scrollElement = document.createElement('div');
		const host = document.createElement('div');
		const events: Array<{
			start: number;
			end: number;
			totalSize: number;
			count: number;
			offset: number;
		}> = [];
		const sizes = [120, 120, 120, 120, 20, 20, 20, 20, 20, 20];
		const positions = positionsFor(sizes);

		container.innerHTML = '';
		container.appendChild(scrollElement);
		scrollElement.style.height = '100px';
		scrollElement.style.overflow = 'auto';
		scrollElement.style.position = 'relative';
		scrollElement.appendChild(host);

		const sub = virtualScroll({
			host,
			scrollElement,
			dataLength: sizes.length,
			render: index => ({
				offsetTop: valueAt(positions, index),
				offsetLeft: valueAt(positions, index),
				offsetHeight: valueAt(sizes, index),
				offsetWidth: valueAt(sizes, index),
			}),
		}).subscribe(record(events));

		try {
			await waitForScrollable(scrollElement);

			const eventCount = events.length;
			scrollElement.scrollTop = 300;
			await dispatchScroll(scrollElement, events);

			const last = events.at(-1);
			t.assert(last, 'Missing render event');
			const correctedEvents = events.slice(eventCount);
			t.equal(scrollElement.scrollTop, 370);
			t.ok(
				scrollElement.scrollTop <
					scrollElement.scrollHeight - scrollElement.clientHeight,
			);
			t.ok(correctedEvents.length > 0);
			t.ok(correctedEvents.every(event => event.start === 5));
			t.equal(last.end, 10);
			t.equal(last.totalSize, 471);
			t.equal(last.count, 5);
			t.equal(last.offset, -30);
			t.equal(host.style.translate, '0px -30px');
		} finally {
			sub.unsubscribe();
		}
	});

	a.test('pins the last item to the bottom when the estimate is too large', async (t: TestApi) => {
		const container = t.dom;
		keepVisible(container);
		const scrollElement = document.createElement('div');
		const host = document.createElement('div');
		const events: Array<{
			start: number;
			end: number;
			totalSize: number;
			count: number;
			offset: number;
		}> = [];
		const sizes = [100, 100, 20, 20, 20, 20, 20, 20, 20, 20];
		const positions = positionsFor(sizes);

		container.innerHTML = '';
		container.appendChild(scrollElement);
		scrollElement.style.height = '100px';
		scrollElement.style.overflow = 'auto';
		scrollElement.style.position = 'relative';
		scrollElement.appendChild(host);

		const sub = virtualScroll({
			host,
			scrollElement,
			dataLength: sizes.length,
			render: index => ({
				offsetTop: valueAt(positions, index),
				offsetLeft: valueAt(positions, index),
				offsetHeight: valueAt(sizes, index),
				offsetWidth: valueAt(sizes, index),
			}),
		}).subscribe(record(events));

		try {
			await waitForScrollable(scrollElement);

			scrollElement.scrollTop =
				scrollElement.scrollHeight - scrollElement.clientHeight;
			await dispatchScroll(scrollElement, events);

			const last = events.at(-1);
			t.assert(last, 'Missing end render event');
			t.equal(last.end, 10);
			t.equal(last.offset, -260);
			t.equal(host.style.translate, '0px');
			t.equal(
				(scrollElement.lastElementChild as HTMLElement | null)?.style.height,
				`${last.totalSize}px`,
			);
		} finally {
			sub.unsubscribe();
		}
	});

	a.test('uses the refreshed data length for end handling', async (t: TestApi) => {
		const container = t.dom;
		keepVisible(container);
		const scrollElement = document.createElement('div');
		const host = document.createElement('div');
		const refresh = subject<void | { dataLength: number }>();
		const events: Array<{
			start: number;
			end: number;
			atEnd: boolean;
		}> = [];

		container.innerHTML = '';
		container.append(scrollElement);
		scrollElement.style.height = '100px';
		scrollElement.style.overflow = 'auto';
		scrollElement.style.position = 'relative';
		scrollElement.append(host);
		host.style.display = 'flex';
		host.style.flexDirection = 'column';

		const sub = virtualScroll({
			host,
			scrollElement,
			dataLength: 4,
			refresh,
			remove(order) {
				for (let i = order; i < host.children.length; i++) {
					const el = host.children[i] as HTMLElement | undefined;
					if (el) el.style.display = 'none';
				}
			},
			render(index, order) {
				let el = host.children[order] as HTMLElement | undefined;
				if (!el) {
					el = document.createElement('div');
					host.append(el);
				}
				el.style.display = 'block';
				el.style.boxSizing = 'border-box';
				el.style.flexShrink = '0';
				el.style.height = '40px';
				el.textContent = `${index}`;
				return el;
			},
		}).subscribe(record(events));

		async function scrollToEnd(expectedEnd: number) {
			await waitForScrollable(scrollElement);
			for (let i = 0; i < 10 && events.at(-1)?.end !== expectedEnd; i++) {
				scrollElement.scrollTop =
					scrollElement.scrollHeight - scrollElement.clientHeight;
				await dispatchScroll(scrollElement, events);
			}
		}

		try {
			await waitForScrollable(scrollElement);
			refresh.next({ dataLength: 8 });
			await scrollToEnd(8);

			let last = events.at(-1);
			let visible = Array.from(host.children).filter(
				(el): el is HTMLElement =>
					(el as HTMLElement).style.display !== 'none',
			);
			let lastItem = visible.at(-1);
			t.assert(last && lastItem, 'Missing grown end range');
			t.equal(last.end, 8);
			t.equal(lastItem.textContent, '7');
			t.equal(host.style.translate, '0px');

			refresh.next({ dataLength: 3 });
			await scrollToEnd(3);

			last = events.at(-1);
			visible = Array.from(host.children).filter(
				(el): el is HTMLElement =>
					(el as HTMLElement).style.display !== 'none',
			);
			lastItem = visible.at(-1);
			t.assert(last && lastItem, 'Missing shrunk end range');
			t.equal(last.end, 3);
			t.equal(lastItem.textContent, '2');
			t.equal(host.style.translate, '0px');
		} finally {
			sub.unsubscribe();
		}
	});

	a.test('does not snap when the final item renders before native end', async (t: TestApi) => {
		const container = t.dom;
		keepVisible(container);
		const scrollElement = document.createElement('div');
		const host = document.createElement('div');
		const sizes = [100, 100, 20, 20, 20, 20, 20, 20, 20, 20];
		const events: Array<{
			end: number;
			atEnd: boolean;
		}> = [];

		container.innerHTML = '';
		container.append(scrollElement);
		scrollElement.style.height = '100px';
		scrollElement.style.overflow = 'auto';
		scrollElement.style.position = 'relative';
		scrollElement.append(host);

		const sub = virtualScroll({
			host,
			scrollElement,
			dataLength: sizes.length,
			remove(order) {
				const el = host.children[order] as HTMLElement | undefined;
				if (el) el.style.display = 'none';
			},
			render(index, order) {
				let el = host.children[order] as HTMLElement | undefined;
				if (!el) {
					el = document.createElement('div');
					host.append(el);
				}
				el.style.display = 'block';
				el.style.height = `${sizes[index]}px`;
				return el;
			},
		}).subscribe(record(events));

		try {
			await waitForScrollable(scrollElement);
			const nativeEnd =
				scrollElement.scrollHeight - scrollElement.clientHeight;
			const requested = Math.max(nativeEnd - 50, 0);
			const eventCount = events.length;
			scrollElement.scrollTop = requested;
			await dispatchScroll(scrollElement, events);
			await waitFor(() => events.length > eventCount);

			const last = events.at(-1);
			t.assert(last, 'Missing near-end range');
			t.equal(last.end, sizes.length);
			t.ok(!last.atEnd);
			t.ok(scrollElement.scrollTop <= requested);
			t.ok(
				scrollElement.scrollTop <
					scrollElement.scrollHeight - scrollElement.clientHeight,
			);
		} finally {
			sub.unsubscribe();
		}
	});

	a.test('backfills tiny trailing items to cover the viewport', async (t: TestApi) => {
		const container = t.dom;
		keepVisible(container);
		const scrollElement = document.createElement('div');
		const host = document.createElement('div');
		const sizes = Array.from({ length: 30 }, (_, index) =>
			index < 10 ? 100 : 1,
		);
		const positions = positionsFor(sizes);
		const events: Array<{
			start: number;
			end: number;
		}> = [];

		container.innerHTML = '';
		container.append(scrollElement);
		scrollElement.style.height = '100px';
		scrollElement.style.overflow = 'auto';
		scrollElement.style.position = 'relative';
		scrollElement.append(host);

		const sub = virtualScroll({
			host,
			scrollElement,
			dataLength: sizes.length,
			render: index => ({
				offsetTop: valueAt(positions, index),
				offsetLeft: valueAt(positions, index),
				offsetHeight: valueAt(sizes, index),
				offsetWidth: valueAt(sizes, index),
			}),
		}).subscribe(record(events));

		try {
			await waitForScrollable(scrollElement);
			const eventCount = events.length;
			scrollElement.scrollTop =
				scrollElement.scrollHeight - scrollElement.clientHeight;
			await dispatchScroll(scrollElement, events);
			await waitFor(() => events.length > eventCount);

			const last = events.at(-1);
			t.assert(last, 'Missing tiny-tail range');
			const covered =
				valueAt(positions, -1) +
				valueAt(sizes, -1) -
				valueAt(positions, last.start);
			t.equal(last.end, sizes.length);
			t.ok(covered >= scrollElement.clientHeight);
		} finally {
			sub.unsubscribe();
		}
	});

	a.test('includes item gaps in mid-list fractional offsets', async (t: TestApi) => {
		const container = t.dom;
		keepVisible(container);
		const scrollElement = document.createElement('div');
		const host = document.createElement('div');
		const events: Array<{ offset: number }> = [];

		container.innerHTML = '';
		container.append(scrollElement);
		scrollElement.style.height = '100px';
		scrollElement.style.overflow = 'auto';
		scrollElement.style.position = 'relative';
		scrollElement.append(host);

		const sub = virtualScroll({
			host,
			scrollElement,
			dataLength: 20,
			render: index => ({
				offsetTop: index * 50,
				offsetLeft: index * 50,
				offsetHeight: 40,
				offsetWidth: 40,
			}),
		}).subscribe(record(events));

		try {
			await waitForScrollable(scrollElement);
			const eventCount = events.length;
			scrollElement.scrollTop = 125;
			await dispatchScroll(scrollElement, events);
			await waitFor(() => events.length > eventCount);

			const last = events.at(-1);
			t.assert(last, 'Missing gapped range');
			t.equal(last.offset, -75);
		} finally {
			sub.unsubscribe();
		}
	});

	a.test(
		'jumps to a large variable-size range without scanning records',
		async (t: TestApi) => {
		const container = t.dom;
		keepVisible(container);
		const scrollElement = document.createElement('div');
		const host = document.createElement('div');
		const events: Array<{ start: number; totalSize: number }> = [];
		let calls = 0;

		container.innerHTML = '';
		container.append(scrollElement);
		scrollElement.style.height = '100px';
		scrollElement.style.overflow = 'auto';
		scrollElement.style.position = 'relative';
		scrollElement.append(host);

		const sub = virtualScroll({
			host,
			scrollElement,
			dataLength: 1_000_000,
			estimateSize: 20,
			render(index) {
				calls++;
				return {
					offsetTop: index * 20,
					offsetLeft: index * 20,
					offsetHeight: 20,
					offsetWidth: 20,
				};
			},
		}).subscribe(record(events));

		try {
			await waitForScrollable(scrollElement);
			calls = 0;
			const eventCount = events.length;
			scrollElement.scrollTop =
				(scrollElement.scrollHeight - scrollElement.clientHeight) / 2;
			await dispatchScroll(scrollElement, events);
			await waitFor(() => events.length > eventCount);

			const last = events.at(-1);
			t.assert(last, 'Missing large-range event');
			t.ok(last.start > 490_000 && last.start < 510_000);
			t.equal(last.totalSize, 5_000_000);
			t.ok(calls < 20);
		} finally {
			sub.unsubscribe();
		}
	});

	a.test(
		'preserves the anchor when resetFrom invalidates its predecessor',
		async (t: TestApi) => {
		const container = t.dom;
		keepVisible(container);
		const scrollElement = document.createElement('div');
		const host = document.createElement('div');
		const refresh = subject<
			void | { dataLength: number; resetFrom?: number }
		>();
		const sizes = Array.from({ length: 100 }, () => 50);
		const events: Array<{ start: number; offset: number }> = [];
		const position = (index: number) =>
			sizes
				.slice(0, index)
				.reduce((total, current) => total + current, 0);

		container.innerHTML = '';
		container.append(scrollElement);
		scrollElement.style.height = '100px';
		scrollElement.style.overflow = 'auto';
		scrollElement.style.position = 'relative';
		scrollElement.append(host);

		const sub = virtualScroll({
			host,
			scrollElement,
			dataLength: sizes.length,
			refresh,
			render(index) {
				const offset = position(index);
				return {
					offsetTop: offset,
					offsetLeft: offset,
					offsetHeight: valueAt(sizes, index),
					offsetWidth: valueAt(sizes, index),
				};
			},
		}).subscribe(record(events));

		try {
			await waitForScrollable(scrollElement);
			let eventCount = events.length;
			scrollElement.scrollTop = 2_500;
			await dispatchScroll(scrollElement, events);
			await waitFor(() => events.length > eventCount);

			t.equal(events.at(-1)?.start, 50);
			sizes[49] = 100;
			eventCount = events.length;
			refresh.next({ dataLength: sizes.length, resetFrom: 49 });
			await waitFor(() => events.length > eventCount);

			const refreshed = events.slice(eventCount);
			t.ok(refreshed.length > 0);
			t.ok(refreshed.every(event => event.start === 50));
			t.equal(events.at(-1)?.offset, -100);
			t.equal(scrollElement.scrollTop, 2_550);
		} finally {
			sub.unsubscribe();
		}
	});

	a.test(
		'does not drift across alternating and clustered size extremes',
		async (t: TestApi) => {
		const container = t.dom;
		keepVisible(container);
		const scrollElement = document.createElement('div');
		const host = document.createElement('div');
		const refresh = subject<void | { dataLength: number }>();
		const sizes = Array.from({ length: 200 }, (_, index) =>
			index < 100
				? index % 2 === 0
					? 16
					: 96
				: index % 20 < 10
					? 16
					: 96,
		);
		const positions = positionsFor(sizes);
		const events: Array<{ start: number; offset: number }> = [];
		let calls = 0;

		container.innerHTML = '';
		container.append(scrollElement);
		scrollElement.style.height = '160px';
		scrollElement.style.overflow = 'auto';
		scrollElement.style.position = 'relative';
		scrollElement.append(host);

		const sub = virtualScroll({
			host,
			scrollElement,
			dataLength: sizes.length,
			estimateSize: 56,
			refresh,
			render(index) {
				calls++;
				return {
					offsetTop: valueAt(positions, index),
					offsetLeft: valueAt(positions, index),
					offsetHeight: valueAt(sizes, index),
					offsetWidth: valueAt(sizes, index),
				};
			},
		}).subscribe(record(events));

		try {
			await waitForScrollable(scrollElement);
			calls = 0;
			for (const ratio of [0.15, 0.75, 0.35, 0.9, 0.2]) {
				let eventCount = events.length;
				scrollElement.scrollTop =
					(scrollElement.scrollHeight - scrollElement.clientHeight) * ratio;
				await dispatchScroll(scrollElement, events);
				await waitFor(() => events.length > eventCount);

				const stable = events.at(-1);
				t.assert(stable, 'Missing clustered-size event');
				eventCount = events.length;
				refresh.next();
				await waitFor(() => events.length > eventCount);

				const repeated = events.at(-1);
				t.assert(repeated, 'Missing repeated range event');
				t.equal(repeated.start, stable.start);
				t.ok(Math.abs(repeated.offset - stable.offset) < 0.01);
			}
			t.ok(calls < 400);
		} finally {
			sub.unsubscribe();
		}
	});

	a.test('normalizes horizontal RTL scrolling', async (t: TestApi) => {
		const container = t.dom;
		keepVisible(container);
		const scrollElement = document.createElement('div');
		const host = document.createElement('div');
		const events: Array<{ end: number }> = [];
		const sizes = [40, 60, 32, 72, 48, 80, 36, 68];

		container.innerHTML = '';
		container.append(scrollElement);
		scrollElement.dir = 'rtl';
		scrollElement.style.width = '100px';
		scrollElement.style.height = '60px';
		scrollElement.style.overflow = 'auto';
		scrollElement.style.position = 'relative';
		scrollElement.append(host);
		host.style.display = 'flex';
		host.style.flexDirection = 'row';

		const sub = virtualScroll({
			host,
			scrollElement,
			axis: 'x',
			dataLength: sizes.length,
			remove(order) {
				for (; order < host.children.length; order++) {
					const el = host.children[order] as HTMLElement | undefined;
					if (el) el.style.display = 'none';
				}
			},
			render(index, order) {
				let el = host.children[order] as HTMLElement | undefined;
				if (!el) {
					el = document.createElement('div');
					host.append(el);
				}
				el.style.display = 'block';
				el.style.flexShrink = '0';
				el.style.width = `${sizes[index]}px`;
				el.textContent = `${index}`;
				return el;
			},
		}).subscribe(record(events));

		try {
			await waitFor(() => scrollElement.scrollWidth > scrollElement.clientWidth);
			const eventCount = events.length;
			scrollElement.scrollLeft = -(
				scrollElement.scrollWidth - scrollElement.clientWidth
			);
			await dispatchScroll(scrollElement, events);
			await waitFor(
				() =>
					events.length > eventCount &&
					events.at(-1)?.end === sizes.length,
			);

			t.equal(events.at(-1)?.end, sizes.length);
			t.ok(scrollElement.scrollLeft <= 0);
		} finally {
			sub.unsubscribe();
		}
	});

	a.test('coalesces invalidation bursts into one frame', async (t: TestApi) => {
		const container = t.dom;
		keepVisible(container);
		const scrollElement = document.createElement('div');
		const spacer = document.createElement('div');
		const refresh = subject<void>();
		const events: Array<{ start: number }> = [];
		let calls = 0;

		container.append(scrollElement);
		scrollElement.style.height = '100px';
		scrollElement.style.overflow = 'auto';
		spacer.style.height = '2000px';
		scrollElement.append(spacer);

		const sub = virtualScrollRender({
			scrollElement,
			dataLength: 100,
			refresh,
			render: index => {
				calls++;
				return {
					offsetTop: index * 20,
					offsetLeft: index * 20,
					offsetHeight: 20,
					offsetWidth: 20,
				};
			},
		}).subscribe(record(events));

		try {
			await waitFor(() => events.length > 0);
			const eventCount = events.length;
			calls = 0;
			for (let i = 0; i < 100; i++) {
				scrollElement.scrollTop = i * 10;
				scrollElement.dispatchEvent(new Event('scroll'));
			}
			refresh.next();
			refresh.next();
			await waitFor(() => events.length > eventCount);
			t.equal(events.length, eventCount + 1);
			t.ok(calls < 20);
		} finally {
			sub.unsubscribe();
		}
	});

	a.test('defers hidden refreshes until visible', async (t: TestApi) => {
		const scrollElement = document.createElement('div');
		const refresh = subject<void>();
		let calls = 0;

		scrollElement.style.height = '100px';
		const sub = virtualScrollRender({
			scrollElement,
			dataLength: 10,
			refresh,
			render: index => {
				calls++;
				return {
					offsetTop: index * 20,
					offsetLeft: index * 20,
					offsetHeight: 20,
					offsetWidth: 20,
				};
			},
		}).subscribe();

		try {
			refresh.next();
			refresh.next();
			t.equal(calls, 0);

			keepVisible(t.dom);
			t.dom.append(scrollElement);
			await waitFor(() => calls > 0);
		} finally {
			sub.unsubscribe();
		}
	});

	a.test('biases pixel overscan toward the scroll direction', async (t: TestApi) => {
		const container = t.dom;
		keepVisible(container);
		const scrollElement = document.createElement('div');
		const spacer = document.createElement('div');
		const events: Array<{ start: number; end: number }> = [];

		container.append(scrollElement);
		scrollElement.style.height = '100px';
		scrollElement.style.overflow = 'auto';
		spacer.style.height = '2000px';
		scrollElement.append(spacer);

		const sub = virtualScrollRender({
			scrollElement,
			dataLength: 100,
			estimateSize: 20,
			overscan: 100,
			render: index => ({
				offsetTop: index * 20,
				offsetLeft: index * 20,
				offsetHeight: 20,
				offsetWidth: 20,
			}),
		}).subscribe(record(events));

		try {
			await waitFor(() => events.length > 0);
			scrollElement.scrollTop = 400;
			await dispatchScroll(scrollElement, events);
			const forward = events.at(-1);
			t.assert(forward, 'Missing forward overscan event');
			t.ok(forward.start * 20 <= 375);
			t.ok(forward.end * 20 >= 575);

			scrollElement.scrollTop = 200;
			await dispatchScroll(scrollElement, events);
			const backward = events.at(-1);
			t.assert(backward, 'Missing backward overscan event');
			t.ok(backward.start * 20 <= 125);
			t.ok(backward.end * 20 >= 325);
		} finally {
			sub.unsubscribe();
		}
	});

	a.test('keeps variable-size overscan aligned with the viewport', async (t: TestApi) => {
		const container = t.dom;
		keepVisible(container);
		const scrollElement = document.createElement('div');
		const host = document.createElement('div');
		const events: Array<{ start: number }> = [];
		const sizes = Array.from({ length: 100 }, (_, index) =>
			index % 2 === 0 ? 20 : 80,
		);

		container.append(scrollElement);
		scrollElement.style.height = '100px';
		scrollElement.style.overflow = 'auto';
		scrollElement.style.position = 'relative';
		scrollElement.append(host);
		host.style.display = 'flex';
		host.style.flexDirection = 'column';

		const sub = virtualScroll({
			host,
			scrollElement,
			dataLength: sizes.length,
			estimateSize: 50,
			overscan: 100,
			remove(order) {
				for (; order < host.children.length; order++) {
					const item = host.children[order] as HTMLElement | undefined;
					if (item) item.style.display = 'none';
				}
			},
			render(index, order) {
				let item = host.children[order] as HTMLElement | undefined;
				if (!item) {
					item = document.createElement('div');
					host.append(item);
				}
				item.style.display = 'block';
				item.style.flexShrink = '0';
				item.style.height = `${valueAt(sizes, index)}px`;
				return item;
			},
		}).subscribe(record(events));

		try {
			await waitForScrollable(scrollElement);
			scrollElement.scrollTop = 1000;
			await dispatchScroll(scrollElement, events);
			const viewport = scrollElement.getBoundingClientRect();
			const renderedItems = Array.from(host.children).filter(
				(item): item is HTMLElement =>
					(item as HTMLElement).style.display !== 'none',
			);
			const first = renderedItems.at(0)?.getBoundingClientRect();
			const last = renderedItems.at(-1)?.getBoundingClientRect();
			t.assert(first && last, 'Missing overscanned items');
			t.ok(first.top <= viewport.top);
			t.ok(last.bottom >= viewport.bottom);
		} finally {
			sub.unsubscribe();
		}
	});

	a.test('batches render writes before geometry reads', async (t: TestApi) => {
		const container = t.dom;
		keepVisible(container);
		const scrollElement = document.createElement('div');
		const operations: string[] = [];

		container.append(scrollElement);
		scrollElement.style.height = '100px';

		const sub = virtualScrollRender({
			scrollElement,
			dataLength: 10,
			render(index) {
				operations.push(`write:${index}`);
				return {
					get offsetTop() {
						operations.push(`read:${index}`);
						return index * 50;
					},
					get offsetLeft() {
						return index * 50;
					},
					get offsetHeight() {
						operations.push(`read:${index}`);
						return 50;
					},
					get offsetWidth() {
						return 50;
					},
				};
			},
		}).subscribe();

		try {
			await waitFor(() => operations.some(value => value.startsWith('read:')));
			const firstRead = operations.findIndex(value => value.startsWith('read:'));
			t.ok(firstRead > 0);
			t.ok(
				operations
					.slice(firstRead)
					.every(value => !value.startsWith('write:')),
			);
		} finally {
			sub.unsubscribe();
		}
	});

	a.test('remeasures resized rendered items', async (t: TestApi) => {
		const container = t.dom;
		keepVisible(container);
		const scrollElement = document.createElement('div');
		const host = document.createElement('div');
		const events: Array<{ totalSize: number }> = [];
		const calls: number[] = [];
		const sizes = Array.from({ length: 10 }, () => 50);

		container.append(scrollElement);
		scrollElement.style.height = '100px';
		scrollElement.style.overflow = 'auto';
		scrollElement.append(host);
		host.style.display = 'flex';
		host.style.flexDirection = 'column';

		const sub = virtualScroll({
			host,
			scrollElement,
			dataLength: sizes.length,
			render(index, order) {
				calls.push(index);
				let item = host.children[order] as HTMLElement | undefined;
				if (!item) {
					item = document.createElement('div');
					host.append(item);
				}
				item.style.flexShrink = '0';
				item.style.height = `${valueAt(sizes, index)}px`;
				return item;
			},
		}).subscribe(record(events));

		try {
			await waitFor(() => events.length > 0);
			const eventCount = events.length;
			calls.length = 0;
			sizes[0] = 80;
			const first = host.firstElementChild as HTMLElement | null;
			t.assert(first, 'Missing first rendered item');
			first.style.height = '80px';
			await waitFor(() => events.length > eventCount);
			t.equal(events.at(-1)?.totalSize, 530);
			t.ok(calls.length > 0);
			t.ok(calls.every(index => index < 4));
		} finally {
			sub.unsubscribe();
		}
	});

	a.test('shares setup and restores owned styles on final unsubscribe', (t: TestApi) => {
		const scrollElement = document.createElement('div');
		const host = document.createElement('div');

		scrollElement.append(host);
		host.style.position = 'relative';
		host.style.top = '4px';
		host.style.left = '6px';
		host.style.translate = '2px 3px';
		const observable = virtualScroll({
			host,
			scrollElement,
			dataLength: 10,
			render: index => ({
				offsetTop: index * 20,
				offsetLeft: index * 20,
				offsetHeight: 20,
				offsetWidth: 20,
			}),
		});

		t.equal(scrollElement.children.length, 1);
		t.equal(host.style.position, 'relative');
		const first = observable.subscribe();
		const second = observable.subscribe();
		t.equal(scrollElement.children.length, 2);
		first.unsubscribe();
		t.equal(scrollElement.children.length, 2);
		second.unsubscribe();
		t.equal(scrollElement.children.length, 1);
		t.equal(host.style.position, 'relative');
		t.equal(host.style.top, '4px');
		t.equal(host.style.left, '6px');
		t.equal(host.style.translate, '2px 3px');
		const third = observable.subscribe();
		t.equal(scrollElement.children.length, 2);
		third.unsubscribe();
		t.equal(scrollElement.children.length, 1);
		t.equal(host.style.position, 'relative');
	});
});
