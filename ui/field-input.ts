import { Component, get } from './component.js';
import { EMPTY, of, merge, ref } from './rx.js';
import { registable } from './registable.js';

import type { Input } from './input.js';
import type { FieldLike } from './field.js';

export function fieldRegistable(host: Component) {
	const fieldRef = ref<FieldLike>();
	return merge(
		registable('field', host, fieldEl => fieldRef.next(fieldEl)),
		fieldRef,
	);
}

/**
 * Defines a utility that emits the most current input element
 * associated with the host component or its field, keeping track of
 * the latest input for fallback purposes.
 */
export function fieldInput(host: Component & { input?: Input }) {
	return fieldRegistable(host).switchMap(field =>
		get(host, 'input').switchMap(input => {
			if (input) return of(input);
			return get(field, 'input').switchMap(inp =>
				inp ? of(inp) : EMPTY,
			);
		}),
	);
}
