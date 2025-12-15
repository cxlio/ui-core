import { spec } from '@cxl/spec';
import {
	empty,
	nonEmpty,
	nonZero,
	pattern,
	hasValue,
	required,
	email,
	zipcode,
	isValidJson,
	json,
	parseRules,
	min,
	max,
	greaterThan,
	lessThan,
	equalTo,
	maxlength,
	minlength,
} from './validation.js';
import { InputText } from './input-text.js';
import { Checkbox } from './checkbox.js';

export default spec('validation', a => {
	a.test('empty', t => {
		t.equal(empty(null), true, 'null is empty');
		t.equal(empty(undefined), true, 'undefined is empty');
		t.equal(empty(''), true, 'empty string is empty');
		t.equal(empty([]), true, 'empty array is empty');
		t.equal(empty([1]), false, 'non-empty array is not empty');
		t.equal(empty(0), false, '0 is not empty');
		t.equal(empty(false), false, 'false is not empty');
	});

	a.test('nonEmpty', t => {
		const res1 = nonEmpty('test');
		t.equal(res1.valid, true, 'non-empty string is valid');
		const res2 = nonEmpty('');
		t.equal(res2.valid, false, 'empty string is invalid');
		t.equal(res2.key, 'nonEmpty', 'key set to nonEmpty');
	});

	a.test('nonZero', t => {
		const res1 = nonZero(5);
		t.equal(res1.valid, true, '5 is non-zero');
		const res2 = nonZero(0);
		t.equal(res2.valid, false, '0 is zero');
		const res3 = nonZero('0');
		t.equal(res3.valid, false, '"0" string is zero');
		const res4 = nonZero('');
		t.equal(res4.valid, true, 'empty string is not zero');
	});

	a.test('pattern', t => {
		// using regex
		const rule = pattern(/^\d+$/);
		t.equal(rule('123').valid, true, 'string "123" matches pattern');
		t.equal(rule('abc').valid, false, '"abc" does not match pattern');
		t.equal(rule('').valid, true, 'empty string is valid');
		// using string input
		const rule2 = pattern('^foo');
		t.equal(rule2('foobar').valid, true, '"foobar" matches "^foo"');
		t.equal(rule2('barfoo').valid, false, '"barfoo" does not match "^foo"');
	});

	a.test('hasValue', t => {
		t.equal(hasValue('a'), true, 'string has value');
		t.equal(hasValue(0), true, '0 is value');
		t.equal(hasValue(''), false, 'empty string is falsy');
		t.equal(hasValue(null), false, 'null is falsy');
		t.equal(hasValue(undefined), false, 'undefined is falsy');
	});

	a.test('required', t => {
		const res1 = required('foo');
		t.equal(res1.valid, true, 'required passes for non-empty');
		t.equal(res1.key, 'required', 'key is required');
		const res2 = required('');
		t.equal(res2.valid, false, 'required fails for empty string');
		t.equal(required(null).valid, false, 'required fails for null');
		t.equal(
			required(undefined).valid,
			false,
			'required fails for undefined',
		);
	});

	a.test('email', t => {
		t.equal(email('').valid, true, 'empty email is valid');
		t.equal(email('user@test.com').valid, true, 'valid email accepted');
		t.equal(email('user@').valid, false, 'incomplete email rejected');
		t.equal(email('bademail').valid, false, 'non-email string');
		t.equal(email(123).valid, false, 'non-string input is invalid');
	});

	a.test('zipcode', t => {
		t.equal(zipcode('').valid, true, 'empty zip is valid');
		t.equal(zipcode('90210').valid, true, 'valid zip code');
		t.equal(zipcode('90210-4321').valid, true, 'valid zip+4 code');
		t.equal(zipcode('9021').valid, false, 'short zip is invalid');
		t.equal(zipcode(12345).valid, false, 'number input is invalid');
	});

	a.test('isValidJson', t => {
		t.equal(isValidJson('{"a":1}'), true, 'valid JSON');
		t.equal(isValidJson('{}'), true, 'empty object');
		t.equal(isValidJson('[1,2]'), true, 'array');
		t.equal(isValidJson('not json'), false, 'invalid string');
		t.equal(isValidJson(''), false, 'empty string is invalid');
	});

	a.test('json', t => {
		t.equal(json('{"x":100}').valid, true, 'valid JSON string');
		t.equal(json('bad').valid, false, 'invalid JSON string');
	});

	a.test('parseRules (single and multiple rules)', t => {
		const validator1 = parseRules('required min(5)', a.dom);
		const obsArray1 = validator1('');
		t.equal(obsArray1.length, 2, 'parseRules returns list of validators');
		obsArray1[0]?.subscribe(res =>
			t.equal(res.valid, false, 'required fails for empty'),
		);
		obsArray1[1]?.subscribe(res => t.equal(res.valid, true));

		const validator2 = parseRules(['required', 'minlength(3)'], a.dom);
		const obsArray2 = validator2('foo');
		t.equal(obsArray2.length, 2, 'parseRules accepts array');
		obsArray2[0]?.subscribe(res =>
			t.equal(res.valid, true, 'required passes'),
		);
		obsArray2[1]?.subscribe(res =>
			t.equal(res.valid, true, 'minlength passes'),
		);
	});

	a.test('min/max', t => {
		const minRule = min(5);
		minRule(7).subscribe(res => t.equal(res.valid, true, '7 >= 5'));
		minRule(2).subscribe(res =>
			t.equal(res.valid, false, '2 < 5 is false'),
		);
		const maxRule = max(10);
		maxRule(7).subscribe(res => t.equal(res.valid, true, '7 <= 10'));
		maxRule(22).subscribe(res => t.equal(res.valid, false, '22 > 10'));
	});

	a.test('greaterThan/lessThan', t => {
		const gtRule = greaterThan(6);
		gtRule(7).subscribe(res => t.equal(res.valid, true, '7 > 6'));
		gtRule(6).subscribe(res => t.equal(res.valid, false, '6 not > 6'));
		const ltRule = lessThan(5);
		ltRule(3).subscribe(res => t.equal(res.valid, true, '3 < 5'));
		ltRule(5).subscribe(res => t.equal(res.valid, false, '5 not < 5'));
	});

	a.test('equalTo', t => {
		const eqRule = equalTo(5);
		eqRule(5).subscribe(res => t.equal(res.valid, true, '5 == 5 true'));
		eqRule('5').subscribe(res => t.equal(res.valid, true, '"5" == 5'));
		eqRule(4).subscribe(res => t.equal(res.valid, false, '4 != 5'));
	});

	a.test('maxlength/minlength', t => {
		const mlRule = maxlength(5);
		t.equal(mlRule('abc').valid, true, 'length 3 <= 5');
		t.equal(mlRule('abcdef').valid, false, 'length 6 > 5');
		t.equal(mlRule('').valid, true, 'empty string gets true');

		const mnlRule = minlength(3);
		t.equal(mnlRule('foo').valid, true, 'length 3 >= 3');
		t.equal(mnlRule('fo').valid, false, 'length 2 < 3');
		t.equal(mnlRule('').valid, true, 'empty string gets true');
	});

	// Negative test: parseRule with bad rule
	a.test('parseRules: unknown rule throws', t => {
		t.throws(() => parseRules('notarule', a.dom));
		t.throws(() => parseRules(['required', 'badparam(2)'], a.dom));
	});

	a.test('custom validation for c-input-text element', t => {
		const input1 = t.element(InputText);
		input1.rules = [
			value => {
				return {
					valid: value ? String(value).length > 3 : true,
					message: 'Value must have at least 10 characters',
				};
			},
		];
		t.ok(!input1.invalid);
		input1.value = 'one';
		t.ok(input1.invalid);
		input1.value = 'four';
		t.ok(!input1.invalid);
	});
	a.test('required validation for checkbox element', t => {
		const input1 = t.element(Checkbox);
		input1.rules = 'required';
		t.ok(input1.invalid);
		input1.checked = true;
		t.ok(!input1.invalid);
		input1.checked = false;
		t.ok(input1.invalid);
	});
	a.test('pattern validation for InputText element', t => {
		const input = t.element(InputText);
		// only digits, exactly 3 chars
		input.rules = 'pattern(^\\d{3}$)';
		input.value = '123';
		t.ok(!input.invalid, '"123" matches \\d{3}');
		input.value = '12a';
		t.ok(input.invalid, '"12a" does not match \\d{3}');
		input.value = '';
		t.ok(!input.invalid, 'empty string bypasses pattern');
	});

	a.test('min/max numeric validation for InputText element', t => {
		const input = t.element(InputText);
		input.rules = [min(5), max(10)];
		input.value = '7';
		t.ok(!input.invalid, '7 is between 5 and 10');
		input.value = '4';
		t.ok(input.invalid, '4 is less than min 5');
		input.value = '11';
		t.ok(input.invalid, '11 is greater than max 10');
		input.value = '';
		t.ok(!input.invalid, 'empty string bypasses min/max');
	});

	a.test('combined rules on InputText element via string', t => {
		const input = t.element(InputText);
		input.rules = 'required minlength(2) maxlength(4)';
		// initial is invalid (no value)
		t.ok(input.invalid, 'required fails on empty');
		input.value = 'a';
		t.ok(input.invalid, 'minlength fails for length 1');
		input.value = 'abc';
		t.ok(!input.invalid, 'passes required, minlength, maxlength');
		input.value = 'abcde';
		t.ok(input.invalid, 'maxlength fails for length 5');
	});
	a.test('dynamic rule change resets validation', t => {
		const input = t.element(InputText);

		// start with required
		input.rules = 'required';
		input.value = '';
		t.ok(input.invalid, 'required fails empty');

		// switch to a pattern rule
		input.rules = 'pattern(^a$)';
		input.value = 'a';
		t.ok(!input.invalid, 'pattern passes "a"');
		input.value = 'b';
		t.ok(input.invalid, 'pattern fails "b"');

		// remove all rules
		input.rules = '';
		input.value = '';
		t.ok(!input.invalid, 'no rules always valid');
	});
	a.test('empty or bad rules strings throw or skip', t => {
		const input = t.element(InputText);

		// empty string => no validation
		input.rules = '';
		input.value = '';
		t.ok(!input.invalid, 'empty rules string is allowed');

		// whitespace-only => no validation
		input.rules = '   ';
		input.value = 'anything';
		t.ok(!input.invalid, 'blank rules skip validation');

		// unknown rule => should throw at assignment
		t.throws(() => {
			input.rules = 'notARealRule';
		});
	});
});
