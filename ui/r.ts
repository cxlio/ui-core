import { Component, Slot, component, styleAttribute } from './component.js';
import { css, media } from './theme.js';

/**
 * The R component allows you to hide and show content based on the browser available screen space.
 * You can use it to create responsive layouts that can show or hide different content depending on the screen size.
 * You can define conditions for different screen size ranges using predefined breakpoints like _xs_ (extra small), _sm_ (small), _md_ (medium), _lg_ (large), and _xl_ (extra large). This allows you to fine-tune content visibility at specific screen widths.
 *
 * @tagName c-r
 * @alpha
 * @demo
 * <c-r xs=0 sm>
		<c-card pad=16>
			<c-t font="code">xs0 sm</c-t>
			Hidden in extra small screens, visible in small to extra large screens.
		</c-card>
	</c-r>
	<c-r xs sm=0>
		<c-card pad=16>
			<c-t font="code">xs sm0</c-t>
			Visible only in extra small screens.
		</c-card>
	</c-r>
 */
export class R extends Component {
	/**
	 * Attribute for defining visibility conditions at extra small screen sizes.
	 * The value can be either a boolean (true/false) or a number indicating the minimum number
	 * of columns to be visible (0 for hidden).
	 */
	xs: 0 | boolean = false;

	/**
	 * Attribute for defining visibility conditions at small screen sizes.
	 * The value can be either a boolean (true/false) or a number indicating the minimum number
	 * of columns to be visible (0 for hidden).
	 */
	sm: 0 | boolean = false;

	/**
	 * Attribute for defining visibility conditions at medium screen sizes.
	 * The value can be either a boolean (true/false) or a number indicating the minimum number
	 * of columns to be visible (0 for hidden).
	 */
	md: 0 | boolean = false;

	/**
	 * Attribute for defining visibility conditions at large screen sizes.
	 * The value can be either a boolean (true/false) or a number indicating the minimum number
	 * of columns to be visible (0 for hidden).
	 */
	lg: 0 | boolean = false;

	/**
	 * Attribute for defining visibility conditions at extra large screen sizes.
	 * The value can be either a boolean (true/false) or a number indicating the minimum number
	 * of columns to be visible (0 for hidden).
	 */
	xl: 0 | boolean = false;
}

component(R, {
	tagName: 'c-r',
	init: [
		styleAttribute('xl'),
		styleAttribute('lg'),
		styleAttribute('md'),
		styleAttribute('sm'),
		styleAttribute('xs'),
	],
	augment: [
		css(`
:host([xs]),:host { display:contents }
:host([xs="0"]) { display:none }
${media('small', `:host([sm]){display:contents}:host([sm="0"]){display:none}`)}
${media('medium', `:host([md]){display:contents}:host([md="0"]){display:none}`)}
${media('large', `:host([lg]){display:contents}:host([lg="0"]){display:none}`)}
${media('xlarge', `:host([xl]){display:contents}:host([xl="0"]){display:none}`)}
	`),
		Slot,
	],
});
