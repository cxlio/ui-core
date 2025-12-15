import { Component, component, create, styleAttribute } from './component.js';
import { css, media, itemLayout } from './theme.js';

export type LayoutType =
	| 'block'
	| 'grid'
	| 'two-column'
	| 'three-column'
	| 'two-column-left'
	| 'two-column-right'
	| 'item';

export const layoutStyles = css(`
#body {
  display: grid;
  grid-template-columns: 1fr;
  row-gap: 16px;
  column-gap: 0;
}
:host([type=grid]) #body { display: grid; }
:host([type="two-column-left"]) #body,
:host([type="two-column-right"]) #body,
:host([type="three-column"]) #body,
:host([type="two-column"]) #body {
  row-gap: 32px;
}

:host([type="item"]) #body {
	${itemLayout}
}

${media(
	'small',
	`
  #body {
    column-gap: 32px;
    grid-template-columns: repeat(12, minmax(0, 1fr));
  }
  :host([type="two-column-left"]) #body {
    grid-template-columns: 2fr 1fr;
    column-gap: 64px;
    row-gap: 32px;
  }
  
  :host([type="three-column"]) #body {
    grid-template-columns: 1fr 1fr 1fr;
    column-gap: 32px;
    row-gap: 32px;
  }

  :host([type="two-column-right"]) #body {
    grid-template-columns: 1fr 2fr;
    column-gap: 64px;
    row-gap: 32px;
  }
  :host([type="two-column"]) #body {
    grid-template-columns: 1fr 1fr;
    column-gap: 48px;
    row-gap: 32px;
  }
`,
)}
${media(
	'large',
	`
  #body {
    width: 100%;
    max-width: 1200px;
  }

  :host([center]) #body {
    margin-left: auto;
    margin-right: auto;
  }
`,
)}
:host { display:block }
:host([type=block]) #body { display: block }
:host([full]) #body { width:auto;max-width:none }
`);

export abstract class LayoutBase extends Component {
	/**
	 * A string attribute defining the layout type. Options include:
	 * - `block`: Creates a simple block-level container.
	 * - `grid`: Creates a basic grid layout with 12 columns.
	 * - `two-column`: Creates a two-column layout with equal width columns (responsive adjustments apply).
	 * - `two-column-left`: Creates a two-column layout with a wider left column (responsive adjustments apply).
	 * - `two-column-right`: Creates a two-column layout with a wider right column (responsive adjustments apply).
	 * - `three-column`: Creates a three-column layout with equal width columns
	 */
	type?: LayoutType;

	/** A boolean attribute for horizontally centering the layout content. */
	center = false;

	/** A boolean attribute for removing width restrictions and allowing the layout to fill its container. */
	full = false;
}

component(LayoutBase, {
	init: [
		styleAttribute('type'),
		styleAttribute('center'),
		styleAttribute('full'),
	],
});

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
export class Layout extends LayoutBase {}

component(Layout, {
	tagName: 'c-layout',
	augment: [
		layoutStyles,
		() => create('div', { id: 'body', part: 'body' }, create('slot')),
	],
});
