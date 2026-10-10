import { attribute, component } from './component.js';
import { Tab } from './tab.js';
import { routerSelectable } from './router-selectable.js';

declare module './component.js' {
	interface Components {
		'c-router-tab': RouterTab;
	}
}

/**
 * A tab that navigates to a route and reflects whether that route is active.
 *
 * @title Router Tab
 * @icon tab
 * @tagName c-router-tab
 * @see Tab
 * @see Tabs
 * @see RouterOutlet
 * @demo
<div style="width:100%">
	<c-router strategy="query">
		<template data-path="" data-default><h2>Overview</h2></template>
		<template data-path="details"><h2>Details</h2></template>
	</c-router>
	<c-tabs aria-label="Sections">
		<c-router-tab href="">Overview</c-router-tab>
		<c-router-tab href="details">Details</c-router-tab>
	</c-tabs>
	<c-router-outlet></c-router-outlet>
</div>
 */
export class RouterTab extends Tab {
	/**
	 * The route to navigate to when the tab is activated.
	 * @attribute
	 */
	href?: string;
}

component(RouterTab, {
	tagName: 'c-router-tab',
	init: [attribute('href')],
	augment: [
		$ =>
			routerSelectable($).tap(isSelected => {
				$.selected = isSelected;
			}),
	],
});
