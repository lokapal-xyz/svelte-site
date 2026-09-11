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

/** ViewBox width and the most common label size, for CSS scale-to-type. */
function diagramMetrics(svg: string): { vw: number; em: number } | null {
	const viewBox = svg.match(/viewBox="([^"]+)"/i);
	let vw = 0;
	if (viewBox) {
		const parts = viewBox[1]
			.trim()
			.split(/[\s,]+/)
			.map(Number);
		if (parts.length === 4 && parts[2] > 0) vw = parts[2];
	}
	if (!vw) {
		const width = svg.match(/\bwidth="([0-9.]+)/i);
		if (width) vw = Number(width[1]);
	}
	if (!(vw > 0)) return null;

	const sizes = [...svg.matchAll(/font-size="([^"]+)"/g)]
		.map((match) => Number(match[1]))
		.filter((size) => size > 0);
	if (sizes.length === 0) return { vw, em: 13 };

	const counts = new Map<number, number>();
	for (const size of sizes) {
		const key = Math.round(size * 100) / 100;
		counts.set(key, (counts.get(key) ?? 0) + 1);
	}
	let em = sizes[0];
	let votes = 0;
	for (const [size, n] of counts) {
		if (n > votes || (n === votes && size < em)) {
			em = size;
			votes = n;
		}
	}
	return { vw, em };
}

/** viewBox-width / label-size above this is too wide for a phone column. */
const WIDE_SPAN = 22;

function inlineSvg(name: string, alt: string): string {
	const svg = readFileSync(join(SVG_DIR, `${name}.svg`), 'utf8')
		.replace(/^\uFEFF/, '')
		.replace(/^<\?xml[^?]*\?>\s*/i, '');
	const label = alt ? ` aria-label="${escapeHtml(alt)}"` : '';
	const metrics = diagramMetrics(svg);
	const wide = metrics != null && metrics.vw / metrics.em > WIDE_SPAN;
	const slotClass = wide
		? 'treatise-diagram-slot treatise-diagram-slot--wide'
		: 'treatise-diagram-slot';
	const vars = metrics ? ` style="--diagram-vw: ${metrics.vw}; --diagram-em: ${metrics.em}"` : '';
	return `<div class="${slotClass}"${vars}><figure class="treatise-diagram"${label}>${svg}</figure></div>`;
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
