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
		let cur = this.start.nextSibling;
		while (cur && cur !== this.end) {
			const nxt = cur.nextSibling;
			cur.remove();
			cur = nxt;
		}
	}
}
