import { tsx } from './component.js';
import { Select } from './select.js';
import { Option } from './option.js';
import { InputText } from './input-text.js';
import { InputNumber } from './input-number.js';

import type { JSONSchema7 as JsonSchema } from 'json-schema';

export type { JSONSchema7 as JsonSchema } from 'json-schema';

export function getSchemaInput(
	p: JsonSchema,
	name: string,
	value: unknown = p.default,
) {
	if (p.enum) {
		const options = p.enum.map(op =>
			typeof op !== 'object'
				? tsx(Option, { value: op, selected: op === value }, String(op))
				: undefined,
		);
		options.unshift(
			tsx(
				Option,
				{ value: undefined },
				tsx('i', undefined, '(undefined)'),
			),
		);

		return tsx(Select, { value: value, name }, ...options);
	}

	if (p.type === 'string')
		return tsx(InputText, { name, value: value as string });
	if (p.type === 'number' || p.type === 'integer')
		return tsx(InputNumber, { name, value: value as number });
}
