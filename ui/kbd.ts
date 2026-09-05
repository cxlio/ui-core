import { Component, Slot, component } from './component.js';
import { css, font, surface } from './theme.js';

declare module './component.js' {
	interface Components {
		'c-kbd': Kbd;
	}
}

export class Kbd extends Component {}

component(Kbd, {
	tagName: 'c-kbd',
	augment: [
		css(`
:host {
	box-sizing: border-box;
	display: inline-block;
	padding: 2px 8px;
	border-radius: var(--cxl-shape-corner-small);
	${surface('surface-container-high')}
	${font('code')}
	border: 1px solid var(--cxl-color-outline-variant);
	box-shadow: var(--cxl-elevation-1);
}
		`),
		Slot,
	],
});
