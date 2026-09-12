import { loadDialogueConversations } from '$lib/server/dialogue';
import { listChapters } from '$lib/server/chapters';
import { loadDexById } from '$lib/server/library';
import { SITE_ORIGIN } from '$lib/site';

export const prerender = true;

function loc(pathname: string): string {
	const url = pathname === '/' ? SITE_ORIGIN : `${SITE_ORIGIN}${pathname}`;
	return url.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

export function GET() {
	const paths = [
		'/',
		'/start',
		'/treatise',
		'/dex',
		'/dialogue',
		'/cases',
		'/about',
		...listChapters().map((chapter) => `/${chapter.slug}`),
		...Object.keys(loadDexById()).map((id) => `/dex/${encodeURIComponent(id)}`),
		...loadDialogueConversations().map((row) => `/dialogue/${encodeURIComponent(row.id)}`)
	];

	const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${paths.map((path) => `  <url><loc>${loc(path)}</loc></url>`).join('\n')}
</urlset>
`;

	return new Response(body, {
		headers: {
			'Content-Type': 'application/xml; charset=utf-8'
		}
	});
}
