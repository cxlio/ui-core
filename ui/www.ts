import { Component, component } from './component.js';
import {
	SurfaceColorNames,
	TypographyValues,
	font,
	media,
	newStylesheet,
	spacingValues,
} from './theme.js';

declare module './component' {
	interface Components {
		'c-www': Www;
	}
}

const cornerSize = {
	xl: 'xlarge',
	lg: 'large',
	md: 'medium',
	sm: 'small',
	xs: 'xsmall',
	full: 'full',
} as const;

const surfaceRules = SurfaceColorNames.map(c =>
	c === 'inherit'
		? `[c~="surface-${c}"]{background-color:inherit;color:inherit}
[c~="color-${c}"]{color:inherit}`
		: `[c~="surface-${c}"]{background-color:var(--cxl-color-${c});color:var(--cxl-color-on-${c})}
[c~="color-${c}"]{color:var(--cxl-color-${c})}`,
).join('');

const base = `[c~="cover"]{object-fit:cover;width:100%;height:100%;}
[c~="fill"]{position:absolute;inset:0;}
[c~="text-center"]{text-align:center;}
[c~="text-left"]{text-align:left;}
[c~="text-right"]{text-align:right;}
[c~="vflex"]{display:flex;flex-direction:column;}
[c~="flex"]{display:flex;}
[c~="grow"]{flex-grow:1}
[c~="wrap"]{flex-wrap:wrap;}
[c~="hide"]{display:none;}
[c~="show"]{display:initial;}
[c~="section-header"]{display:block;${font('title-medium')}margin-bottom:48px;grid-column:1 / -1;}
[c~="section-header"] > h2{${font('display-small')}font-weight:700;}
${surfaceRules}
${TypographyValues.map(t => `[c-font="${t}"]{${font(t)}}`).join('')}
${spacingValues
	.map(
		t => `[c~="pad-${t}"]{padding:${t}px}
[c~="corner-${t}"]{border-radius:${t}px}
[c~="gap-${t}"]{gap:${t}px}`,
	)
	.join('')}
${Object.entries(cornerSize)
	.map(
		([k, v]) =>
			`[c~="corner-${k}"]{border-radius:var(--cxl-shape-corner-${v})}`,
	)
	.join('')}
[c~="surface-scrim"]{
	background-color:var(--cxl-color-scrim);
	background-size:cover;
	background-blend-mode:darken;
	background-position:center;
}`;

export const wwwCss = `${base}
${media('small', base.replace(/\[c~/g, '[c\\:sm~'))}
`;

const stylesheets = new WeakMap<Document, CSSStyleSheet>();

export function installWwwCss(doc: Document = document): CSSStyleSheet {
	let stylesheet = stylesheets.get(doc);
	if (!stylesheet) {
		stylesheet = newStylesheet(wwwCss);
		doc.adoptedStyleSheets.push(stylesheet);
		stylesheets.set(doc, stylesheet);
	}
	return stylesheet;
}

/**
 * Installs website utility CSS.
 *
 * @tagName c-www
 * @title Website Utilities
 * @demo
 * <c-www></c-www>
 * <header c="section-header">
 *   <h2>Build product pages faster</h2>
 *   <p>Use website utilities with semantic page markup.</p>
 * </header>
 */
export class Www extends Component {}

component(Www, {
	tagName: 'c-www',
	augment: [
		$ => {
			installWwwCss($.ownerDocument);
		},
	],
});
