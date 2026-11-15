import { TestApi, spec } from '@cxl/spec';

import { theme, registerIcon, svgPath, ImageDiff, create, font, onFontsReady } from './index.js';

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
		title: 'IconButtonToggle[States and Variants]',
		html: `<div style="display:flex;flex-direction:column;gap:24px;padding:24px">
${['text', 'outlined', 'filled', 'elevated'].map(variant => `<div style="display:flex;gap:24px;align-items:center">
<span style="width:64px">${variant}</span>
<c-icon-button-toggle variant="${variant}" iconoff="search" aria-label="Search"></c-icon-button-toggle>
<c-icon-button-toggle variant="${variant}" iconoff="search" iconon="notifications" open aria-label="Search"></c-icon-button-toggle>
<c-icon-button-toggle variant="${variant}" iconoff="search" disabled aria-label="Search"></c-icon-button-toggle>
<c-icon-button-toggle variant="${variant}" iconoff="search" iconon="notifications" open disabled aria-label="Search"></c-icon-button-toggle>
</div>`).join('')}
</div>`,
	},
	{
		title: 'Slider[States, Range, RTL]',
		html: `<div style="padding:64px 24px 24px;width:320px">
<c-slider aria-label="Value" value="0.25"></c-slider>
<c-slider aria-label="Disabled" value="0.5" disabled></c-slider>
<c-slider aria-label="Invalid" value="0.75" invalid touched></c-slider>
<c-slider-bar style="margin-top:64px">
<c-slider-knob aria-label="Minimum" value="0.25"><c-slider-tooltip keepopen></c-slider-tooltip></c-slider-knob>
<c-slider-line></c-slider-line>
<c-slider-knob aria-label="Maximum" value="0.75"><c-slider-tooltip keepopen></c-slider-tooltip></c-slider-knob>
</c-slider-bar>
<c-slider aria-label="RTL value" dir="rtl" value="0.25"></c-slider>
</div>`,
	},
	{
		title: 'Tooltip[Popup]',
		html: '<c-tooltip-popup style="position:static">Supporting information</c-tooltip-popup>',
	},
	{
		title: 'Datepicker[Selection, Bounds, Disabled]',
		html: `<div style="padding:24px;width:400px">
<c-datepicker value="2024-02-29" minyear="2023" maxyear="2025" locale="en-US"></c-datepicker>
<c-datepicker value="2024-01-01" minyear="2024" maxyear="2024" disabled></c-datepicker>
</div>`,
	},
	{
		title: 'CalendarMonthInput[Locale, Week Start]',
		html: `<div style="padding:24px;width:400px">
<c-calendar-month-input month="2024-02" value="2024-02-29" locale="fr-FR" weekstart="1"></c-calendar-month-input>
<c-calendar-month-input month="2021-02" value="2021-02-15" locale="en-US" weekstart="1"></c-calendar-month-input>
</div>`,
	},
	{
		title: 'DatepickerPopup[Open]',
		html: `<div style="padding:24px;width:400px">
<c-field><c-input-date value="2024-02-29" locale="en-GB"></c-input-date><c-datepicker-popup slot="help" static open></c-datepicker-popup></c-field>
</div>`,
	},
	{
		title: 'InputDate',
		html: `<div style="padding:24px;width:320px">
<c-field><c-label>Date</c-label><c-input-date locale="en-GB" value="1984-08-06"></c-input-date></c-field>
<c-field><c-label>French date</c-label><c-input-date locale="fr-FR" format="long" value="2024-02-29"></c-input-date></c-field>
<c-field><c-label>Invalid date</c-label><c-input-date locale="en-GB" value="invalid" touched></c-input-date><c-field-help>Enter a complete date</c-field-help></c-field>
<c-field><c-label>Disabled date</c-label><c-input-date locale="en-US" value="2024-02-29" disabled></c-input-date></c-field>
</div>`,
	},
	{
		title: 'Radio[States]',
		html: `<div style="padding:24px">
<c-fieldset vflex>
<c-label>Radio states</c-label>
<c-radio>Unchecked</c-radio>
<c-radio checked>Checked</c-radio>
<c-radio disabled>Disabled</c-radio>
<c-radio checked invalid touched>Invalid</c-radio>
</c-fieldset>
</div>`,
	},
	{
		title: 'Fieldset[Layout]',
		html: `<div style="padding:24px">
<c-fieldset>
<c-label>Horizontal options</c-label>
<c-radio name="horizontal">One</c-radio>
<c-radio name="horizontal" checked>Two</c-radio>
</c-fieldset>
<c-fieldset style="width:160px;margin-top:24px">
<c-label>Narrow options</c-label>
<c-radio name="narrow">First option</c-radio>
<c-radio name="narrow" checked>Second option</c-radio>
</c-fieldset>
</div>`,
	},
	{
		title: 'Badge[Sizes, Colors, RTL]',
		html: `<div style="padding:24px">
${['ltr', 'rtl']
	.map(
		dir => `<div dir="${dir}" style="display:flex;gap:48px;padding:24px">
	<c-badge><span style="display:inline-block;width:24px;height:24px">M</span><span slot="badge">999+</span></c-badge>
	<c-badge size="small" aria-label="Unread messages"><span style="display:inline-block;width:24px;height:24px">M</span></c-badge>
	<c-badge color="success"><span style="display:inline-block;width:24px;height:24px">M</span><span slot="badge">ON</span></c-badge>
	<c-badge color="primary-container"><span style="display:inline-block;width:24px;height:24px">M</span><span slot="badge">3</span></c-badge>
</div>`,
	)
	.join('')}
</div>`,
	},
	{
		title: 'Button[color][outlined]',
		html: `
<c-button variant="outlined">Default</c-button>
<c-button color="primary" variant="outlined">Primary</c-button>
<c-button color="secondary" variant="outlined">Secondary</c-button>
<c-button color="tertiary" variant="outlined">Tertiary</c-button>
`,
	},
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


function source(color: string) {
	const canvas = create('canvas', { width: 80, height: 40 });
	const context = canvas.getContext('2d');
	if (!context) throw new Error('No rendering context');
	context.fillStyle = color;
	context.fillRect(0, 0, 80, 40);
	return canvas.toDataURL();
}

export default spec('ui', async a => {
	theme.disableAnimations = true;
	a.setTimeout(60000);
	await onFontsReady();
	await document.fonts.load('12px Roboto');

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

	for (const [id, d] of [
		['chevron_left', 'M15 6l-6 6 6 6'],
		['chevron_right', 'M9 6l6 6-6 6'],
	]) registerIcon({
		id: id ?? '',
		icon: () => svgPath({ viewBox: '0 0 24 24', d, fill: 'none', stroke: 'currentColor', 'stroke-width': '2' }),
	});

	for (const [id, d] of [
		['flight', 'M340-80v-60l80-60v-220L80-320v-80l340-200v-220q0-25 17.5-42.5T480-880q25 0 42.5 17.5T540-820v220l340 200v80L540-420v220l80 60v60l-140-40-140 40Z'],
		['trip', 'M160-120q-33 0-56.5-23.5T80-200v-440q0-33 23.5-56.5T160-720h160v-80q0-33 23.5-56.5T400-880h160q33 0 56.5 23.5T640-800v80h160q33 0 56.5 23.5T880-640v440q0 33-23.5 56.5T800-120H160Zm240-600h160v-80H400v80Zm-160 80h-80v440h80v-440Zm400 440v-440H320v440h320Zm80-440v440h80v-440h-80ZM480-420Z'],
		['explore', 'm260-260 300-140 140-300-300 140-140 300Zm220-180q-17 0-28.5-11.5T440-480q0-17 11.5-28.5T480-520q17 0 28.5 11.5T520-480q0 17-11.5 28.5T480-440Zm0 360q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z'],
		['list', 'M280-600v-80h560v80H280Zm0 160v-80h560v80H280Zm0 160v-80h560v80H280ZM160-600q-17 0-28.5-11.5T120-640q0-17 11.5-28.5T160-680q17 0 28.5 11.5T200-640q0 17-11.5 28.5T160-600Zm0 160q-17 0-28.5-11.5T120-480q0-17 11.5-28.5T160-520q17 0 28.5 11.5T200-480q0 17-11.5 28.5T160-440Zm0 160q-17 0-28.5-11.5T120-320q0-17 11.5-28.5T160-360q17 0 28.5 11.5T200-320q0 17-11.5 28.5T160-280Z'],
		['grid_view', 'M120-520v-320h320v320H120Zm0 400v-320h320v320H120Zm400-400v-320h320v320H520Zm0 400v-320h320v320H520ZM200-600h160v-160H200v160Zm400 0h160v-160H600v160Zm0 400h160v-160H600v160Zm-400 0h160v-160H200v160Zm400-400Zm0 240Zm-240 0Zm0-240Z'],
	] as const) registerIcon({
		id,
		icon: () => svgPath({ viewBox: '0 -960 960 960', d, fill: 'currentColor' }),
	});

	HTMLDialogElement.prototype.showModal = () => false;

	for (const example of examples) {
		if (!(example.tagName && skip.includes(example.tagName)))
			a.figure(example.title, example.html, node => {
				if (node instanceof HTMLElement && /^(Datepicker|CalendarMonthInput)/.test(example.title)) node.style.width = '448px';
			})?.catch(() => undefined);
	}
	a.figure(
		'ImageDiff',
		`<c-image-diff style="${font('body-medium')}--cxl-color-on-surface-variant:#444" src1="${source('black')}" src2="${source('white')}"></c-image-diff>`,
	)?.catch(error => a.ok(false, String(error)));

	a.figure(
		'ImageDiffSources',
		`<c-image-diff ratio="0.5" hidediff style="${font('body-medium')}--cxl-color-on-surface-variant:#444"></c-image-diff>`,
		dom => {
			if (!(dom instanceof HTMLElement)) throw new Error('Missing figure element');
			const observer = new MutationObserver(() => {
				const host = dom.querySelector('c-image-diff');
				if (!(host instanceof ImageDiff)) return;
				observer.disconnect();
				const pixels = new ImageData(80, 40);
				for (let i = 0; i < pixels.data.length; i += 4)
					pixels.data[i + 2] = pixels.data[i + 3] = 255;
				const baseline = new OffscreenCanvas(40, 80);
				const context = baseline.getContext('2d');
				if (!context) throw new Error('No rendering context');
				context.fillStyle = 'red';
				context.fillRect(0, 0, 40, 80);
				host.src1 = pixels;
				host.src2 = baseline;
			});
			observer.observe(dom, { childList: true });
		},
	)?.catch(error => a.ok(false, String(error)));
});
