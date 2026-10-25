<script lang="ts">
	import { resolve } from '$app/paths';
	import type { ChapterMeta } from '$lib/library/types';

	let { prev, next }: { prev: ChapterMeta | null; next: ChapterMeta | null } = $props();
</script>

<nav class="chapter-nav" aria-label="Chapters">
	{#if prev}
		<a
			class="link prev"
			href={resolve('/[slug]', { slug: prev.slug })}
			aria-label="Previous: {prev.title}"
		>
			<span class="dir">« Previous</span>
			<span class="name">{prev.title}</span>
		</a>
	{/if}
	<a class="link contents" href={resolve('/treatise')} aria-label="Table of contents">
		<svg class="mark" viewBox="0 0 24 24" aria-hidden="true">
			<path d="M4 7h16M4 12h16M4 17h10" />
		</svg>
		<span>Table of Contents</span>
	</a>
	{#if next}
		<a
			class="link next"
			href={resolve('/[slug]', { slug: next.slug })}
			aria-label="Next: {next.title}"
		>
			<span class="dir">Next »</span>
			<span class="name">{next.title}</span>
		</a>
	{/if}
</nav>

<style>
	.chapter-nav {
		display: grid;
		grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr);
		grid-template-areas: 'prev contents next';
		gap: 0.75rem;
		margin: 1.75rem 0 0;
		padding-top: 0.9rem;
		border-top: 1px solid var(--border);
		font-family: var(--font-ui);
	}

	.link {
		display: flex;
		flex-direction: column;
		justify-content: center;
		gap: 0.15rem;
		min-width: 0;
		min-height: 2.85rem;
		padding: 0.55rem 0.9rem;
		border: 1px solid var(--border);
		border-radius: 0.65rem;
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

	.prev {
		grid-area: prev;
	}

	.contents {
		grid-area: contents;
	}

	.link.contents {
		flex-direction: row;
		flex-wrap: nowrap;
		align-items: center;
		justify-content: center;
		gap: 0.45em;
		font-size: 0.95rem;
		line-height: 1.3;
		text-align: center;
	}

	.contents .mark {
		display: block;
		width: 1.05em;
		height: 1.05em;
		flex-shrink: 0;
		stroke: currentColor;
		stroke-width: 2;
		stroke-linecap: round;
		fill: none;
	}

	.contents span {
		min-width: 0;
		white-space: nowrap;
	}

	.next {
		grid-area: next;
		align-items: flex-end;
		text-align: right;
	}

	.dir {
		color: var(--text-muted);
		font-size: 0.65rem;
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
		min-width: 0;
		max-width: 100%;
		font-size: 0.95rem;
		line-height: 1.3;
	}

	@media (max-width: 40rem) {
		.chapter-nav {
			grid-template-columns: 1fr 1fr;
			grid-template-areas:
				'prev next'
				'contents contents';
			gap: 0.5rem;
			margin-top: 1.35rem;
			padding-top: 0.7rem;
		}

		.link {
			align-items: center;
			min-height: 2.75rem;
			padding: 0.6rem 0.75rem;
		}

		.next {
			align-items: center;
		}

		.dir {
			color: var(--text);
			font-size: 0.88rem;
			letter-spacing: 0.04em;
		}

		.name {
			display: none;
		}

		.link.contents {
			font-size: 0.88rem;
			letter-spacing: 0.04em;
			text-transform: uppercase;
		}
	}
</style>
