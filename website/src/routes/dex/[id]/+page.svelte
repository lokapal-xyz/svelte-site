<script lang="ts">
	import { resolve } from '$app/paths';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	const term = $derived(data.glossary[data.entry.id]);
	const operatorLabel = $derived(
		data.entry.operator ? (data.glossary[data.entry.operator]?.term ?? data.entry.operator) : null
	);

	function labelFor(id: string) {
		return data.glossary[id]?.term ?? id;
	}
</script>

<svelte:head>
	<title>{term?.term ?? data.entry.id} — EIC-Dex</title>
</svelte:head>

<main class="entry">
	<p class="kicker"><a href={resolve('/dex')}>EIC-Dex</a></p>
	<h1>
		{term?.term ?? data.entry.id}
		{#if data.entry.symbol}
			<span class="symbol">{data.entry.symbol}</span>
		{/if}
	</h1>

	{#if term?.definition}
		<p class="definition">{term.definition}</p>
	{/if}

	<dl>
		{#if data.entry.equation}
			<div>
				<dt>Equation</dt>
				<dd class="mono">{data.entry.equation}</dd>
			</div>
		{/if}
		{#if operatorLabel && data.entry.operator}
			<div>
				<dt>Operator</dt>
				<dd>
					<a href={resolve('/dex/[id]', { id: data.entry.operator })}>{operatorLabel}</a>
				</dd>
			</div>
		{/if}
		{#if data.entry.depends_on}
			<div>
				<dt>Depends on</dt>
				<dd>
					{#each data.entry.depends_on as dep, i (dep)}
						{i > 0 ? ', ' : ''}<a href={resolve('/dex/[id]', { id: dep })}>{labelFor(dep)}</a>
					{/each}
				</dd>
			</div>
		{/if}
		{#if data.entry.roots}
			<div>
				<dt>Roots</dt>
				<dd>
					{#each data.entry.roots as root, i (root)}
						{i > 0 ? ', ' : ''}<a href={resolve('/dex/[id]', { id: root })}>{labelFor(root)}</a>
					{/each}
				</dd>
			</div>
		{/if}
		{#if data.entry.notes}
			<div>
				<dt>Notes</dt>
				<dd>{data.entry.notes}</dd>
			</div>
		{/if}
	</dl>
</main>

<style>
	.entry {
		width: min(var(--content), 100%);
		margin: 1.5rem auto 0;
	}

	.kicker {
		margin: 0 0 0.35rem;
		font-family: var(--font-ui);
		font-size: 0.8rem;
		letter-spacing: 0.04em;
		text-transform: uppercase;
	}

	h1 {
		margin: 0 0 0.75rem;
		font-size: 2.15rem;
		line-height: 1.2;
	}

	.symbol {
		margin-left: 0.4rem;
		color: var(--token);
		font-weight: 500;
	}

	.definition {
		margin: 0 0 1.25rem;
	}

	dl {
		display: grid;
		gap: 0.9rem;
	}

	div {
		margin: 0;
	}

	dt {
		color: var(--text-muted);
		font-family: var(--font-ui);
		font-size: 0.72rem;
		letter-spacing: 0.05em;
		text-transform: uppercase;
	}

	dd {
		margin: 0.2rem 0 0;
	}

	.mono {
		font-family: ui-monospace, 'Cascadia Code', monospace;
	}
</style>
