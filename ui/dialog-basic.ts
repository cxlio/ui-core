import { component, create } from './component.js';
import { DialogBase, dialogStyles } from './dialog.js';
import { css, font } from './theme.js';

declare module './component' {
	interface Components {
		'c-dialog-basic': DialogBasic;
	}
}

/**
 * Defines a custom dialog component.
 * It provides basic styling and allows the use of slots for adding a title, content, and action buttons.
 *
 * @tagName c-dialog-basic
 * @title Dialog for quick confirmation or alert flows
 * @icon chat_bubble
 * @demo
 * <div style="width:100%;min-height:200px;">
 * <c-dialog-basic open static aria-label="demo dialog">
 *   <div slot="title">Dialog Title</div>
 *   <c-t>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam tincidunt luctus.</c-t>
 *   <c-button variant="text" slot="actions">Cancel</c-button>
 *   <c-button variant="text" slot="actions">Accept</c-button>
 * </c-dialog-basic>
 * </div>
 *
 * @see Dialog
 */
export class DialogBasic extends DialogBase {}

component(DialogBasic, {
	tagName: 'c-dialog-basic',
	augment: [
		dialogStyles,
		css(`
dialog {
	display:flex; flex-direction:column;row-gap:16px;
	max-width: min(calc(100% - 24px), 560px);
}
slot[name=title] { ${font('title-large')} }
slot[name=actions] {
	display:flex; column-gap: 24px; align-items: center; justify-content: end; margin-top:8px;
}
		`),
		$ => {
			$.dialog.append(
				create('slot', { name: 'title' }),
				create('slot'),
				create('slot', { name: 'actions' }),
			);
		},
	],
});
