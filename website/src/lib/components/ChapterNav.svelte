<script lang="ts">
	import { resolve } from '$app/paths';
	import type { ChapterMeta } from '$lib/library/types';

	let { prev, next }: { prev: ChapterMeta | null; next: ChapterMeta | null } = $props();
</script>

<nav class="chapter-nav" aria-label="Chapters">
	{#if prev}
		<a class="link" href={resolve('/[slug]', { slug: prev.slug })}>
			<span class="dir">‹ Previous</span>
			<span class="name">{prev.title}</span>
		</a>
	{:else}
		<span></span>
	{/if}
	{#if next}
		<a class="link next" href={resolve('/[slug]', { slug: next.slug })}>
			<span class="dir">Next ›</span>
			<span class="name">{next.title}</span>
		</a>
	{/if}
</nav>

<style>
	.chapter-nav {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 0.85rem;
		margin: 2.5rem 0 0;
		padding-top: 1.25rem;
		border-top: 1px solid var(--border);
		font-family: var(--font-ui);
	}

	.link {
		display: flex;
		flex-direction: column;
		justify-content: center;
		gap: 0.2rem;
		min-width: 0;
		min-height: 4.5rem;
		padding: 0.85rem 1rem;
		border: 1px solid var(--border);
		border-radius: 0.75rem;
		color: var(--text);
		text-decoration: none;
		transition:
			border-color 180ms ease,
			color 180ms ease;
	}

	.link:hover {
		border-color: var(--accent);
		color: var(--accent);
	}

	.next {
		align-items: flex-end;
		text-align: right;
	}

	.dir {
		color: var(--text-muted);
		font-size: 0.72rem;
		letter-spacing: 0.05em;
		text-transform: uppercase;
		transition: color 180ms ease;
	}

	.link:hover .dir {
		color: var(--accent);
	}

	.name {
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	@media (max-width: 40rem) {
		.name {
			white-space: normal;
		}
	}
</style>
