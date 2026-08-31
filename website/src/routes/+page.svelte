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

<svelte:head>
	<title>Lokapal</title>
</svelte:head>

<main class="home">
	<img class="emblem" src={asset('/lokapal-main.png')} alt="" width="240" height="240" />

	<h1>Lokapal</h1>

	<p class="lede">
		This is the official website of the philosopher Lokapal (Ricardo Pintos). I am currently
		developing Conciliatorics, a perspective within Systemics that seeks to reconcile the inventive
		aspects of Systemic Intervention.
	</p>

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
		width: min(var(--content), 100%);
		margin: 2rem auto 0;
		text-align: center;
	}

	.emblem {
		display: block;
		width: 7.5rem;
		height: 7.5rem;
		margin: 0 auto 1.35rem;
		border-radius: 50%;
		object-fit: cover;
		border: 1px solid var(--border);
	}

	h1 {
		margin: 0 0 0.7rem;
		font-size: 2.15rem;
		line-height: 1.2;
	}

	.lede {
		margin: 0 auto 2rem;
		max-width: 38rem;
		color: var(--text-muted);
		text-align: center;
	}

	.gates {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 2.1rem 0.75rem;
		padding-top: 1.85rem;
		text-align: left;
		font-family: var(--font-ui);
	}

	.gates a {
		display: flex;
		flex-direction: column;
		gap: 0.2rem;
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
		.gates {
			grid-template-columns: 1fr;
		}
	}
</style>
