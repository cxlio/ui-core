import { spec } from '@cxl/spec';
import { Iframe } from './iframe.js';
import { onThemeChange } from './theme.js';

const frame = () =>
	new Promise<void>(resolve => requestAnimationFrame(() => resolve()));

async function waitFor(condition: () => boolean) {
	for (let i = 0; i < 30 && !condition(); i++) await frame();
}

export default spec('iframe', a => {
	a.test('resizes sandboxed srcdoc content', async a => {
		const iframe = a.element(Iframe);
		iframe.srcdoc = '<div style="height:40px"></div>';
		a.dom.append(iframe);

		await waitFor(() => iframe.getBoundingClientRect().height > 0);

		a.ok(iframe.getBoundingClientRect().height >= 40);
	});

	a.test('ignores resize messages from other windows', async a => {
		const iframe = a.element(Iframe);
		iframe.srcdoc = '<div style="height:40px"></div>';
		a.dom.append(iframe);
		await waitFor(() => iframe.getBoundingClientRect().height > 0);
		const height = iframe.getBoundingClientRect().height;

		window.postMessage({ height: height + 100 }, location.origin);
		await frame();
		await frame();

		a.equal(iframe.getBoundingClientRect().height, height);
	});

	a.test('accepts themes only from the parent window', async a => {
		const iframe = a.element(Iframe);
		const theme = ':root{--iframe-theme:ready}';
		iframe.srcdoc = `<script>
let handledTheme = false;
addEventListener('message', ev => {
	if (handledTheme || ev.data?.theme !== '${theme}') return;
	handledTheme = true;
	const value = name => getComputedStyle(document.documentElement).getPropertyValue(name).trim();
	const waitForTheme = () => {
		if (value('--iframe-theme') !== 'ready') {
			requestAnimationFrame(waitForTheme);
			return;
		}
		const nested = document.createElement('iframe');
		const report = () => parent.postMessage({
			iframeTheme: value('--iframe-theme'),
			forgedTheme: value('--iframe-forged')
		}, '*');
		nested.sandbox = 'allow-scripts';
		nested.srcdoc = "<script>parent.postMessage({theme:':root{--iframe-forged:yes}'},'*')<\\/script>";
		nested.addEventListener('load', () => requestAnimationFrame(() => requestAnimationFrame(report)));
		document.body.append(nested);
	};
	waitForTheme();
});
</script><div style="height:40px"></div>`;
		a.dom.append(iframe);
		await waitFor(() => iframe.getBoundingClientRect().height > 0);

		const report = new Promise<{ iframeTheme: string; forgedTheme: string }>(
			resolve => {
				const listener = (ev: MessageEvent) => {
					if (
						ev.source !== iframe.iframe.contentWindow ||
						!ev.data ||
						typeof ev.data !== 'object' ||
						!Reflect.has(ev.data, 'iframeTheme')
					)
						return;
					window.removeEventListener('message', listener);
					resolve(ev.data as { iframeTheme: string; forgedTheme: string });
				};
				window.addEventListener('message', listener);
			},
		);

		onThemeChange.next({ theme: {}, css: theme });
		const result = await report;
		onThemeChange.next(undefined);

		a.equal(result.iframeTheme, 'ready');
		a.equal(result.forgedTheme, '');
	});
});
