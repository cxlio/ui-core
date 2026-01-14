import { SnackbarContainer } from './snackbar-container.js';
import { SurfaceColorValue } from './theme.js';

import type { Snackbar } from './snackbar.js';

export interface SnackbarOptions {
	duration?: number;
	color?: SurfaceColorValue;
	content: string | Node;
	container?: SnackbarContainer;
}

/**
 * If a container is not specified by using the _setSnackbarContainer_ function, _notify_ will create a new container and store it in this variable.
 */
export let snackbarContainer: SnackbarContainer | undefined;

/**
 * Simplifies the process of creating and displaying snackbar notifications.
 * @param options Defines the configuration for the snackbar notification.
 * If a string is provided, it's treated as the snackbar content.
 * Otherwise, a SnackbarOptions object can be used for more detailed configuration.
 * SnackbarOptions (implicit):
 * - content (string): The message content to be displayed in the snackbar.
 * - delay (number): The duration (in milliseconds) for which the snackbar will be displayed before automatically hiding. Defaults to the value set on the Snackbar component (usually 4 seconds).
 * - color (string): The color theme for the snackbar
 * - container (SnackbarContainer): An optional reference to a specific SnackbarContainer component for managing the queue. If not provided, a default container is created and attached to the document body.
 */
export function notify(options: string | Snackbar | SnackbarOptions) {
	let bar;

	if (typeof options === 'string') options = { content: options };
	else if (!(options instanceof HTMLElement)) bar = options.container;

	if (!bar) {
		bar = snackbarContainer ??= new SnackbarContainer();
		if (!bar.parentNode) document.body.appendChild(bar);
	}

	return bar.notify(options);
}

export function setSnackbarContainer(bar: SnackbarContainer) {
	snackbarContainer = bar;
}
