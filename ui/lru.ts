export class LRU<K, V> {
	map = new Map<K, V>();

	constructor(public readonly limit = 10000) {}

	get(key: K) {
		const val = this.map.get(key);
		if (val !== undefined) {
			this.map.delete(key);
			this.map.set(key, val);
		}
		return val;
	}

	set(key: K, val: V) {
		if (this.map.has(key)) this.map.delete(key);
		else if (this.map.size >= this.limit) {
			// delete oldest entry
			const oldestKey = this.map.keys().next().value;
			if (oldestKey !== undefined) this.map.delete(oldestKey);
		}
		this.map.set(key, val);
	}
}
