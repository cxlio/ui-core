import { spec } from '@cxl/spec';
import { Button } from './button.js';

export default spec('button', a => {
	a.test('outlined ripple uses the label color at pressed opacity', a => {
		const button = new Button();
		button.variant = 'outlined';

		const rippleColor = document.createElement('span');
		rippleColor.style.backgroundColor = 'var(--cxl-color-ripple)';
		button.append(rippleColor);
		a.dom.append(button);

		const reference = document.createElement('span');
		reference.style.backgroundColor = `color-mix(in srgb, ${getComputedStyle(button).color} 12%, transparent)`;
		a.dom.append(reference);

		a.equal(
			getComputedStyle(rippleColor).backgroundColor,
			getComputedStyle(reference).backgroundColor,
		);
	});
});
