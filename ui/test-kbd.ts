import { spec } from '@cxl/spec';
import { Kbd } from './kbd.js';

export default spec('kbd', a => {
	a.test('renders keyboard content through its default slot', a => {
		const kbd = a.element(Kbd);
		kbd.textContent = 'Ctrl+K';

		a.equal(kbd.textContent, 'Ctrl+K');
		a.ok(kbd.shadowRoot?.querySelector('slot'));
		a.equal(getComputedStyle(kbd).display, 'inline-block');
	});
});
