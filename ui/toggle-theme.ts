import { Component, component, attribute, onUpdate } from './component.js';
import { role } from './a11y.js';
import { observable, merge } from './rx.js';
import { onAction } from './dom.js';
import { defaultThemes, loadTheme } from './theme.js';
import { storage } from './util.js';

declare module './component' {
	interface Components {
		'c-toggle-theme': ToggleTheme;
	}
}

export function toggleThemeBehavior($: ToggleTheme) {
	const themeEl = document.createElement('style');
	return merge(
		observable(sub => {
			const saved = $.persistkey && storage.get($.persistkey);
			if (saved !== undefined) $.open = saved === $.themeon;
			else if ($.usepreferred)
				$.open = matchMedia?.('(prefers-color-scheme: dark)').matches;

			sub.signal.subscribe(() => themeEl.remove());
		}),
		onUpdate($).raf(() => {
			$.setAttribute('aria-pressed', String($.open));
			const themeName = $.open ? $.themeon : $.themeoff;
			if ($.persistkey) storage.set($.persistkey, themeName);
			loadTheme(defaultThemes[themeName] || themeName);
		}),
		onAction($).tap(() => ($.open = !$.open)),
	);
}

/**
 * The ThemeToggle component provides a mechanism for users to switch between different themes within your application.
 * @tagName c-toggle-theme
 * @beta
 */
export class ToggleTheme extends Component {
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

component(ToggleTheme, {
	tagName: 'c-toggle-theme',
	init: [
		attribute('persistkey'),
		attribute('usepreferred'),
		attribute('open'),
		attribute('themeon'),
		attribute('themeoff'),
	],
	augment: [role('group'), toggleThemeBehavior],
});
