import { Slot, component, styleAttribute } from './component.js';
import { Spacing, css, spacingValues } from './theme.js';
import { Block, buildGridCss, growAndFillStyles } from './c.js';

declare module './component' {
	interface Components {
		'c-flex': Flex;
	}
}

/**
 * Provides a lightweight, flexible container for arranging child elements with
 * adjustable direction, spacing, and content alignment.
 *
 * Supports horizontal and vertical layouts. The spacing between child items
 * can be adjusted via the `gap` attribute with allowed spacing tokens. Use
 * the `middle` attribute to align items to the center of the cross axis, and
 * combine it with `vflex` to center children vertically within a column
 * layout. Content will wrap naturally according to standard flexbox
 * behavior. Accepts any child elements as its flex items.
 *
 * @title Flexible Layout Container
 * @icon view_stream
 * @tagName c-flex
 * @beta
 * @demo
 * <c-flex gap="16">
 *   <c-card pad="16">Item 1</c-card>
 *   <c-card pad="16">Item 2</c-card>
 *   <c-card pad="16">Item 3</c-card>
 * </c-flex>
 */
export class Flex extends Block {
	/**
	 * A boolean attribute indicating a vertical flex layout.
	 *
	 * @demo
	 * <c-flex vflex gap="8">
	 *   <c-card pad="16">Item 1</c-card>
	 *   <c-card pad="16">Item 2</c-card>
	 *   <c-card pad="16">Item 3</c-card>
	 * </c-flex>
	 */
	vflex = false;

	/**
	 * A spacing attribute to control the gap between flex items using columnGap and rowGap properties.
	 */
	gap?: Spacing;

	/**
	 * Centers content vertically or horizontally within the flex container.
	 */
	middle = false;
}

component(Flex, {
	tagName: 'c-flex',
	init: [
		styleAttribute('vflex'),
		styleAttribute('gap'),
		styleAttribute('middle'),
	],
	augment: [
		buildGridCss('flex'),
		growAndFillStyles,
		css(`
:host([middle]) { align-items: center; }
:host([center]) { justify-content: center; }
:host([vflex]) { flex-direction: column; }
:host([vflex][middle]) { justify-content: center; align-items: normal }
:host([vflex][center]) { align-items: center; }
${spacingValues.map(v => `:host([gap="${v}"]){gap:${v}px}`).join('')}
	`),
		Slot,
	],
});
