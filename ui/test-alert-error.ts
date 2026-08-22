import { spec } from '@cxl/spec';
import { AlertError, errorToString } from './alert-error.js';

export default spec('alert-error', a => {
	a.test('formats unknown error values', a => {
		a.equal(errorToString(undefined), 'Unknown Error');
		a.equal(errorToString(''), 'Unknown Error');
		a.equal(errorToString(new Error('failed')), 'failed');
		a.equal(errorToString({ error: 'failed' }), 'failed');
		a.equal(
			errorToString({ status: 404, statusText: 'Not Found' }),
			'HTTP 404 Not Found',
		);
		a.equal(errorToString({}), 'Unknown Error');
	});

	a.test('renders errors with the error color', a => {
		const alert = a.element(AlertError);
		alert.error = new Error('failed');

		a.equal(alert.color, 'error');
		a.equal(alert.textContent, 'failed');
		a.equal(alert.role, 'alert');
	});
});
