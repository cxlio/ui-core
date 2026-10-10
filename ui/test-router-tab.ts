import { spec, triggerKeydown, type TestApi } from '@cxl/spec';
import { RouterItem, RouterLink, RouterOutlet, RouterTab, Tab, Tabs, get } from './index.js';
import { MainRouter, QueryStrategy, router, routerState, strategy$ } from './router.js';
import { firstValueFrom } from './rx.js';

async function withRoutes(
	a: TestApi,
	run: (first: string, second: string) => void | Promise<void>,
) {
	const state = router.state;
	const routes = router.routes;
	const instances = router.instances;
	const root = router.root;
	const strategy = strategy$.hasValue ? strategy$.value : QueryStrategy;
	const first = `router-tab-${crypto.randomUUID()}`;
	const second = `${first}-second`;
	router.routes = new MainRouter().routes;
	router.instances = {};
	router.state = undefined;
	router.root = undefined;
	strategy$.next(QueryStrategy);
	router.route({ path: first, render: () => document.createElement('div') });
	router.route({ path: second, render: () => document.createElement('div') });
	try {
		router.go(first);
		await run(first, second);
	} finally {
		a.dom.replaceChildren();
		router.routes = routes;
		router.instances = instances;
		router.state = state;
		router.root = root;
		strategy$.next(strategy);
		if (state) routerState.next();
	}
}

export default spec('router-tab', a => {
	a.test('registers and inherits Tab semantics', a => withRoutes(a, first => {
		const tab = document.createElement('c-router-tab');
		tab.setAttribute('href', first);
		tab.textContent = 'Overview';
		a.dom.append(tab);
		a.ok(tab instanceof RouterTab);
		a.ok(tab instanceof Tab);
		a.equal(tab.getAttribute('href'), first);
		a.equal(tab.role, 'tab');
		a.equal(tab.ariaSelected, 'true');
		a.equal(tab.tabIndex, 0);
		a.equal(tab.shadowRoot?.querySelector('slot')?.assignedNodes()[0]?.textContent, 'Overview');
		a.equal(tab.shadowRoot?.querySelector('a')?.getAttribute('href'), QueryStrategy.getHref(first));
	}));

	a.test('tracks route changes and repeated navigation', a => withRoutes(a, (first, second) => {
		const tab = new RouterTab();
		tab.href = first;
		a.dom.append(tab);
		a.equal(tab.selected, true);
		router.go(second);
		a.equal(tab.selected, false);
		a.equal(tab.ariaSelected, 'false');
		router.go(first);
		router.go(first);
		a.equal(tab.selected, true);
		a.equal(tab.ariaSelected, 'true');
	}));

	a.test('updates selection when href changes or is removed', a => withRoutes(a, (first, second) => {
		const tab = new RouterTab();
		a.dom.append(tab);
		a.equal(tab.selected, false);
		tab.setAttribute('href', first);
		a.equal(tab.selected, true);
		tab.href = second;
		a.equal(tab.selected, false);
		tab.href = first;
		a.equal(tab.selected, true);
		tab.removeAttribute('href');
		a.equal(tab.selected, false);
		a.equal(tab.shadowRoot?.querySelector('a')?.getAttribute('href'), null);
		tab.click();
		a.equal(router.state?.url.path, first);
	}));

	a.test('keeps unmatched routes unselected and rejects invalid navigation', a => withRoutes(a, first => {
		const tab = new RouterTab();
		tab.href = `${first}-missing`;
		a.dom.append(tab);
		a.equal(tab.selected, false);
		a.throws(() => router.go(tab.href ?? ''));
		a.equal(router.state?.url.path, first);
		a.equal(tab.selected, false);
	}));

	a.test('updates shared router-item and router-link href bindings', a => withRoutes(a, first => {
		const item = new RouterItem();
		a.dom.append(item);
		item.href = first;
		a.equal(item.selected, true);
		item.href = undefined;
		a.equal(item.selected, false);
		for (const host of [item, new RouterLink()]) {
			a.dom.append(host);
			host.href = first;
			a.ok(host.shadowRoot?.querySelector('a')?.hasAttribute('href'));
			host.href = undefined;
			a.equal(host.shadowRoot?.querySelector('a')?.getAttribute('href'), null);
		}
	}));

	a.test('navigates on pointer click, Enter, and Space', (a: TestApi) => withRoutes(a, (first, second) => {
		const tab = new RouterTab();
		tab.href = second;
		a.dom.append(tab);
		const link = tab.shadowRoot?.querySelector('a');
		a.assert(link);
		link.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, detail: 1 }));
		a.equal(router.state?.url.path, second);
		for (const key of ['Enter', ' ']) {
			router.go(first);
			triggerKeydown(tab, key);
			a.equal(router.state?.url.path, second);
			a.equal(tab.selected, true);
		}
	}));

	a.test('inherits disabled keyboard behavior', a => withRoutes(a, (first, second) => {
		const tab = new RouterTab();
		tab.href = second;
		tab.disabled = true;
		a.dom.append(tab);
		a.equal(tab.ariaDisabled, 'true');
		a.equal(tab.tabIndex, -1);
		a.equal(getComputedStyle(tab).pointerEvents, 'none');
		triggerKeydown(tab, 'Enter');
		triggerKeydown(tab, ' ');
		a.equal(router.state?.url.path, first);
		tab.disabled = false;
		triggerKeydown(tab, 'Enter');
		a.equal(router.state?.url.path, second);
	}));

	a.testElement('integrates with tab-group keyboard navigation', a => withRoutes(a, async (first, second) => {
		const tabs = new Tabs();
		const outlet = new RouterOutlet();
		tabs.ariaLabel = 'Sections';
		const one = new RouterTab();
		const two = new RouterTab();
		one.textContent = 'Overview';
		two.textContent = 'Details';
		one.href = first;
		two.href = second;
		const registered = firstValueFrom(get(tabs, 'selected').filter(tab => tab === one));
		tabs.append(one, two);
		a.dom.append(tabs, outlet);
		await registered;
		await a.a11y(tabs);
		a.equal(tabs.tabs.size, 2);
		a.equal(one.tabIndex, 0);
		a.equal(two.tabIndex, -1);
		await a.tap(two);
		a.equal(router.state?.url.path, second);
		a.equal<Node | null | undefined>(outlet.firstChild, router.state?.root);
		await a.action({ type: 'press', element: one, value: 'Enter' });
		a.equal(router.state?.url.path, first);
		a.equal<Node | null | undefined>(outlet.firstChild, router.state?.root);
		for (const key of ['ArrowRight', 'Home', 'End', 'ArrowLeft']) {
			triggerKeydown(tabs, key);
			const expected = key === 'ArrowRight' || key === 'End' ? two : one;
			a.equal(tabs.selected, expected);
			a.equal(router.state?.url.path, expected.href);
			a.equal(document.activeElement, expected);
		}
	}));

	a.test('disconnects routing and reconnects without duplicate links', a => withRoutes(a, (first, second) => {
		const tab = new RouterTab();
		tab.href = first;
		a.dom.append(tab);
		a.equal(tab.selected, true);
		tab.remove();
		router.go(second);
		a.equal(tab.selected, true);
		tab.click();
		a.equal(router.state?.url.path, second);
		a.dom.append(tab);
		a.equal(tab.selected, false);
		a.equal(tab.shadowRoot?.querySelectorAll('a').length, 1);
		tab.click();
		a.equal(router.state?.url.path, first);
		a.equal(tab.selected, true);
	}));
});
