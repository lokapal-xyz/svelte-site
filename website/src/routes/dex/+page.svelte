<script lang="ts">
	import { resolve } from '$app/paths';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	let query = $state('');

	const rows = $derived.by(() => {
		const needle = query.trim().toLowerCase();
		return data.dexIds
			.map((id) => {
				const entry = data.dex[id];
				const term = data.glossary[id];
				return {
					id,
					name: term?.term ?? id,
					symbol: entry?.symbol ?? term?.symbol ?? '',
					equation: entry?.equation ?? ''
				};
			})
			.filter((row) => {
				if (!needle) return true;
				return (
					row.name.toLowerCase().includes(needle) ||
					row.symbol.toLowerCase().includes(needle) ||
					row.id.includes(needle)
				);
			});
	});
</script>

<svelte:head>
	<title>EIC-Dex — Conciliatorics</title>
</svelte:head>

<main class="dex">
	<h1>EIC-Dex</h1>
	<p class="lede">
		Core EIC equation graph. Search by name or symbol, then open an entry to trace it back to
		terminal primitives.
	</p>

	<label>
		<span class="sr">Search</span>
		<input type="search" bind:value={query} placeholder="Search name or symbol" />
	</label>

	<ul>
		{#each rows as row (row.id)}
			<li>
				<a href={resolve('/dex/[id]', { id: row.id })}>
					<span class="name">{row.name}</span>
					{#if row.symbol}
						<span class="symbol">{row.symbol}</span>
					{/if}
				</a>
			</li>
		{:else}
			<li class="empty">No matching entries.</li>
		{/each}
	</ul>
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
		background: var(--bg-raised);
		color: var(--text);
		font-family: var(--font-ui);
	}

	ul {
		margin: 0;
		padding: 0;
		list-style: none;
	}

	li {
		border-bottom: 1px solid var(--border);
	}

	a {
		display: flex;
		justify-content: space-between;
		gap: 1rem;
		padding: 0.55rem 0.15rem;
		color: var(--text);
		text-decoration: none;
	}

	a:hover {
		color: var(--accent);
	}

	.symbol {
		color: var(--token);
		font-family: ui-monospace, 'Cascadia Code', monospace;
	}

	.empty {
		padding: 0.8rem 0;
		color: var(--text-muted);
	}
</style>
