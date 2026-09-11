<script lang="ts">
	import DexLink from '$lib/components/DexLink.svelte';
	import { groupByFamily, groupByKicker, kickerSlug, labelOf } from '$lib/library/dex';
	import { resolve } from '$app/paths';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	let query = $state('');

	const matchedIds = $derived.by(() => {
		const needle = query.trim().toLowerCase();
		return data.dexIds.filter((id) => {
			if (!needle) return true;
			const entry = data.dex[id];
			const label = labelOf(id, data.glossary, data.dex);
			const family = data.families.find((row) => row.id === entry?.family);
			return (
				label.name.toLowerCase().includes(needle) ||
				label.symbol.toLowerCase().includes(needle) ||
				id.includes(needle) ||
				(entry?.equation?.toLowerCase().includes(needle) ?? false) ||
				(entry?.notes?.toLowerCase().includes(needle) ?? false) ||
				(family?.title.toLowerCase().includes(needle) ?? false)
			);
		});
	});

	const blocks = $derived(groupByKicker(groupByFamily(data.families, data.dex, matchedIds)));
	const searching = $derived(query.trim().length > 0);
</script>

<svelte:head>
	<title>EIC-Dex — Conciliatorics</title>
</svelte:head>

<main class="dex">
	<h1>EIC-Dex</h1>
	<p class="lede">
		The Core EIC equation graph — Parts 2–5. Walk a family to see how a concept is formed, what it
		bottoms out on, and what later concepts use it. Definitions stay in the treatise; this page is
		the connexions.
	</p>

	<label>
		<span class="sr">Search</span>
		<input type="search" bind:value={query} placeholder="Search name, symbol, or equation" />
	</label>

	{#if searching}
		<p class="count">
			{matchedIds.length}
			{matchedIds.length === 1 ? 'matching entry' : 'matching entries'}
		</p>
	{/if}

	<div class="index">
		{#each blocks as block (block.kicker)}
			<section class="kicker-block">
				<h2 id={kickerSlug(block.kicker)}>{block.kicker}</h2>
				{#each block.families as family (family.id)}
					<section class="family" id={family.id}>
						<h3>{family.title}</h3>
						{#if family.blurb && !searching}
							<p class="blurb">{family.blurb}</p>
						{/if}
						{#if family.id === 'operators'}
							<div class="legend">
								{#each family.ids as id (id)}
									{@const label = labelOf(id, data.glossary, data.dex)}
									<a href={resolve('/dex/[id]', { id })}>
										<span class="glyph">{label.symbol || label.name}</span>
										<span class="op-name">{label.name}</span>
									</a>
								{/each}
							</div>
						{:else}
							<ul>
								{#each family.ids as id (id)}
									<li>
										<DexLink label={labelOf(id, data.glossary, data.dex)} variant="row" />
									</li>
								{/each}
							</ul>
						{/if}
					</section>
				{/each}
			</section>
		{:else}
			<p class="empty">No matching entries.</p>
		{/each}
	</div>
</main>

<style>
	.dex {
		width: min(var(--content), 100%);
		margin: 1.5rem auto 0;
	}

	h1 {
		margin: 0 0 0.5rem;
		font-size: 2.15rem;
	}

	.lede {
		margin: 0 0 1.25rem;
		color: var(--text-muted);
	}

	label {
		display: block;
		margin-bottom: 1rem;
	}

	.sr {
		position: absolute;
		width: 1px;
		height: 1px;
		overflow: hidden;
		clip: rect(0 0 0 0);
	}

	input {
		width: 100%;
		padding: 0.55rem 0.7rem;
		border: 1px solid var(--border);
		background-color: var(--bg-inset);
		color: var(--text);
		font-family: var(--font-ui);
		appearance: none;
	}

	input:focus {
		outline: none;
	}

	input:focus-visible {
		border-color: var(--accent);
		outline: 2px solid var(--accent);
		outline-offset: 2px;
	}

	.count,
	.empty {
		margin: 0 0 1rem;
		color: var(--text-muted);
		font-family: var(--font-ui);
		font-size: 0.9rem;
	}

	.kicker-block {
		margin-top: 2rem;
	}

	h2 {
		margin: 0 0 0.85rem;
		color: var(--text-muted);
		font-family: var(--font-ui);
		font-size: 0.8rem;
		font-weight: 600;
		letter-spacing: 0.04em;
		text-transform: uppercase;
		scroll-margin-top: 5rem;
	}

	.family {
		margin: 0 0 1.6rem;
		scroll-margin-top: 5rem;
	}

	h3 {
		margin: 0 0 0.35rem;
		font-size: 1.25rem;
		line-height: 1.3;
	}

	.blurb {
		margin: 0 0 0.65rem;
		color: var(--text-muted);
		font-size: 0.95rem;
		line-height: 1.55;
	}

	ul {
		margin: 0;
		padding: 0;
		list-style: none;
	}

	li {
		border-bottom: 1px solid var(--border);
	}

	.legend {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(10.5rem, 1fr));
		gap: 0.5rem;
	}

	.legend a {
		display: flex;
		align-items: center;
		gap: 0.65rem;
		padding: 0.55rem 0.7rem;
		border: 1px solid var(--border);
		border-radius: 0.55rem;
		color: var(--text);
		text-decoration: none;
	}

	.legend a:hover {
		border-color: var(--token);
		color: var(--link-hover);
	}

	.glyph {
		color: var(--token);
		font-family: ui-monospace, 'Cascadia Code', monospace;
		font-size: 1.25rem;
		line-height: 1;
		min-width: 1.4rem;
		text-align: center;
	}

	.op-name {
		font-family: var(--font-ui);
		font-size: 0.9rem;
	}
</style>
