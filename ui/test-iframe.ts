import { spec } from '@cxl/spec';
import { Iframe } from './iframe.js';

function waitForHeight(element: Element) {
	return new Promise<void>(resolve => {
		const observer = new ResizeObserver(entries => {
			if (!entries.some(entry => entry.contentRect.height > 0)) return;
			observer.disconnect();
			resolve();
		});
		observer.observe(element);
	});
}

export default spec('iframe', a => {
	a.test('resizes sandboxed srcdoc content', async a => {
		const iframe = a.element(Iframe);
		iframe.srcdoc = '<div style="height:40px"></div>';
		a.dom.append(iframe);

		await waitForHeight(iframe);

		a.ok(iframe.getBoundingClientRect().height >= 40);
	});

	a.test('ignores resize messages from other windows', async a => {
		const iframe = a.element(Iframe);
		iframe.srcdoc = '<div style="height:40px"></div>';
		a.dom.append(iframe);
		await waitForHeight(iframe);
		const height = iframe.getBoundingClientRect().height;
		const message = new Promise<void>(resolve => {
			const listener = (event: MessageEvent) => {
				if (
					event.source !== window ||
					!event.data ||
					typeof event.data !== 'object' ||
					Reflect.get(event.data, 'height') !== height + 100
				)
					return;
				window.removeEventListener('message', listener);
				resolve();
			};
			window.addEventListener('message', listener);
		});

		window.postMessage({ height: height + 100 }, location.origin);
		await message;

		a.equal(iframe.getBoundingClientRect().height, height);
	});
});
