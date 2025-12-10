import {
	Component,
	component,
	create,
	getShadow,
	property,
	styleAttribute,
	Slot,
	get,
} from './component.js';
import { isHidden, onResize } from './dom.js';
import { Observable, Subject, merge } from './rx.js';
import { Span } from './span.js';
import { role } from './a11y.js';
import { css, onFontsReady } from './theme.js';
import { registableHost } from './registable.js';
import { navigation } from './navigation.js';

import type { TabBase, Tab } from './tab.js';

declare module './registable.js' {
	interface RegistableMap {
		tabs: TabBase;
	}
}

declare module './component' {
	interface Components {
		'c-tabs': Tabs;
	}
}

/**
 * Organizes related content in separate, switchable sections within one view.
 *
 * Users can switch between sections by selecting each tab directly or by
 * navigating with the keyboard. Only one tab section is shown at a time, with
 * visual indication of the active tab.
 *
 * The currently active tab is set with the `selected` property or by selecting
 * a tab element that is a child of this component. The component manages an
 * internal set of all child tab elements and updates the selected tab and
 * selection underline as tabs are added, removed, or reordered.
 *
 * Supports keyboard navigation: use left/right arrows to move between tabs,
 * Home/End to jump to the first or last tab, and Enter/Space to activate a
 * focused tab.
 *
 * @title Organize Sections with Switchable Tabs
 * @icon tab
 * @tagName c-tabs
 * @demo <caption>Primary Tabs</caption>
<c-tabs>
	<c-tab name="tab1" selected>
		<c-icon name="flight"></c-icon>
		Flights
	</c-tab>
	<c-tab name="tab2">
		<c-icon name="trip"></c-icon>
		Trips
	</c-tab>
	<c-tab name="tab3">
		<c-icon name="explore"></c-icon>
		Explore
	</c-tab>
</c-tabs>
 * @demo <caption>Secondary Tabs</caption>
<c-tabs variant="secondary">
	<c-tab name="tab1" selected>Overview</c-tab>
	<c-tab name="tab2">Specifications</c-tab>
	<c-tab name="tab3">Explore</c-tab>
</c-tabs>
 * @see Tab
 * @see TabPanel
 */
export class Tabs extends Component {
	/**
	 * This attribute specifies the currently selected tab within the Tabs component.
	 * It should reference a Tab element from within the tabs container.
	 */
	selected?: Tab;

	/**
	 * This property holds a Set containing all the Tab elements nested within the Tabs component.
	 */
	readonly tabs = new Set<Tab>();

	/**
	 * This property specifies the visual style of the Tabs component.
	 * The `primary` variant is the default look.
	 * @attribute
	 */
	variant?: 'primary' | 'secondary';
}

component(Tabs, {
	tagName: 'c-tabs',
	init: [property('selected'), styleAttribute('variant')],
	augment: [
		role('tablist'),
		css(`
			:host {
				background-color: var(--cxl-color-surface);
				color: var(--cxl-color-on-surface);
				flex-shrink: 0;
				position: relative;
				overflow-y: hidden;
				display: flex;
				align-items: center;
				overflow-x: auto;
				border-bottom: 1px solid var(--cxl-color-surface-variant);
				--cxl-tabs-direction: column;
				--cxl-tabs-height: 63px;
			}
			.selected {
				transform-origin: left;
				background-color: var(--cxl-color-primary);
				height: 3px;
				border-radius: 3px 3px 0 0;
				width: 100px;
				display: none;
				position:absolute;
				left: 0;
				transition: transform var(--cxl-speed);
				bottom: 0;
			}
			:host([variant=secondary]) {
				--cxl-tabs-direction: row;
				--cxl-tabs-height: 47px;
			}
			:host([variant=secondary]) .selected {
				height: 2px;
				margin-top: -2px;
				border-radius: 0;
			}
		`),
		Slot,

		$ => {
			function getNext(off = 1) {
				const all = Array.from($.tabs);
				const focused = $.selected || all[0];
				const i = all.indexOf(focused);
				return i === -1 ? null : all[i + off] || null;
			}

			return navigation<Tab>({
				host: $,
				goRight: getNext.bind(null, 1),
				goLeft: getNext.bind(null, -1),
				goFirst: () => Array.from($.tabs)[0] || null,
				goLast: () => Array.from($.tabs)[$.tabs.size - 1] || null,
			}).tap(el => {
				if (el) {
					el.click();
					el.focus?.();
				}
			});
		},
		host => {
			const resize$ = new Subject<void>();

			getShadow(host).append(
				create(Span, {
					className: 'selected',
					$: el =>
						merge(
							onFontsReady(),
							get(host, 'selected'),
							get(host, 'variant'),
							resize$,
							onResize(host),
						).raf(() => {
							if (isHidden(host)) return;
							const sel = host.selected;
							if (!sel) return (el.style.transform = 'scaleX(0)');
							const left = sel.offsetLeft;

							if (host.variant === 'secondary') {
								const scaleX = sel.clientWidth / 100;
								el.style.transform = `translate(${left}px, 0) scaleX(${scaleX})`;
								el.style.display = 'block';
							} else {
								const range = document.createRange();
								range.selectNodeContents(sel);
								const { width } = range.getBoundingClientRect();
								const x = left + (sel.clientWidth - width) / 2;
								const scaleX = width / 100;
								el.style.transform = `translate(${x}px, 0) scaleX(${scaleX})`;
								el.style.display = 'block';
							}

							if (host.scrollWidth !== sel.clientWidth)
								host.scrollLeft = left - 32;
						}),
				}),
			);

			return registableHost('tabs', host, host.tabs)
				.raf()
				.switchMap(ev => {
					const bindings: Observable<unknown>[] = [];
					for (const el of ev.elements)
						bindings.push(
							get(el, 'selected').tap(selected => {
								if (selected) {
									if (host.selected && host.selected !== el)
										host.selected.selected = false;
									host.selected = el;
								} else if (host.selected === el)
									host.selected = undefined;
								el.tabIndex = selected ? 0 : -1;
							}),
							onResize(el).tap(() => resize$.next()),
						);
					return merge(...bindings);
				});
		},
	],
});
