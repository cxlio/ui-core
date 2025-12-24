import { Child, create } from './component.js';
import { dialog, dialogClose } from './dialog.js';
import { DialogBasic } from './dialog-basic.js';
import { Button } from './button.js';
import { content } from './locale.js';
import { Span } from './span.js';

/**
 * Presents a confirmation dialog to the user, prompting for a binary decision with two distinct buttons (e.g., "OK" and "Cancel").
 * @param optionsOrMessage An object containing properties to customize the confirmation dialog.
 * @returns A promise that resolves with a boolean value: true if the user clicked the primary action button, false if they cancelled.
 */
export function confirm(
	optionsOrMessage:
		| string
		| {
				message: Child;
				title?: string;
				action?: Child;
				cancelAction?: Child;
		  },
) {
	const nodes = [];
	if (typeof optionsOrMessage === 'string')
		optionsOrMessage = {
			message: optionsOrMessage,
		};

	const { message: msg, title, action, cancelAction } = optionsOrMessage;
	if (title) nodes.push(create('div', { slot: 'title' }, title));
	nodes.push(
		create(Span, undefined, msg),
		create(
			Button,
			{
				variant: 'text',
				slot: 'actions',
				$: el => dialogClose(el, false),
			},
			cancelAction ?? content.get('dialog.cancel'),
		),
		create(
			Button,
			{
				variant: 'text',
				slot: 'actions',
				$: el => dialogClose(el, true),
			},
			action ?? content.get('dialog.ok'),
		),
	);
	return dialog<DialogBasic, boolean>(DialogBasic, {}, ...nodes);
}
