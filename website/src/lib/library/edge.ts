import type { EdgeLeaf, EdgeStatus, EdgeTrunk } from './types';

export const STATUS_LABEL: Record<EdgeStatus, string> = {
	seedling: 'Seedling',
	budding: 'Budding',
	bloom: 'In Bloom'
};

/** Same silhouette, one to three. Glanceable development, not a rating. */
export const STATUS_MARKS: Record<EdgeStatus, 1 | 2 | 3> = {
	seedling: 1,
	budding: 2,
	bloom: 3
};

/** Hub key order: count grows down the page. */
export const STATUS_STAGES: EdgeStatus[] = ['seedling', 'budding', 'bloom'];

const STATUS_RANK: Record<EdgeStatus, number> = {
	bloom: 0,
	budding: 1,
	seedling: 2
};

export type TrunkBlock = EdgeTrunk & { leaves: EdgeLeaf[] };

export function groupByTrunk(trunks: EdgeTrunk[], leaves: EdgeLeaf[]): TrunkBlock[] {
	const blocks: TrunkBlock[] = [];
	for (const trunk of trunks) {
		const rows = leaves
			.filter((leaf) => leaf.trunk === trunk.id)
			.sort(compareLeaves);
		if (rows.length > 0) blocks.push({ ...trunk, leaves: rows });
	}
	return blocks;
}

function compareLeaves(a: EdgeLeaf, b: EdgeLeaf): number {
	const rank = STATUS_RANK[a.status] - STATUS_RANK[b.status];
	if (rank !== 0) return rank;
	return a.title.localeCompare(b.title, 'en', { sensitivity: 'base' });
}
