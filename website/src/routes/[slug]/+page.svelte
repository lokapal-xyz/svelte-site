<script lang="ts">
	import { resolve } from '$app/paths';
	import ChapterNav from '$lib/components/ChapterNav.svelte';
	import { getChapterComponent } from '$lib/treatise/modules';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
	const Content = $derived(getChapterComponent(data.chapter.slug));
	const index = $derived(data.chapters.findIndex((chapter) => chapter.slug === data.chapter.slug));
	const prev = $derived(index > 0 ? data.chapters[index - 1] : null);
	const next = $derived(
		index >= 0 && index < data.chapters.length - 1 ? data.chapters[index + 1] : null
	);
</script>

<svelte:head>
	<title>{data.chapter.title} — Conciliatorics</title>
</svelte:head>

<article class="chapter">
	<nav class="kicker" aria-label="Breadcrumb">
		<a href={resolve('/treatise')}>Treatise</a><span class="sep" aria-hidden="true">›</span>{data.chapter.partTitle}
	</nav>
	{#if Content}
		<Content />
	{/if}
	<ChapterNav {prev} {next} />
</article>
