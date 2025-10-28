//const start = performance.now();
const console = window.console;

function notify(method: typeof console.log): typeof console.log {
	return (msg, ...args) => {
		if (args.length) {
			console.groupCollapsed(msg);
			method(...args);
			console.groupEnd();
		} else method(msg);
	};
}

export const log = notify(console.log.bind(console));
export const warn = notify(console.warn.bind(console));

// eslint-disable-next-line
type FunctionOverride = (...args: any[]) => any;

export function override<
	T,
	K extends keyof T,
	P extends T[K] extends FunctionOverride ? T[K] : never,
>(
	obj: T,
	fn: K,
	pre: (this: T, ...args: Parameters<P>) => void,
	post?: (this: T, result: ReturnType<P>, ...args: Parameters<P>) => void,
) {
	const old = obj[fn] as P;
	obj[fn] = function (this: T, ...args: Parameters<P>) {
		if (pre) pre.apply(this, args);

		const result = old.apply(this, args);

		if (post) post.apply(this as T, [result, ...args]);

		return result;
	} as P;
}

console.log(`
\x1b[38;2;180;180;180m░█▀▀░█▀█░█▀█░█░█░▀█▀░█▀█░█░░\x1b[0m
\x1b[38;2;190;190;190m░█░░░█░█░█▀█░▄▀▄░░█░░█▀█░█░░\x1b[0m
\x1b[38;2;200;200;200m░▀▀▀░▀▀▀░▀░▀░▀░▀░▀▀▀░▀░▀░▀▀▀\x1b[0m
`);

/*if (typeof window !== 'undefined') {
	window.addEventListener('DOMContentLoaded', () => {
		const now = performance.now();
		log(`[debug] Page loaded in ${now - start}ms`);
	});
}*/
