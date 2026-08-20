import { Component, Slot, attribute, component, get } from './component.js';
import { visuallyHidden } from './theme.js';

declare module './component' {
	interface Components {
		'c-aria-live': AriaLive;
	}
}

export class AriaLive extends Component {
	assertive = false;
}

component(AriaLive, {
	tagName: 'c-aria-live',
	init: [attribute('assertive')],
	augment: [
		visuallyHidden,
		Slot,
		$ =>
			get($, 'assertive').tap(assertive => {
				$.role = assertive ? 'alert' : 'status';
				$.ariaLive = assertive ? 'assertive' : 'polite';
				$.ariaAtomic = 'true';
			}),
	],
});
