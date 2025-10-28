import { Marker } from './marker.js';
import { placeholder } from './component.js';
import { EMPTY, Observable, merge, timer, fromPromise, of } from './rx.js';

export function renderIf<T>(
	source: Observable<T>,
	renderFn: (item: T) => Node | Node[] | Promise<Node | Node[]>,
	elseFn?: () => Node | Node[] | Promise<Node | Node[]>,
) {
	return placeholder(() => {
		const marker = new Marker();
		return [
			source
				.switchMap(v => {
					marker.empty();
					const r = v ? renderFn(v) : elseFn?.();
					return r instanceof Promise ? fromPromise(r) : of(r);
				})
				.tap(r => {
					if (r) marker.insert(r);
				}),
			marker.end,
		];
	});
}

export function render<T>({
	source,
	renderFn,
	loading,
	error,
}: {
	source: Observable<T>;
	renderFn: (item: T) => Node | Node[] | undefined;
	loading?: () => Node;
	error?: (e: unknown) => Node;
}) {
	return placeholder(() => {
		const marker = new Marker();
		let ready = false;
		return [
			merge(
				loading
					? timer(750).tap(() => {
							if (!ready) marker.insert(loading());
					  })
					: EMPTY,
				source
					.tap(item => {
						ready = true;
						marker.empty();
						const el = renderFn(item);
						if (el) marker.insert(el);
					})
					.catchError(e => {
						ready = true;
						if (error) {
							marker.empty();
							marker.insert(error(e));
							return EMPTY;
						}
						throw e;
					}),
			),
			marker.end,
		];
	});
}
