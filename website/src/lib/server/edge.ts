import { parse } from 'yaml';
import type { EdgeLeaf, EdgeStatus, EdgeTrunk } from '$lib/library/types';
import trunksSource from '../../../../library/edge-eic/edge-eic.yaml?raw';
import { listChapters } from './chapters';

const leafFiles = import.meta.glob('../../../../library/edge-eic/leaves/*.md', {
	query: '?raw',
	import: 'default',
	eager: true
}) as Record<string, string>;

const STATUSES = new Set<EdgeStatus>(['seedling', 'budding', 'bloom']);

function str(value: unknown): string | undefined {
	if (typeof value === 'string') {
		const trimmed = value.trim();
		return trimmed.length > 0 ? trimmed : undefined;
	}
	if (typeof value === 'number' || typeof value === 'boolean') return String(value);
	return undefined;
}

function strList(value: unknown): string[] {
	if (!Array.isArray(value)) return [];
	return value.map(str).filter((item): item is string => item != null);
}

function leafFileId(path: string): string {
	const file = path.replace(/\\/g, '/').split('/').pop() ?? '';
	return file.endsWith('.md') ? file.slice(0, -3) : file;
}

function parseFrontMatter(raw: string, path: string): Record<string, unknown> {
	const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/);
	if (!match) {
		throw new Error(`Edge leaf "${leafFileId(path)}" is missing YAML front matter`);
	}
	const data = parse(match[1]);
	if (typeof data !== 'object' || data == null || Array.isArray(data)) {
		throw new Error(`Edge leaf "${leafFileId(path)}" front matter must be a mapping`);
	}
	return data as Record<string, unknown>;
}

type RawTrunks = {
	trunks?: Record<string, unknown>[];
};

function normalizeTrunk(raw: Record<string, unknown>): EdgeTrunk | null {
	const id = str(raw.id);
	const title = str(raw.title);
	const chapter = str(raw.chapter);
	if (!id || !title || !chapter) return null;
	return { id, title, chapter };
}

function normalizeLeaf(
	raw: Record<string, unknown>,
	fileId: string,
	trunkIds: Set<string>
): EdgeLeaf {
	const id = str(raw.id);
	const title = str(raw.title);
	const status = str(raw.status);
	const trunk = str(raw.trunk);
	const lede = str(raw.lede);
	if (!id || !title || !status || !trunk || !lede) {
		throw new Error(
			`Edge leaf "${fileId}" needs id, title, status, trunk, and lede in front matter`
		);
	}
	if (id !== fileId) {
		throw new Error(`Edge leaf "${fileId}.md" has id "${id}"; they must match`);
	}
	if (!STATUSES.has(status as EdgeStatus)) {
		throw new Error(`Edge leaf "${id}" has unknown status "${status}"`);
	}
	if (!trunkIds.has(trunk)) {
		throw new Error(`Edge leaf "${id}" has unknown trunk "${trunk}"`);
	}
	return {
		id,
		title,
		status: status as EdgeStatus,
		trunk,
		lede,
		chapters: strList(raw.chapters)
	};
}

let trunksCache: EdgeTrunk[] | undefined;
let leavesCache: EdgeLeaf[] | undefined;

export function loadEdgeTrunks(): EdgeTrunk[] {
	if (trunksCache) return trunksCache;
	const chapterSlugs = new Set(listChapters().map((chapter) => chapter.slug));
	const raw = parse(trunksSource) as RawTrunks;
	const trunks: EdgeTrunk[] = [];
	const seen = new Set<string>();
	for (const row of raw.trunks ?? []) {
		const trunk = normalizeTrunk(row);
		if (!trunk || seen.has(trunk.id)) continue;
		if (!chapterSlugs.has(trunk.chapter)) {
			throw new Error(`Edge trunk "${trunk.id}" points at missing chapter "${trunk.chapter}"`);
		}
		seen.add(trunk.id);
		trunks.push(trunk);
	}
	if (trunks.length === 0) {
		throw new Error('edge-eic.yaml is missing a trunks catalog');
	}
	trunksCache = trunks;
	return trunks;
}

export function loadEdgeLeaves(): EdgeLeaf[] {
	if (leavesCache) return leavesCache;
	const trunkIds = new Set(loadEdgeTrunks().map((trunk) => trunk.id));
	const chapterSlugs = new Set(listChapters().map((chapter) => chapter.slug));
	const leaves: EdgeLeaf[] = [];
	const seen = new Set<string>();

	for (const [path, raw] of Object.entries(leafFiles)) {
		const fileId = leafFileId(path);
		if (!fileId) continue;
		const leaf = normalizeLeaf(parseFrontMatter(raw, path), fileId, trunkIds);
		if (seen.has(leaf.id)) {
			throw new Error(`Edge leaf id "${leaf.id}" is duplicated`);
		}
		for (const slug of leaf.chapters) {
			if (!chapterSlugs.has(slug)) {
				throw new Error(`Edge leaf "${leaf.id}" points at missing chapter "${slug}"`);
			}
		}
		seen.add(leaf.id);
		leaves.push(leaf);
	}

	if (leaves.length === 0) {
		throw new Error('library/edge-eic/leaves is empty');
	}

	leavesCache = leaves;
	return leaves;
}

export function getEdgeLeaf(id: string): EdgeLeaf | undefined {
	return loadEdgeLeaves().find((leaf) => leaf.id === id);
}
