import { component, styleAttribute } from './component.js';
import { Card } from './card.js';
import { buttonBaseStyles } from './button.js';
import { ripple } from './ripple.js';
import { css } from './theme.js';
import { itemButtonBehavior } from './item.js';
import { role } from './a11y.js';

declare module './component' {
	interface Components {
		'c-card-item': CardItem;
	}
}

/**
 * The CardItem component is a Card that can be used with Lists or Grids.
 *
 * @tagName c-card-item
 * @title: Interactive card list item
 * @icon view_agenda
 * @example
 * <c-card-item pad="16" style="width:200px;height:120px">Filled</c-card-item>
 * @see Card
 */
export class CardItem extends Card {
	/**
	 * A boolean indicating whether the item is disabled.
	 * @attribute
	 */
	disabled = false;

	/**
	 * Indicates whether the item has been interacted with via touch.
	 * @attribute
	 */
	touched = false;

	/**
	 * Indicates whether the item is selected.
	 * @attribute
	 */
	selected = false;
}

component(CardItem, {
	tagName: 'c-card-item',
	init: [
		styleAttribute('disabled'),
		styleAttribute('touched'),
		styleAttribute('selected'),
	],
	augment: [
		role('option'),
		...buttonBaseStyles,
		css(`
:host([variant=outlined]:hover) { box-shadow: var(--cxl-elevation-1) }
:host([variant=elevated]) { color: var(--cxl-color-on-surface); }
		`),
		itemButtonBehavior,
		ripple,
	],
});
