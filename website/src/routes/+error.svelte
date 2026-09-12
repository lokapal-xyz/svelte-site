<script lang="ts">
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import WanderingBirds from '$lib/components/WanderingBirds.svelte';

	const missing = $derived(page.status === 404);
</script>

{#if missing}
	<main class="error missing">
		<div class="copy">
			<h1>This page isn't here</h1>
			<p class="lede">That address isn't a section, a chapter, a Dex entry, or a conversation.</p>
			<a class="gate" href={resolve('/')}>
				<span class="label">Home</span>
				<span class="blurb">Back to the six sections.</span>
			</a>
		</div>
		<WanderingBirds />
	</main>
{:else}
	<main class="error">
		<h1>{page.status}</h1>
		<p class="lede">{page.error?.message ?? 'Something went wrong.'}</p>
		<a class="gate" href={resolve('/')}>
			<span class="label">Home</span>
			<span class="blurb">Back to the six sections.</span>
		</a>
	</main>
{/if}

<style>
	.error {
		width: min(var(--content), 100%);
		margin: 1.5rem auto 0;
	}

	.missing {
		width: 100%;
		display: flex;
		flex-direction: column;
		height: calc(100svh - 9.5rem);
		min-height: calc(100svh - 9.5rem);
	}

	.copy {
		width: min(var(--content), 100%);
		margin-left: auto;
		margin-right: auto;
	}

	h1 {
		margin-bottom: 0.5rem;
		font-size: 2.15rem;
		line-height: 1.25;
		font-weight: 650;
	}

	.lede {
		margin-bottom: 1.25rem;
		color: var(--text-muted);
	}

	.gate {
		display: flex;
		flex-direction: column;
		justify-content: center;
		gap: 0.2rem;
		box-sizing: border-box;
		width: fit-content;
		min-width: 14rem;
		max-width: 100%;
		min-height: 4.5rem;
		margin-bottom: 0;
		padding: 0.85rem 1rem;
		border: 1px solid var(--border);
		border-radius: 0.75rem;
		color: var(--text);
		font-family: var(--font-ui);
		text-decoration: none;
		transition:
			border-color 180ms ease,
			color 180ms ease;
	}

	.gate:hover {
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

	.gate:hover .blurb {
		color: var(--accent);
	}
</style>
