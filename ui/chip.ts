import { component, styleAttribute } from './component.js';
import { role } from './a11y.js';
import { buttonBehavior, buttonBaseStyles } from './button.js';
import { css, surface } from './theme.js';
import { ripple } from './ripple.js';
import { Pill } from './pill.js';

declare module './component' {
	interface Components {
		'c-chip': Chip;
	}
}

/**
 * Chips are compact elements that represent an input, attribute, or action.
 * Chips allow users to enter information, make selections, filter content, or trigger actions.
 *
 * @tagName c-chip
 * @title Chip component for compact action, input, or filter UI.
 * @icon voting_chip
 * @example
 *   <c-chip>Single Chip</c-chip>
 *   <c-chip><c-icon width="18" name="tag" slot="leading"></c-icon>Chip with Icon</c-chip>
 *   <c-chip disabled><c-icon slot="leading" width="18" name="tag"></c-icon>Disabled Chip</c-chip>
 */
export class Chip extends Pill {
	/**
	 * Determines if the chip is disabled.
	 * @attribute
	 */
	disabled = false;

	/**
	 * Captures touch interaction state.
	 * @attribute
	 */
	touched = false;

	/**
	 * Indicates whether the chip is in a selected state,
	 * @attribute
	 * @demo
	 * <c-chip selected><c-icon width="18" name="tag" slot="trailing"></c-icon>Selected Chip</c-chip>
	 */
	selected = false;
}

component(Chip, {
	tagName: 'c-chip',
	init: [
		styleAttribute('disabled'),
		styleAttribute('touched'),
		styleAttribute('selected'),
	],
	augment: [
		role('button'),
		buttonBehavior,
		...buttonBaseStyles,
		css(`
:host { 
	cursor: pointer;
}
:host([disabled]) {
	background-color: color-mix(in srgb, var(--cxl-color--on-surface) 12%, transparent);
	color: color-mix(in srgb, var(--cxl-color--on-surface) 38%, transparent);
	border-color: color-mix(in srgb, var(--cxl-color-on-surface) 12%, transparent);
}
:host([selected]) {
	border-color: var(--cxl-color-secondary-container);
	${surface('secondary-container')}
}
:host(:hover) { box-shadow: none; }
		`),
		ripple,
	],
});
