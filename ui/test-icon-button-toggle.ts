import { spec, type TestApi } from '@cxl/spec';
import {
	Icon,
	IconButton,
	IconButtonToggle,
	IconToggleTheme,
	create,
	get,
	getRegisteredComponents,
	loadTheme,
	themeName,
} from './index.js';
import { ToggleTheme } from './toggle-theme.js';

function icon(button: IconButton) {
	const icon = button.shadowRoot?.querySelector('c-icon');
	if (!(icon instanceof Icon)) throw new Error('Missing icon');
	return icon;
}

function key(button: IconButton, key: string) {
	button.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true }));
	button.dispatchEvent(new KeyboardEvent('keyup', { key, bubbles: true }));
}

function frame() {
	return new Promise<void>(resolve => requestAnimationFrame(() => resolve()));
}

export default spec('icon-button-toggle', a => {
	a.test('registers through the public package entry point', a => {
		const button = document.createElement('c-icon-button-toggle');
		a.ok(button instanceof IconButtonToggle);
		a.ok(button instanceof IconButton);
		a.equal(customElements.get('c-icon-button-toggle'), IconButtonToggle);
		a.equal(getRegisteredComponents()['c-icon-button-toggle'], IconButtonToggle);
	});

	a.test('synchronizes initial, property, and attribute state while preserving iconoff', a => {
		const button = create(IconButtonToggle, { iconoff: 'search', iconon: 'notifications', ariaLabel: 'Search' });
		a.dom.append(button);
		a.equal(button.open, false);
		a.equal(button.hasAttribute('open'), false);
		a.equal(button.ariaPressed, 'false');
		a.equal(button.role, 'button');
		a.equal(button.tabIndex, 0);
		a.equal(icon(button).name, 'search');
		button.open = true;
		a.ok(button.hasAttribute('open'));
		a.equal(button.ariaPressed, 'true');
		a.equal(icon(button).name, 'notifications');
		a.equal(button.iconoff, 'search');
		button.iconoff = 'notifications';
		button.iconon = 'search';
		a.equal(icon(button).name, 'search');
		button.removeAttribute('open');
		a.equal(button.open, false);
		a.equal(button.ariaPressed, 'false');
		a.equal(icon(button).name, 'notifications');
		button.setAttribute('open', '');
		a.equal(button.open, true);
		a.equal(button.ariaLabel, 'Search');
		button.iconon = undefined;
		a.equal(icon(button).name, 'notifications');
		button.iconon = '';
		a.equal(icon(button).name, 'notifications');
		button.setAttribute('iconon', 'search');
		a.equal(button.iconon, 'search');
		a.equal(icon(button).name, 'search');
		button.removeAttribute('iconon');
		a.equal(icon(button).name, 'notifications');
	});

	a.test('reads initial open markup and preserves icon presentation and naming', (a: TestApi) => {
		a.dom.innerHTML = '<span id="toggle-name">Search</span><c-icon-button-toggle iconoff="search" iconon="notifications" open fill alt="Search" aria-labelledby="toggle-name"></c-icon-button-toggle>';
		const button = a.dom.querySelector('c-icon-button-toggle');
		a.assert(button instanceof IconButtonToggle);
		a.equal(button.open, true);
		a.equal(button.ariaPressed, 'true');
		a.equal(icon(button).name, 'notifications');
		button.width = 32;
		button.height = 28;
		a.equal(icon(button).width, 32);
		a.equal(icon(button).height, 28);
		a.equal(icon(button).fill, true);
		a.equal(icon(button).alt, 'Search');
		button.click();
		a.equal(button.getAttribute('aria-labelledby'), 'toggle-name');
		a.equal(icon(button).alt, 'Search');
	});

	a.test('toggles once per click or Enter/Space activation', a => {
		const button = a.element(IconButtonToggle);
		let changes = 0;
		const sub = get(button, 'open').subscribe(() => changes++);
		for (const activate of [() => button.click(), () => key(button, 'Enter'), () => key(button, ' ')]) {
			const previous = button.open;
			const count = changes;
			activate();
			a.equal(button.open, !previous);
			a.equal(changes, count + 1);
		}
		key(button, 'Escape');
		a.equal(changes, 4);
		sub.unsubscribe();
	});

	a.test('ignores disabled activation and permits programmatic selection', a => {
		const button = create(IconButtonToggle, { disabled: true });
		a.dom.append(button);
		for (const open of [false, true]) {
			button.open = open;
			button.click();
			button.dispatchEvent(new MouseEvent('click', { bubbles: true }));
			key(button, 'Enter');
			key(button, ' ');
			a.equal(button.open, open);
			a.equal(button.ariaPressed, String(open));
		}
		a.equal(button.ariaDisabled, 'true');
		a.equal(button.hasAttribute('tabindex'), false);
		button.disabled = false;
		button.click();
		a.equal(button.open, false);
	});

	a.test('restores bindings after reconnect without duplicate handlers or icons', a => {
		const button = create(IconButtonToggle, { iconoff: 'search', iconon: 'notifications' });
		a.dom.append(button);
		for (let i = 0; i < 3; i++) {
			button.remove();
			button.open = true;
			button.iconoff = 'search';
			a.dom.append(button);
			a.equal(button.ariaPressed, 'true');
			a.equal(icon(button).name, 'notifications');
			a.equal(button.shadowRoot?.querySelectorAll('c-icon').length, 1);
			button.click();
			a.equal(button.open, false);
			a.equal(icon(button).name, 'search');
		}
	});

	for (const variant of ['text', 'outlined', 'filled', 'elevated'] as const) {
		a.test(`${variant} has distinct on-state styling and accessible states`, async (a: TestApi) => {
			const button = create(IconButtonToggle, { variant, iconoff: 'search', ariaLabel: 'Search' });
			a.dom.append(button);
			const background = getComputedStyle(button).backgroundColor;
			button.open = true;
			a.ok(getComputedStyle(button).backgroundColor !== background);
			a.equal(button.variant, variant);
			await a.a11y(button);
			button.open = false;
			await a.a11y(button);
			button.disabled = true;
			await a.a11y(button);
		});
	}

	a.test('theme toggle inherits state and icon switching', a => {
		const button = create(IconToggleTheme, { themeon: '', themeoff: '', ariaLabel: 'Theme' });
		a.dom.append(button);
		a.ok(button instanceof IconButtonToggle);
		a.equal(icon(button).name, 'dark_mode');
		button.open = true;
		a.equal(button.open, true);
		a.equal(button.ariaPressed, 'true');
		a.equal(icon(button).name, 'wb_sunny');
		button.iconon = 'notifications';
		button.iconoff = 'search';
		a.equal(icon(button).name, 'notifications');
		button.open = false;
		a.equal(button.open, false);
		a.equal(icon(button).name, 'search');
		button.setAttribute('open', '');
		a.equal(button.open, true);
		button.removeAttribute('open');
		a.equal(button.open, false);
		button.click();
		a.equal(button.open, true);
		button.disabled = true;
		button.click();
		key(button, 'Enter');
		key(button, ' ');
		a.equal(button.open, true);
		button.disabled = false;
		key(button, 'Enter');
		a.equal(button.open, false);
		key(button, ' ');
		a.equal(button.open, true);
		a.equal(button.ariaLabel, 'Theme');
	});

	a.test('theme toggle restores persisted selection and updates storage after reconnect', async (a: TestApi) => {
		const persistkey = `icon-button-toggle-${crypto.randomUUID()}`;
		localStorage.setItem(persistkey, './theme-dark.js');
		const button = create(IconToggleTheme, { persistkey });
		try {
			a.dom.append(button);
			a.equal(button.open, true);
			await themeName.filter(name => name === 'dark').first();
			a.equal(themeName.value, 'dark');
			a.equal(localStorage.getItem(persistkey), './theme-dark.js');
			button.open = false;
			await frame();
			a.equal(localStorage.getItem(persistkey), '');
			a.equal(themeName.value, '');
			button.remove();
			button.open = true;
			a.dom.append(button);
			a.equal(button.open, false);
			button.click();
			a.equal(button.open, true);
			await themeName.filter(name => name === 'dark').first();
			a.equal(localStorage.getItem(persistkey), './theme-dark.js');
		} finally {
			button.remove();
			loadTheme('');
			localStorage.removeItem(persistkey);
		}
	});

	a.test('theme toggle initializes from preference and retains standalone ToggleTheme activation', a => {
		const button = create(IconToggleTheme, { usepreferred: true, themeon: '', themeoff: '' });
		a.dom.append(button);
		a.equal(button.open, matchMedia('(prefers-color-scheme: dark)').matches);
		const standalone = create(ToggleTheme, { themeon: '', themeoff: '' });
		a.dom.append(standalone);
		standalone.click();
		a.equal(standalone.open, true);
	});
});
