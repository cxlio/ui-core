import { Slot, component, property, tsx } from './component.js';
import { merge } from './rx.js';
import { on, onAction } from './dom.js';
import { dropTarget } from './drag.js';
import { InputProxy } from './input-proxy.js';
import { displayContents } from './theme.js';
import { disabledAttribute } from './focusable.js';

export function fileUploadBehavior(
	$: HTMLElement,
	fileInput: HTMLInputElement,
) {
	fileInput.style.width = '0';
	if (!fileInput.parentNode) $.append(fileInput);

	return merge(
		merge(on(fileInput, 'input'), on(fileInput, 'change')).map(ev => {
			ev.stopPropagation();
			$.dispatchEvent(new Event(ev.type, { bubbles: true }));
			if (fileInput.files) return Array.from(fileInput.files);
		}),
		onAction($)
			.tap(() => fileInput.click())
			.ignoreElements(),
		dropTarget($).map(ev => {
			ev.stopPropagation();
			if (ev.dataTransfer?.files.length)
				return Array.from(ev.dataTransfer.files);
		}),
	);
}

/**
 * A component that lets users select or drag-and-drop files for upload.
 *
 * Users provide their own trigger (e.g., a button or icon) via the default slot.
 * Clicking or tapping the component, or dropping files onto it, opens the file picker.
 * Supports selecting multiple files at once.
 *
 * @title File Upload
 * @icon attach_file
 * @tagName c-input-file
 * @alpha
 * @example
 * <c-input-file>
 *   <c-button>
 *     <c-icon name="upload">
 *     Upload File
 *   </c-button>
 * </c-input-file>
 */

export class InputFile extends InputProxy {
	/**
	 * An array of File objects representing the selected files.
	 * This property is automatically updated when the user selects files or drops them onto the component.
	 */
	value: File[] | undefined = undefined;

	inputEl = tsx('input', { tabIndex: -1, type: 'file' });
}

component(InputFile, {
	tagName: 'c-input-file',
	init: [property('value')],
	augment: [
		displayContents,
		Slot,
		$ => {
			const fileInput = $.inputEl;
			fileInput.setAttribute('form', '__cxl_ignore__');
			$.append(fileInput);
			//getShadow($).appendChild(fileInput);

			return merge(
				disabledAttribute($),
				fileUploadBehavior($, fileInput).tap(val => {
					$.value = val;
				}),
			);
		},
	],
});
