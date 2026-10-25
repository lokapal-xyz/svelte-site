import type { ChapterMeta } from '$lib/library/types';
import { clampDescription } from '$lib/seo';

const sources = import.meta.glob('../../../../docs/**/*.md', {
	query: '?raw',
	import: 'default',
	eager: true
}) as Record<string, string>;

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

function stripMarkup(text: string): string {
	return text
		.replace(/<plain(?:\s[^>]*)?>([\s\S]*?)<\/plain>/gi, '$1')
		.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
		.replace(/!\[[^\]]*\]\([^)]+\)/g, '')
		.replace(/[*_`]/g, '')
		.replace(/\s+/g, ' ')
		.trim();
}

function firstSentence(text: string): string {
	const match = text.match(/^.+?[.!?](?=\s|$)/);
	return (match ? match[0] : text).trim();
}

function ensurePeriod(text: string): string {
	return /[.!?]$/.test(text) ? text : `${text}.`;
}

function skipLine(line: string): boolean {
	return (
		/^#{1,6}\s/.test(line) ||
		/^---+$/.test(line.trim()) ||
		line.startsWith('![') ||
		line.startsWith('|') ||
		/^- \*\*/.test(line)
	);
}

function chapterCopy(raw: string, slug: string): { title: string; description: string } {
	const lines = raw.split(/\r?\n/);
	let i = 0;
	const title = lines[0]?.startsWith('# ') ? lines[0].slice(2).trim() : slug;
	if (lines[0]?.startsWith('# ')) i = 1;

	while (i < lines.length && lines[i].trim() === '') i += 1;

	let kicker = '';
	const kick = lines[i]?.trim().match(/^\*(.+)\*$/);
	if (kick && !lines[i].includes('**')) {
		kicker = kick[1].trim();
		i += 1;
		while (i < lines.length && lines[i].trim() === '') i += 1;
	}

	const para: string[] = [];
	while (i < lines.length) {
		const line = lines[i];
		if (line.trim() === '') {
			if (para.length > 0) break;
			i += 1;
			continue;
		}
		if (skipLine(line)) {
			if (para.length > 0) break;
			i += 1;
			continue;
		}
		para.push(line);
		i += 1;
	}

	const sentence = firstSentence(stripMarkup(para.join(' ')));
	const description = kicker
		? sentence
			? `${ensurePeriod(kicker)} ${sentence}`
			: ensurePeriod(kicker)
		: sentence || title;

	return { title, description: clampDescription(description) };
}

function parseDocPath(path: string): { partDir: string; slug: string } | null {
	const match = path.replace(/\\/g, '/').match(/\/docs\/([^/]+)\/([^/]+)\.md$/);
	if (!match) return null;
	return { partDir: match[1], slug: match[2] };
}

export function listChapters(): ChapterMeta[] {
	const rows = Object.entries(sources)
		.map(([path, raw]) => {
			const parsed = parseDocPath(path);
			if (!parsed) return null;
			return { ...parsed, raw };
		})
		.filter((row): row is { partDir: string; slug: string; raw: string } => row != null)
		.sort((a, b) => a.partDir.localeCompare(b.partDir) || a.slug.localeCompare(b.slug));

	return rows.map((row) => {
		const copy = chapterCopy(row.raw, row.slug);
		return {
			slug: row.slug,
			title: copy.title,
			partDir: row.partDir,
			partTitle: partTitle(row.partDir),
			description: copy.description
		};
	});
}

export function getChapter(slug: string): ChapterMeta | undefined {
	return listChapters().find((chapter) => chapter.slug === slug);
}
