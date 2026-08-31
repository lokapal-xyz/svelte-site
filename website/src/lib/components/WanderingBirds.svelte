<script lang="ts">
	import BirdGlyph from '$lib/birds/BirdGlyph.svelte';
	import { WalkController } from '$lib/birds/walk.svelte';

	const walkers = new WalkController();
</script>

<div class="plaza" aria-hidden="true" {@attach walkers.attachStage}>
	{#each walkers.birds as bird (bird.id)}
		<button
			type="button"
			class={['bird', bird.phase]}
			tabindex="-1"
			style:--x="{bird.x}px"
			style:--y="{bird.y}px"
			style:--hop="{bird.hop}px"
			onpointerdown={(event) => {
				event.stopPropagation();
				walkers.nudge(bird.id);
			}}
		>
			<span class={['lift', bird.facing < 0 && 'flip']}>
				<BirdGlyph kind={bird.id} pose={bird.pose} />
			</span>
		</button>
	{/each}
</div>

<style>
	.plaza {
		position: relative;
		flex: 1 1 auto;
		height: 0;
		min-height: 12rem;
		margin-top: 1.5rem;
		overflow: visible;
		pointer-events: none;
	}

	.bird {
		position: absolute;
		top: 0;
		left: 0;
		z-index: 1;
		width: 2.6rem;
		height: 1.95rem;
		margin: 0;
		padding: 0;
		border: 0;
		appearance: none;
		background: transparent;
		color: inherit;
		font: inherit;
		pointer-events: auto;
		cursor: pointer;
		user-select: none;
		transform: translate(calc(var(--x) - 50%), calc(var(--y) - var(--hop, 0px) - 100%));
	}

	.bird.jump {
		z-index: 2;
	}

	.bird:focus {
		outline: none;
	}

	.lift {
		display: block;
		transform-origin: 50% 80%;
	}

	.lift.flip :global(.glyph) {
		transform: scaleX(-1);
	}

	.walk .lift {
		animation: walk-bob 320ms ease-in-out infinite;
	}

	@keyframes walk-bob {
		0%,
		100% {
			transform: translateY(0);
		}
		50% {
			transform: translateY(-1.5px);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.walk .lift {
			animation: none;
		}

		.bird {
			pointer-events: none;
			cursor: default;
		}
	}
</style>
