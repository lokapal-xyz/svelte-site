<script lang="ts">
	import BirdGlyph from '$lib/birds/BirdGlyph.svelte';
	import type { BirdKind } from '$lib/birds/flock.svelte';
	import type { MarkKind } from './panels';

	let { kind }: { kind: MarkKind } = $props();

	const birds: BirdKind[] = ['jay', 'sparrow', 'dove', 'crow'];
	const isBird = $derived(birds.includes(kind as BirdKind));
</script>

<div class="mark" data-kind={kind} aria-hidden="true">
	{#if isBird}
		<div class="flock">
			{#each birds as bird (bird)}
				<BirdGlyph kind={bird} pose={kind === bird ? 'wings-up' : 'rest'} />
			{/each}
		</div>
	{:else if kind === 'intervention'}
		<svg viewBox="0 0 96 56" fill="none">
			<rect x="15" y="5" width="31" height="21" rx="4" />
			<rect x="50" y="5" width="31" height="21" rx="4" />
			<rect x="15" y="30" width="31" height="21" rx="4" />
			<rect x="50" y="30" width="31" height="21" rx="4" />
			<circle class="joint" cx="48" cy="28" r="2.6" />
		</svg>
	{:else if kind === 'anatomy'}
		<svg viewBox="0 0 96 56" fill="none">
			<circle cx="48" cy="11" r="7" />
			<circle cx="48" cy="45" r="7" />
			<circle cx="22" cy="28" r="7" />
			<circle cx="74" cy="28" r="7" />
			<path d="M48 18v20M29 28h38" />
			<circle class="joint" cx="48" cy="28" r="2.6" />
		</svg>
	{:else if kind === 'physiology'}
		<svg viewBox="0 0 96 56" fill="none">
			<circle cx="38" cy="28" r="23" />
			<circle cx="58" cy="28" r="23" />
			<circle class="joint" cx="48" cy="28" r="2.6" />
		</svg>
	{:else}
		<svg viewBox="0 0 96 56" fill="none">
			<ellipse cx="48" cy="28" rx="33" ry="24" />
			<circle class="joint" cx="48" cy="4" r="2.6" />
			<circle cx="76" cy="41" r="5.2" />
			<circle cx="20" cy="41" r="5.2" />
		</svg>
	{/if}
</div>

<style>
	.mark {
		display: flex;
		justify-content: center;
		margin: 0 0 1rem;
	}

	svg {
		display: block;
		width: 6.5rem;
		height: 3.75rem;
		overflow: visible;
		fill: none;
		stroke: #e6e6e6;
		stroke-width: 1.7;
		stroke-linecap: round;
		stroke-linejoin: round;
	}

	.joint {
		fill: #c4a574;
		stroke: #c4a574;
	}

	.flock {
		display: flex;
		align-items: flex-end;
		justify-content: center;
		gap: 0.7rem;
	}
</style>
