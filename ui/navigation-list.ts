import {
	buildGo,
	getHostActive,
	navigation,
	manageFocus,
} from './navigation.js';
import { merge } from './rx.js';
import { registableHostOrdered } from './registable.js';

import type { Component } from './component.js';
import type { List } from './list.js';

export function itemHost($: Component & { items: Component[] }) {
	return registableHostOrdered('list', $, $.items);
}

export function manageFocusList($: List) {
	return manageFocus({
		host: $,
		getFocusable: () => $.items,
		getSelected: () => $.items.find(i => i.selected),
		getActive: () => $.items.find(i => i.matches(':focus,:focus-within')),
		observe: itemHost($),
	});
}

export function buildListGo($: List) {
	return buildGo({
		getFocusable: () => $.items,
		getActive: () => getHostActive($),
	});
}

export function navigationList($: List) {
	const go = buildListGo($);

	return merge(
		manageFocusList($),
		navigation({
			host: $,
			goDown: () => go(1),
			goUp: () => go(-1),
			goFirst: () => go(1, -1),
			goLast: () => go(-1, $.items.length),
		}).tap(item => item.focus()),
	);
}
