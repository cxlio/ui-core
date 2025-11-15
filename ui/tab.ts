import {
	Component,
	attribute,
	styleAttribute,
	component,
	Slot,
	get,
} from './component.js';
import { onAction } from './dom.js';
import { EMPTY } from './rx.js';

import { role } from './a11y.js';
import { css, media, maskStyles, disabledStyles } from './theme.js';
import { registable } from './registable.js';
import { ripple } from './ripple.js';
import { buttonBehavior } from './button.js';

declare module './component' {
	interface Components {
		'c-tab': Tab;
	}
}

/**
 * The BaseTab class is an abstract component that serves as the foundation for building tab UIs.
 */
export class TabBase extends Component {
	/**
	 * A boolean attribute indicating whether the tab is currently selected.
	 * @attribute
	 */
	selected = false;

	touched = false;

	/**
	 * A boolean attribute indicating if the tab is disabled.
	 */
	disabled = false;

	/**
	 * An optional string attribute allowing you to assign a name to the tab.
	 * If set, the tab will automatically select itself when the user interacts with it.
	 */
	name?: string;
}

component(TabBase, {
	init: [
		styleAttribute('touched'),
		styleAttribute('selected'),
		styleAttribute('disabled'),
		attribute('name'),
	],
	augment: [
		role('tab'),
		buttonBehavior,
		$ => registable('tabs', $),
		host =>
			get(host, 'name').switchMap(name => {
				return name
					? onAction(host).tap(() => (host.selected = true))
					: EMPTY;
			}),
		$ =>
			get($, 'selected').tap(v => {
				$.setAttribute('aria-selected', v ? 'true' : 'false');
			}),
	],
});

/**
 * Represents a selectable option within a tab group, enabling users to switch
 * between multiple content sections in a compact container. Supports both mouse
 * and keyboard interaction for quick navigation.
 *
 * Use the `name` attribute to
 * uniquely identify tabs and programmatically control selection.
 * 
 * When placed inside a tab group, activation automatically updates the active
 * state and notifies the group. The tab is focusable using keyboard navigation.
 * 
 * Keyboard: Activated by Space or Enter, and participates in arrow navigation
 * as managed by the tab group.
 *
 * @title Tab – Switch Between Content Areas
 * @icon tab
 * @tagName c-tab
 * @example
<c-tabs>
	<c-tab name="tab1" selected>Tab 1</c-tab>
	<c-tab name="tab2">Tab 2</c-tab>
	<c-tab name="tab3">Tab 3</c-tab>
</c-tabs>
 * @see Tabs
 */
export class Tab extends TabBase {}
component(Tab, {
	tagName: 'c-tab',
	augment: [
		css(`
:host {
	--cxl-color-on-surface: var(--cxl-color-on-surface-variant);
	box-sizing: border-box;
	background-color: var(--cxl-color-surface);
	color: var(--cxl-color-on-surface);
	font: var(--cxl-font-title-small);
	letter-spacing: var(--cxl-letter-spacing-title-small);
	flex-shrink: 0;
	flex-grow: 1;
	padding: 7px 16px 8px 16px;
	min-height: 47px;
	flex-direction: var(--cxl-tabs-direction, row);
	text-decoration: none;
	justify-content: center;
	display: inline-flex;
	gap: 4px 8px;
	align-items: center;
	cursor: pointer;
	min-width: 90px;
	position: relative;
}
:host([selected]) { 
	--cxl-color-on-surface: var(--cxl-color-primary);
}
${media('small', ':host { flex-grow: 0 }')}
		`),
		ripple,
		disabledStyles,
		maskStyles,
		Slot,
	],
});
