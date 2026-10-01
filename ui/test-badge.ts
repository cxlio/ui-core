import { spec, type TestApi } from '@cxl/spec';
import { Badge, create } from './index.js';

export default spec('badge', a => {
	a.test('registers the public component and assigns both slots', (a: TestApi) => {
		const content = create('span', undefined, 'Messages');
		const count = create('span', { slot: 'badge' }, '999+');
		const badge = document.createElement('c-badge');
		badge.append(content, count);
		a.dom.append(badge);

		a.ok(badge instanceof Badge);
		const slot = badge.shadowRoot?.querySelector<HTMLSlotElement>(
			'slot:not([name])',
		);
		const badgeSlot = badge.shadowRoot?.querySelector<HTMLSlotElement>(
			'slot[name="badge"]',
		);
		a.assert(slot);
		a.assert(badgeSlot);
		a.equal(slot.assignedElements()[0], content);
		a.equal(badgeSlot.assignedElements()[0], count);
		a.equal(getComputedStyle(badge).display, 'inline-block');
	});

	a.test('updates dot and count sizes through properties and attributes', (a: TestApi) => {
		const badge = a.element(Badge);
		const indicator = badge.shadowRoot?.querySelector<HTMLElement>('.badge');
		a.assert(indicator);

		a.equal(getComputedStyle(indicator).height, '16px');
		badge.size = 'small';
		a.equal(badge.getAttribute('size'), 'small');
		a.equal(getComputedStyle(indicator).height, '6px');
		a.equal(getComputedStyle(indicator).minWidth, '6px');
		badge.setAttribute('size', 'large');
		a.equal(badge.size, 'large');
		a.equal(getComputedStyle(indicator).height, '16px');
		badge.setAttribute('size', 'unknown');
		a.equal(getComputedStyle(indicator).height, '16px');
		badge.removeAttribute('size');
		a.equal(badge.size, undefined);
		a.equal(getComputedStyle(indicator).height, '16px');
	});

	a.test('applies theme colors to the indicator and restores the default', (a: TestApi) => {
		const badge = a.element(Badge);
		badge.style.setProperty('--cxl-color--error', '#ff0000');
		badge.style.setProperty('--cxl-color--on-error', '#ffffff');
		badge.style.setProperty('--cxl-color--success', '#008000');
		badge.style.setProperty('--cxl-color--on-success', '#000000');
		const indicator = badge.shadowRoot?.querySelector<HTMLElement>('.badge');
		a.assert(indicator);

		a.equal(getComputedStyle(indicator).backgroundColor, 'rgb(255, 0, 0)');
		a.equal(getComputedStyle(indicator).color, 'rgb(255, 255, 255)');
		badge.color = 'success';
		a.equal(badge.getAttribute('color'), 'success');
		a.equal(getComputedStyle(indicator).backgroundColor, 'rgb(0, 128, 0)');
		a.equal(getComputedStyle(indicator).color, 'rgb(0, 0, 0)');
		badge.setAttribute('color', 'transparent');
		a.equal(badge.color, 'transparent');
		a.equal(getComputedStyle(indicator).backgroundColor, 'rgba(0, 0, 0, 0)');
		badge.removeAttribute('color');
		a.equal(badge.color, undefined);
		a.equal(getComputedStyle(indicator).backgroundColor, 'rgb(255, 0, 0)');
	});

	a.test('mirrors count and dot positioning in RTL', (a: TestApi) => {
		const badge = a.element(Badge);
		badge.style.width = '40px';
		badge.style.height = '40px';
		const indicator = badge.shadowRoot?.querySelector<HTMLElement>('.badge');
		a.assert(indicator);

		for (const size of ['large', 'small'] as const) {
			badge.size = size;
			badge.dir = 'ltr';
			const host = badge.getBoundingClientRect();
			const ltr = indicator.getBoundingClientRect();
			a.equal(ltr.left - host.left, size === 'small' ? 34 : 28);
			a.equal(ltr.top - host.top, size === 'small' ? 0 : -2);
			badge.dir = 'rtl';
			const rtl = indicator.getBoundingClientRect();
			a.equal(host.right - rtl.right, ltr.left - host.left);
			a.equal(rtl.top, ltr.top);
		}
	});
});
