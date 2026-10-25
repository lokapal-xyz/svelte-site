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

const PLAIN_OPEN = /^<plain(?:\s[^>]*)?>$/i;
const PLAIN_CLOSE = /^<\/plain\s*>$/i;
const PLAIN_COMPLETE = /^<plain(?:\s[^>]*)?>([\s\S]*?)<\/plain\s*>$/i;
const PLAIN_IN_TEXT = /<plain(?:\s[^>]*)?>([\s\S]*?)<\/plain\s*>/gi;

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
	return `<span class="glossary-token" data-glossary-id="${escapeHtml(id)}" role="button" tabindex="0">${escapeHtml(text)}</span>`;
}

function isHtml(node: MdNode): node is MdNode & { value: string } {
	return node.type === 'html' && typeof node.value === 'string';
}

function splitText(value: string, matchers: Matcher[], regex: RegExp): MdNode[] {
	const nodes: MdNode[] = [];
	let lastIndex = 0;
	regex.lastIndex = 0;

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

/** Tokenize text, but emit `<plain>…</plain>` inner content as ordinary text. */
function splitTextProtectingPlain(value: string, matchers: Matcher[], regex: RegExp): MdNode[] {
	const nodes: MdNode[] = [];
	let lastIndex = 0;

	for (const match of value.matchAll(new RegExp(PLAIN_IN_TEXT.source, 'gi'))) {
		const index = match.index ?? 0;
		if (index > lastIndex) {
			nodes.push(...splitText(value.slice(lastIndex, index), matchers, regex));
		}
		nodes.push({ type: 'text', value: match[1] });
		lastIndex = index + match[0].length;
	}

	if (lastIndex < value.length) {
		nodes.push(...splitText(value.slice(lastIndex), matchers, regex));
	}

	return nodes.length > 0 ? nodes : [{ type: 'text', value }];
}

function visit(node: MdNode, matchers: Matcher[], regex: RegExp) {
	if (!node.children || SKIP_PARENTS.has(node.type)) return;

	const next: MdNode[] = [];

	for (let i = 0; i < node.children.length; i += 1) {
		const child = node.children[i];

		if (isHtml(child)) {
			const complete = child.value.trim().match(PLAIN_COMPLETE);
			if (complete) {
				next.push({ type: 'text', value: complete[1] });
				continue;
			}

			if (PLAIN_OPEN.test(child.value.trim())) {
				const inner: MdNode[] = [];
				let closeAt = -1;
				for (let j = i + 1; j < node.children.length; j += 1) {
					const candidate = node.children[j];
					if (isHtml(candidate) && PLAIN_CLOSE.test(candidate.value.trim())) {
						closeAt = j;
						break;
					}
					inner.push(candidate);
				}
				if (closeAt !== -1) {
					next.push(...inner);
					i = closeAt;
					continue;
				}
			}
		}

		if (child.type === 'text' && child.value) {
			next.push(...splitTextProtectingPlain(child.value, matchers, regex));
			continue;
		}

		visit(child, matchers, regex);
		next.push(child);
	}

	node.children = next;
}

/** Wrap glossary terms (by display name) and the five operator symbols, keyed by glossary id. */
export function glossaryTokens() {
	const matchers = loadMatchers();
	const regex = new RegExp(matchers.map((matcher) => `(${matcher.source})`).join('|'), 'giu');

	return (tree: MdNode) => {
		visit(tree, matchers, regex);
	};
}
