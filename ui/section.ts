import { component, styleAttribute } from './component.js';
import { Layout, LayoutType } from './layout.js';
import { SurfaceColorValue, css, media, colorAttribute } from './theme.js';

/**
 * The Section component builds upon the Layout component and provides a styled section
 * element for structuring your UI content.
 * It offers a standard visual container with padding and background color options.
 *
 * @beta
 * @demo
 * <c-section dense color="primary">
 *   <c-t h4>Section Title</c-t>
 *   <p>Content with a primary background color.</p>
 * </c-section>
 */
export class Section extends Layout {
	/**
	 * A boolean attribute for a more compact section with reduced padding.
	 */
	dense = false;

	/**
	 * A color attribute allowing you to customize the section's background color based on the theme.
	 */
	color?: SurfaceColorValue;

	center = true;

	type: LayoutType | undefined = 'block';
}

component(Section, {
	tagName: 'c-section',
	init: [styleAttribute('dense'), colorAttribute('color')],
	augment: [
		css(`
:host { padding: 96px 16px; }
:host([dense]) { padding-top: 48px;padding-bottom:48px; }
${media('medium', `:host {padding-left:32px;padding-right:32px}`)}
${media('large', ':host {padding-left:64px;padding-right:64px}')}
	`),
	],
});
