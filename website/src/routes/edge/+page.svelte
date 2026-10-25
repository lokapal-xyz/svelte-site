<script lang="ts">
	import { resolve } from '$app/paths';
	import EdgeStatus from '$lib/components/EdgeStatus.svelte';
	import { groupByTrunk, STATUS_STAGES } from '$lib/library/edge';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	const blocks = $derived(groupByTrunk(data.trunks, data.leaves));
</script>

<main class="edge">
	<h1>Edge EIC</h1>
	<p class="lede">
		Core EIC is the main work — Attributes Dynamics through Status Reciprocity. Edge EIC grows from one
		point on that trunk at a time, without waiting for a matching development elsewhere. These
		leaves are younger than the core. They may be revised, renamed, or reworked.
	</p>
	<p class="how">
		This is not a second treatise. Each leaf is further EIC method on the edge of Conciliatorics.
	</p>

	<ul class="key" aria-label="Status marks">
		{#each STATUS_STAGES as status (status)}
			<li><EdgeStatus {status} /></li>
		{/each}
	</ul>

	<div class="index">
		{#each blocks as block (block.id)}
			<section class="group" id={block.id}>
				<h2>{block.title}</h2>
				<ul>
					{#each block.leaves as leaf (leaf.id)}
						<li>
							<a href={resolve('/edge/[id]', { id: leaf.id })}>
								<span class="title">{leaf.title}</span>
								<span class="status"><EdgeStatus status={leaf.status} /></span>
								<span class="blurb">{leaf.lede}</span>
							</a>
						</li>
					{/each}
				</ul>
			</section>
		{/each}
	</div>
</main>

<style>
	.edge {
		width: min(var(--content), 100%);
		margin: 1.5rem auto 0;
	}

	h1 {
		margin: 0 0 0.5rem;
		font-size: 2.15rem;
	}

	.lede {
		margin: 0 0 0.85rem;
		color: var(--text-muted);
	}

	.how {
		margin: 0 0 0.4rem;
	}

	.key {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 0.28rem;
		margin: 0 0 1.5rem;
		padding: 0;
		list-style: none;
		color: var(--text-muted);
	}

	.group {
		margin: 0 0 1.6rem;
		scroll-margin-top: 5rem;
	}

	.group + .group {
		margin-top: 2rem;
	}

	h2 {
		margin: 0 0 0.45rem;
		color: var(--text-muted);
		font-family: var(--font-ui);
		font-size: 1.05rem;
		font-weight: 600;
		letter-spacing: 0.02em;
		line-height: 1.3;
	}

	ul {
		margin: 0;
		padding: 0;
		list-style: none;
	}

	.index li {
		border-bottom: 1px solid var(--border);
	}

	a {
		display: grid;
		grid-template-columns: minmax(0, 1fr) auto;
		column-gap: 0.75rem;
		row-gap: 0.15rem;
		padding: 0.55rem 0.15rem;
		color: var(--text);
		text-decoration: none;
	}

	a:hover {
		color: var(--link-hover);
	}

	.title {
		font-weight: 650;
	}

	.status {
		color: var(--text-muted);
		align-self: center;
	}

	.blurb {
		grid-column: 1 / -1;
		color: var(--text-muted);
		font-family: var(--font-ui);
		font-size: 0.9rem;
		line-height: 1.4;
	}

	a:hover .status,
	a:hover .blurb {
		color: var(--link-hover);
	}
</style>
