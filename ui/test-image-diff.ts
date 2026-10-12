import { spec, type TestApi } from '@cxl/spec';
import {
	ImageDiff,
	create,
	get,
	imageData,
	imageDataDiff,
	imageDiff,
	loadImage,
} from './index.js';

function source(width = 2, height = 1, color = 'black') {
	const canvas = create('canvas', { width, height });
	const context = canvas.getContext('2d');
	if (!context) throw new Error('No rendering context');
	context.fillStyle = color;
	context.fillRect(0, 0, width, height);
	return canvas.toDataURL();
}

function result(host: ImageDiff) {
	return get(host, 'value').filter(value => value !== undefined).map(value => {
		if (!value) throw new Error('Missing comparison');
		return value;
	}).first();
}

function summary(host: ImageDiff, text: string) {
	return new Promise<void>(resolve => {
		const root = host.shadowRoot;
		if (!root) throw new Error('No shadow root');
		const observer = new MutationObserver(() => {
			if (root.querySelector('p')?.textContent !== text) return;
			observer.disconnect();
			resolve();
		});
		observer.observe(root, { childList: true, subtree: true, characterData: true });
	});
}

export default spec('image-diff', a => {
	a.test('compares identical pixels and every RGBA channel', async (a: TestApi) => {
		const pixels = new ImageData(new Uint8ClampedArray([1, 2, 3, 4]), 1, 1);
		const same = await imageDataDiff(pixels, pixels);
		a.equal(same.diffBytes, 0);
		a.equal(same.size, 4);
		a.equalValues(Array.from(same.diff.data), [0, 0, 0, 0]);
		for (let channel = 0; channel < 4; channel++) {
			const changed = new ImageData(new Uint8ClampedArray(pixels.data), 1, 1);
			changed.data[channel] = 0;
			const comparison = await imageDataDiff(pixels, changed);
			a.equal(comparison.diffBytes, 4);
			a.equalValues(Array.from(comparison.diff.data), [255, 0, 0, 255]);
		}
	});

	a.test('aligns unequal dimensions by coordinates', async (a: TestApi) => {
		const comparison = await imageDataDiff(new ImageData(2, 1), new ImageData(1, 2));
		a.equal(comparison.diff.width, 2);
		a.equal(comparison.diff.height, 2);
		a.equal(comparison.size, 16);
		a.equal(comparison.diffBytes, 12);
		a.equalValues(Array.from(comparison.diff.data), [
			0, 0, 0, 0, 255, 0, 0, 255,
			255, 0, 0, 255, 255, 0, 0, 255,
		]);
	});

	a.test('loads image URLs and rejects invalid images', async (a: TestApi) => {
		const url = source();
		a.equal((await loadImage(url)).naturalWidth, 2);
		a.equal((await imageData(url)).height, 1);
		a.equal((await imageDiff(url, url)).diffBytes, 0);
		for (const operation of [loadImage, imageData]) {
			let rejected = false;
			try {
				await operation('data:image/png,invalid');
			} catch {
				rejected = true;
			}
			a.ok(rejected);
		}
		let rejected = false;
		try {
			await imageDiff(url, 'data:image/png,invalid');
		} catch {
			rejected = true;
		}
		a.ok(rejected);
	});

	a.test('registers and renders while hidden without a visibility gate', async (a: TestApi) => {
		const host = document.createElement('c-image-diff');
		a.assert(host instanceof ImageDiff);
		host.src1 = source();
		host.src2 = source(1);
		host.ratio = 0.5;
		host.style.display = 'none';
		a.dom.append(host);
		const value = await result(host);
		a.equal(value.diffBytes, 4);
		const canvas = host.shadowRoot?.querySelector('canvas');
		const text = host.shadowRoot?.querySelector('p');
		a.assert(canvas);
		a.assert(text);
		a.equal(canvas.width, 2);
		a.equal(canvas.height, 1);
		a.equal(canvas.role, 'img');
		a.equal(text.ariaLive, 'polite');
		a.equal(text.textContent, '1 changed pixels (50%) · actual 2×1 · baseline 1×1');
		a.equal(canvas.ariaLabel, text.textContent);
		a.equalValues(Array.from(canvas.getContext('2d')?.getImageData(0, 0, 2, 1).data ?? []), [0, 0, 0, 0, 255, 0, 0, 255]);
	});

	a.test('updates opacity and hiding attributes', (a: TestApi) => {
		const clock = a.mockRequestAnimationFrame();
		const host = a.element(ImageDiff);
		const canvas = host.shadowRoot?.querySelector('canvas');
		a.assert(canvas);
		host.setAttribute('ratio', '0.25');
		a.equal(host.ratio, 0.25);
		clock.advance();
		a.equal(canvas.style.opacity, '0.25');
		host.hidediff = true;
		a.ok(host.hasAttribute('hidediff'));
		a.equal(getComputedStyle(canvas).visibility, 'hidden');
		host.removeAttribute('hidediff');
		a.equal(host.hidediff, false);
	});

	a.test('updates, discards stale comparisons and reconnects', async (a: TestApi) => {
		const host = a.element(ImageDiff);
		const baseline = source();
		host.src1 = baseline;
		host.src2 = baseline;
		a.equal((await result(host)).diffBytes, 0);
		host.src1 = source(2, 1, 'white');
		host.src1 = source(1, 1);
		const value = await result(host);
		a.equal(value.imageA.width, 1);
		a.equal(value.diffBytes, 4);
		host.remove();
		host.src1 = baseline;
		a.dom.append(host);
		a.equal((await result(host)).diffBytes, 0);
		host.src1 = undefined;
		a.equal(host.value, undefined);
		a.equal(host.shadowRoot?.querySelector('canvas')?.width, 0);
		a.equal(host.shadowRoot?.querySelector('p')?.textContent, '');
	});

	a.test('clears errors and recovers when sources are replaced', async (a: TestApi) => {
		const host = a.element(ImageDiff);
		const failed = summary(host, 'Comparison unavailable');
		host.src1 = source();
		host.src2 = 'data:image/png,invalid';
		await failed;
		a.equal(host.value, undefined);
		a.equal(host.shadowRoot?.querySelector('canvas')?.width, 0);
		host.src2 = host.src1;
		a.equal((await result(host)).diffBytes, 0);
	});

	a.figure(
		'ImageDiff',
		`<c-image-diff style="font:16px/20px sans-serif;--cxl-color-on-surface-variant:#444" src1="${source(80, 40, 'black')}" src2="${source(80, 40, 'white')}"></c-image-diff>`,
	)?.catch(error => a.ok(false, String(error)));
});
