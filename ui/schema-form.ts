import { Component, attribute, component, get, tsx } from './component.js';
import { fromAsync, of } from './rx.js';
import { renderIf } from './render.js';
import { displayContents } from './theme.js';
import { Form } from './form.js';
import { Field } from './field.js';
import { Label } from './label.js';

import { Checkbox } from './checkbox.js';
import { Flex } from './flex.js';
import { T } from './t.js';

import { FieldHelp } from './field-help.js';
import * as validation from './validation.js';

import { getSchemaInput } from './schema-input.js';

import type {
	JSONSchema7 as JsonSchema,
	JSONSchema7Definition as Definition,
} from 'json-schema';

/**
 * Defines the References type as a mapping from schema URIs to
 * loaded schema objects, boolean "true" (for resolved booleans),
 * or undefined for not-yet-fetched/referenced items. This serves
 * as a cache for remote and in-memory schema resolution
 * throughout the schema traversal and dereferencing process.
 */
export type References = Record<string, object | boolean | undefined>;

function loadJson(url: string | URL) {
	return fetch(url).then(
		r => r.json(),
		() => true,
	);
}

function loadDefinitions(
	defs: Record<string, Definition>,
	baseUrl: string,
	references: References,
) {
	for (const d of Object.values(defs)) {
		if (d && d !== true && d.$id) {
			const full = baseUrl ? new URL(d.$id, baseUrl).href : d.$id;
			d.$id = full;
			references[full] ??= d;
		}
	}
}

function findNode(parent: JsonSchema, path: string, baseUrl: string) {
	const parts = path.split('/');
	let baseHref = baseUrl;
	let newParent: JsonSchema | undefined = parent;

	for (const p of parts) {
		if (!p) continue;

		newParent = newParent[
			decodeURI(
				p.replaceAll('~0', '~').replaceAll('~1', '/'),
			) as keyof JsonSchema
		] as unknown as JsonSchema | undefined;

		if (newParent === undefined) break;
		if (newParent.$id) baseHref = new URL(newParent.$id, baseHref).href;
	}

	if (baseHref !== baseUrl) parent.$id = new URL(`#${path}`, baseHref).href;

	return parent;
}

/**
 * - `href`: Reference string to resolve, potentially including fragment.
 * - `baseHref`: (Optional) Base URL for relative resolution.
 * - `references`: Cache/object containing already resolved schemas to avoid redundant network requests and circular references.
 */
async function resolveReference({
	href,
	baseHref,
	references,
}: {
	href: string;
	baseHref?: string;
	references: References;
}): Promise<Definition> {
	const url = new URL(href, baseHref);
	// Normalize trailing #
	if (url.hash === '' || url.hash === '#') url.hash = '';
	href = url.href;

	let json = references[href];
	if (json) return json;

	let result: Definition | undefined;

	if (url.hash) {
		const hash = url.hash;
		url.hash = '';
		const baseHref = url.href;
		json = await loadSchema(baseHref, references);
		if (json === true || json === false) {
			throw new Error('Unable to resolve schema fragment: ' + hash);
		}

		result = references[href] ?? findNode(json, hash.slice(1), baseHref);
	} else result = await loadSchema(href, references);

	return (references[href] = result);
}

async function loadSchema(url: string, references: References) {
	const json = (references[url] ??= await loadJson(url)) as Definition;

	if (json !== true && json !== false) {
		const defs = json.$defs || json.definitions;
		if (defs) loadDefinitions(defs, url, references);
	}

	return json;
}

function field(name: string, p: JsonSchema, body: Node) {
	const result = tsx(
		Field,
		undefined,
		tsx(Label, undefined, p.title ?? name),
		body,
	);

	if (p.description) result.append(tsx(FieldHelp, undefined, p.description));

	return result;
}

function getField(name: string, p: JsonSchema) {
	if (p.type === 'boolean') return tsx(Checkbox, { name }, p.title ?? name);

	const input = getSchemaInput(p, name);

	if (input) {
		const rules = [];
		if (p.pattern) rules.push(validation.pattern(p.pattern));
		if (p.maxLength) rules.push(validation.maxlength(p.maxLength));
		if (p.minLength) rules.push(validation.minlength(p.minLength));
		if (p.maximum) rules.push(validation.max(p.maximum));
		if (p.minimum) rules.push(validation.max(p.minimum));
		if (p.required) rules.push(validation.required);
		if (p.default) input.value = p.default;

		if (rules.length) input.rules = rules;

		return field(name, p, input);
	}
}

function initSchema(
	schema: JsonSchema,
	schemaUrl: string,
	references: References,
) {
	const url = new URL(schema.$id ?? schemaUrl, schemaUrl);
	if (url.hash === '' || url.hash === '#') url.hash = '';
	schemaUrl = url.href;
	references[schemaUrl] ??= schema;

	const defs = schema.$defs || schema.definitions;
	if (defs) loadDefinitions(defs, schemaUrl, references);

	return schemaUrl;
}

export async function generateForm(schema: JsonSchema) {
	const { properties, title } = schema;
	const flex = tsx(Flex, { gap: 16, vflex: true });
	const form = tsx(Form, undefined, flex);
	const references: References = {};

	const baseHref = initSchema(schema, 'schema://', references);

	if (title) flex.append(tsx(T, { font: 'title-large' }, title));
	if (schema.description)
		flex.append(tsx(T, { font: 'body-medium' }, schema.description));

	if (properties)
		for (const name in properties) {
			let p = properties[name];

			if (!p || p === true) continue;

			if (p.$ref)
				p = await resolveReference({
					href: p.$ref,
					references,
					baseHref,
				});

			if (!p || p === true) continue;

			const field = getField(name, p);
			if (field) flex.append(field);
		}

	return form;
}

function getSchema(schema: string | JsonSchema) {
	const parsed: JsonSchema =
		typeof schema === 'string' ? JSON.parse(schema) : schema;
	return generateForm(parsed);
}

/**
 * Generate forms from JSON Schema
 * @beta
 */
export class SchemaForm extends Component {
	schema?: string | JsonSchema;
}

component(SchemaForm, {
	tagName: 'c-schema-form',
	init: [attribute('schema')],
	augment: [
		displayContents,
		$ =>
			renderIf(
				get($, 'schema').switchMap<Form | false>(schema =>
					schema ? fromAsync(() => getSchema(schema)) : of(false),
				),
				form => form as Form,
			)($),
	],
});
