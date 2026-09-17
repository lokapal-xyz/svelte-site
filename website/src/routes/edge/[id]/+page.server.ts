import { error } from '@sveltejs/kit';
import { clampDescription } from '$lib/seo';
import { getEdgeLeaf, loadEdgeLeaves, loadEdgeTrunks } from '$lib/server/edge';
import type { EntryGenerator, PageServerLoad } from './$types';

export const entries: EntryGenerator = () => loadEdgeLeaves().map((leaf) => ({ id: leaf.id }));

export const load: PageServerLoad = ({ params }) => {
	const leaf = getEdgeLeaf(params.id);
	if (!leaf) error(404, 'Leaf not found');
	const trunk = loadEdgeTrunks().find((row) => row.id === leaf.trunk);
	return {
		leaf,
		trunk,
		seo: {
			title: `${leaf.title} — Edge EIC`,
			description: clampDescription(leaf.lede),
			type: 'article' as const
		}
	};
};
