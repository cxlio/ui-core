import {
	Component,
	MessageType,
	Slot,
	attribute,
	component,
	message,
} from './component.js';
import { displayContents } from './theme.js';
import { onAction } from './dom.js';

/**
 * Send message on action.
 * @beta
 */
export class Action extends Component {
	type?: MessageType;

	details?: unknown;
}

component(Action, {
	tagName: 'c-action',
	init: [attribute('type'), attribute('details')],
	augment: [
		displayContents,
		Slot,
		$ =>
			onAction($).tap(() => {
				if ($.type) message($, $.type, $.details);
			}),
	],
});
