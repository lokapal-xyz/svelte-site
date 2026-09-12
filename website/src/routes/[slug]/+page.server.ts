import { error } from '@sveltejs/kit';
import { getChapter, listChapters } from '$lib/server/chapters';
import type { EntryGenerator, PageServerLoad } from './$types';

export const entries: EntryGenerator = () =>
	listChapters().map((chapter) => ({ slug: chapter.slug }));

export const load: PageServerLoad = ({ params }) => {
	const chapter = getChapter(params.slug);
	if (!chapter) error(404, 'Chapter not found');
	return {
		chapter,
		seo: {
			title: `${chapter.title} — Conciliatorics`,
			description: chapter.description,
			type: 'article' as const
		}
	};
};
