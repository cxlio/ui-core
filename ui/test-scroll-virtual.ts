import { spec } from '@cxl/spec';
import { virtualScroll } from './scroll-virtual.js';

export default spec('scroll-virtual', a => {
	a.test('throws when scrollElement cannot be resolved', t => {
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

	a.test('renders with the real browser DOM', async t => {
		const frame = () =>
			new Promise<void>(resolve => requestAnimationFrame(() => resolve()));
		const settle = async () => {
			await new Promise(resolve => setTimeout(resolve, 0));
			await frame();
			await frame();
		};
		const waitForEvent = async (count: number) => {
			for (let i = 0; i < 10 && events.length < count; i++) await frame();
		};
		const container = t.dom;
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

			scrollElement.scrollTop = 0;
			scrollElement.dispatchEvent(new Event('scroll'));
			await waitForEvent(1);

			const first = events.at(-1);
			if (!first) throw new Error('Missing render event');
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
			if (!second) throw new Error('Missing scrolled render event');
			t.equal(second.start, 2);
			t.equal(second.end, 3);
			t.equal(second.count, 1);
			t.equal(second.offset, -50);
			t.equal(host.style.translate, '0px -50px');
			t.equal(
				JSON.stringify(calls.slice(3)),
				JSON.stringify([
					[1, 0, 'pre'],
					[2, 1, 'on'],
					[3, 2, 'post'],
				]),
			);
			sub.unsubscribe();
			t.equal(scrollElement.children.length, 1);
		} finally {
			sub.unsubscribe();
		}
	});

	a.test('vertical end alignment matches the padded viewport size', async t => {
		const frame = () =>
			new Promise<void>(resolve => requestAnimationFrame(() => resolve()));
		const settle = async () => {
			await new Promise(resolve => setTimeout(resolve, 0));
			await frame();
			await frame();
		};
		const container = t.dom;
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
			if (!last) throw new Error('Missing end render event');
			if (!lastItem) throw new Error('Missing last rendered item');
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

	a.test('keeps the last vertical item exactly at the padded bottom edge', async t => {
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
				const el = host.children[index] as HTMLElement | undefined;
				if (el) el.style.display = 'none';
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
			if (!last) throw new Error('Missing end render event');
			if (!lastItem) throw new Error('Missing last rendered item');
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

	a.test('vertical end alignment with gap matches the padded viewport size', async t => {
		const frame = () =>
			new Promise<void>(resolve => requestAnimationFrame(() => resolve()));
		const settle = async () => {
			await new Promise(resolve => setTimeout(resolve, 0));
			await frame();
			await frame();
		};
		const container = t.dom;
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
			if (!last) throw new Error('Missing end render event');
			if (!lastItem) throw new Error('Missing last rendered item');
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

	a.test('keeps the last vertical item exactly at the padded bottom edge with gap', async t => {
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
				const el = host.children[index] as HTMLElement | undefined;
				if (el) el.style.display = 'none';
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
			if (!last) throw new Error('Missing end render event');
			if (!lastItem) throw new Error('Missing last rendered item');
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

	a.test('keeps the correct trailing items visible at the end', async t => {
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
		const positions = sizes.map((_, i) =>
			sizes.slice(0, i).reduce((sum, size) => sum + size, 0),
		);

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
			if (!last) throw new Error('Missing end render event');
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

	a.test('keeps exact vertical offset values before the real end', async t => {
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
		const positions = sizes.map((_, i) =>
			sizes.slice(0, i).reduce((sum, size) => sum + size, 0),
		);

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

			scrollElement.scrollTop = 300;
			scrollElement.dispatchEvent(new Event('scroll'));

			await frame();
			await frame();

			const last = events.at(-1);
			if (!last) throw new Error('Missing render event');
			t.equal(scrollElement.scrollTop, 300);
			t.equal(scrollElement.scrollTop + scrollElement.clientHeight, 400);
			t.equal(last.start, 4);
			t.equal(last.end, 5);
			t.equal(last.totalSize, 556);
			t.equal(last.count, 1);
			t.equal(last.offset, -203.47826086956528);
			t.equal(host.style.translate, '0px -203.478px');
		} finally {
			sub.unsubscribe();
		}
	});

	a.test('pins the last item to the bottom when the estimate is too large', async t => {
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
		const positions = sizes.map((_, i) =>
			sizes.slice(0, i).reduce((sum, size) => sum + size, 0),
		);

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
			if (!last) throw new Error('Missing end render event');
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
});