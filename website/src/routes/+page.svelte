<script lang="ts">
	import { asset, resolve } from '$app/paths';
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

<svelte:head>
	<title>Conciliatorics</title>
</svelte:head>

<main class="home">
	<img
		class="hero"
		src={asset('/illustrations/hero.jpg')}
		alt="Four cartoon birds — a white dove, brown sparrow, blue jay, and black crow — on a mossy log over a stream, ink and watercolor."
		width="1248"
		height="832"
	/>

	<p class="lede">
		A perspective within Systemics that seeks to reconcile the inventive aspect of Systemic
		Intervention. Read the treatise, click a term to glance at its definition, or trace Core EIC
		equations in the Dex.
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
	.home {
		width: min(var(--content), 100%);
		margin: 1.5rem auto 0;
	}

	.hero {
		display: block;
		width: 100%;
		border: 1px solid var(--border);
		background: #f4efe4;
	}

	.lede {
		margin: 1.25rem 0 2rem;
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
		color: var(--accent);
	}
</style>
