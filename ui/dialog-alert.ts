import { Child, create } from './component.js';
import { dialog } from './dialog.js';
import { DialogBasic } from './dialog-basic.js';
import { Button } from './button.js';
import { content } from './locale.js';
import { toggleClose } from './toggle.js';
import { Span } from './span.js';

/**
 * Presents an alert dialog to the user with a simple message and an "OK" button for dismissal.
 * @param optionsOrMessage Either a string message to display or an object containing partial properties to customize the alert dialog.
 * @returns A promise that resolves when the dialog is closed, indicating that the user has acknowledged the message.
 */
export function alert(
	optionsOrMessage:
		| string
		| { message: Child; title?: string; action?: Child },
) {
	const nodes = [];
	const { message, title, action } =
		typeof optionsOrMessage === 'string'
			? { message: optionsOrMessage }
			: optionsOrMessage;

	if (title) nodes.push(create('div', { slot: 'title' }, title));
	nodes.push(
		create(Span, undefined, message),
		create(
			Button,
			{ $: toggleClose, variant: 'text', slot: 'actions' },
			action ?? content.get('dialog.ok'),
		),
	);

	return dialog(DialogBasic, {}, ...nodes);
}
