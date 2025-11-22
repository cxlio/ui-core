import { Component, component, create, styleAttribute } from './component.js';
import { css, media } from './theme.js';

export type LayoutType =
	| 'block'
	| 'grid'
	| 'two-column'
	| 'two-column-left'
	| 'two-column-right';

/**
 * The Layout component provides a flexible way to structure your UI layouts.
 * It offers predefined options and responsive styles for various layout configurations.
 *
 * @beta
 * @demo
 * <c-layout type="two-column">
 *    <div>Left Column Content</div>
 *    <div>Right Column Content</div>
 * </c-layout>
 */

export class Layout extends Component {
	/**
	 * A string attribute defining the layout type. Options include:
	 * - `block`: Creates a simple block-level container.
	 * - `grid`: Creates a basic grid layout with 12 columns.
	 * - `two-column`: Creates a two-column layout with equal width columns (responsive adjustments apply).
	 * - `two-column-left`: Creates a two-column layout with a wider left column (responsive adjustments apply).
	 * - `two-column-right`: Creates a two-column layout with a wider right column (responsive adjustments apply).
	 */
	type?: LayoutType;

	/** A boolean attribute for horizontally centering the layout content. */
	center = false;

	/** A boolean attribute for removing width restrictions and allowing the layout to fill its container. */
	full = false;
}

component(Layout, {
	tagName: 'c-layout',
	init: [
		styleAttribute('type'),
		styleAttribute('center'),
		styleAttribute('full'),
	],
	augment: [
		css(`
.div {
  display: grid;
  grid-template-columns: 1fr;
  row-gap: 16px;
  column-gap: 0;
}
:host([type=grid]) .div { display: grid; }
:host([type="two-column-left"]) .div,
:host([type="two-column-right"]) .div,
:host([type="two-column"]) .div {
  row-gap: 32px;
}

${media(
	'small',
	`
  .div {
    column-gap: 32px;
    grid-template-columns: repeat(12, minmax(0, 1fr));
  }

  :host([type="two-column-left"]) .div {
    grid-template-columns: 2fr 1fr;
    column-gap: 64px;
    row-gap: 32px;
  }

  :host([type="two-column-right"]) .div {
    grid-template-columns: 1fr 2fr;
    column-gap: 64px;
    row-gap: 32px;
  }
  :host([type="two-column"]) .div {
    grid-template-columns: 1fr 1fr;
    column-gap: 48px;
    row-gap: 32px;
  }

  :host([type="three-column"]) .div {
    grid-template-columns: 1fr 2fr 1fr;
    column-gap: 48px;
    row-gap: 32px;
  }
`,
)}
${media(
	'large',
	`
  .div {
    width: 100%;
    max-width: 1200px;
  }

  :host([center]) .div {
    margin-left: auto;
    margin-right: auto;
  }
`,
)}
:host { display:block }
:host([type=block]) .div { display: block }
:host([full]) .div { width:auto;max-width:none }
`),
		() => create('div', { className: 'div' }, create('slot')),
	],
});
