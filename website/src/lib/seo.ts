import { OG_IMAGE_PATH, SAME_AS, SITE_EMAIL, SITE_NAME, SITE_ORIGIN } from './site';

export type OgType = 'website' | 'article';

export type Seo = {
	title: string;
	description: string;
	type?: OgType;
	noindex?: boolean;
};

const PERSON_ID = `${SITE_ORIGIN}/about#person`;
const WEBSITE_ID = `${SITE_ORIGIN}/#website`;
const BOOK_ID = `${SITE_ORIGIN}/treatise#book`;

export const fallbackSeo: Seo = {
	title: SITE_NAME,
	description: 'The public home of Conciliatorics, a perspective within Systemics.'
};

/** Share copy for the six hubs plus home. Keep aligned with the on-page ledes. */
export const hubSeo: Record<string, Seo> = {
	'/': fallbackSeo,
	'/start': {
		title: 'Start here — Lokapal',
		description:
			'A short walkthrough of the main ideas in Conciliatorics, for a first reading that does not begin at chapter one.'
	},
	'/treatise': {
		title: 'Treatise — Lokapal',
		description: 'The full text of Conciliatorics, with clickable terms and inlined diagrams.'
	},
	'/dex': {
		title: 'EIC-Dex — Lokapal',
		description:
			'The Core EIC equation graph — Parts 2–5. Walk a family to see how a concept is formed, what it bottoms out on, and what later concepts use it.'
	},
	'/dialogue': {
		title: 'In dialogue — Lokapal',
		description:
			'The treatise is self-contained. It still has to meet the literature it sits next to — without dissolving into it, and without walling itself off.'
	},
	'/cases': {
		title: 'Cases — Lokapal',
		description:
			'Government systems, applied with care — social organization at the national, supranational, and subnational level.'
	},
	'/about': {
		title: 'About — Lokapal',
		description: 'Lokapal (Ricardo Pintos). Conciliatorics, a perspective within Systemics.'
	}
};

export function errorSeo(status: number): Seo {
	if (status === 404) {
		return {
			title: "This page isn't here — Lokapal",
			description: "That address isn't a section, a chapter, a Dex entry, or a conversation.",
			noindex: true
		};
	}
	return {
		title: `${status} — Lokapal`,
		description: 'Something went wrong.',
		noindex: true
	};
}

export function resolveSeo(
	status: number,
	pathname: string,
	pageSeo?: Seo,
	preview?: boolean
): Seo {
	if (status >= 400) return errorSeo(status);
	const seo = pageSeo ?? hubSeo[pathname] ?? fallbackSeo;
	if (preview) return { ...seo, noindex: true };
	return seo;
}

export function canonicalUrl(pathname: string): string {
	if (pathname === '/') return SITE_ORIGIN;
	return `${SITE_ORIGIN}${pathname.replace(/\/$/, '')}`;
}

export function ogImageUrl(): string {
	return `${SITE_ORIGIN}${OG_IMAGE_PATH}`;
}

export function clampDescription(text: string, max = 200): string {
	const cleaned = text.replace(/\s+/g, ' ').trim();
	if (cleaned.length <= max) return cleaned;
	const cut = cleaned.slice(0, max - 1);
	const space = cut.lastIndexOf(' ');
	const clipped = (space > 40 ? cut.slice(0, space) : cut).replace(/[.,;:]+$/, '');
	return `${clipped}…`;
}

function pageName(title: string): string {
	return title.replace(/\s+—\s+(Lokapal|Conciliatorics|EIC-Dex|In dialogue)$/, '');
}

type JsonLd = Record<string, unknown>;

function personNode(): JsonLd {
	return {
		'@type': 'Person',
		'@id': PERSON_ID,
		name: 'Lokapal',
		alternateName: 'Ricardo Pintos',
		url: SITE_ORIGIN,
		email: `mailto:${SITE_EMAIL}`,
		image: `${SITE_ORIGIN}/lokapal-main.png`,
		sameAs: [...SAME_AS]
	};
}

function websiteNode(): JsonLd {
	return {
		'@type': 'WebSite',
		'@id': WEBSITE_ID,
		name: SITE_NAME,
		url: SITE_ORIGIN,
		inLanguage: 'en',
		description: fallbackSeo.description,
		image: ogImageUrl(),
		author: { '@id': PERSON_ID },
		publisher: { '@id': PERSON_ID }
	};
}

function bookNode(): JsonLd {
	return {
		'@type': 'Book',
		'@id': BOOK_ID,
		name: 'Conciliatorics',
		inLanguage: 'en',
		url: `${SITE_ORIGIN}/treatise`,
		author: { '@id': PERSON_ID }
	};
}

export function jsonLd(pathname: string, seo: Seo): JsonLd {
	const url = canonicalUrl(pathname);
	const graph: JsonLd[] = [websiteNode(), personNode()];

	if (pathname === '/treatise' || /^\/\d/.test(pathname)) {
		graph.push(bookNode());
	}

	if (/^\/\d/.test(pathname)) {
		graph.push({
			'@type': 'Chapter',
			name: pageName(seo.title),
			description: seo.description,
			url,
			inLanguage: 'en',
			isPartOf: { '@id': BOOK_ID },
			author: { '@id': PERSON_ID }
		});
	} else if (pathname.startsWith('/dialogue/') && pathname !== '/dialogue/') {
		graph.push({
			'@type': 'Article',
			headline: pageName(seo.title),
			description: seo.description,
			url,
			inLanguage: 'en',
			author: { '@id': PERSON_ID },
			isPartOf: { '@id': WEBSITE_ID }
		});
	}

	return { '@context': 'https://schema.org', '@graph': graph };
}

export function jsonLdTag(pathname: string, seo: Seo): string {
	const json = JSON.stringify(jsonLd(pathname, seo)).replace(/</g, '\\u003c');
	return `<script type="application/ld+json">${json}</script>`;
}
