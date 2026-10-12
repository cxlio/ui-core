import { spec, triggerKeydown, type TestApi } from '@cxl/spec';
import {
	Slider, SliderKnob, SliderBar, SliderLine, SliderTooltip,
	Form, create, getRegisteredComponents,
} from './index.js';

export default spec('slider', (a: TestApi) => {
	a.test('registers the slider family', (a: TestApi) => {
		for (const [tag, ctor] of [
			['c-slider', Slider], ['c-slider-knob', SliderKnob],
			['c-slider-bar', SliderBar], ['c-slider-line', SliderLine],
			['c-slider-tooltip', SliderTooltip],
		] as const) {
			a.ok(a.element(tag) instanceof ctor);
			a.equal(getRegisteredComponents()[tag], ctor);
		}
	});

	a.test('changes value on keypress using the archived keyboard sequence', (a: TestApi) => {
		const slider = a.element(Slider);
		a.equal(slider.value, 0);
		triggerKeydown(slider, 'ArrowLeft');
		a.equal(slider.value, 0);
		triggerKeydown(slider, 'ArrowRight');
		triggerKeydown(slider, 'ArrowRight');
		a.equal(slider.value, 0.1);
		triggerKeydown(slider, 'ArrowLeft');
		a.equal(slider.value, 0.05);
		slider.step = 0.2;
		triggerKeydown(slider, 'ArrowLeft');
		a.equal(slider.value, 0);
		triggerKeydown(slider, 'ArrowRight');
		triggerKeydown(slider, 'ArrowRight');
		a.equal(slider.value, 0.4);
		for (let i = 0; i < 3; i++) triggerKeydown(slider, 'ArrowRight');
		a.equal(slider.value, 1);
	});

	for (const ctor of [Slider, SliderKnob]) {
		a.test(`${ctor.name} clamps values and exposes horizontal slider semantics`, (a: TestApi) => {
			const slider = a.element(ctor);
			a.equal(slider.getAttribute('role'), 'slider');
			a.equal(slider.ariaValueMin, '0');
			a.equal(slider.ariaValueMax, '1');
			a.equal(slider.ariaOrientation, 'horizontal');
			for (const [value, expected] of [['2', 1], ['-1', 0], ['invalid', 0], ['Infinity', 1]] as const) {
				slider.setAttribute('value', value);
				a.equal(slider.value, expected);
				a.equal(slider.ariaValueNow, String(expected));
			}
			slider.value = -2;
			a.equal(slider.value, 0);
			slider.value = NaN;
			a.equal(slider.value, 0);
		});

		a.test(`${ctor.name} handles modifiers, endpoints and unchanged values`, (a: TestApi) => {
			const slider = a.element(ctor);
			slider.step = 0.1;
			let changes = 0;
			slider.addEventListener('change', () => changes++);
			const key = (key: string, options: KeyboardEventInit = {}) => slider.dispatchEvent(new KeyboardEvent('keydown', { key, cancelable: true, ...options }));
			key('ArrowRight', { ctrlKey: true });
			a.ok(Math.abs(slider.value - 0.01) < 1e-10);
			key('ArrowDown', { altKey: true });
			a.ok(Math.abs(slider.value - 0.02) < 1e-10);
			key('ArrowUp');
			a.equal(slider.value, 0);
			key('ArrowRight', { shiftKey: true });
			a.equal(slider.value, 1);
			key('End');
			a.equal(changes, 4);
			key('Home');
			a.equal(slider.value, 0);
			slider.step = 0;
			key('ArrowRight');
			a.equal(changes, 5);
			a.equal(key('a'), true);
			slider.value = 0.5;
			a.equal(changes, 5);
		});

		a.test(`${ctor.name} reverses horizontal keys and positions in RTL`, (a: TestApi) => {
			const slider = create(ctor, { dir: 'rtl', value: 0.5, step: 0.1 });
			a.dom.append(slider);
			triggerKeydown(slider, 'ArrowLeft');
			a.equal(slider.value, 0.6);
			triggerKeydown(slider, 'ArrowRight');
			a.equal(slider.value, 0.5);
			triggerKeydown(slider, 'Home');
			a.equal(slider.value, 0);
			const knob = slider instanceof SliderKnob ? slider : slider.shadowRoot?.querySelector<HTMLElement>('.knob');
			a.assert(knob);
			a.equal(knob.style.insetInlineStart, '0%');
		});

		a.test(`${ctor.name} blocks disabled keyboard and track clicks`, (a: TestApi) => {
			const slider = create(ctor, { value: 0.5, disabled: true });
			const bar = new SliderBar();
			if (slider instanceof SliderKnob) { bar.append(slider); a.dom.append(bar); }
			else a.dom.append(slider);
			triggerKeydown(slider, 'Home');
			const target = slider instanceof Slider ? slider.shadowRoot?.querySelector('#background') : bar;
			target?.dispatchEvent(new MouseEvent('click', { clientX: 0, bubbles: true }));
			a.equal(slider.value, 0.5);
			a.equal(slider.tabIndex, -1);
			a.equal(slider.ariaDisabled, 'true');
			slider.disabled = false;
			triggerKeydown(slider, 'End');
			a.equal(slider.value, 1);
		});
	}

	a.test('maps pointer coordinates to the track at 200% zoom', (a: TestApi) => {
		const slider = a.element(Slider);
		slider.style.width = '212px';
		slider.style.setProperty('zoom', '2');
		const track = slider.shadowRoot?.querySelector<HTMLElement>('#background');
		a.assert(track);
		const rect = track.getBoundingClientRect();
		track.dispatchEvent(new MouseEvent('click', { clientX: rect.left + 112 }));
		a.equal(slider.value, 0.25);
	});

	a.test('anchors the tooltip to the knob at 200% zoom', (a: TestApi) => {
		const raf = a.mockRequestAnimationFrame();
		const slider = a.element(Slider);
		slider.style.width = '212px';
		slider.style.setProperty('zoom', '2');
		slider.value = 0.25;
		const tooltip = create(SliderTooltip, { knob: slider, keepopen: true });
		a.dom.append(tooltip);
		raf.advance();
		const knob = slider.shadowRoot?.querySelector('.knob');
		a.assert(knob);
		const rect = knob.getBoundingClientRect();
		a.equal(parseFloat(tooltip.style.left), rect.left + rect.width / 2);
	});

	a.testElement('positions a nested tooltip in the viewport at 200% zoom', async (a: TestApi) => {
		const slider = a.element(Slider);
		slider.style.setProperty('zoom', '2');
		slider.value = 0.25;
		const tooltip = slider.shadowRoot?.querySelector<SliderTooltip>('c-slider-tooltip');
		const knob = slider.shadowRoot?.querySelector('.knob');
		a.assert(tooltip);
		a.assert(knob);
		await a.waitForEvent(tooltip, 'toggle', () => { tooltip.keepopen = true; });
		const label = tooltip.getBoundingClientRect();
		const handle = knob.getBoundingClientRect();
		a.ok(Math.abs(label.left + label.width / 2 - handle.left - handle.width / 2) < 0.02, `label center ${label.left + label.width / 2}, knob center ${handle.left + handle.width / 2}`);
		a.ok(label.bottom < handle.top, `label bottom ${label.bottom}, knob top ${handle.top}`);
	});

	for (const zoom of [1, 2]) for (const pointerType of ['mouse', 'touch']) {
		a.testElement(`drags with ${pointerType} pointers at ${zoom * 100}% zoom and stops when disabled`, async (a: TestApi) => {
			const bar = a.element(SliderBar);
			bar.style.width = '212px';
			bar.style.setProperty('zoom', String(zoom));
			const knob = create(SliderKnob, { value: 0.25, step: 0.2 });
			bar.append(knob);
			a.mock(knob, 'setPointerCapture', () => undefined);
			const pointer = (target: EventTarget, type: string, clientX: number) => target.dispatchEvent(new PointerEvent(type, { clientX: clientX * zoom, pointerId: 1, pointerType, bubbles: true }));
			await a.waitForEvent(knob, 'focus', () => pointer(knob, 'pointerdown', 50));
			pointer(knob, 'pointermove', 80);
			a.equal(knob.value, 0.4);
			pointer(knob, 'pointermove', 400);
			a.equal(knob.value, 1);
			pointer(knob, 'pointermove', -100);
			a.equal(knob.value, 0);
			knob.disabled = true;
			pointer(knob, 'pointermove', 100);
			a.equal(knob.value, 0);
			pointer(knob, 'pointerup', 100);
			knob.disabled = false;
			knob.blur();
			await a.waitForEvent(knob, 'focus', () => pointer(knob, 'pointerdown', 50));
			pointer(knob, 'pointermove', 100);
			a.equal(knob.value, 0.25);
			pointer(knob, 'pointercancel', 100);
			pointer(knob, 'pointermove', 150);
			a.equal(knob.value, 0.25);
		});
	}

	a.test('enforces explicit and neighboring bounds and updates ARIA', (a: TestApi) => {
		const bar = a.element(SliderBar);
		const first = create(SliderKnob, { value: 0.25 });
		const second = create(SliderKnob, { value: 0.75 });
		bar.append(first, second);
		a.equal(bar.knobs.length, 2);
		triggerKeydown(first, 'End');
		a.equal(first.value, 0.75);
		triggerKeydown(second, 'Home');
		a.equal(second.value, 0.75);
		first.value = 0.2;
		a.equal(second.ariaValueMin, '0.2');
		second.setAttribute('min', '0.4');
		second.setAttribute('max', '0.6');
		triggerKeydown(second, 'Home');
		a.equal(second.value, 0.4);
		triggerKeydown(second, 'End');
		a.equal(second.value, 0.6);
		second.removeAttribute('min');
		second.removeAttribute('max');
		triggerKeydown(second, 'End');
		a.equal(second.value, 1);
		const other = a.element(SliderBar);
		other.append(second);
		a.equal(bar.knobs.length, 1);
		a.equal(other.knobs[0], second);
		a.equal(first.ariaValueMax, '1');
		second.remove();
		a.equal(other.knobs.length, 0);
		other.append(second);
		a.equal(other.knobs.length, 1);
	});

	a.test('updates the active line as neighboring knobs change or move', (a: TestApi) => {
		const raf = a.mockRequestAnimationFrame();
		const bar = a.element(SliderBar);
		const first = create(SliderKnob, { value: 0.25 });
		const line = new SliderLine();
		const second = create(SliderKnob, { value: 0.75 });
		const slot = bar.shadowRoot?.querySelector('slot');
		a.assert(slot);
		bar.append(first, line, second);
		slot.dispatchEvent(new Event('slotchange'));
		raf.advance();
		a.equal(line.style.insetInlineStart, '25%');
		a.equal(line.style.width, '50%');
		second.value = 1;
		raf.advance();
		a.equal(line.style.width, '75%');
		first.remove();
		slot.dispatchEvent(new Event('slotchange'));
		raf.advance();
		a.equal(line.style.insetInlineStart, '0%');
		a.equal(line.style.width, '100%');
	});

	a.test('formats tooltip values and follows explicit targets and disabled state', (a: TestApi) => {
		const raf = a.mockRequestAnimationFrame();
		const first = create(SliderKnob, { value: 0.25 });
		const second = create(SliderKnob, { value: 0.75 });
		const tooltip = create(SliderTooltip, { keepopen: true });
		first.append(tooltip);
		a.dom.append(first, second);
		raf.advance();
		a.equal(tooltip.shadowRoot?.textContent, '0.25');
		a.ok(tooltip.matches(':popover-open'));
		tooltip.format = value => `${Math.round(value * 100)}%`;
		tooltip.knob = second;
		raf.advance();
		a.equal(tooltip.shadowRoot?.textContent, '75%');
		second.disabled = true;
		raf.advance();
		a.ok(!tooltip.matches(':popover-open'));
		second.disabled = false;
		tooltip.keepopen = false;
		raf.advance();
		second.focus();
		raf.advance();
		a.ok(tooltip.matches(':popover-open'));
		second.blur();
		raf.advance();
		a.ok(!tooltip.matches(':popover-open'));
		tooltip.remove();
		first.append(tooltip);
		raf.advance();
		a.equal(tooltip.shadowRoot?.textContent, '75%');
	});

	for (const native of [true, false]) {
		a.test(`submits and resets sliders in ${native ? 'native' : 'custom'} forms`, (a: TestApi) => {
			const form = native ? document.createElement('form') : new Form();
			const slider = create(Slider, { name: 'value', value: 0.25 });
			const knob = create(SliderKnob, { name: 'bound', value: 0.75 });
			form.append(slider, knob);
			a.dom.append(form);
			slider.value = 0.5;
			knob.value = 1;
			const data = () => form instanceof Form ? form.getFormData() : Object.fromEntries(new FormData(form));
			a.equal(data().value, native ? '0.5' : 0.5);
			a.equal(data().bound, native ? '1' : 1);
			slider.disabled = true;
			a.equal(data().value, undefined);
			slider.disabled = false;
			slider.touched = knob.touched = true;
			form.reset();
			a.equal(slider.value, 0.25);
			a.equal(knob.value, 0.75);
			a.equal(slider.touched, false);
			a.equal(knob.touched, false);
		});
	}

	for (const dir of ['ltr', 'rtl']) {
		a.testElement(`clicks and drags real slider components in ${dir}`, async (a: TestApi) => {
			a.dom.style.cssText = 'position:fixed;top:100px;left:100px;width:300px;z-index:1';
			const slider = create(Slider, { dir, value: dir === 'rtl' ? 0.75 : 0.25, ariaLabel: 'Value' });
			a.dom.append(slider);
			const target = create('div');
			target.style.cssText = 'position:absolute;left:216px;top:0;width:12px;height:48px;pointer-events:none';
			a.dom.append(target);
			const knob = slider.shadowRoot?.querySelector<HTMLElement>('.knob');
			a.assert(knob);
			await a.action({ type: 'drag', element: knob, target });
			a.ok(Math.abs(slider.value - (dir === 'rtl' ? 0.25 : 0.75)) < 0.04);
			await a.action({ type: 'click', element: slider });
			a.ok(Math.abs(slider.value - 0.5) < 0.02);
			const bar = create(SliderBar, { dir });
			const thumb = create(SliderKnob, { value: 0.2, ariaLabel: 'Track value' });
			bar.append(thumb);
			a.dom.append(bar);
			await a.action({ type: 'tap', element: bar });
			a.ok(Math.abs(thumb.value - 0.5) < 0.02);
			await a.a11y(slider);
		});
	}
});
