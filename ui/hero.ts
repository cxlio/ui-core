import { create, component, styleAttribute } from './component.js';
import { LayoutBase, LayoutType, layoutStyles } from './layout.js';
import { sectionStyles } from './section.js';
import { SurfaceColorValue, colorAttribute, css, font } from './theme.js';

declare module './component' {
	interface Components {
		'c-hero': Hero;
	}
}

/**
 * Generic hero layout for prominent page sections.
 *
 * @tagName c-hero
 * @title Hero
 * @demo
 * <c-hero color="primary-container">
 *   <c-t font="display-medium">Build product pages faster</c-t>
 *   <p>Compose a focused opening section with existing ui-core typography, buttons, and layout primitives.</p>
 *   <p>
 *     <c-button color="primary">Start building</c-button>
 *     <c-button-text>View docs</c-button-text>
 *   </p>
 * </c-hero>
 */
export class Hero extends LayoutBase {
	dense = false;
	color?: SurfaceColorValue;
	center = true;
	type: LayoutType | undefined = 'block';
}

component(Hero, {
	tagName: 'c-hero',
	init: [styleAttribute('dense'), colorAttribute('color')],
	augment: [
		sectionStyles,
		layoutStyles,
		css(`
:host {
	box-sizing: border-box;
	display: block;
}
#body {
	row-gap: 24px;
}
::slotted(c-t:first-child) {
	max-width: 820px;
}
::slotted(p) {
	max-width: 720px;
	margin: 0;
	${font('body-large')}
}
		`),
		() => create('div', { id: 'body', part: 'body' }, create('slot')),
	],
});
