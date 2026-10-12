import { spec, type TestApi } from '@cxl/spec';
import {
	ImageDiff,
	create,
	get,
	imageData,
	imageDataDiff,
	imageDiff,
	loadImage,
	type ImageSource,
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

	a.test('normalizes browser image sources without consuming caller resources', async (a: TestApi) => {
		const url = source(2, 1, 'white');
		const pixels = await imageData(url);
		const canvas = create('canvas', { width: 2, height: 1 });
		canvas.getContext('2d')?.putImageData(pixels, 0, 0);
		const offscreen = new OffscreenCanvas(2, 1);
		offscreen.getContext('2d')?.putImageData(pixels, 0, 0);
		const blob = await (await fetch(url)).blob();
		const svgBlob = new Blob(['<svg xmlns="http://www.w3.org/2000/svg" width="2" height="1"><rect width="2" height="1" fill="white"/></svg>'], { type: 'image/svg+xml' });
		const image = await loadImage(url);
		image.width = 20;
		const bitmap = await createImageBitmap(canvas);
		const frame = new VideoFrame(canvas, { timestamp: 0 });
		try {
			const sources: ImageSource[] = [url, pixels, blob, svgBlob, new File([blob], 'image.png'), image, canvas, offscreen, bitmap, frame];
			for (const input of sources) {
				const normalized = await imageData(input);
				a.equal(normalized.width, 2);
				a.equal(normalized.height, 1);
				a.equalValues(Array.from(normalized.data), Array.from(pixels.data));
				a.equal((await imageDiff(input, pixels)).diffBytes, 0);
			}
			a.equal(await imageData(pixels), pixels);
			a.equal(bitmap.width, 2);
			a.equal(frame.displayWidth, 2);
		} finally {
			bitmap.close();
			frame.close();
		}
	});

	a.test('compares object properties and keeps URL attributes working', async (a: TestApi) => {
		const host = a.element(ImageDiff);
		const pixels = await imageData(source());
		host.src1 = pixels;
		host.src2 = pixels;
		a.equal((await result(host)).diffBytes, 0);
		a.equal(host.src1, pixels);
		a.equal(host.hasAttribute('src1'), false);
		host.setAttribute('src1', source(2, 1, 'white'));
		a.equal((await result(host)).diffBytes, 8);
		host.src1 = new ImageData(1, 1);
		host.src1 = pixels;
		a.equal((await result(host)).imageA, pixels);
		host.remove();
		a.dom.append(host);
		a.equal((await result(host)).diffBytes, 0);
		host.removeAttribute('src1');
		a.equal(host.src1, undefined);
		a.equal(host.value, undefined);
	});

	a.test('normalizes SVG images and current video frames', async (a: TestApi) => {
		const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
		const image = document.createElementNS('http://www.w3.org/2000/svg', 'image');
		image.setAttribute('width', '2');
		image.setAttribute('height', '1');
		svg.append(image);
		a.dom.append(svg);
		const url = source(2, 1, 'white');
		await a.waitForEvent(image, 'load', () => image.setAttribute('href', url));
		const canvas = create('canvas', { width: 2, height: 1 });
		canvas.getContext('2d')?.putImageData(await imageData(url), 0, 0);
		const stream = canvas.captureStream(1);
		const video = create('video', { muted: true, srcObject: stream });
		a.dom.append(video);
		try {
			await video.play();
			for (const input of [image, video]) {
				const normalized = await imageData(input);
				a.equal(normalized.width, 2);
				a.equal(normalized.height, 1);
				a.equal((await imageDiff(input, url)).diffBytes, 0);
			}
		} finally {
			video.pause();
			for (const track of stream.getTracks()) track.stop();
			video.srcObject = null;
		}
	});

	a.test('rejects invalid blobs and closed bitmaps', async (a: TestApi) => {
		const bitmap = await createImageBitmap(await imageData(source()));
		bitmap.close();
		for (const input of [new Blob(['invalid'], { type: 'image/png' }), bitmap]) {
			let rejected = false;
			try {
				await imageData(input);
			} catch {
				rejected = true;
			}
			a.ok(rejected);
		}
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
		const canvas = host.shadowRoot?.querySelector<HTMLCanvasElement>('canvas.diff');
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
		const canvas = host.shadowRoot?.querySelector<HTMLCanvasElement>('canvas.diff');
		const images = host.shadowRoot?.querySelectorAll<HTMLCanvasElement>('canvas:not(.diff)');
		a.assert(canvas);
		a.assert(images);
		a.equal(images.length, 2);
		const [actual, baseline] = images;
		a.assert(actual);
		a.assert(baseline);
		host.setAttribute('ratio', '0.25');
		a.equal(host.ratio, 0.25);
		clock.advance();
		a.equal(baseline.style.opacity, '0.25');
		a.equal(getComputedStyle(actual).opacity, '1');
		a.equal(getComputedStyle(canvas).opacity, '1');
		for (const ratio of [0, 1]) {
			host.ratio = ratio;
			clock.advance();
			a.equal(baseline.style.opacity, String(ratio));
			a.equal(getComputedStyle(canvas).opacity, '1');
		}
		host.hidediff = true;
		a.ok(host.hasAttribute('hidediff'));
		a.equal(getComputedStyle(canvas).visibility, 'hidden');
		a.equal(getComputedStyle(actual).visibility, 'visible');
		a.equal(getComputedStyle(baseline).visibility, 'visible');
		host.removeAttribute('hidediff');
		a.equal(host.hidediff, false);
		a.equal(getComputedStyle(canvas).visibility, 'visible');
	});

	a.test('layers source images with a shared scale and updates their sources', async (a: TestApi) => {
		const host = a.element(ImageDiff);
		host.style.width = '200px';
		host.src1 = source(2, 1);
		host.src2 = source(1, 2, 'white');
		const value = await result(host);
		const images = host.shadowRoot?.querySelectorAll<HTMLCanvasElement>('canvas:not(.diff)');
		const canvas = host.shadowRoot?.querySelector<HTMLCanvasElement>('canvas.diff');
		a.assert(images);
		a.assert(canvas);
		const [actual, baseline] = images;
		a.assert(actual);
		a.assert(baseline);
		a.equalValues(Array.from(actual.getContext('2d')?.getImageData(0, 0, 2, 1).data ?? []), Array.from(value.imageA.data));
		a.equalValues(Array.from(baseline.getContext('2d')?.getImageData(0, 0, 1, 2).data ?? []), Array.from(value.imageB.data));
		a.equal(actual.ariaLabel, 'Actual image');
		a.equal(baseline.ariaLabel, 'Baseline image');
		const bounds = canvas.getBoundingClientRect();
		const boundsA = actual.getBoundingClientRect();
		const boundsB = baseline.getBoundingClientRect();
		a.equal(bounds.width, 200);
		a.equal(bounds.height, 200);
		a.equal(boundsA.width, 200);
		a.equal(boundsA.height, 100);
		a.equal(boundsB.width, 100);
		a.equal(boundsB.height, 200);
		for (const image of [actual, baseline]) {
			a.equal(image.getBoundingClientRect().x, bounds.x);
			a.equal(image.getBoundingClientRect().y, bounds.y);
		}
		a.equal(actual.nextElementSibling, baseline);
		a.equal(baseline.nextElementSibling, canvas);
		host.src2 = host.src1;
		a.equal((await result(host)).diffBytes, 0);
		a.equal(baseline.width, 2);
		a.equal(baseline.height, 1);
		a.equal(canvas.getBoundingClientRect().height, 100);
		host.src1 = undefined;
		a.equal(actual.width, 0);
		a.equal(baseline.width, 2);
		a.equal(actual.hidden, true);
		a.equal(baseline.hidden, false);
		a.equal(canvas.getBoundingClientRect().height, 100);
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
		a.equal(host.shadowRoot?.querySelector<HTMLCanvasElement>('canvas.diff')?.width, 0);
		a.equal(host.shadowRoot?.querySelector('p')?.textContent, '');
	});

	a.test('clears errors and recovers when sources are replaced', async (a: TestApi) => {
		const host = a.element(ImageDiff);
		const failed = summary(host, 'Comparison unavailable');
		host.src1 = source();
		host.src2 = 'data:image/png,invalid';
		await failed;
		a.equal(host.value, undefined);
		a.equal(host.shadowRoot?.querySelector<HTMLCanvasElement>('canvas.diff')?.width, 0);
		const actual = host.shadowRoot?.querySelector<HTMLCanvasElement>('canvas:not(.diff)');
		a.assert(actual);
		a.equal(actual.hidden, false);
		a.equal(actual.width, 2);
		host.src2 = host.src1;
		a.equal((await result(host)).diffBytes, 0);
	});

	a.figure(
		'ImageDiff',
		`<c-image-diff style="font:16px/20px sans-serif;--cxl-color-on-surface-variant:#444" src1="${source(80, 40, 'black')}" src2="${source(80, 40, 'white')}"></c-image-diff>`,
	)?.catch(error => a.ok(false, String(error)));

	a.figure(
		'ImageDiffSources',
		'<c-image-diff ratio="0.5" hidediff style="font:16px/20px sans-serif;--cxl-color-on-surface-variant:#444"></c-image-diff>',
		dom => {
			if (!(dom instanceof HTMLElement)) throw new Error('Missing figure element');
			const observer = new MutationObserver(() => {
				const host = dom.querySelector('c-image-diff');
				if (!(host instanceof ImageDiff)) return;
				observer.disconnect();
				const pixels = new ImageData(80, 40);
				for (let i = 0; i < pixels.data.length; i += 4)
					pixels.data[i + 2] = pixels.data[i + 3] = 255;
				const baseline = new OffscreenCanvas(40, 80);
				const context = baseline.getContext('2d');
				if (!context) throw new Error('No rendering context');
				context.fillStyle = 'red';
				context.fillRect(0, 0, 40, 80);
				host.src1 = pixels;
				host.src2 = baseline;
			});
			observer.observe(dom, { childList: true });
		},
	)?.catch(error => a.ok(false, String(error)));
});
