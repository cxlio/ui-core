import {
	Component,
	Child,
	CreateAttribute,
	component,
	get,
	attribute,
	styleAttribute,
	create,
	onMessage,
} from './component.js';
import { on, trigger } from './dom.js';
import { popupManager } from './popup-manager.js';
import { css, displayContents, media, surface } from './theme.js';
import { registerText } from './locale.js';

declare module './component' {
	interface Components {
		'c-dialog': Dialog;
	}
}

registerText({
	'dialog.close': 'Close dialog',
	'dialog.cancel': 'Cancel',
	'dialog.ok': 'Ok',
});

export const dialogStyles = css(`
:host([fullscreen]) dialog {
	background-color: var(--cxl-color-surface);
	box-shadow: none;
	margin: 0;
	width: 100%; height: 100%; max-width: none;
	border-radius: 0; max-height: none;
}
dialog {
	margin: auto;
	border-width: 0;
	max-height: none;
	text-align: start;
	outline: none;
	${surface('surface-container-high')}
	
	box-sizing: border-box;
	min-width: 280px;
	max-width: calc(100% - 24px);
	padding: 24px;
	overflow-y: auto;
	box-shadow: var(--cxl-elevation-3);
	border-radius: var(--cxl-shape-corner-xlarge);
}

dialog::backdrop { background-color: var(--cxl-color-scrim); }

${media('small', `.content { max-height: 85%; }`)}
	`);

/**
 * DialogBase is an abstract class that provides a foundation for building reusable dialog components.
 * It offers functionalities for managing dialog visibility, capturing user interaction, and returning values.
 */
export class DialogBase extends Component {
	/**
	 * Displays the dialog without blocking interaction with other content on the page.
	 * This allows users to continue engaging with the surrounding interface while the dialog remains available.
	 * @attribute
	 */
	static = false;

	/**
	 * A boolean attribute that controls the visibility of the dialog. Setting this to true opens the dialog, and false closes it.
	 * @attribute
	 */
	open = false;

	/**
	 * Indicates whether the dialog is displayed in fullscreen mode.
	 * This can be toggled to adapt the dialog's appearance for smaller screens or specific use cases.
	 * @attribute
	 */
	fullscreen = false;

	/**
	 * A reference to the underlying HTML dialog element.
	 * This property is marked as readonly and cannot be modified directly.
	 */
	readonly dialog = document.createElement('dialog');

	/**
	 * Stores a value returned by the dialog (e.g. user confirmation or response)
	 * so it can be accessed after the dialog closes.
	 * This facilitates passing data back to calling code and is used for resolving dialog promises.
	 */
	returnValue: unknown;
}

component(DialogBase, {
	init: [
		attribute('static'),
		attribute('open'),
		styleAttribute('fullscreen'),
	],
	augment: [
		displayContents,
		// Prevent safari from exiting fullscreen mode
		$ =>
			on($, 'keydown').tap(ev => {
				if (ev.key === 'Escape') {
					ev.preventDefault();
					$.open = false;
				}
			}),
		$ => on($.dialog, 'close').tap(() => ($.open = false)),
		$ => $.dialog,
		$ =>
			get($, 'open').tap(visible => {
				if (visible) {
					if ($.static) $.dialog.show();
					else {
						popupManager.openModal({
							element: $.dialog,
							close: () => ($.open = false),
						});
					}
				} else if ($.dialog.open) {
					$.dialog.close();
					trigger($, 'close');
				}
			}),
		$ =>
			onMessage($, 'toggle.close').tap(v => {
				$.returnValue = v;
				$.open = false;
			}),
	],
});

/**
 * The Dialog component represents a modal dialog window used to inform users,
 * gather input, or present critical information.
 * It provides a dedicated space for focused interaction and can contain various content elements
 * like titles, text, buttons, and forms.
 *
 * @tagName c-dialog
 * @title Configurable modal for focused user interactions
 * @icon chat_bubble
 * @demo
 * <div style="width:100%;min-height:180px;position:absolute;left:0;top:0">
 * <c-dialog open static aria-label="demo dialog">
 *   <c-t font="title-large">Dialog Title</c-t><br/><br/>
 *   <c-t>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam tincidunt luctus.</c-t>
 * </c-dialog>
 * </div>
 *
 * @demo <caption>Fullscreen</caption>
 * <div style="width:100%;min-height:180px;position:absolute;left:0;top:0">
 * <c-dialog open static fullscreen aria-label="demo dialog">
 *   <c-t font="title-large">Dialog Title</c-t><br /><br />
 *   <c-t>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam tincidunt luctus eleifend.</c-t>
 * </c-dialog>
 * </div>
 *
 * @see DialogBasic
 */
export class Dialog extends DialogBase {}

component(Dialog, {
	tagName: 'c-dialog',
	augment: [
		dialogStyles,
		$ => {
			$.dialog.append(create('slot', { className: 'content' }));
		},
	],
});

/**
 * Provides a streamlined way to create, display, interact with, and manage dialog instances within your application.
 * @param ctor The constructor function of the dialog component you want to create and display. It must extend DialogBase.
 * @param optionsOrMessage Either a string message to display in the dialog or an object containing partial properties to set on the dialog instance.
 * @param container A container element to append the dialog to, providing control over its placement within the DOM. If not specified, the dialog is appended to the document.body.
 * @returns A promise that resolves with the value returned by the dialog when it's closed.
 */
export function dialog<T extends DialogBase, ReturnT = unknown>(
	ctor: new () => T,
	options: CreateAttribute<T>,
	...content: Child[]
) {
	const modal = create(ctor, options, ...content);
	return new Promise<ReturnT>(resolve => {
		const handler = () => {
			modal.removeEventListener('close', handler);
			modal.remove();
			resolve(modal.returnValue as ReturnT);
		};
		modal.addEventListener('close', handler);
		if (!modal.parentNode) document.body.append(modal);
		modal.open = true;
	});
}
