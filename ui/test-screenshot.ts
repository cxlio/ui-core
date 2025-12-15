import { TestApi, spec } from '@cxl/spec';

import { theme, registerIcon, svgPath } from './index.js';

type Node = {
	name: string;
	docs?: { tagName: string; alpha?: boolean };
	children?: Node[];
};

type ScreenshotJson = {
	index: Node[];
	examples: Example[];
};
type Example = { tagName?: string; title: string; html: string };

const skip: string[] = [
	'Drawer',
	'Application',
	'Backdrop',
	'Dialog',
	'DialogBasic',
];
//const fixHeight = ['c-dialog', 'c-dialog-basic'];

const extra: Example[] = [
	{
		title: 'FieldOutlined[No Label]',
		html: `
<c-field-outlined>
<c-input-text></c-input-text>
<c-field-help>Supporting Text</c-field-help>
</c-field-outlined>
`,
	},
	{
		title: 'Select[Invalid Value]',
		html: `
<c-select value="d" aria-label="Invalid Value">
	<c-option value="a">A</c-option>
	<c-option value="b">B</c-option>
</c-select>
		`,
	},
	/*{
		title: 'Slider[disabled]',
		html: `<c-slider aria-label="Disabled slider" value="0.5" disabled><c-slider>`,
	},*/
	{
		title: 'TextArea[One Line]',
		html: `
<c-field style="width:100%">
	<c-label>Prefilled Text Area</c-label>
	<c-textarea value="Lorem ipsum dolor sit amet"></c-textarea>
</c-field>
		`,
	},
];

export default spec('ui', async a => {
	theme.disableAnimations = true;
	a.setTimeout(60000);

	const { index, examples } = (await fetch('./test-screenshot.json').then(r =>
		r.json(),
	)) as ScreenshotJson;

	examples.push(...extra);

	a.test('React support', (a: TestApi) => {
		const components = index.find(n => n.name === 'Components');
		a.assert(components, 'Components interface must exist');
		for (const node of index) {
			const tagName = node.docs?.tagName;
			if (tagName && !node.docs?.alpha)
				a.ok(
					components.children?.find(n => n.name === `'${tagName}'`),
					`Component ${tagName} must be registered in Components interface`,
				);
		}
	});

	// Register icons to avoid network requests.
	registerIcon({
		id: 'search',
		icon: () =>
			svgPath({
				viewBox: '0 -960 960 960',
				fill: 'currentColor',
				d: 'M784-120 532-372q-30 24-69 38t-83 14q-109 0-184.5-75.5T120-580q0-109 75.5-184.5T380-840q109 0 184.5 75.5T640-580q0 44-14 83t-38 69l252 252-56 56ZM380-400q75 0 127.5-52.5T560-580q0-75-52.5-127.5T380-760q-75 0-127.5 52.5T200-580q0 75 52.5 127.5T380-400Z',
			}),
	});
	registerIcon({
		id: 'notifications',
		icon: () =>
			svgPath({
				viewBox: '0 -960 960 960',
				fill: 'currentColor',
				d: 'M160-200v-80h80v-280q0-83 50-147.5T420-792v-28q0-25 17.5-42.5T480-880q25 0 42.5 17.5T540-820v28q80 20 130 84.5T720-560v280h80v80H160Zm320-300Zm0 420q-33 0-56.5-23.5T400-160h160q0 33-23.5 56.5T480-80ZM320-280h320v-280q0-66-47-113t-113-47q-66 0-113 47t-47 113v280Z',
			}),
	});

	HTMLDialogElement.prototype.showModal = () => false;

	for (const example of examples) {
		if (!(example.tagName && skip.includes(example.tagName)))
			a.figure(example.title, example.html);
	}
});
