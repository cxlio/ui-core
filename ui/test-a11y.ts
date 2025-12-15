import { spec } from '@cxl/spec';
import { create } from './component.js';
import { Span } from './span.js';
import { aria, ariaValue, ariaChecked, role } from './a11y.js';
import { be, of } from './rx.js';

export default spec('a11y', async a => {
	a.test('aria', it => {
		it.should(
			'set initial aria attribute value when element is connected',
			a => {
				const A = create(Span, { $: aria('checked', 'yes') });
				a.dom.appendChild(A);
				a.equal(A.getAttribute('aria-checked'), 'yes');
			},
		);
	});

	a.test('ariaValue', it => {
		it.should(
			'set initial aria attribute value when element is connected',
			a => {
				const A = create(Span, {
					$: el => of('test').pipe(ariaValue(el, 'label')),
				});
				a.dom.appendChild(A);
				a.equal(A.getAttribute('aria-label'), 'test');
			},
		);
	});

	a.test('ariaChecked', it => {
		it.should(
			'set initial aria attribute value when element is connected',
			a => {
				const checked = be<boolean | undefined>(undefined);
				const A = create(Span, {
					$: el => checked.pipe(ariaChecked(el)),
				});
				a.dom.appendChild(A);
				a.equal(A.getAttribute('aria-checked'), 'mixed');
				checked.next(true);
				a.equal(A.getAttribute('aria-checked'), 'true');
				checked.next(false);
				a.equal(A.getAttribute('aria-checked'), 'false');
			},
		);
	});

	a.test('role', it => {
		it.should(
			'set initial aria role attribute value when element is connected',
			a => {
				const A = create(Span, { $: role('button') });
				a.dom.appendChild(A);
				a.equal(A.getAttribute('role'), 'button');
			},
		);
	});
});
