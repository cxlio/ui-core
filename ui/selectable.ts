import { merge } from './rx.js';
import { onAction } from './dom.js';
import { get, message } from './component.js';

import { ariaValue } from './a11y.js';
import { registable } from './registable.js';

import type { Option } from './option.js';

declare module './dom.js' {
	interface CustomEventMap {
		'selectable.action': Option;
	}
}

declare module './registable' {
	interface RegistableMap {
		selectable: Option;
	}
}

export function selectable(host: Option) {
	return merge(
		get(host, 'selected').pipe(ariaValue(host, 'selected')),
		registable('selectable', host),
		onAction(host).tap(() => message(host, 'selectable.action', host)),
	);
}
