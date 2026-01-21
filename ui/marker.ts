export class Marker {
	start = new Comment('marker-start');
	end = new Comment('marker-end');
	frag = document.createDocumentFragment();

	insert(content: Node | Node[], nextNode: Node = this.end) {
		const parent = this.end.parentNode;
		if (parent) {
			if (!this.start.parentNode)
				parent.insertBefore(this.start, this.end);

			if (Array.isArray(content)) {
				this.frag.append(...content);
				parent.insertBefore(this.frag, nextNode);
			} else parent.insertBefore(content, nextNode);
		}
	}

	empty() {
		const parent = this.end.parentNode;
		if (!parent || this.start.parentNode !== parent) return;

		const r = document.createRange();
		r.setStartAfter(this.start);
		r.setEndBefore(this.end);
		r.deleteContents();
	}
}
