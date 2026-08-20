import { spec } from '@cxl/spec';
import { AriaLive } from './aria-live.js';

export default spec('aria', a => {
	a.test('uses polite live-region semantics by default', a => {
		const live = a.element(AriaLive);

		a.equal(live.role, 'status');
		a.equal(live.ariaLive, 'polite');
		a.equal(live.ariaAtomic, 'true');
		a.ok(live.shadowRoot?.querySelector('slot'));
	});

	a.test('switches to assertive live-region semantics', a => {
		const live = a.element(AriaLive);

		live.assertive = true;
		a.equal(live.role, 'alert');
		a.equal(live.ariaLive, 'assertive');
	});
});
