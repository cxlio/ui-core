import { spec, TestApi, triggerKeydown } from '@cxl/spec';
import { SliderReveal } from './slider-reveal.js';

export default spec('slider-reveal', a => {
	a.test('creates reveal layers and slider semantics', (a: TestApi) => {
		const slider = a.element(SliderReveal);
		const root = slider.shadowRoot;

		a.assert(root);
		a.assert(root.querySelector('slot[name="after"]'));
		a.assert(root.querySelector('slot[name="before"]'));
		a.assert(root.querySelector('slot:not([name])'));
		a.assert(root.querySelector('[part="slider"]'));
		a.equal(slider.getAttribute('role'), 'slider');
		a.equal(slider.ariaValueMin, '0');
		a.equal(slider.ariaValueMax, '1');
		a.equal(slider.ariaOrientation, 'horizontal');
	});

	a.test('clamps value attributes', a => {
		a.dom.innerHTML = '<c-slider-reveal value="2"></c-slider-reveal>';
		const slider = a.dom.firstElementChild as SliderReveal;

		a.equal(slider.value, 1);
		slider.setAttribute('value', '-1');
		a.equal(slider.value, 0);
	});

	a.test('updates the value from the keyboard', (a: TestApi) => {
		const slider = a.element(SliderReveal);
		let changes = 0;

		slider.value = 0.5;
		slider.step = 0.1;
		slider.addEventListener('change', () => changes++);

		triggerKeydown(slider, 'ArrowRight');
		a.equal(slider.value, 0.6);
		triggerKeydown(slider, 'Home');
		a.equal(slider.value, 0);
		triggerKeydown(slider, 'End');
		a.equal(slider.value, 1);
		a.equal(changes, 3);
	});
});
