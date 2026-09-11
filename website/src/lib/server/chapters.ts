import { readdirSync, readFileSync, statSync } from 'node:fs';
import { basename, join } from 'node:path';
import type { ChapterMeta } from '$lib/library/types';
import { DOCS_PATH } from './paths';

const PART_TITLES: Record<string, string> = {
	'00_front': 'Front matter',
	'01_introduction': 'Part 1 — Introduction',
	'02_edified_interstitial_contemplation': 'Part 2 — Edified Interstitial Contemplation',
	'03_attributes-structure': 'Part 3 — Attributes Structure',
	'04_attributes-status': 'Part 4 — Attributes Status',
	'05_attributes-synthesis': 'Part 5 — Attributes Synthesis',
	'06_edified-intrinsic-transformation': 'Part 6 — Edified Intrinsic Transformation',
	'07_closing': 'Part 7 — Closing'
};

function partTitle(dir: string): string {
	if (PART_TITLES[dir]) return PART_TITLES[dir];
	const withoutIndex = dir.replace(/^\d+_/, '').replace(/_/g, ' ');
	return withoutIndex.replace(/\b\w/g, (ch) => ch.toUpperCase());
}

function chapterTitle(filePath: string, slug: string): string {
	const raw = readFileSync(filePath, 'utf8');
	return raw.match(/^#\s+(.+)$/m)?.[1]?.trim() ?? slug;
}

export function listChapters(): ChapterMeta[] {
	const parts = readdirSync(DOCS_PATH)
		.filter((name) => statSync(join(DOCS_PATH, name)).isDirectory())
		.sort();

	const chapters: ChapterMeta[] = [];
	for (const partDir of parts) {
		const files = readdirSync(join(DOCS_PATH, partDir))
			.filter((name) => name.endsWith('.md'))
			.sort();
		for (const file of files) {
			const slug = basename(file, '.md');
			chapters.push({
				slug,
				title: chapterTitle(join(DOCS_PATH, partDir, file), slug),
				partDir,
				partTitle: partTitle(partDir)
			});
		}
	}
	return chapters;
}

export function getChapter(slug: string): ChapterMeta | undefined {
	return listChapters().find((chapter) => chapter.slug === slug);
}
