import type { ThemeDefinition, TypographyValues } from './theme.js';

const typography: typeof TypographyValues = [
	'display-large',
	'display-medium',
	'display-small',
	'body-large',
	'body-medium',
	'body-small',
	'label-large',
	'label-medium',
	'label-small',
	'headline-large',
	'headline-medium',
	'headline-small',
	'title-large',
	'title-medium',
	'title-small',
	'code',
];

const fontSize = '16px';
/*const IconButton =
	':host{padding:0 16px 0 16px;margin:0 -16px 0 -16px;border-radius:0}';
const Tab =
	':host{min-height:24px;padding-top:2px;line-height:20px;column-gap:16px}:host([aria-selected="true"]){background-color:#808080;color:#ffffff}';*/

const colors = {
	background: '#000080',
	'on-background': '#c0c0c0',
	primary: '#c0c0c0',
	'on-primary': '#000000',
	'primary-container': '#808080',
	'on-primary-container': '#000000',
	secondary: '#008080',
	'on-secondary': '#ffffff',
	'secondary-container': '#004040',
	'on-secondary-container': '#c0ffff',
	tertiary: '#00c0c0',
	'on-tertiary': '#000000',
	'tertiary-container': '#006060',
	'on-tertiary-container': '#c0ffff',
	error: '#800000',
	'on-error': '#ffffff',
	'error-container': '#ffb4ab',
	'on-error-container': '#800000',
	surface: '#000080',
	'on-surface': '#c0c0c0',
	'surface-variant': '#808080',
	'on-surface-variant': 'fff',
	outline: '#000000',
	'outline-variant': '#808080',
	shadow: '#000000',
	scrim: '#000000',
	'inverse-surface': '#ffffff',
	'on-inverse-surface': '#000000',
	'inverse-primary': '#000080',
	'primary-fixed': '#c0c0c0',
	'on-primary-fixed': '#000000',
	'primary-fixed-dim': '#808080',
	'on-primary-fixed-variant': '#000000',
	'secondary-fixed': '#008080',
	'on-secondary-fixed': '#ffffff',
	'secondary-fixed-dim': '#004040',
	'on-secondary-fixed-variant': '#c0ffff',
	'tertiary-fixed': '#00c0c0',
	'on-tertiary-fixed': '#000000',
	'tertiary-fixed-dim': '#006060',
	'on-tertiary-fixed-variant': '#c0ffff',
	'surface-dim': '#606080',
	'surface-bright': '#e0e0ff',
	'surface-container-lowest': '#000040',
	'surface-container-low': '#171c40',
	'surface-container': '#404080',
	'surface-container-high': '#4060a0',
	'surface-container-highest': '#8080e0',
	warning: '#ff0000',
	'on-warning': '#000000',
	'warning-container': '#fff3cf',
	'on-warning-container': '#4e3400',
	success: '#008000',
	'on-success': '#ffffff',
	'success-container': '#81c784',
	'on-success-container': '#000000',
};

/**
 * Terminal User Interface Theme
 * @alpha
 */
const theme: ThemeDefinition = {
	name: 'tui',
	colors,
	globalCss: `:root{
--cxl-font-family: "Roboto Mono", monospace;
--cxl-font-size: ${fontSize};
--cxl-scrollbar-width: 16px;
--cxl-scrollbar-height: 24px;
--cxl-scrollbar-background: #808080;
--cxl-scrollbar-foreground: #008080;
--cxl-shape-corner-xlarge: 0;
--cxl-shape-corner-large: 0;
--cxl-shape-corner-medium: 0;
--cxl-shape-corner-small: 0;
--cxl-shape-corner-xsmall: 0;
--cxl-shape-corner-full: 0;
${[1, 2, 3, 4, 5].map(n => `--cxl-elevation-${n}:none;`)}
${typography
	.map(
		t =>
			`--cxl-font-${t}: 400 var(--cxl-font-size)/24px var(--cxl-font-family);--cxl-letter-spacing-${t}:normal;`,
	)
	.join('')}
}
`,
	/*override: {
		'C-PROGRESS': ':host{height:12px;} :host .indicator{height:12px}',
		'C-ALERT': `:host{margin-top:12px;margin-bottom:12px}
:host([dense]){padding:0;margin:0;}
:host([dense][outline]){border-width:0}
:host([outline]){border-width:16px;}`,
		'C-APPBAR': `:host .flex{height:24px;padding:0 16px}`,
		'C-DIALOG': `:host .content{outline:1px solid var(--cxl-divider);outline-offset:-8px;padding:24px 16px}`,
		'C-FIELD':
			':host([outline]){padding:11px 7px}:host([outline]) .container{border-radius:0}:host(:focus-within) .label{color:var(--cxl-background)} ',
		'C-ICON': `:host{width:16px}`,
		'C-ICON-BUTTON': IconButton,
		'C-THEME-TOGGLE-ICON': IconButton,
		'C-NAVBAR': ':host{height:24px}',
		'C-TOOLBAR':
			':host{min-height:24px;gap:0 16px;padding:0 16px 0 16px}:host([dense]){min-height:24px}',
		'C-HR': `:host{margin:11px -8px 12px -8px}`,
		'C-BUTTON':
			':host,:host([size]){border-radius:0;font-size:16px;padding:0 16px;min-height:24px}:host{gap:16px}',
		'C-TAB': Tab,
		'C-ROUTER-TAB': Tab,
		'C-TABS': ':host .selected{display:none !important}',
		'C-GRID': ':host {row-gap:24px}',
	},*/
};

export default theme;
