import { spec, type TestApi, triggerKeydown } from '@cxl/spec';
import {
	Application,
	Button,
	Tooltip,
	TooltipPopup,
	getRegisteredComponents,
} from './index.js';

function setup(a: TestApi) {
	const clock = a.mockSetTimeout();
	const parent = document.createElement('button');
	const tooltip = new Tooltip();
	const content = document.createElement('span');
	content.textContent = 'Supporting information';
	tooltip.append(content);
	parent.append('Target', tooltip);
	a.dom.append(parent);
	return { clock, parent, tooltip, content };
}

function enter(el: Element) {
	el.dispatchEvent(new MouseEvent('mouseenter'));
}

function leave(el: Element) {
	el.dispatchEvent(new MouseEvent('mouseleave'));
}

function popup(parent: Element) {
	const id = parent.getAttribute('aria-describedby')?.split(' ').at(-1);
	const el = id ? document.getElementById(id) : null;
	return el?.matches('c-tooltip-popup:popover-open') ? el : null;
}

export default spec('tooltip', (a: TestApi) => {
	a.test('registers public components and parses delay attributes', (a: TestApi) => {
		const tooltip = a.element('c-tooltip') as Tooltip;
		a.ok(tooltip instanceof Tooltip);
		a.equal(getRegisteredComponents()['c-tooltip'], Tooltip);
		a.equal(getRegisteredComponents()['c-tooltip-popup'], TooltipPopup);
		a.equal(tooltip.delayin, 500);
		a.equal(tooltip.delayout, 100);
		tooltip.setAttribute('delayin', '20');
		tooltip.setAttribute('delayout', '30');
		a.equal(tooltip.delayin, 20);
		a.equal(tooltip.delayout, 30);
		tooltip.setAttribute('delayin', '-1');
		tooltip.setAttribute('delayout', 'invalid');
		a.equal(tooltip.delayin, 0);
		a.equal(tooltip.delayout, 0);
	});

	a.test('delays hover opening and dismissal and preserves content on repeated opens', (a: TestApi) => {
		const { clock, parent, tooltip, content } = setup(a);
		enter(parent);
		clock.advance(499);
		a.equal(popup(parent), null);
		clock.advance(1);
		const shown = popup(parent);
		a.assert(shown);
		a.ok(shown instanceof TooltipPopup);
		a.equal(shown.getAttribute('role'), 'tooltip');
		a.equal(shown.firstChild, content);
		a.ok(shown.matches(':popover-open'));
		leave(parent);
		clock.advance(99);
		a.equal(popup(parent), shown);
		clock.advance(1);
		a.equal(popup(parent), null);
		a.equal(tooltip.firstChild, content);
		enter(parent);
		clock.advance(500);
		a.equal(popup(parent), shown);
		a.equal(shown.firstChild, content);
	});

	a.test('cancels opening and closing timers when interaction changes', (a: TestApi) => {
		const { clock, parent } = setup(a);
		enter(parent);
		clock.advance(250);
		leave(parent);
		clock.advance(500);
		a.equal(popup(parent), null);
		enter(parent);
		clock.advance(500);
		const shown = popup(parent);
		a.assert(shown);
		leave(parent);
		clock.advance(50);
		enter(parent);
		clock.advance(100);
		a.equal(popup(parent), shown);
	});

	a.test('keeps the popup open while either focus or hover is active', (a: TestApi) => {
		const { clock, parent } = setup(a);
		parent.focus();
		clock.advance(500);
		const shown = popup(parent);
		a.assert(shown);
		enter(parent);
		parent.blur();
		clock.advance(100);
		a.equal(popup(parent), shown);
		enter(shown);
		leave(parent);
		clock.advance(100);
		a.equal(popup(parent), shown);
		leave(shown);
		clock.advance(100);
		a.equal(popup(parent), null);
	});

	a.test('Escape dismisses immediately and cancels pending opening', (a: TestApi) => {
		const { clock, parent } = setup(a);
		enter(parent);
		triggerKeydown(parent, 'Escape');
		clock.advance(500);
		a.equal(popup(parent), null);
		leave(parent);
		enter(parent);
		clock.advance(500);
		a.assert(popup(parent));
		triggerKeydown(parent, 'Escape');
		a.equal(popup(parent), null);
		parent.dispatchEvent(new MouseEvent('mousemove'));
		clock.advance(500);
		a.equal(popup(parent), null);
	});

	a.test('exposes content in descriptions while closed and open and restores existing descriptions', (a: TestApi) => {
		const { clock, parent, tooltip, content } = setup(a);
		tooltip.remove();
		parent.setAttribute('aria-describedby', 'existing');
		parent.append(tooltip);
		a.equal(parent.getAttribute('aria-describedby'), `existing ${tooltip.id}`);
		a.equal(tooltip.textContent, content.textContent);
		enter(parent);
		clock.advance(500);
		const shown = popup(parent);
		a.assert(shown);
		a.equal(parent.getAttribute('aria-describedby'), `existing ${shown.id}`);
		leave(parent);
		clock.advance(100);
		a.equal(parent.getAttribute('aria-describedby'), `existing ${tooltip.id}`);
		tooltip.remove();
		a.equal(parent.getAttribute('aria-describedby'), 'existing');
	});

	a.test('does not open for disabled or hidden targets', (a: TestApi) => {
		const { clock, parent } = setup(a);
		parent.disabled = true;
		enter(parent);
		clock.advance(500);
		a.equal(popup(parent), null);
		leave(parent);
		parent.disabled = false;
		parent.hidden = true;
		enter(parent);
		clock.advance(500);
		a.equal(popup(parent), null);
	});

	a.test('replaces competing tooltips and preserves their content', (a: TestApi) => {
		const { clock, parent, tooltip, content } = setup(a);
		const other = document.createElement('button');
		const otherTooltip = new Tooltip();
		otherTooltip.textContent = 'Other tooltip';
		other.append('Other target', otherTooltip);
		a.dom.append(other);
		enter(parent);
		clock.advance(500);
		const first = popup(parent);
		a.assert(first);
		enter(other);
		clock.advance(500);
		a.ok(!first.isConnected);
		a.assert(popup(other));
		a.equal(document.querySelectorAll('c-tooltip-popup:popover-open').length, 1);
		a.equal(tooltip.firstChild, content);
	});

	a.test('cleans up visible and pending popups and supports reconnecting', (a: TestApi) => {
		const { clock, parent, tooltip, content } = setup(a);
		enter(parent);
		tooltip.remove();
		clock.advance(500);
		a.equal(popup(parent), null);
		a.equal(parent.getAttribute('aria-describedby'), null);
		parent.append(tooltip);
		enter(parent);
		clock.advance(500);
		a.assert(popup(parent));
		parent.remove();
		a.equal(popup(parent), null);
		a.equal(tooltip.firstChild, content);
		clock.advance(500);
		a.equal(popup(parent), null);
	});

	a.test('positions at the pointer and clamps to the viewport', (a: TestApi) => {
		const { clock, parent } = setup(a);
		parent.dispatchEvent(
			new MouseEvent('mousemove', {
				clientX: innerWidth + 100,
				clientY: innerHeight + 100,
			}),
		);
		enter(parent);
		clock.advance(500);
		const shown = popup(parent);
		a.assert(shown);
		const rect = shown.getBoundingClientRect();
		a.ok(rect.left >= 0);
		a.ok(rect.top >= 0);
		a.ok(rect.right <= innerWidth);
		a.ok(rect.bottom <= innerHeight);
	});

	a.test('supports accessible descriptions on a focused Button', async (a: TestApi) => {
		const parent = new Button();
		const tooltip = new Tooltip();
		tooltip.delayin = 0;
		tooltip.textContent = 'Supporting information';
		parent.append('Focus target', tooltip);
		a.dom.append(parent);
		parent.focus();
		const shown = popup(parent);
		a.assert(shown);
		a.equal(document.activeElement, parent);
		a.equal(parent.getAttribute('aria-describedby'), shown.id);
		await a.a11y(parent);
		await a.a11y(shown);
		parent.focus();
		triggerKeydown(parent, 'Escape');
		a.equal(popup(parent), null);
		a.equal(document.activeElement, parent);
		parent.blur();
		await a.hover(parent);
		a.assert(popup(parent));
	});

	a.test('opens after an Application popup container disconnects', (a: TestApi) => {
		const app = a.element(Application);
		app.remove();
		const { clock, parent } = setup(a);
		enter(parent);
		clock.advance(500);
		a.assert(popup(parent));
	});
});
