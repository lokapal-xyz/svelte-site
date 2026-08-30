import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { SVG_DIR } from '../server/paths.ts';

type MdNode = {
	type: string;
	url?: string;
	alt?: string;
	value?: string;
	children?: MdNode[];
};

function escapeHtml(value: string): string {
	return value
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;');
}

function diagramName(url: string | undefined): string | null {
	const match = url?.match(/diagrams\/png\/([^/]+)\.png$/);
	return match ? match[1] : null;
}

function inlineSvg(name: string, alt: string): string {
	const svg = readFileSync(join(SVG_DIR, `${name}.svg`), 'utf8')
		.replace(/^\uFEFF/, '')
		.replace(/^<\?xml[^?]*\?>\s*/i, '');
	const label = alt ? ` aria-label="${escapeHtml(alt)}"` : '';
	return `<figure class="treatise-diagram"${label}>${svg}</figure>`;
}

function isDiagramImage(node: MdNode): boolean {
	return node.type === 'image' && diagramName(node.url) != null;
}

function figureNode(image: MdNode): MdNode {
	const name = diagramName(image.url);
	if (!name) throw new Error('expected diagram image');
	return { type: 'html', value: inlineSvg(name, image.alt ?? '') };
}

function visit(node: MdNode) {
	if (!node.children) return;

	for (let i = 0; i < node.children.length; i += 1) {
		const child = node.children[i];
		if (
			child.type === 'paragraph' &&
			child.children?.length === 1 &&
			isDiagramImage(child.children[0])
		) {
			node.children[i] = figureNode(child.children[0]);
			continue;
		}
		if (isDiagramImage(child)) {
			node.children[i] = figureNode(child);
			continue;
		}
		visit(child);
	}
}

/** Replace treatise PNG diagram images with the matching inline SVG. */
export function inlineDiagrams() {
	return (tree: MdNode) => {
		visit(tree);
	};
}
