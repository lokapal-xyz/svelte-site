<script lang="ts">
	import BirdGlyph from '$lib/birds/BirdGlyph.svelte';

	let { partTitle }: { partTitle: string } = $props();

	const split = $derived.by(() => {
		const match = partTitle.match(/^Part (\d+) — (.+)$/);
		if (match) {
			return { line: `End of Part ${match[1]}`, title: match[2] };
		}
		return { line: `End of ${partTitle}`, title: null as string | null };
	});
</script>

<div class="part-end">
	<div class="flank left" aria-hidden="true">
		<span class="bird">
			<BirdGlyph kind="dove" pose="rest" />
		</span>
		<span class="bird">
			<BirdGlyph kind="sparrow" pose="rest" />
		</span>
	</div>
	<p class="legend">
		<span class="line">{split.line}</span>
		{#if split.title}
			<span class="dash"> — </span>
			<span class="name">{split.title}</span>
		{/if}
	</p>
	<div class="flank right" aria-hidden="true">
		<span class="bird flip">
			<BirdGlyph kind="jay" pose="rest" />
		</span>
		<span class="bird flip">
			<BirdGlyph kind="crow" pose="rest" />
		</span>
	</div>
</div>

<style>
	.part-end {
		display: grid;
		grid-template-columns: auto minmax(0, auto) auto;
		grid-template-areas: 'left legend right';
		justify-content: center;
		align-items: center;
		column-gap: 0.85rem;
		margin: 2.75rem 0 0;
		padding: 0.85rem 0 0.35rem;
	}

	.left {
		grid-area: left;
	}

	.right {
		grid-area: right;
	}

	.flank {
		display: flex;
		align-items: flex-end;
		gap: 0.35rem;
		pointer-events: none;
	}

	.bird {
		display: block;
		line-height: 0;
	}

	.bird :global(.glyph) {
		width: 1.65rem;
		height: 1.24rem;
	}

	.flip :global(.glyph) {
		transform: scaleX(-1);
	}

	.legend {
		grid-area: legend;
		margin: 0;
		text-align: center;
		color: var(--text-muted);
		font-family: var(--font-ui);
		font-size: 1.05rem;
		font-weight: 600;
		line-height: 1.35;
	}

	@media (max-width: 40rem) {
		.part-end {
			display: flex;
			flex-wrap: wrap;
			justify-content: center;
			align-items: flex-end;
			column-gap: 1.15rem;
			row-gap: 0.75rem;
			margin-top: 2.25rem;
		}

		.legend {
			flex: 1 0 100%;
			order: 1;
		}

		.line {
			display: block;
			font-size: 0.8rem;
			letter-spacing: 0.06em;
		}

		.dash {
			display: none;
		}

		.name {
			display: block;
			margin-top: 0.35rem;
			color: var(--text);
			font-family: var(--font-body);
			font-size: 1.25rem;
			font-weight: 650;
			line-height: 1.3;
			text-wrap: balance;
		}
	}
</style>
