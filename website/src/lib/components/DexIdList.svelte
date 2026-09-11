<script lang="ts">
	import DexLink from '$lib/components/DexLink.svelte';
	import { labelOf } from '$lib/library/dex';
	import type { DexEntry, GlossaryTerm } from '$lib/library/types';

	let {
		ids,
		dex,
		glossary
	}: {
		ids: string[];
		dex: Record<string, DexEntry>;
		glossary: Record<string, GlossaryTerm>;
	} = $props();
</script>

<ul>
	{#each ids as id (id)}
		<li>
			<DexLink label={labelOf(id, glossary, dex)} variant="item" />
		</li>
	{/each}
</ul>

<style>
	ul {
		margin: 0.15rem 0 0;
		padding: 0;
		list-style: none;
		display: flex;
		flex-wrap: wrap;
		gap: 0.15rem 1.25rem;
	}

	li {
		margin: 0;
	}
</style>
