type MdNode = {
	type: string;
	value?: string;
	children?: MdNode[];
};

function visit(node: MdNode) {
	if (!node.children) return;

	for (let i = 0; i < node.children.length; i += 1) {
		const child = node.children[i];
		if (child.type === 'table') {
			node.children.splice(i, 1, { type: 'html', value: '<div class="table-wrap">' }, child, {
				type: 'html',
				value: '</div>'
			});
			i += 2;
			continue;
		}
		visit(child);
	}
}

/** Wrap markdown tables so narrow viewports can scroll them sideways. */
export function wrapTables() {
	return (tree: MdNode) => {
		visit(tree);
	};
}
