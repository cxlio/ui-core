import { spec, type TestApi } from '@cxl/spec';
import { Tab, TabPanel, Tabs, create } from './index.js';

function frame() {
	return new Promise<void>(resolve =>
		requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
	);
}

async function setup(a: TestApi) {
	const tabs = create(Tabs, { id: `tabs-${crypto.randomUUID()}`, ariaLabel: 'Sections' });
	const one = create(Tab, { name: 'one', selected: true }, 'One');
	const two = create(Tab, { name: 'two' }, 'Two');
	const first = create(TabPanel, { tabs: tabs.id, name: 'one' }, 'First panel');
	const second = create(TabPanel, { tabs, name: 'two' }, 'Second panel');
	tabs.append(one, two);
	a.dom.append(tabs, first, second);
	await frame();
	return { tabs, one, two, first, second };
}

export default spec('tab-panel', a => {
	a.test('registers, slots content, and associates panels by name', async a => {
		const { tabs, one, two, first, second } = await setup(a);
		a.ok(document.createElement('c-tab-panel') instanceof TabPanel);
		a.equal(first.role, 'tabpanel');
		a.equal(first.shadowRoot?.querySelector('slot')?.assignedNodes()[0]?.textContent, 'First panel');
		a.equal(first.open, true);
		a.equal(second.open, false);
		a.equal(getComputedStyle(first).display, 'contents');
		a.equal(getComputedStyle(second).display, 'none');
		a.ok(first.id);
		a.ok(one.id);
		a.equal(one.getAttribute('aria-controls'), first.id);
		a.equal(two.getAttribute('aria-controls'), second.id);
		a.equal(first.getAttribute('aria-labelledby'), one.id);
		a.equal(second.getAttribute('aria-labelledby'), two.id);
		await a.a11y(tabs);
	});

	a.testElement('updates visibility on selection and deselection', async a => {
		const { tabs, one, two, first, second } = await setup(a);
		await a.action({ type: 'click', element: two });
		a.equal(tabs.selected, two);
		a.equal(first.open, false);
		a.equal(second.open, true);
		a.equal(getComputedStyle(first).display, 'none');
		a.equal(getComputedStyle(second).display, 'contents');
		two.selected = false;
		a.equal(first.open, false);
		a.equal(second.open, false);
		one.selected = true;
		a.equal(first.open, true);
		await a.action({ type: 'press', element: one, value: 'ArrowRight' });
		a.equal(second.open, true);
		a.equal(document.activeElement, two);
		await a.action({ type: 'press', element: two, value: 'Home' });
		a.equal(first.open, true);
		a.equal(second.open, false);
		a.equal(document.activeElement, one);
	});

	a.test('hides panels with absent, unresolved, invalid, or unmatched targets', async a => {
		const panel = create(TabPanel, { name: 'one' });
		a.dom.append(panel);
		a.equal(panel.open, false);
		a.equal(getComputedStyle(panel).display, 'none');
		panel.tabs = 'missing-tabs';
		a.equal(panel.open, false);
		const invalid = create('div', { id: `invalid-${crypto.randomUUID()}` });
		a.dom.append(invalid);
		panel.tabs = invalid.id;
		a.equal(panel.open, false);
		const tabs = create(Tabs);
		tabs.append(create(Tab, { name: 'two', selected: true }));
		a.dom.append(tabs);
		panel.tabs = tabs;
		await frame();
		a.equal(panel.open, false);
		a.equal(panel.getAttribute('aria-labelledby'), null);
		panel.name = undefined;
		a.equal(panel.open, false);
	});

	a.test('resolves IDs in the local shadow root', async a => {
		const host = create('div');
		const root = host.attachShadow({ mode: 'open' });
		const id = `shadow-tabs-${crypto.randomUUID()}`;
		const outer = create(Tabs, { id });
		const tabs = create(Tabs, { id });
		const tab = create(Tab, { name: 'one', selected: true });
		const panel = create(TabPanel, { tabs: id, name: 'one' });
		tabs.append(tab);
		root.append(tabs, panel);
		a.dom.append(outer, host);
		await frame();
		a.equal(panel.open, true);
		a.equal(tab.getAttribute('aria-controls'), panel.id);
		a.equal(panel.getAttribute('aria-labelledby'), tab.id);
	});

	a.test('reacts to panel and tab name changes without stale associations', async a => {
		const { one, first, second } = await setup(a);
		second.remove();
		first.setAttribute('name', 'missing');
		a.equal(first.open, false);
		a.equal(one.getAttribute('aria-controls'), null);
		a.equal(first.getAttribute('aria-labelledby'), null);
		one.setAttribute('name', 'missing');
		a.equal(first.open, true);
		a.equal(one.getAttribute('aria-controls'), first.id);
		one.name = undefined;
		a.equal(first.open, false);
		a.equal(one.getAttribute('aria-controls'), null);
		first.name = 'one';
		one.name = 'one';
		a.equal(first.open, true);
		first.removeAttribute('name');
		a.equal(first.open, false);
		a.equal(first.getAttribute('aria-labelledby'), null);
	});

	a.test('associates dynamically added nested tabs and removes detached tabs', async a => {
		const tabs = create(Tabs);
		const container = create('div');
		tabs.append(container);
		const panel = create(TabPanel, { tabs, name: 'dynamic' });
		a.dom.append(tabs, panel);
		await frame();
		a.equal(panel.open, false);
		const tab = create(Tab, { name: 'dynamic', selected: true });
		container.append(tab);
		await frame();
		a.equal(panel.open, true);
		a.equal(tab.getAttribute('aria-controls'), panel.id);
		tab.remove();
		await frame();
		a.equal(panel.open, false);
		a.equal(tab.getAttribute('aria-controls'), null);
		a.equal(panel.getAttribute('aria-labelledby'), null);
		container.append(tab);
		await frame();
		a.equal(panel.open, true);
		a.equal(tab.getAttribute('aria-controls'), panel.id);
	});

	a.test('tracks explicit ID changes and regenerates removed IDs', async a => {
		const { one, first } = await setup(a);
		first.id = `panel-${crypto.randomUUID()}`;
		one.id = `tab-${crypto.randomUUID()}`;
		await frame();
		a.equal(one.getAttribute('aria-controls'), first.id);
		a.equal(first.getAttribute('aria-labelledby'), one.id);
		first.removeAttribute('id');
		one.removeAttribute('id');
		await frame();
		a.ok(first.id);
		a.ok(one.id);
		a.equal(one.getAttribute('aria-controls'), first.id);
		a.equal(first.getAttribute('aria-labelledby'), one.id);
	});

	a.test('cleans up on reassociation and target removal', async a => {
		const { one, first } = await setup(a);
		const tabs = create(Tabs, { id: `replacement-${crypto.randomUUID()}` });
		const tab = create(Tab, { name: 'one', selected: true });
		tabs.append(tab);
		a.dom.append(tabs);
		first.setAttribute('tabs', tabs.id);
		a.equal(one.getAttribute('aria-controls'), null);
		await frame();
		a.equal(first.open, true);
		a.equal(tab.getAttribute('aria-controls'), first.id);
		a.equal(first.getAttribute('aria-labelledby'), tab.id);
		first.removeAttribute('tabs');
		a.equal(first.open, false);
		a.equal(tab.getAttribute('aria-controls'), null);
		a.equal(first.getAttribute('aria-labelledby'), null);
		first.tabs = tabs;
		await frame();
		a.equal(first.open, true);
		first.tabs = 'unresolved';
		a.equal(first.open, false);
		a.equal(tab.getAttribute('aria-controls'), null);
	});

	a.test('cleans up subscriptions and restores bindings on reconnect', async a => {
		const { one, first } = await setup(a);
		first.remove();
		a.equal(first.open, false);
		a.equal(one.getAttribute('aria-controls'), null);
		a.equal(first.getAttribute('aria-labelledby'), null);
		one.selected = false;
		first.name = 'renamed';
		one.name = 'renamed';
		one.selected = true;
		await frame();
		a.equal(first.open, false);
		a.equal(one.getAttribute('aria-controls'), null);
		a.dom.append(first);
		await frame();
		a.equal(first.open, true);
		a.equal(one.getAttribute('aria-controls'), first.id);
		a.equal(first.getAttribute('aria-labelledby'), one.id);
		a.equal(first.shadowRoot?.querySelectorAll('slot').length, 1);
		a.equal(first.shadowRoot?.adoptedStyleSheets.length, 1);
	});
});
