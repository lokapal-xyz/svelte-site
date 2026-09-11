<script lang="ts">
	import { getDialogueComponent } from '$lib/dialogue/modules';
	import { interlocutorLine } from '$lib/library/dialogue';
	import { resolve } from '$app/paths';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	const Content = $derived(getDialogueComponent(data.conversation.id));
	const who = $derived(interlocutorLine(data.conversation));
	const chapters = $derived(
		data.conversation.chapters
			.map((slug) => data.chapters.find((chapter) => chapter.slug === slug))
			.filter((chapter) => chapter != null)
	);
</script>

<svelte:head>
	<title>{data.conversation.title} — In dialogue</title>
</svelte:head>

<main class="conversation">
	<nav class="kicker" aria-label="Breadcrumb">
		<a href={resolve('/dialogue')}>In dialogue</a>
		{#if data.field}
			<span class="sep" aria-hidden="true">›</span>
			<a href="{resolve('/dialogue')}#{data.field.id}">{data.field.title}</a>
		{/if}
	</nav>

	<h1>{data.conversation.title}</h1>
	<p class="lede">{data.conversation.lede}</p>
	{#if who}
		<p class="who">{who}</p>
	{/if}

	<div class="body">
		{#if Content}
			<Content />
		{/if}
	</div>

	<div class="foot">
		{#if chapters.length > 0}
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
		{/if}

		{#if data.related.length > 0}
			<section>
				<h2>Related conversations</h2>
				<ul>
					{#each data.related as row (row.id)}
						<li>
							<a href={resolve('/dialogue/[id]', { id: row.id })}>{row.title}</a>
						</li>
					{/each}
				</ul>
			</section>
		{/if}

		{#if data.conversation.sources.length > 0}
			<section>
				<h2>Sources</h2>
				<ul class="sources">
					{#each data.conversation.sources as source (source)}
						<li>{source}</li>
					{/each}
				</ul>
			</section>
		{/if}
	</div>
</main>

<style>
	.who {
		margin: 0 0 1.25rem;
		color: var(--text-muted);
		font-family: var(--font-ui);
		font-size: 0.9rem;
	}

	.foot {
		margin: 1.75rem 0 0;
		padding-top: 0.9rem;
		border-top: 1px solid var(--border);
		display: grid;
		gap: 1.15rem;
	}

	.foot section {
		margin: 0;
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

	.sources {
		color: var(--text-muted);
		font-size: 0.95rem;
	}
</style>
