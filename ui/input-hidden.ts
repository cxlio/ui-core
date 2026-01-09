import { component, attribute } from './component.js';
import { Input } from './input.js';

/**
 * Equivalent to input type="hidden".
 *
 * @title Hidden Input
 * @tagName c-input-file
 * @alpha
 */

export class InputHidden extends Input {
	value: unknown;
}

component(InputHidden, {
	tagName: 'c-input-hidden',
	init: [attribute('value')],
	augment: [],
});
