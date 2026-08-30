import { listChapters } from '$lib/server/chapters';
import { loadDexById, loadGlossaryById } from '$lib/server/library';

export function load() {
	const glossary = loadGlossaryById();
	const dex = loadDexById();
	return {
		glossary,
		dex,
		dexIds: Object.keys(dex),
		chapters: listChapters()
	};
}
