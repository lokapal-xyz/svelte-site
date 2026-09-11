<script lang="ts">
	import { afterNavigate } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import {
		conversationMatches,
		groupByField,
		groupByInterlocutor,
		groupByJoint,
		interlocutorLine,
		interlocutorSlug,
		MANNER_LABEL
	} from '$lib/library/dialogue';
	import type { DialogueConversation } from '$lib/library/types';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	const filters = [
		{ id: 'field', label: 'By field' },
		{ id: 'joint', label: 'By Conciliatorics joint' },
		{ id: 'interlocutor', label: 'By interlocutor' }
	] as const;

	type GroupBy = (typeof filters)[number]['id'];

	let query = $state('');
	let groupBy = $state<GroupBy>('field');

	const matched = $derived(
		data.conversations.filter((row) =>
			conversationMatches(
				row,
				data.fields.find((field) => field.id === row.field),
				data.joints,
				query
			)
		)
	);
	const searching = $derived(query.trim().length > 0);
	const fieldBlocks = $derived(
		groupByField(data.fields, matched).filter(
			(block) => !searching || block.conversations.length > 0
		)
	);
	const jointBlocks = $derived(groupByJoint(data.joints, matched));
	const people = $derived(groupByInterlocutor(matched));

	function groupFromHash(hash: string): GroupBy | null {
		const id = decodeURIComponent(hash.replace(/^#/, ''));
		if (!id) return null;
		if (data.fields.some((row) => row.id === id)) return 'field';
		if (data.joints.some((row) => row.id === id)) return 'joint';
		if (
			data.conversations.some((row) =>
				row.interlocutors.some((person) => interlocutorSlug(person.sort_name) === id)
			)
		) {
			return 'interlocutor';
		}
		return null;
	}

	afterNavigate(() => {
		const next = groupFromHash(page.url.hash);
		if (next) groupBy = next;
	});
</script>

<svelte:head>
	<title>In dialogue — Lokapal</title>
</svelte:head>

{#snippet conversationLinks(rows: DialogueConversation[], withWho: boolean)}
	<ul>
		{#each rows as row (row.id)}
			<li>
				<a href={resolve('/dialogue/[id]', { id: row.id })}>
					<span class="title">{row.title}</span>
					{#if withWho}
						<span class="who">{interlocutorLine(row)}</span>
					{/if}
				</a>
			</li>
		{/each}
	</ul>
{/snippet}

<main class="dialogue">
	<h1>In dialogue</h1>
	<p class="lede">
		The treatise is self-contained. It still has to meet the literature it sits next to — without
		dissolving into it, and without walling itself off.
	</p>
	<p class="how">
		This is a buffet, not a course. You do not have to read every conversation, or in any sequence.
		Each plate is a contact: what a well-known perspective says about a shared problem, and
		Conciliatorics' view of that problem. It is not a substitute for the treatise, or for the works
		it meets. The table will grow.
	</p>

	<label class="search">
		<span class="sr">Search</span>
		<input type="search" bind:value={query} placeholder="Search a name, a field, or a concept" />
	</label>

	<div class="filter">
		<p class="filter-label" id="dialogue-filter-label">
			<svg viewBox="0 0 24 24" aria-hidden="true">
				<path d="M4 5h16l-6.5 8v5l-3 1.5v-6.5L4 5z" />
			</svg>
			Filter
		</p>
		<div class="pills" role="radiogroup" aria-labelledby="dialogue-filter-label">
			{#each filters as filter (filter.id)}
				<label id="filter-{filter.id}">
					<input
						class="sr"
						type="radio"
						name="dialogue-group"
						value={filter.id}
						bind:group={groupBy}
					/>
					{filter.label}
				</label>
			{/each}
		</div>
	</div>

	{#if searching}
		<p class="count">
			{matched.length}
			{matched.length === 1 ? 'matching conversation' : 'matching conversations'}
		</p>
	{/if}

	<div class="index" aria-labelledby="filter-{groupBy}">
		{#if groupBy === 'field'}
			{#each fieldBlocks as block (block.id)}
				<section class="group" id={block.id}>
					<p class="manner">{MANNER_LABEL[block.manner]}</p>
					<h2>{block.title}</h2>
					{#if block.blurb && !searching}
						<p class="blurb">{block.blurb}</p>
					{/if}
					{#if block.conversations.length > 0}
						{@render conversationLinks(block.conversations, true)}
					{:else}
						<p class="empty">This plate will grow.</p>
					{/if}
				</section>
			{:else}
				<p class="empty">No matching conversations.</p>
			{/each}
		{:else if groupBy === 'joint'}
			{#each jointBlocks as block (block.id)}
				<section class="group" id={block.id}>
					<h2>{block.label}</h2>
					{@render conversationLinks(block.conversations, true)}
				</section>
			{:else}
				<p class="empty">No matching conversations.</p>
			{/each}
		{:else}
			{#each people as person (person.sort_name)}
				<section class="group" id={interlocutorSlug(person.sort_name)}>
					<h2>{person.name}</h2>
					{@render conversationLinks(person.conversations, false)}
				</section>
			{:else}
				<p class="empty">No matching conversations.</p>
			{/each}
		{/if}
	</div>
</main>

<style>
	.dialogue {
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
		margin: 0 0 1.25rem;
	}

	.search {
		display: block;
		margin-bottom: 0.7rem;
	}

	.sr {
		position: absolute;
		width: 1px;
		height: 1px;
		overflow: hidden;
		clip: rect(0 0 0 0);
	}

	.search input {
		width: 100%;
		padding: 0.55rem 0.7rem;
		border: 1px solid var(--border);
		background-color: var(--bg-inset);
		color: var(--text);
		font-family: var(--font-ui);
		appearance: none;
	}

	.search input:focus {
		outline: none;
	}

	.search input:focus-visible {
		border-color: var(--accent);
		outline: 2px solid var(--accent);
		outline-offset: 2px;
	}

	.filter {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 0.55rem 0.75rem;
		margin: 0 0 1.15rem;
		font-family: var(--font-ui);
	}

	.filter-label {
		display: inline-flex;
		align-items: center;
		gap: 0.35rem;
		margin: 0;
		color: var(--text-muted);
		font-size: 0.72rem;
		font-weight: 600;
		letter-spacing: 0.05em;
		text-transform: uppercase;
	}

	.filter-label svg {
		display: block;
		width: 0.95rem;
		height: 0.95rem;
		stroke: currentColor;
		stroke-width: 1.75;
		stroke-linejoin: round;
		stroke-linecap: round;
		fill: none;
	}

	.pills {
		display: flex;
		flex-wrap: wrap;
		gap: 0.45rem;
	}

	.pills label {
		display: inline-flex;
		align-items: center;
		padding: 0.4rem 0.9rem;
		border: 1px solid var(--border);
		border-radius: 999px;
		color: var(--text);
		font-size: 0.9rem;
		line-height: 1.2;
		cursor: pointer;
	}

	.pills label:hover,
	.pills label:has(input:checked) {
		border-color: var(--accent);
		color: var(--accent);
	}

	.pills label:has(input:focus-visible) {
		outline: 2px solid var(--accent);
		outline-offset: 2px;
	}

	.count,
	.empty {
		margin: 0 0 1rem;
		color: var(--text-muted);
		font-family: var(--font-ui);
		font-size: 0.9rem;
	}

	.group {
		margin: 0 0 1.6rem;
		scroll-margin-top: 5rem;
	}

	.manner {
		margin: 0 0 0.15rem;
		color: var(--text-muted);
		font-family: var(--font-ui);
		font-size: 0.72rem;
		font-weight: 600;
		letter-spacing: 0.05em;
		text-transform: uppercase;
	}

	h2 {
		margin: 0 0 0.35rem;
		font-size: 1.25rem;
		line-height: 1.3;
		font-weight: 650;
	}

	.blurb {
		margin: 0 0 0.65rem;
		color: var(--text-muted);
		font-size: 0.95rem;
		line-height: 1.55;
	}

	ul {
		margin: 0;
		padding: 0;
		list-style: none;
	}

	li {
		border-bottom: 1px solid var(--border);
	}

	a {
		display: flex;
		flex-direction: column;
		gap: 0.15rem;
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

	.who {
		color: var(--text-muted);
		font-family: var(--font-ui);
		font-size: 0.9rem;
	}

	a:hover .who {
		color: var(--link-hover);
	}
</style>
