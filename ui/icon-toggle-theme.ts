import { component, attribute, get } from './component.js';
import { IconButton } from './icon-button.js';
import { toggleThemeBehavior } from './toggle-theme.js';
import { combineLatest } from './rx.js';

/**
 * The ThemeToggleIcon component offers a visual toggle for users to switch between themes. It renders an icon button that reflects the current theme state
 *
 * - Renders an icon button with the appropriate icon based on the toggle state.
 * - Manages theme toggling functionality, inheriting behavior from ThemeToggleBehavior.
 * - Updates the displayed icon when the toggle state changes.
 *
 * @beta
 * @demo
 * <c-icon-toggle-theme aria-label="Toggle theme"></c-icon-toggle-theme>
 */
export class IconToggleTheme extends IconButton {
	/**
	 * This attribute controls the initial state of the toggle. Set value to true to make the toggle button selected by default.
	 */
	open = false;

	/**
	 * This attribute determines whether the component should use the user's preferred color scheme from the browser settings. Set usepreferred to true to enable this behavior.
	 */
	usepreferred = false;

	/**
	 * This attribute specifies a key to be used for storing the user's theme preference in local storage. If provided, the component will attempt to retrieve the stored preference on initialization and set the toggle state accordingly. It will also update local storage whenever the user changes the theme using the toggle button.
	 *
	 */
	persistkey = '';

	/** Name of the icon to display when the toggle is active (default: "wb_sunny"). */
	iconon = 'wb_sunny';
	/**  Name of the icon to display when the toggle is inactive (default: "dark_mode"). */
	iconoff = 'dark_mode';

	/**
	 * This attribute specifies the name of the theme activated when the toggle button is off.
	 * If empty it will use the default theme.
	 */
	themeoff: string = '';

	/**
	 * This attribute specifies the name of the theme activated when the toggle button is on.
	 */
	themeon: string = './theme-dark.js';
}

component(IconToggleTheme, {
	tagName: 'c-icon-toggle-theme',
	init: [
		attribute('persistkey'),
		attribute('usepreferred'),
		attribute('open'),
		attribute('themeon'),
		attribute('themeoff'),
	],
	augment: [
		toggleThemeBehavior,
		$ =>
			combineLatest(
				get($, 'iconon'),
				get($, 'iconoff'),
				get($, 'open'),
			).tap(() => ($.icon = $.open ? $.iconon : $.iconoff)),
	],
});
