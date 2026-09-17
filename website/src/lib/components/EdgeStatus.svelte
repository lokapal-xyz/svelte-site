<script lang="ts">
	import { STATUS_LABEL, STATUS_MARKS } from '$lib/library/edge';
	import type { EdgeStatus } from '$lib/library/types';

	let { status, labelFirst = false }: { status: EdgeStatus; labelFirst?: boolean } = $props();

	const label = $derived(STATUS_LABEL[status]);
	const marks = $derived(STATUS_MARKS[status]);
</script>

{#snippet markIcons()}
	<span class="marks" aria-hidden="true">
		{#each Array.from({ length: marks }, (_, i) => i) as i (i)}
			<svg viewBox="0 0 16 16">
				<path
					d="M2.1 14.5c.3-1 .8-1.5 1.2-1.6C3.6 8.2 7.2 3.5 12.6 3.1c.5 4.2-1.4 7.8-5 10.2-1.9 1.2-3.8 1.1-4.5-.1-.3.7-.6 1.1-.8 1.4-.2.2-.4.1-.2-.1z"
				/>
			</svg>
		{/each}
	</span>
{/snippet}

<span class="edge-status">
	{#if labelFirst}
		<span class="name">{label}</span>
		{@render markIcons()}
	{:else}
		{@render markIcons()}
		<span class="name">{label}</span>
	{/if}
</span>

<style>
	.edge-status {
		display: inline-flex;
		align-items: center;
		gap: 0.4rem;
		color: inherit;
		font-family: var(--font-ui);
		font-size: 0.72rem;
		font-weight: 600;
		letter-spacing: 0.05em;
		text-transform: uppercase;
		white-space: nowrap;
	}

	.marks {
		display: inline-flex;
		align-items: center;
		gap: 0.08rem;
	}

	svg {
		display: block;
		width: 0.78rem;
		height: 0.78rem;
		fill: currentColor;
	}
</style>
