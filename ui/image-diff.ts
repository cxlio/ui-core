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
import { combineLatest, concat, fromPromise, merge, of } from './rx.js';
import { css } from './theme.js';

declare module './component.js' {
	interface Components {
		'c-image-diff': ImageDiff;
	}
}

export type ImageSource = string | ImageData | Blob | CanvasImageSource;

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

export async function imageData(src: ImageSource) {
	if (src instanceof ImageData) return src;
	if (src instanceof Blob) {
		const url = URL.createObjectURL(src);
		try {
			return await imageData(url);
		} finally {
			URL.revokeObjectURL(url);
		}
	}
	const image = await createImageBitmap(typeof src === 'string' ? await loadImage(src) : src);
	try {
		const canvas = create('canvas', { width: image.width, height: image.height });
		const ctx = canvas.getContext('2d');
		if (!ctx) throw new Error('Could not create context');
		ctx.drawImage(image, 0, 0);
		return ctx.getImageData(0, 0, image.width, image.height);
	} finally {
		image.close();
	}
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

export async function imageDiff(srcA: ImageSource, srcB: ImageSource) {
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
	 * Actual image source. HTML attributes accept URL strings.
	 *
	 * @attribute
	 */
	src1?: ImageSource;

	/**
	 * Baseline image source. HTML attributes accept URL strings.
	 *
	 * @attribute
	 */
	src2?: ImageSource;

	/**
	 * Opacity of image B over image A, between 0 and 1. Defaults to 1.
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
.images { position: relative; }
.images canvas { position: absolute; top: 0; left: 0; height: auto; }
.images .diff { display: block; height: 100%; width: 100%; }
:host([hidediff]) .diff { visibility: hidden; }
.summary {
	color: var(--cxl-color-on-surface-variant);
	font-size: 0.75rem;
	margin: 0;
	padding: 8px 10px;
}
`),
		host => {
			const actual = create('canvas', { role: 'img', ariaLabel: 'Actual image', width: 0, height: 0 });
			const baseline = create('canvas', { role: 'img', ariaLabel: 'Baseline image', width: 0, height: 0 });
			const images = create('div', { className: 'images' });
			function resize() {
				const width = Math.max(actual.width, baseline.width);
				const height = Math.max(actual.height, baseline.height);
				images.style.aspectRatio = width && height ? `${width} / ${height}` : '';
				for (const image of [actual, baseline]) {
					image.hidden = !image.width;
					image.style.width = width ? `${(image.width / width) * 100}%` : '';
				}
			}
			const canvas = create('canvas', {
				className: 'diff',
				role: 'img',
				ariaLabel: 'rendered diff',
			});
			const summary = create('p', {
				className: 'summary',
				ariaLive: 'polite',
			});
			images.append(actual, baseline, canvas);
			getShadow(host).append(images, summary);
			function input(name: 'src1' | 'src2', layer: HTMLCanvasElement) {
				return get(host, name)
					.switchMap(src => src
						? concat(of(null), fromPromise(imageData(src).catch(() => undefined)))
						: of(undefined))
					.tap(value => {
						layer.width = value?.width ?? 0;
						layer.height = value?.height ?? 0;
						if (value) layer.getContext('2d')?.putImageData(value, 0, 0);
						resize();
					});
			}

			return merge(
				combineLatest(input('src1', actual), input('src2', baseline))
					.switchMap<ImageDiffResult | null | undefined>(async ([A, B]) => {
						host.value = undefined;
						canvas.width = canvas.height = 0;
						canvas.ariaLabel = 'rendered diff';
						summary.textContent = host.src1 && host.src2 ? 'Comparing images…' : '';
						if (A === null || B === null) return null;
						return A && B ? imageDataDiff(A, B) : undefined;
					})
					.tap(value => {
						if (value === null) return;
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
					baseline.style.opacity = value.toString();
				}),
			);
		},
	],
});
