import { spec } from '@cxl/spec';
import { firstValueFrom, subject } from './rx.js';
import { virtualScrollRender } from './scroll-virtual.js';

export default spec('virtual scroll benchmarks', s => {
	s.test('coalesces scroll bursts', async a => {
		const scrollElement = document.createElement('div');
		const spacer = document.createElement('div');
		const rendered = subject<void>();
		const items: HTMLElement[] = [];
		let offset = 0;
		let renderCalls = 0;
		let renderPasses = 0;

		a.dom.style.position = 'fixed';
		a.dom.style.inset = '0';
		a.dom.append(scrollElement);
		scrollElement.style.height = '100px';
		scrollElement.style.overflow = 'auto';
		scrollElement.style.position = 'relative';
		spacer.style.height = '20000px';
		scrollElement.append(spacer);

		const sub = virtualScrollRender({
			scrollElement,
			dataLength: 1000,
			estimateSize: 20,
			overscan: 100,
			render: (index, order) => {
				renderCalls++;
				let item = items[order];
				if (!item) {
					item = document.createElement('div');
					item.style.position = 'absolute';
					item.style.height = '20px';
					item.style.width = '20px';
					items[order] = item;
					scrollElement.append(item);
				}
				item.style.top = `${index * 20}px`;
				return item;
			},
		}).subscribe(() => {
			renderPasses++;
			rendered.next();
		});

		try {
			await firstValueFrom(rendered);
			const frames = new Map<number, FrameRequestCallback>();
			let frameId = 0;
			a.mock(globalThis, 'requestAnimationFrame', callback => {
				frames.set(++frameId, callback);
				return frameId;
			});
			a.mock(globalThis, 'cancelAnimationFrame', id => {
				frames.delete(id);
			});
			const runBurst = () => {
				const passesBefore = renderPasses;
				const callsBefore = renderCalls;
				offset = offset >= 10000 ? 0 : offset + 100;
				scrollElement.scrollTop = offset;
				for (let i = 0; i < 100; i++)
					scrollElement.dispatchEvent(new Event('scroll'));
				const queuedFrames = frames.size;
				const callbacks = [...frames.values()];
				frames.clear();
				const timestamp = performance.now();
				for (const callback of callbacks) callback(timestamp);
				return {
					queuedFrames,
					renderCalls: renderCalls - callsBefore,
					renderPasses: renderPasses - passesBefore,
				};
			};
			const result = runBurst();
			a.equal(result.queuedFrames, 1);
			a.equal(result.renderPasses, 1);
			a.ok(result.renderCalls < 20);
			await a.benchmark(runBurst);
		} finally {
			sub.unsubscribe();
		}
	});
});
