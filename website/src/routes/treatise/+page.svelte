<script lang="ts">
	import { resolve } from '$app/paths';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	const parts = $derived.by(() => {
		const grouped: { title: string; chapters: typeof data.chapters }[] = [];
		for (const chapter of data.chapters) {
			const last = grouped.at(-1);
			if (last && last.title === chapter.partTitle) {
				last.chapters.push(chapter);
			} else {
				grouped.push({ title: chapter.partTitle, chapters: [chapter] });
			}
		}
		return grouped;
	});
</script>

<main class="treatise">
	<h1>Treatise</h1>
	<p class="lede">
		The full text of Conciliatorics. Click a term to glance at its definition. If that term is in
		the Dex, the panel offers a way into the equation graph.
	</p>

	<nav class="toc" aria-label="Treatise">
		{#each parts as part (part.title)}
			<section>
				<h2>{part.title}</h2>
				<ol>
					{#each part.chapters as chapter (chapter.slug)}
						<li>
							<a href={resolve('/[slug]', { slug: chapter.slug })}>{chapter.title}</a>
						</li>
					{/each}
				</ol>
			</section>
		{/each}
	</nav>
</main>

<style>
	.treatise {
		width: min(var(--content), 100%);
		margin: 1.5rem auto 0;
	}

	h1 {
		margin: 0 0 0.5rem;
		font-size: 2.15rem;
	}

	.lede {
		margin: 0 0 2rem;
		color: var(--text-muted);
	}

	h2 {
		margin: 1.6rem 0 0.45rem;
		font-size: 1.05rem;
		color: var(--text-muted);
		font-family: var(--font-ui);
		font-weight: 600;
		letter-spacing: 0.02em;
	}

	ol {
		margin: 0;
		padding-left: 1.2rem;
	}

	li {
		margin: 0.2rem 0;
	}

	a {
		color: var(--text);
		text-decoration-color: var(--border);
	}

	a:hover {
		color: var(--link-hover);
	}
</style>
