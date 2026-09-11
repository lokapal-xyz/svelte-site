import { listChapters } from '$lib/server/chapters';
import { loadDexById, loadDexFamilies, loadGlossaryById } from '$lib/server/library';

export function load() {
	const glossary = loadGlossaryById();
	const dex = loadDexById();
	return {
		glossary,
		dex,
		dexIds: Object.keys(dex),
		families: loadDexFamilies(),
		chapters: listChapters()
	};
}
