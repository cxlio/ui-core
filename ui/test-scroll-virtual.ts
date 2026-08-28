import { spec, type TestApi } from '@cxl/spec';
import { subject } from './rx.js';
import { virtualScroll, virtualScrollRender } from './scroll-virtual.js';

export default spec('scroll-virtual', a => {
	const frame = () =>
		new Promise<void>(resolve => requestAnimationFrame(() => resolve()));

	function keepVisible(container: HTMLElement) {
		container.style.position = 'fixed';
		container.style.inset = '0';
		container.style.pointerEvents = 'none';
	}

	async function waitFor(condition: () => boolean) {
		for (let i = 0; i < 30 && !condition(); i++) await frame();
	}

	async function waitForScrollable(scrollElement: HTMLElement) {
		await waitFor(
			() => scrollElement.scrollHeight > scrollElement.clientHeight,
		);
	}

	function positionsFor(sizes: number[]) {
		let total = 0;
		return sizes.map(size => {
			const position = total;
			total += size;
			return position;
		});
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
		let renderError: unknown;

		scrollElement.style.position = 'fixed';
		scrollElement.style.inset = '0';
		scrollElement.style.height = '100px';
		scrollElement.style.overflow = 'auto';
		t.dom.append(scrollElement);

		const sub = virtualScrollRender({
			scrollElement,
			dataLength: 1,
			render: () => ({
				offsetTop: 0,
				offsetLeft: 0,
				offsetHeight: Number.NaN,
				offsetWidth: 1,
			}),
		}).subscribe({ error: error => (renderError = error) });

		try {
			await waitFor(() => !!renderError);

			t.ok(renderError instanceof Error);
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
	});

	a.test('renders with the real browser DOM', async (t: TestApi) => {
		const frame = () =>
			new Promise<void>(resolve => requestAnimationFrame(() => resolve()));
		const settle = async () => {
			await new Promise(resolve => setTimeout(resolve, 0));
			await frame();
			await frame();
		};
		const waitForEvent = async (count: number) => {
			for (let i = 0; i < 30 && events.length < count; i++) await frame();
		};
		const container = t.dom;
		keepVisible(container);
		const scrollElement = document.createElement('div');
		const host = document.createElement('div');
		const calls: Array<[number, number, 'pre' | 'post' | 'on']> = [];
		const events: Array<{
			start: number;
			end: number;
			totalSize: number;
			count: number;
			offset: number;
		}> = [];

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
		}).subscribe(ev => events.push(ev));

		try {
			await settle();
			await waitForEvent(1);

			scrollElement.scrollTop = 0;
			scrollElement.dispatchEvent(new Event('scroll'));
			await waitForEvent(1);
			if (!events.length) {
				await settle();
				scrollElement.dispatchEvent(new Event('scroll'));
				await waitForEvent(1);
			}

			const first = events.at(-1);
			t.assert(first, 'Missing render event');
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

			scrollElement.scrollTop = 100;
			scrollElement.dispatchEvent(new Event('scroll'));

			await waitForEvent(2);

			const second = events.at(-1);
			t.assert(second, 'Missing scrolled render event');
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
		const frame = () =>
			new Promise<void>(resolve => requestAnimationFrame(() => resolve()));
		const settle = async () => {
			await new Promise(resolve => setTimeout(resolve, 0));
			await frame();
			await frame();
		};
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
		const waitForScrollable = async () => {
			for (
				let i = 0;
				i < 10 &&
				scrollElement.scrollHeight <= scrollElement.clientHeight;
				i++
			) {
				await frame();
			}
		};

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
		}).subscribe(ev => events.push(ev));

		try {
			await settle();
			await waitForScrollable();

			scrollElement.scrollTop =
				scrollElement.scrollHeight - scrollElement.clientHeight;
			scrollElement.dispatchEvent(new Event('scroll'));

			await frame();
			await frame();

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
		const frame = () =>
			new Promise<void>(resolve => requestAnimationFrame(() => resolve()));
		const settle = async () => {
			await new Promise(resolve => setTimeout(resolve, 0));
			await frame();
			await frame();
		};
		const waitForScrollable = async () => {
			for (
				let i = 0;
				i < 10 &&
				scrollElement.scrollHeight <= scrollElement.clientHeight;
				i++
			) {
				await frame();
			}
		};
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
		}).subscribe(ev => events.push(ev));

		try {
			await settle();
			await waitForScrollable();

			scrollElement.scrollTop =
				scrollElement.scrollHeight - scrollElement.clientHeight;
			scrollElement.dispatchEvent(new Event('scroll'));
			await frame();
			await frame();

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
		const frame = () =>
			new Promise<void>(resolve => requestAnimationFrame(() => resolve()));
		const settle = async () => {
			await new Promise(resolve => setTimeout(resolve, 0));
			await frame();
			await frame();
		};
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
		const waitForScrollable = async () => {
			for (
				let i = 0;
				i < 10 &&
				scrollElement.scrollHeight <= scrollElement.clientHeight;
				i++
			) {
				await frame();
			}
		};

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
		}).subscribe(ev => events.push(ev));

		try {
			await settle();
			await waitForScrollable();

			scrollElement.scrollTop =
				scrollElement.scrollHeight - scrollElement.clientHeight;
			scrollElement.dispatchEvent(new Event('scroll'));

			await frame();
			await frame();

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
		const frame = () =>
			new Promise<void>(resolve => requestAnimationFrame(() => resolve()));
		const settle = async () => {
			await new Promise(resolve => setTimeout(resolve, 0));
			await frame();
			await frame();
		};
		const waitForScrollable = async () => {
			for (
				let i = 0;
				i < 10 &&
				scrollElement.scrollHeight <= scrollElement.clientHeight;
				i++
			) {
				await frame();
			}
		};
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
		}).subscribe(ev => events.push(ev));

		try {
			await settle();
			await waitForScrollable();

			scrollElement.scrollTop =
				scrollElement.scrollHeight - scrollElement.clientHeight;
			scrollElement.dispatchEvent(new Event('scroll'));
			await frame();
			await frame();

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
		const frame = () =>
			new Promise<void>(resolve => requestAnimationFrame(() => resolve()));
		const settle = async () => {
			await new Promise(resolve => setTimeout(resolve, 0));
			await frame();
			await frame();
		};
		const waitForScrollable = async () => {
			for (
				let i = 0;
				i < 10 &&
				scrollElement.scrollHeight <= scrollElement.clientHeight;
				i++
			) {
				await frame();
			}
		};
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
		}).subscribe(ev => events.push(ev));

		try {
			await settle();
			await waitForScrollable();

			scrollElement.scrollTop =
				scrollElement.scrollHeight - scrollElement.clientHeight;
			scrollElement.dispatchEvent(new Event('scroll'));
			await frame();
			await frame();
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
			scrollElement.dispatchEvent(new Event('scroll'));
			await frame();
			await frame();
			const up = events.at(-1);
			const upScrollTop = scrollElement.scrollTop;
			t.assert(up, 'Missing upward render event');
			await frame();
			await frame();
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
			const frame = () =>
				new Promise<void>(resolve => requestAnimationFrame(() => resolve()));
			const settle = async () => {
				await new Promise(resolve => setTimeout(resolve, 0));
				await frame();
				await frame();
			};
			const waitForStableMetrics = async () => {
				let lastTop = scrollElement.scrollTop;
				let lastHeight = scrollElement.scrollHeight;
				for (let i = 0; i < 10; i++) {
					await frame();
					const currentTop = scrollElement.scrollTop;
					const currentHeight = scrollElement.scrollHeight;
					if (currentTop === lastTop && currentHeight === lastHeight) return;
					lastTop = currentTop;
					lastHeight = currentHeight;
				}
			};
			const waitForScrollable = async () => {
				for (
					let i = 0;
					i < 10 &&
					scrollElement.scrollHeight <= scrollElement.clientHeight;
					i++
				) {
					await frame();
				}
			};
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
					offsetTop: positions[index]!,
					offsetLeft: positions[index]!,
					offsetHeight: sizes[index]!,
					offsetWidth: sizes[index]!,
				}),
			}).subscribe(ev => events.push(ev));

			try {
				await settle();
				await waitForScrollable();

				scrollElement.scrollTop =
					scrollElement.scrollHeight - scrollElement.clientHeight;
				scrollElement.dispatchEvent(new Event('scroll'));
				await frame();
				await frame();
				await waitForStableMetrics();
				scrollElement.scrollTop =
					scrollElement.scrollHeight - scrollElement.clientHeight;
				scrollElement.dispatchEvent(new Event('scroll'));
				await frame();
				await frame();
				await waitForStableMetrics();

				scrollElement.scrollTop = Math.max(scrollElement.scrollTop - 10, 0);
				scrollElement.dispatchEvent(new Event('scroll'));
				await frame();
				await frame();
				await waitForStableMetrics();

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
		const frame = () =>
			new Promise<void>(resolve => requestAnimationFrame(() => resolve()));
		const settle = async () => {
			await new Promise(resolve => setTimeout(resolve, 0));
			await frame();
			await frame();
		};
		const waitForScrollable = async () => {
			for (
				let i = 0;
				i < 10 &&
				scrollElement.scrollWidth <= scrollElement.clientWidth;
				i++
			) {
				await frame();
			}
		};
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
		}).subscribe(ev => events.push(ev));

		try {
			await settle();
			await waitForScrollable();

			scrollElement.scrollLeft =
				scrollElement.scrollWidth - scrollElement.clientWidth;
			scrollElement.dispatchEvent(new Event('scroll'));
			await frame();
			await frame();
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
			scrollElement.dispatchEvent(new Event('scroll'));
			await frame();
			await frame();
			const left = events.at(-1);
			const leftScrollLeft = scrollElement.scrollLeft;
			t.assert(left, 'Missing left render event');
			await frame();
			await frame();
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
		const frame = () =>
			new Promise<void>(resolve => requestAnimationFrame(() => resolve()));
		const settle = async () => {
			await new Promise(resolve => setTimeout(resolve, 0));
			await frame();
			await frame();
		};
		const waitForScrollable = async () => {
			for (
				let i = 0;
				i < 10 &&
				scrollElement.scrollHeight <= scrollElement.clientHeight;
				i++
			) {
				await frame();
			}
		};
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
					offsetTop: positions[index]!,
					offsetLeft: positions[index]!,
					offsetHeight: sizes[index]!,
					offsetWidth: sizes[index]!,
				};
			},
		}).subscribe(ev => events.push(ev));

		try {
			await settle();
			await waitForScrollable();
			calls.length = 0;

			scrollElement.scrollTop =
				scrollElement.scrollHeight - scrollElement.clientHeight;
			scrollElement.dispatchEvent(new Event('scroll'));

			await frame();
			await frame();

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
		const frame = () =>
			new Promise<void>(resolve => requestAnimationFrame(() => resolve()));
		const settle = async () => {
			await new Promise(resolve => setTimeout(resolve, 0));
			await frame();
			await frame();
		};
		const waitForScrollable = async () => {
			for (
				let i = 0;
				i < 10 &&
				scrollElement.scrollHeight <= scrollElement.clientHeight;
				i++
			) {
				await frame();
			}
		};
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
				offsetTop: positions[index]!,
				offsetLeft: positions[index]!,
				offsetHeight: sizes[index]!,
				offsetWidth: sizes[index]!,
			}),
		}).subscribe(ev => events.push(ev));

		try {
			await settle();
			await waitForScrollable();

			const eventCount = events.length;
			scrollElement.scrollTop = 300;
			scrollElement.dispatchEvent(new Event('scroll'));

			await frame();
			await frame();

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
		const frame = () =>
			new Promise<void>(resolve => requestAnimationFrame(() => resolve()));
		const settle = async () => {
			await new Promise(resolve => setTimeout(resolve, 0));
			await frame();
			await frame();
		};
		const waitForScrollable = async () => {
			for (
				let i = 0;
				i < 10 &&
				scrollElement.scrollHeight <= scrollElement.clientHeight;
				i++
			) {
				await frame();
			}
		};
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
				offsetTop: positions[index]!,
				offsetLeft: positions[index]!,
				offsetHeight: sizes[index]!,
				offsetWidth: sizes[index]!,
			}),
		}).subscribe(ev => events.push(ev));

		try {
			await settle();
			await waitForScrollable();

			scrollElement.scrollTop =
				scrollElement.scrollHeight - scrollElement.clientHeight;
			scrollElement.dispatchEvent(new Event('scroll'));

			await frame();
			await frame();

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
		const waitForFrames = async (count = 3) => {
			while (count-- > 0) await frame();
		};
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
		}).subscribe(event => events.push(event));

		async function scrollToEnd(expectedEnd: number) {
			await waitForScrollable(scrollElement);
			for (let i = 0; i < 10 && events.at(-1)?.end !== expectedEnd; i++) {
				scrollElement.scrollTop =
					scrollElement.scrollHeight - scrollElement.clientHeight;
				scrollElement.dispatchEvent(new Event('scroll'));
				await waitForFrames(2);
			}
		}

		try {
			await waitForFrames();
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
		}).subscribe(event => events.push(event));

		try {
			await waitForScrollable(scrollElement);
			const nativeEnd =
				scrollElement.scrollHeight - scrollElement.clientHeight;
			const requested = Math.max(nativeEnd - 50, 0);
			const eventCount = events.length;
			scrollElement.scrollTop = requested;
			scrollElement.dispatchEvent(new Event('scroll'));
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
				offsetTop: positions[index]!,
				offsetLeft: positions[index]!,
				offsetHeight: sizes[index]!,
				offsetWidth: sizes[index]!,
			}),
		}).subscribe(event => events.push(event));

		try {
			await waitForScrollable(scrollElement);
			const eventCount = events.length;
			scrollElement.scrollTop =
				scrollElement.scrollHeight - scrollElement.clientHeight;
			scrollElement.dispatchEvent(new Event('scroll'));
			await waitFor(() => events.length > eventCount);

			const last = events.at(-1);
			t.assert(last, 'Missing tiny-tail range');
			const covered =
				positions.at(-1)! + sizes.at(-1)! - positions[last.start]!;
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
		}).subscribe(event => events.push(event));

		try {
			await waitForScrollable(scrollElement);
			const eventCount = events.length;
			scrollElement.scrollTop = 125;
			scrollElement.dispatchEvent(new Event('scroll'));
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
		}).subscribe(event => events.push(event));

		try {
			await waitForScrollable(scrollElement);
			calls = 0;
			const eventCount = events.length;
			scrollElement.scrollTop =
				(scrollElement.scrollHeight - scrollElement.clientHeight) / 2;
			scrollElement.dispatchEvent(new Event('scroll'));
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
					offsetHeight: sizes[index]!,
					offsetWidth: sizes[index]!,
				};
			},
		}).subscribe(event => events.push(event));

		try {
			await waitForScrollable(scrollElement);
			let eventCount = events.length;
			scrollElement.scrollTop = 2_500;
			scrollElement.dispatchEvent(new Event('scroll'));
			await waitFor(() => events.length > eventCount);
			await frame();

			t.equal(events.at(-1)?.start, 50);
			sizes[49] = 100;
			eventCount = events.length;
			refresh.next({ dataLength: sizes.length, resetFrom: 49 });
			await waitFor(() => events.length > eventCount);
			await frame();
			await frame();

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
					offsetTop: positions[index]!,
					offsetLeft: positions[index]!,
					offsetHeight: sizes[index]!,
					offsetWidth: sizes[index]!,
				};
			},
		}).subscribe(event => events.push(event));

		try {
			await waitForScrollable(scrollElement);
			calls = 0;
			for (const ratio of [0.15, 0.75, 0.35, 0.9, 0.2]) {
				let eventCount = events.length;
				scrollElement.scrollTop =
					(scrollElement.scrollHeight - scrollElement.clientHeight) * ratio;
				scrollElement.dispatchEvent(new Event('scroll'));
				await waitFor(() => events.length > eventCount);
				await frame();
				await frame();

				const stable = events.at(-1);
				t.assert(stable, 'Missing clustered-size event');
				eventCount = events.length;
				refresh.next();
				await waitFor(() => events.length > eventCount);
				await frame();

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
		}).subscribe(event => events.push(event));

		try {
			await waitFor(() => scrollElement.scrollWidth > scrollElement.clientWidth);
			const eventCount = events.length;
			scrollElement.scrollLeft = -(
				scrollElement.scrollWidth - scrollElement.clientWidth
			);
			scrollElement.dispatchEvent(new Event('scroll'));
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
});
