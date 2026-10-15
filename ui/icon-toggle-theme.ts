import { component, attribute } from './component.js';
import { IconButtonToggle } from './icon-button-toggle.js';
import { themeBehavior } from './toggle-theme.js';

/**
 * An icon toggle button that applies themeon when open and themeoff when off.
 * Inherits icon switching, pressed-state accessibility, and disabled behavior
 * from IconButtonToggle. Supports saved themes and the preferred color scheme.
 *
 * @beta
 * @demo
 * <c-icon-toggle-theme aria-label="Toggle theme"></c-icon-toggle-theme>
 */
export class IconToggleTheme extends IconButtonToggle {
	/**
	 * Initializes open from the preferred color scheme when no saved theme exists.
	 * @attribute
	 */
	usepreferred = false;

	/**
	 * Optional localStorage key for restoring and saving the active theme.
	 * @attribute
	 */
	persistkey = '';

	/**
	 * Icon to display when the theme toggle is on.
	 * @attribute
	 */
	override iconon = 'wb_sunny';

	/**
	 * Icon to display when the theme toggle is off.
	 * @attribute
	 */
	override iconoff = 'dark_mode';

	/**
	 * Theme to apply when off. An empty value restores the default theme.
	 * @attribute
	 */
	themeoff: string = '';

	/**
	 * Theme to apply when open.
	 * @attribute
	 */
	themeon: string = './theme-dark.js';
}

component(IconToggleTheme, {
	tagName: 'c-icon-toggle-theme',
	init: [
		attribute('persistkey'),
		attribute('usepreferred'),
		attribute('themeon'),
		attribute('themeoff'),
	],
	augment: [themeBehavior],
});
