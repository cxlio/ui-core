import { Component, component, create } from './component.js';
import { css } from './theme.js';
import { Snackbar } from './snackbar.js';

import type { SnackbarOptions } from './notify.js';

declare module './component' {
	interface Components {
		'c-snackbar-container': SnackbarContainer;
	}
}

type QueueItem = [Snackbar, () => void];

/**
 * Container for displaying temporary notification messages. Only one notification
 * is shown at a time; new messages are queued and displayed automatically in order.
 *
 * Shows snackbars in the order they are enqueued and ensures the user does not
 * miss notifications sent in quick succession. Supports string content or options
 * like `timeout` and custom actions when notifying.
 *
 * Pass a `Snackbar` instance, options object, or plain string to `notify()` to show
 * a message. Returns a `Promise` that resolves after the notification is dismissed.
 * Supports async flows waiting for user dismissal and imperatively managed content.
 *
 * For multiple independent containers, instantiate additional `<c-snackbar-container>`
 * elements.
 *
 * @title Snackbar Notifications Queue
 * @icon campaign
 * @tagName c-snackbar-container
 * @example
 * <div style="width:100%;height: 140px; text-align:center;">
 * <c-button onclick="snack.notify({ content: 'Snackbar Number ' + (this.number=(this.number??0) + 1)})">Notify!</c-button>
 * <br/><br/>
 * <c-snackbar-container id="snack"></c-snackbar-container>
 * </div>
 *
 */
export class SnackbarContainer extends Component {
	/**
	 * An internal queue that stores references to Snackbar components and their respective resolution functions.
	 */
	queue: QueueItem[] = [];

	/**
	 * Public method to enqueue a new Snackbar component for display.
	 * It returns a promise that resolves when the snackbar is removed from the DOM.
	 */
	notify(snackbar: Snackbar | SnackbarOptions | string) {
		const element =
			typeof snackbar === 'string'
				? create(Snackbar, undefined, snackbar)
				: !(snackbar instanceof HTMLElement)
				? (snackbar = create(Snackbar, snackbar, snackbar.content))
				: snackbar;

		return new Promise<void>(resolve => {
			this.queue.push([element, resolve]);
			if (this.queue.length === 1 && this.queue[0])
				this.notifyNext(this.queue[0]);
		});
	}

	/**
	 * Triggers the display of the next snackbar in the queue, handling animation, removal, and queue advancement.
	 */
	private notifyNext([next, resolve]: QueueItem) {
		const onClose = () => {
			this.queue.shift();
			next.removeEventListener('close', onClose);
			resolve();
			if (this.queue[0]) this.notifyNext(this.queue[0]);
		};

		this.shadowRoot?.append(next);
		next.addEventListener('close', onClose);
		next.open = true;
	}
}

component(SnackbarContainer, {
	tagName: 'c-snackbar-container',
	augment: [
		css(`
:host {
	position:relative; width: 100%; height: 0;
	display: flex; text-align:center; align-items: end;
	overflow: visible;
}`),
	],
});
