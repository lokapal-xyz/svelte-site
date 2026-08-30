import { readFileSync } from 'node:fs';
import { parse } from 'yaml';
import { GLOSSARY_PATH } from '../server/paths.ts';

const OPERATOR_IDS = new Set([
	'symmetry',
	'asymmetry',
	'concatenation',
	'accentuation',
	'modulation'
]);

const SKIP_PARENTS = new Set([
	'code',
	'inlineCode',
	'link',
	'linkReference',
	'image',
	'html',
	'heading'
]);

type MdNode = {
	type: string;
	value?: string;
	children?: MdNode[];
};

type Matcher = {
	id: string;
	source: string;
};

function escapeRegExp(value: string): string {
	return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function escapeHtml(value: string): string {
	return value
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;');
}

function loadMatchers(): Matcher[] {
	const raw = parse(readFileSync(GLOSSARY_PATH, 'utf8')) as {
		terms?: { id?: string; term?: string; symbol?: string | null }[];
	};
	const matchers: Matcher[] = [];

	for (const row of raw.terms ?? []) {
		if (!row.id || !row.term) continue;
		matchers.push({
			id: row.id,
			source: `(?<![A-Za-z0-9])${escapeRegExp(row.term)}(?![A-Za-z0-9])`
		});
		if (OPERATOR_IDS.has(row.id) && row.symbol) {
			matchers.push({
				id: row.id,
				source: escapeRegExp(row.symbol)
			});
		}
	}

	matchers.sort((a, b) => b.source.length - a.source.length);
	return matchers;
}

function tokenHtml(id: string, text: string): string {
	return `<button type="button" class="glossary-token" data-glossary-id="${escapeHtml(id)}">${escapeHtml(text)}</button>`;
}

function splitText(value: string, matchers: Matcher[], regex: RegExp): MdNode[] {
	const nodes: MdNode[] = [];
	let lastIndex = 0;

	for (const match of value.matchAll(regex)) {
		const index = match.index ?? 0;
		if (index > lastIndex) {
			nodes.push({ type: 'text', value: value.slice(lastIndex, index) });
		}

		let matcherIndex = -1;
		for (let i = 1; i < match.length; i += 1) {
			if (match[i] != null) {
				matcherIndex = i - 1;
				break;
			}
		}

		const matcher = matchers[matcherIndex];
		if (matcher) {
			nodes.push({ type: 'html', value: tokenHtml(matcher.id, match[0]) });
		} else {
			nodes.push({ type: 'text', value: match[0] });
		}

		lastIndex = index + match[0].length;
	}

	if (lastIndex < value.length) {
		nodes.push({ type: 'text', value: value.slice(lastIndex) });
	}

	return nodes.length > 0 ? nodes : [{ type: 'text', value }];
}

function visit(node: MdNode, matchers: Matcher[], regex: RegExp) {
	if (!node.children || SKIP_PARENTS.has(node.type)) return;

	for (let i = 0; i < node.children.length; i += 1) {
		const child = node.children[i];
		if (child.type === 'text' && child.value) {
			regex.lastIndex = 0;
			if (!regex.test(child.value)) continue;
			regex.lastIndex = 0;
			const pieces = splitText(child.value, matchers, regex);
			if (pieces.length === 1 && pieces[0].type === 'text') continue;
			node.children.splice(i, 1, ...pieces);
			i += pieces.length - 1;
		} else {
			visit(child, matchers, regex);
		}
	}
}

/** Wrap glossary terms (by display name) and the five operator symbols, keyed by glossary id. */
export function glossaryTokens() {
	const matchers = loadMatchers();
	const regex = new RegExp(matchers.map((matcher) => `(${matcher.source})`).join('|'), 'giu');

	return (tree: MdNode) => {
		visit(tree, matchers, regex);
	};
}
