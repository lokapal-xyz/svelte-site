import { error } from '@sveltejs/kit';
import { listChapters } from '$lib/server/chapters';
import type { EntryGenerator, PageServerLoad } from './$types';

export const entries: EntryGenerator = () =>
	listChapters().map((chapter) => ({ slug: chapter.slug }));

export const load: PageServerLoad = ({ params }) => {
	const chapters = listChapters();
	const index = chapters.findIndex((row) => row.slug === params.slug);
	if (index < 0) error(404, 'Chapter not found');
	const chapter = chapters[index];
	return {
		chapter,
		seo: {
			title: `${chapter.title} — Conciliatorics`,
			description: chapter.description,
			type: 'article' as const,
			position: index + 1
		}
	};
};
