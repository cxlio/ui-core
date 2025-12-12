export function walkUp(
	start: Element,
	pred: (node: Element) => boolean,
): Element | undefined {
	let current = start;

	for (;;) {
		if (pred(current)) return current;

		if (current.parentElement) {
			current = current.parentElement;
			continue;
		}

		const root = current.getRootNode();
		if (root instanceof ShadowRoot) {
			current = root.host;
			continue;
		}

		break;
	}
}
