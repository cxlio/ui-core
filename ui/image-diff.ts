import {
	Component,
	attribute,
	component,
	create,
	get,
	getShadow,
	numberAttribute,
	property,
	styleAttribute,
} from './component.js';
import { combineLatest, merge } from './rx.js';
import { css } from './theme.js';

declare module './component.js' {
	interface Components {
		'c-image-diff': ImageDiff;
	}
}

export interface ImageDiffResult {
	imageA: ImageData;
	imageB: ImageData;
	diffBytes: number;
	size: number;
	diff: ImageData;
}

export function loadImage(src: string) {
	return new Promise<HTMLImageElement>((resolve, reject) => {
		const img = new Image();
		img.addEventListener('load', () => resolve(img));
		img.addEventListener('error', () => reject(new Error('Failed to load image')));
		img.src = src;
	});
}

export async function imageData(srcA: string) {
	const A = await loadImage(srcA);
	const canvasEl = create('canvas');
	const ctx = canvasEl.getContext('2d');
	if (!ctx) throw new Error('Could not create context');

	const w = (canvasEl.width = A.width);
	const h = (canvasEl.height = A.height);
	ctx.drawImage(A, 0, 0);
	return ctx.getImageData(0, 0, w, h);
}

export async function imageDataDiff(A: ImageData, B: ImageData) {
	const w = Math.max(A.width, B.width);
	const h = Math.max(A.height, B.height);
	const size = w * h * 4;

	const diff = new Uint8ClampedArray(size);
	let diffBytes = 0;

	for (let y = 0; y < h; y++) {
		for (let x = 0; x < w; x++) {
			const i = (y * w + x) * 4;
			const indexA = (y * A.width + x) * 4;
			const indexB = (y * B.width + x) * 4;
			const match =
				x < A.width &&
				y < A.height &&
				x < B.width &&
				y < B.height &&
				A.data[indexA] === B.data[indexB] &&
				A.data[indexA + 1] === B.data[indexB + 1] &&
				A.data[indexA + 2] === B.data[indexB + 2] &&
				A.data[indexA + 3] === B.data[indexB + 3];
			if (!match) diffBytes += 4;
			diff[i] = diff[i + 3] = match ? 0 : 0xff;
		}
	}

	return {
		imageA: A,
		imageB: B,
		diffBytes,
		size,
		diff: new ImageData(diff, w, h),
	};
}

export async function imageDiff(srcA: string, srcB: string) {
	const [A, B] = await Promise.all([imageData(srcA), imageData(srcB)]);
	return imageDataDiff(A, B);
}

/**
 * Compares two images and displays changed pixels in red with a summary of
 * the changed pixel count, percentage, and image dimensions.
 * Comparisons run when either source changes, including while offscreen.
 * Image URLs must permit reading their pixels through a canvas.
 *
 * @tagName c-image-diff
 * @title Image Difference
 * @icon compare
 */
export class ImageDiff extends Component {
	/**
	 * URL of the actual image to compare.
	 *
	 * @attribute
	 */
	src1?: string;

	/**
	 * URL of the baseline image to compare against.
	 *
	 * @attribute
	 */
	src2?: string;

	/**
	 * Opacity of the difference mask, between 0 and 1. Defaults to 1.
	 *
	 * @attribute
	 */
	ratio = 1;

	/**
	 * Hides the difference mask while preserving its layout and summary.
	 * Defaults to false.
	 *
	 * @attribute
	 */
	hidediff = false;

	/**
	 * Latest comparison result. Undefined while comparing, when either source
	 * is missing, or when the images cannot be compared.
	 */
	value: ImageDiffResult | undefined;
}

component(ImageDiff, {
	tagName: 'c-image-diff',
	init: [
		attribute('src1'),
		attribute('src2'),
		numberAttribute('ratio', 0, 1),
		styleAttribute('hidediff'),
		property('value'),
	],
	augment: [
		css(`
:host { display: block; }
.diff { display: block; height: auto; width: 100%; }
:host([hidediff]) .diff { visibility: hidden; }
.summary {
	color: var(--cxl-color-on-surface-variant);
	font-size: 0.75rem;
	margin: 0;
	padding: 8px 10px;
}
`),
		host => {
			const canvas = create('canvas', {
				className: 'diff',
				role: 'img',
				ariaLabel: 'rendered diff',
			});
			const summary = create('p', {
				className: 'summary',
				ariaLive: 'polite',
			});
			getShadow(host).append(canvas, summary);

			return merge(
				combineLatest(get(host, 'src1'), get(host, 'src2'))
					.switchMap<ImageDiffResult | undefined>(async ([src1, src2]) => {
						host.value = undefined;
						canvas.width = canvas.height = 0;
						canvas.ariaLabel = 'rendered diff';
						summary.textContent = src1 && src2 ? 'Comparing images…' : '';
						if (!src1 || !src2) return undefined;
						try {
							return await imageDiff(src1, src2);
						} catch {
							return undefined;
						}
					})
					.tap(value => {
						if (!value) {
							if (host.src1 && host.src2)
								summary.textContent = 'Comparison unavailable';
							return;
						}
						canvas.width = value.diff.width;
						canvas.height = value.diff.height;
						canvas.getContext('2d')?.putImageData(value.diff, 0, 0);
						const changed = value.diffBytes / 4;
						const percentage = value.size ? (value.diffBytes / value.size) * 100 : 0;
						const formatted = percentage > 0 && percentage < 0.01
							? '<0.01'
							: percentage.toFixed(2).replace(/\.00$/, '');
						summary.textContent = `${changed.toLocaleString()} changed pixels (${formatted}%) · actual ${value.imageA.width}×${value.imageA.height} · baseline ${value.imageB.width}×${value.imageB.height}`;
						canvas.ariaLabel = summary.textContent;
						host.value = value;
					}),
				get(host, 'ratio').raf(value => {
					canvas.style.opacity = value.toString();
				}),
			);
		},
	],
});
