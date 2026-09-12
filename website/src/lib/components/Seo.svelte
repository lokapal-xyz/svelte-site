<script lang="ts">
	import { page } from '$app/state';
	import { canonicalUrl, jsonLdTag, ogImageUrl, type Seo as SeoData } from '$lib/seo';
	import {
		OG_IMAGE_ALT,
		OG_IMAGE_HEIGHT,
		OG_IMAGE_WIDTH,
		SITE_AUTHOR,
		SITE_NAME,
		THEME_COLOR,
		TWITTER_SITE
	} from '$lib/site';

	let { seo }: { seo: SeoData } = $props();

	const url = $derived(canonicalUrl(page.url.pathname));
	const image = $derived(ogImageUrl());
	const type = $derived(seo.type ?? 'website');
	const ld = $derived(jsonLdTag(page.url.pathname, seo));
</script>

<svelte:head>
	<title>{seo.title}</title>
	<meta name="description" content={seo.description} />
	<meta name="author" content={SITE_AUTHOR} />
	<meta name="theme-color" content={THEME_COLOR} />
	{#if seo.noindex}
		<meta name="robots" content="noindex, nofollow" />
	{/if}
	<link rel="canonical" href={url} />

	<meta property="og:type" content={type} />
	<meta property="og:site_name" content={SITE_NAME} />
	<meta property="og:locale" content="en" />
	<meta property="og:title" content={seo.title} />
	<meta property="og:description" content={seo.description} />
	<meta property="og:url" content={url} />
	<meta property="og:image" content={image} />
	<meta property="og:image:type" content="image/png" />
	<meta property="og:image:width" content={String(OG_IMAGE_WIDTH)} />
	<meta property="og:image:height" content={String(OG_IMAGE_HEIGHT)} />
	<meta property="og:image:alt" content={OG_IMAGE_ALT} />
	{#if type === 'article'}
		<meta property="article:author" content={SITE_AUTHOR} />
	{/if}

	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:site" content={TWITTER_SITE} />
	<meta name="twitter:creator" content={TWITTER_SITE} />
	<meta name="twitter:title" content={seo.title} />
	<meta name="twitter:description" content={seo.description} />
	<meta name="twitter:image" content={image} />
	<meta name="twitter:image:alt" content={OG_IMAGE_ALT} />

	<!-- eslint-disable-next-line svelte/no-at-html-tags -- JSON-LD, build-time -->
	{@html ld}
</svelte:head>
