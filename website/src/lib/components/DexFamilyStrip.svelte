<script lang="ts">
	import DexLink from '$lib/components/DexLink.svelte';
	import { familyMembers, labelOf } from '$lib/library/dex';
	import type { DexEntry, GlossaryTerm } from '$lib/library/types';

	let {
		familyId,
		currentId,
		dex,
		glossary
	}: {
		familyId: string;
		currentId: string;
		dex: Record<string, DexEntry>;
		glossary: Record<string, GlossaryTerm>;
	} = $props();

	const ids = $derived(familyMembers(dex, familyId));
</script>

{#if ids.length > 1}
	<nav class="strip" aria-label="Family">
		{#each ids as id (id)}
			<DexLink label={labelOf(id, glossary, dex)} variant="chip" current={id === currentId} />
		{/each}
	</nav>
{/if}

<style>
	.strip {
		display: flex;
		flex-wrap: wrap;
		gap: 0.35rem;
		margin: 0 0 1.1rem;
	}
</style>
