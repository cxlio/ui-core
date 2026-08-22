import { component, get, property } from './component.js';
import { Alert } from './alert.js';

import type { SurfaceColorValue } from './theme.js';

function objectToString(error: object) {
	if ('message' in error && typeof error.message === 'string')
		return error.message;
	if ('error' in error && typeof error.error === 'string') return error.error;
	if ('status' in error && typeof error.status === 'number')
		return `HTTP ${error.status}${
			'statusText' in error &&
			typeof error.statusText === 'string' &&
			error.statusText
				? ` ${error.statusText}`
				: ''
		}`;

	if (
		'toString' in error &&
		typeof error.toString === 'function' &&
		error.toString !== Object.prototype.toString
	)
		return error.toString();

	if (Object.keys(error).length === 0) return 'Unknown Error';
}

export function errorToString<T>(error: T | null | undefined): string {
	if (error === undefined || error === null) return 'Unknown Error';
	if (typeof error === 'string') return error || 'Unknown Error';
	if (error instanceof Response)
		return `HTTP ${error.status} ${error.statusText}`;
	if (error instanceof Error) return error.message || 'Unknown Error';
	if (typeof error === 'object') {
		const output = objectToString(error);
		if (output) return output;
	}
	if (typeof error === 'symbol' || typeof error === 'function')
		return String(error);

	try {
		return JSON.stringify(error) || 'Unknown Error';
	} catch {
		return String(error) || 'Unknown Error';
	}
}

export class AlertError extends Alert {
	color: SurfaceColorValue = 'error';

	error: unknown;
}

component(AlertError, {
	tagName: 'c-alert-error',
	init: [property('error')],
	augment: [
		$ =>
			get($, 'error').tap(error => {
				$.textContent = errorToString(error);
			}),
	],
});
