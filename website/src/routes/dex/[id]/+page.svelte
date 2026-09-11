<script lang="ts">
	import DexFamilyStrip from '$lib/components/DexFamilyStrip.svelte';
	import DexIdList from '$lib/components/DexIdList.svelte';
	import {
		formedBy,
		groupByFamily,
		kindLine,
		kickerSlug,
		labelOf,
		showComposition,
		showRoots
	} from '$lib/library/dex';
	import { resolve } from '$app/paths';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	const entry = $derived(data.entry);
	const family = $derived(data.families.find((row) => row.id === entry.family));
	const term = $derived(data.glossary[entry.id]);
	const label = $derived(labelOf(entry.id, data.glossary, data.dex));
	const operatorName = $derived(
		entry.operator ? labelOf(entry.operator, data.glossary, data.dex).name : undefined
	);
	const formedIds = $derived(entry.kind === 'operator' ? formedBy(data.dex, entry.id) : []);
	const formedGroups = $derived(groupByFamily(data.families, data.dex, formedIds));
	const chapter = $derived(data.chapters.find((row) => row.slug === family?.chapter));
	const apex = $derived(entry.kind !== 'operator' && entry.used_by.length === 0);
</script>

<svelte:head>
	<title>{label.name} — EIC-Dex</title>
</svelte:head>

<main class="entry">
	<p class="kicker">
		<a href={resolve('/dex')}>EIC-Dex</a>
		{#if family}
			<span class="sep" aria-hidden="true">›</span>
			<a href="{resolve('/dex')}#{kickerSlug(family.kicker)}">{family.kicker}</a>
			<span class="sep" aria-hidden="true">›</span>
			<a href="{resolve('/dex')}#{family.id}">{family.title}</a>
		{/if}
	</p>

	{#if family}
		<DexFamilyStrip
			familyId={family.id}
			currentId={entry.id}
			dex={data.dex}
			glossary={data.glossary}
		/>
	{/if}

	<h1>
		{label.name}
		{#if label.symbol}
			<span class="symbol">{label.symbol}</span>
		{/if}
	</h1>

	<p class="kind">
		{#if entry.kind === 'derived' && entry.operator}
			Formed by
			<a href={resolve('/dex/[id]', { id: entry.operator })}>{operatorName}</a>
		{:else}
			{kindLine(entry, operatorName)}
		{/if}
	</p>

	{#if term?.definition}
		<p class="definition">{term.definition}</p>
	{/if}

	{#if entry.notes}
		<p class="notes">{entry.notes}</p>
	{/if}

	<div class="graph">
		{#if entry.equation}
			<section>
				<h2>Equation</h2>
				<p class="mono">{entry.equation}</p>
			</section>
		{/if}

		{#if showComposition(entry) && entry.depends_on}
			<section>
				<h2>Formed from</h2>
				<DexIdList ids={entry.depends_on} dex={data.dex} glossary={data.glossary} />
			</section>
		{/if}

		{#if showRoots(entry) && entry.roots}
			<section>
				<h2>Bottoms out on</h2>
				<DexIdList ids={entry.roots} dex={data.dex} glossary={data.glossary} />
			</section>
		{/if}

		{#if entry.kind === 'operator'}
			<section>
				<h2>Forms</h2>
				{#if formedGroups.length > 0}
					{#each formedGroups as group (group.id)}
						<h3>{group.title}</h3>
						<DexIdList ids={group.ids} dex={data.dex} glossary={data.glossary} />
					{/each}
				{:else}
					<p class="empty">Does not produce a named concept as the outermost operator.</p>
				{/if}
			</section>
		{:else if entry.used_by.length > 0}
			<section>
				<h2>Used by</h2>
				<DexIdList ids={entry.used_by} dex={data.dex} glossary={data.glossary} />
			</section>
		{:else if apex}
			<section>
				<h2>Used by</h2>
				<p class="empty">No later Dex concept depends on this one.</p>
			</section>
		{/if}
	</div>

	{#if chapter}
		<p class="treatise">
			<a href={resolve('/[slug]', { slug: chapter.slug })}>Read {chapter.title} in the treatise →</a
			>
		</p>
	{/if}
</main>

<style>
	.entry {
		width: min(var(--content), 100%);
		margin: 1.5rem auto 0;
	}

	.kicker {
		margin: 0 0 0.75rem;
		color: var(--text-muted);
		font-family: var(--font-ui);
		font-size: 0.8rem;
		letter-spacing: 0.04em;
		text-transform: uppercase;
	}

	.kicker .sep {
		margin: 0 0.4em;
	}

	h1 {
		margin: 0 0 0.35rem;
		font-size: 2.15rem;
		line-height: 1.2;
	}

	.symbol {
		margin-left: 0.4rem;
		color: var(--token);
		font-weight: 500;
	}

	.kind {
		margin: 0 0 0.85rem;
		color: var(--text-muted);
		font-family: var(--font-ui);
		font-size: 0.9rem;
	}

	.definition {
		margin: 0 0 0.75rem;
	}

	.notes {
		margin: 0 0 1.25rem;
		color: var(--text-muted);
	}

	.graph {
		display: grid;
		gap: 1.15rem;
	}

	section {
		margin: 0;
	}

	h2 {
		margin: 0;
		color: var(--text-muted);
		font-family: var(--font-ui);
		font-size: 0.72rem;
		letter-spacing: 0.05em;
		text-transform: uppercase;
	}

	h3 {
		margin: 0.7rem 0 0;
		font-size: 1rem;
		font-weight: 650;
	}

	.mono {
		margin: 0.25rem 0 0;
		font-family: ui-monospace, 'Cascadia Code', monospace;
		font-size: 1.05rem;
	}

	.empty {
		margin: 0.25rem 0 0;
		color: var(--text-muted);
	}

	.treatise {
		margin: 1.75rem 0 0;
		padding-top: 0.9rem;
		border-top: 1px solid var(--border);
	}
</style>
