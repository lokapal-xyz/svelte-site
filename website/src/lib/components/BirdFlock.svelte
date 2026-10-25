<script lang="ts">
	import BirdGlyph from '$lib/birds/BirdGlyph.svelte';
	import { getFlock } from '$lib/birds/flock.svelte';

	const flock = getFlock();
</script>

{#if flock.active}
	<div class="flock" aria-hidden="true">
		{#each flock.birds as bird (bird.id)}
			<div
				class={['bird', bird.phase]}
				style:--x="{bird.x}px"
				style:--y="{bird.y}px"
				style:--bob-delay={bird.bobDelay}
			>
				<span class={['lift', bird.facing < 0 && 'flip']}>
					<BirdGlyph kind={bird.id} pose={bird.pose} />
				</span>
			</div>
		{/each}
	</div>
{/if}

<style>
	.flock {
		pointer-events: none;
		animation: flock-in 700ms ease both;
	}

	.bird {
		position: fixed;
		top: 0;
		left: 0;
		z-index: 6;
		width: 2.6rem;
		height: 1.95rem;
		transform: translate(calc(var(--x) - 50%), calc(var(--y) - 100% + 2px));
		transition: none;
	}

	.bird.hop {
		transition: transform 540ms cubic-bezier(0.22, 0.64, 0.28, 1);
	}

	.bird.scatter {
		z-index: 24;
		opacity: 0;
		transition:
			transform 780ms cubic-bezier(0.18, 0.68, 0.22, 1),
			opacity 180ms 600ms linear;
	}

	.lift {
		display: block;
		transform-origin: 50% 80%;
	}

	.lift.flip :global(.glyph) {
		transform: scaleX(-1);
	}

	.idle .lift {
		animation: bob 3.4s ease-in-out infinite;
		animation-delay: var(--bob-delay, 0s);
	}

	.hop .lift {
		animation: hop-arc 540ms ease-in-out;
	}

	.scatter .lift {
		animation: scatter-tilt 780ms ease-in;
	}

	@keyframes flock-in {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}

	@keyframes bob {
		0%,
		100% {
			transform: translateY(0);
		}
		50% {
			transform: translateY(-2px);
		}
	}

	@keyframes hop-arc {
		0%,
		100% {
			transform: translateY(0);
		}
		50% {
			transform: translateY(-1.85rem);
		}
	}

	@keyframes scatter-tilt {
		to {
			transform: translateY(-0.4rem) rotate(18deg);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.flock,
		.idle .lift,
		.hop .lift,
		.scatter .lift {
			animation: none;
		}

		.bird.hop,
		.bird.scatter {
			transition: none;
		}
	}
</style>
