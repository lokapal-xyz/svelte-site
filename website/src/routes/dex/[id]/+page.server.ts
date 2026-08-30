import { error } from '@sveltejs/kit';
import { loadDexById } from '$lib/server/library';
import type { EntryGenerator, PageServerLoad } from './$types';

export const entries: EntryGenerator = () => Object.keys(loadDexById()).map((id) => ({ id }));

export const load: PageServerLoad = ({ params }) => {
	const entry = loadDexById()[params.id];
	if (!entry) error(404, 'Dex entry not found');
	return { entry };
};
