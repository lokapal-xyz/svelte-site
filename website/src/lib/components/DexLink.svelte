<script lang="ts">
	import { resolve } from '$app/paths';
	import type { DexLabel } from '$lib/library/dex';

	let {
		label,
		variant = 'item',
		current = false
	}: {
		label: DexLabel;
		variant?: 'row' | 'chip' | 'item';
		current?: boolean;
	} = $props();

	const href = $derived(resolve('/dex/[id]', { id: label.id }));
	const mark = $derived(label.symbol || label.name);
</script>

{#if current}
	<span
		class={['dex-link', variant, 'current']}
		aria-current="page"
		title={variant === 'chip' ? label.name : undefined}
	>
		{#if variant === 'chip'}
			<span class="symbol">{mark}</span>
			<span class="sr">{label.name}</span>
		{:else}
			<span class="name">{label.name}</span>
			{#if label.symbol}
				<span class="symbol">{label.symbol}</span>
			{/if}
		{/if}
	</span>
{:else}
	<a class={['dex-link', variant]} {href} title={variant === 'chip' ? label.name : undefined}>
		{#if variant === 'chip'}
			<span class="symbol">{mark}</span>
			<span class="sr">{label.name}</span>
		{:else}
			<span class="name">{label.name}</span>
			{#if label.symbol}
				<span class="symbol">{label.symbol}</span>
			{/if}
		{/if}
	</a>
{/if}

<style>
	.dex-link {
		color: var(--text);
		text-decoration: none;
	}

	.dex-link:hover {
		color: var(--link-hover);
	}

	.row {
		display: flex;
		justify-content: space-between;
		align-items: baseline;
		gap: 1rem;
		padding: 0.55rem 0.15rem;
	}

	.item {
		display: inline-flex;
		align-items: baseline;
		gap: 0.45rem;
		padding: 0.2rem 0;
	}

	.chip {
		position: relative;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		min-width: 1.85rem;
		padding: 0.2rem 0.45rem;
		border: 1px solid var(--border);
		border-radius: 0.4rem;
		color: var(--token);
		font-family: var(--font-ui);
		font-size: 0.85rem;
		line-height: 1.2;
	}

	.chip:hover {
		border-color: var(--token);
		color: var(--link-hover);
	}

	.chip.current,
	.row.current,
	.item.current {
		color: var(--token);
	}

	.chip.current {
		border-color: var(--token);
	}

	.symbol {
		color: var(--token);
		font-family: ui-monospace, 'Cascadia Code', monospace;
		font-weight: 500;
	}

	.chip .symbol {
		color: inherit;
	}

	.sr {
		position: absolute;
		width: 1px;
		height: 1px;
		overflow: hidden;
		clip: rect(0 0 0 0);
	}
</style>
