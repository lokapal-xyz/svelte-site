import { loadEdgeLeaves, loadEdgeTrunks } from '$lib/server/edge';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = () => ({
	trunks: loadEdgeTrunks(),
	leaves: loadEdgeLeaves()
});
