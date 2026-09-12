<script lang="ts">
	import { asset, resolve } from '$app/paths';
	import { getFlock } from '$lib/birds/flock.svelte';
	import { sections } from '$lib/nav';

	const flock = getFlock();

	function scare(event: PointerEvent | MouseEvent) {
		if ('button' in event && event.button !== 0) return;
		flock.scatter();
	}
</script>

<main class="home">
	<img class="emblem" src={asset('/icon-transparent.png')} alt="" width="240" height="240" />

	<h1 class="sr">Lokapal</h1>

	<p class="lede">Conciliatorics, a perspective within Systemics.</p>

	<nav class="gates" aria-label="Sections" {@attach flock.attachGates}>
		{#each sections as section (section.href)}
			<a href={resolve(section.href)} onpointerdown={scare} onclick={scare}>
				<span class="label">{section.label}</span>
				<span class="blurb">{section.blurb}</span>
			</a>
		{/each}
	</nav>
</main>

<style>
	.home {
		--emblem: clamp(5.75rem, 12svh, 7.5rem);
		--emblem-gap: clamp(0.7rem, 2svh, 1.1rem);
		--lede-gap: clamp(0.9rem, 2.8svh, 2rem);
		--rooftop: clamp(1.4rem, 2.8svh, 1.85rem);
		--row-gap: clamp(1.5rem, 3.6svh, 2.1rem);
		box-sizing: border-box;
		display: flex;
		flex-direction: column;
		justify-content: center;
		justify-content: safe center;
		width: min(var(--content), 100%);
		min-height: calc(100svh - var(--header-h, 4.25rem) - 2rem);
		margin: 0 auto;
		padding-top: clamp(0.75rem, 3svh, 2rem);
		padding-bottom: 0.5rem;
		text-align: center;
	}

	.home > :not(.sr) {
		flex-shrink: 0;
	}

	.emblem {
		display: block;
		width: var(--emblem);
		height: var(--emblem);
		margin: 0 auto var(--emblem-gap);
		object-fit: contain;
	}

	.sr {
		position: absolute;
		width: 1px;
		height: 1px;
		overflow: hidden;
		clip: rect(0 0 0 0);
	}

	.lede {
		margin: 0 auto var(--lede-gap);
		max-width: 38rem;
		color: var(--text-muted);
		text-align: center;
	}

	.gates {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: var(--row-gap) var(--col-gap, 0.75rem);
		width: 100%;
		padding-top: var(--rooftop);
		text-align: left;
		font-family: var(--font-ui);
	}

	.gates a {
		position: relative;
		display: flex;
		flex-direction: column;
		gap: 0.2rem;
		min-width: 0;
		min-height: 4.5rem;
		padding: 0.85rem 1rem;
		border: 1px solid var(--border);
		border-radius: 0.75rem;
		color: var(--text);
		text-decoration: none;
		transition:
			border-color 180ms ease,
			color 180ms ease;
	}

	.gates a:hover {
		border-color: var(--accent);
		color: var(--accent);
	}

	.label {
		font-weight: 650;
	}

	.blurb {
		color: var(--text-muted);
		font-size: 0.9rem;
		line-height: 1.4;
		transition: color 180ms ease;
	}

	.gates a:hover .blurb {
		color: var(--accent);
	}

	@media (max-width: 36rem) {
		.home {
			--lede-gap: 0.45rem;
			--rooftop: 2rem;
			--row-gap: 2.5rem;
			--col-gap: 1.1rem;
			justify-content: flex-end;
			justify-content: safe flex-end;
			padding-bottom: max(0.75rem, env(safe-area-inset-bottom));
		}

		.gates {
			grid-template-columns: 1fr 1fr;
			text-align: center;
		}

		.gates a {
			min-height: 2.75rem;
			justify-content: center;
			align-items: center;
			padding: 0.65rem 0.75rem;
		}

		.blurb {
			position: absolute;
			width: 1px;
			height: 1px;
			overflow: hidden;
			clip: rect(0 0 0 0);
		}
	}
</style>
