import { spec, triggerKeydown } from '@cxl/spec';
import { gridNavigation } from './grid-list.js';
import { manageFocus } from './navigation.js';

function createGrid(host: HTMLElement, count: number) {
	const items = Array.from({ length: count }, (_, index) => {
		const item = document.createElement('button');
		item.textContent = String(index);
		return item;
	});
	host.append(...items);
	return items;
}

function getActive() {
	return document.activeElement instanceof HTMLElement
		? document.activeElement
		: undefined;
}

export default spec('navigation', a => {
	a.test('keeps one naturally focusable child in the tab order', a => {
		const host = document.createElement('div');
		const first = document.createElement('button');
		const second = document.createElement('button');
		host.append(first, second);
		a.dom.appendChild(host);
		const subscription = manageFocus({
			host,
			getFocusable: () => [first, second],
		}).subscribe();

		a.equal(first.tabIndex, 0);
		a.equal(second.tabIndex, -1);
		subscription.unsubscribe();
	});

	a.test('navigates fixed columns and row edges', a => {
		const host = document.createElement('div');
		const items = createGrid(host, 6);
		a.dom.appendChild(host);
		const subscription = gridNavigation({
			host,
			getFocusable: () => items,
			getActive,
			columns: 3,
		}).subscribe();

		items.at(0)?.focus();
		triggerKeydown(host, 'ArrowRight');
		a.equal(document.activeElement, items[1]);
		triggerKeydown(host, 'ArrowDown');
		a.equal(document.activeElement, items[4]);
		triggerKeydown(host, 'Home');
		a.equal(document.activeElement, items[3]);
		host.dispatchEvent(
			new KeyboardEvent('keydown', {
				key: 'Home',
				ctrlKey: true,
				bubbles: true,
			}),
		);
		a.equal(document.activeElement, items[0]);
		subscription.unsubscribe();
	});

	a.test('uses rendered positions for variable columns', a => {
		const host = document.createElement('div');
		host.style.display = 'grid';
		host.style.gridTemplateColumns = 'repeat(2, 100px)';
		const items = createGrid(host, 4);
		a.dom.appendChild(host);
		const subscription = gridNavigation({
			host,
			getFocusable: () => items,
			getActive,
		}).subscribe();

		items.at(0)?.focus();
		triggerKeydown(host, 'ArrowDown');
		a.equal(document.activeElement, items[2]);
		subscription.unsubscribe();
	});
});
