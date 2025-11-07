export interface BaseAttributes {
	d?: string;
	stroke?: string;
	fill?: string;
	viewBox?: string;
	className?: string;
	id?: string;
	cx?: string;
	cy?: string;
	r?: string;
	style?: string;
	x?: string | number;
	y?: string | number;
	width?: string | number;
	height?: string | number;
	x1?: string | number;
	x2?: string | number;
	y1?: string | number;
	y2?: string | number;
	'stroke-width'?: string | number;
	title?: string;
}

export function svg<T extends keyof SVGElementTagNameMap>(
	name: T,
	p?: BaseAttributes,
	...children: SVGElement[]
): SVGElementTagNameMap[T] {
	const el = document.createElementNS('http://www.w3.org/2000/svg', name);
	for (const attr in p) {
		if (attr === 'children') continue;
		const val = (p as unknown as Record<string, string>)[attr];
		el.setAttribute(attr === 'className' ? 'class' : attr, val);
	}
	if (children) el.append(...children);

	return el;
}

export function svgPath(p: { viewBox: string } & BaseAttributes) {
	return svg('svg', p, svg('path', { d: p.d }));
}
