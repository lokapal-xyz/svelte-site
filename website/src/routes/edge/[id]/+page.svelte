<script lang="ts">
	import { getEdgeComponent } from '$lib/edge/modules';
	import EdgeStatus from '$lib/components/EdgeStatus.svelte';
	import { resolve } from '$app/paths';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	const Content = $derived(getEdgeComponent(data.leaf.id));
	const chapters = $derived(
		data.leaf.chapters
			.map((slug) => data.chapters.find((chapter) => chapter.slug === slug))
			.filter((chapter) => chapter != null)
	);
</script>

<main class="leaf">
	<nav class="kicker" aria-label="Breadcrumb">
		<a href={resolve('/edge')}>Edge EIC</a>
		{#if data.trunk}
			<span class="sep" aria-hidden="true">›</span>
			<a href="{resolve('/edge')}#{data.trunk.id}">{data.trunk.title}</a>
		{/if}
	</nav>

	<h1>{data.leaf.title}</h1>
	<p class="status"><EdgeStatus status={data.leaf.status} labelFirst /></p>
	<p class="lede">{data.leaf.lede}</p>

	<div class="body">
		{#if Content}
			<Content />
		{/if}
	</div>

	{#if chapters.length > 0}
		<div class="foot">
			<section>
				<h2>In the treatise</h2>
				<ul>
					{#each chapters as chapter (chapter.slug)}
						<li>
							<a href={resolve('/[slug]', { slug: chapter.slug })}
								>Read {chapter.title} in the treatise →</a
							>
						</li>
					{/each}
				</ul>
			</section>
		</div>
	{/if}
</main>

<style>
	.status {
		margin: 0 0 0.5rem;
		color: var(--text-muted);
	}

	.foot {
		margin: 1.75rem 0 0;
		padding-top: 0.9rem;
		border-top: 1px solid var(--border);
	}

	.foot h2 {
		margin: 0;
		color: var(--text-muted);
		font-family: var(--font-ui);
		font-size: 0.72rem;
		letter-spacing: 0.05em;
		text-transform: uppercase;
	}

	.foot ul {
		margin: 0.35rem 0 0;
		padding: 0;
		list-style: none;
	}

	.foot li {
		margin: 0.25rem 0;
	}
</style>
