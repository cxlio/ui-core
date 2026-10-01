import { Component, Slot, component } from './component.js';
import { displayContents } from './theme.js';
import { onAction } from './dom.js';
import { findForm } from './form-submit.js';

declare module './component.js' {
	interface Components {
		'c-form-reset': FormReset;
	}
}

/**
 * @tagName c-form-reset
 * @title Form Reset Action
 * @icon restart_alt
 * @see Form
 * @demoonly
 * <c-form>
 *   <c-flex vflex gap="16">
 *     <c-field>
 *       <c-label>Name</c-label>
 *       <c-input-text name="name" value="Ada" rules="required"></c-input-text>
 *     </c-field>
 *     <c-toolbar>
 *       <c-form-submit><c-button>Submit</c-button></c-form-submit>
 *       <c-form-reset><c-button variant="outlined">Reset</c-button></c-form-reset>
 *     </c-toolbar>
 *   </c-flex>
 * </c-form>
 */
export class FormReset extends Component {}

component(FormReset, {
	tagName: 'c-form-reset',
	augment: [
		displayContents,
		Slot,
		$ => onAction($).tap(() => findForm($)?.reset()),
	],
});
