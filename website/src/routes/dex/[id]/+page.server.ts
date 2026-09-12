import { error } from '@sveltejs/kit';
import { clampDescription } from '$lib/seo';
import { loadDexById, loadGlossaryById } from '$lib/server/library';
import type { EntryGenerator, PageServerLoad } from './$types';

export const entries: EntryGenerator = () => Object.keys(loadDexById()).map((id) => ({ id }));

export const load: PageServerLoad = ({ params }) => {
	const entry = loadDexById()[params.id];
	if (!entry) error(404, 'Dex entry not found');
	const term = loadGlossaryById()[params.id];
	const name = term?.term ?? params.id;
	const definition = term?.definition?.trim();
	return {
		entry,
		seo: {
			title: `${name} — EIC-Dex`,
			description: clampDescription(
				definition && definition.length > 0 ? definition : `${name} in the Core EIC equation graph.`
			)
		}
	};
};
