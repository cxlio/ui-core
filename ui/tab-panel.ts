import {
	Component,
	Slot,
	attribute,
	component,
	get,
	getShadow,
} from './component.js';
import { EMPTY, combineLatest, merge } from './rx.js';
import { getTarget } from './util.js';
import { ariaControls, getAriaId, role } from './a11y.js';
import { observeChildren } from './dom.js';
import { Tabs } from './tabs.js';

declare module './component.js' {
	interface Components {
		'c-tab-panel': TabPanel;
	}
}

/**
 * Shows content when the associated tab with the same name is selected.
 * Set `tabs` to a Tabs element or its ID and `name` to the matching tab name.
 *
 * @title Tab Panel
 * @icon tab
 * @tagName c-tab-panel
 * @see Tabs
 * @see Tab
 * @demo <caption>Primary Tabs</caption>
<div style="width:100%">
	<c-tabs id="primary-tabs" aria-label="Travel">
		<c-tab name="flights" selected>Flights</c-tab>
		<c-tab name="trips">Trips</c-tab>
	</c-tabs>
	<c-tab-panel tabs="primary-tabs" name="flights"><p>Find a flight.</p></c-tab-panel>
	<c-tab-panel tabs="primary-tabs" name="trips"><p>Plan a trip.</p></c-tab-panel>
</div>
 * @demo <caption>Secondary Tabs</caption>
<div style="width:100%">
	<c-tabs id="secondary-tabs" variant="secondary" aria-label="Product">
		<c-tab name="overview" selected>Overview</c-tab>
		<c-tab name="details">Details</c-tab>
	</c-tabs>
	<c-tab-panel tabs="secondary-tabs" name="overview"><p>Product overview.</p></c-tab-panel>
	<c-tab-panel tabs="secondary-tabs" name="details"><p>Product details.</p></c-tab-panel>
</div>
 */
export class TabPanel extends Component {
	tabs?: Tabs | string;
	name?: string;

	private visible = false;

	static {
		component(TabPanel, {
			tagName: 'c-tab-panel',
			init: [attribute('tabs'), attribute('name')],
			augment: [
				role('tabpanel'),
				$ => {
					const css = new CSSStyleSheet();
					css.replaceSync(':host{display:none}');
					getShadow($).adoptedStyleSheets.push(css);
					function visible(open: boolean) {
						if ($.visible === open) return;
						$.visible = open;
						css.replaceSync(`:host{display:${open ? 'contents' : 'none'}}`);
					}
					return getTarget($, 'tabs').switchMap(target => {
						if (!(target instanceof Tabs)) return EMPTY;
						return observeChildren(target, { subtree: true })
							.raf()
							.switchMap(() => {
								const tabs = Array.from(target.tabs);
								return combineLatest(
									get($, 'name'),
									...tabs.map(tab => get(tab, 'name')),
								)
									.map(([name, ...names]) =>
										name ? tabs[names.indexOf(name)] : undefined,
									)
									.distinctUntilChanged()
									.switchMap(tab =>
										merge(
											get(target, 'selected').tap(selected =>
												visible(!!tab && selected === tab),
											),
											tab
												? merge(
														ariaControls(tab, [$]).finalize(() =>
															tab.removeAttribute('aria-controls'),
														),
														getAriaId(tab)
															.tap(id => $.setAttribute('aria-labelledby', id))
															.finalize(() => $.removeAttribute('aria-labelledby')),
												  )
												: EMPTY,
										),
									);
							})
							.finalize(() => visible(false));
					});
				},
				Slot,
			],
		});
	}

	get open() {
		return this.visible;
	}
}
