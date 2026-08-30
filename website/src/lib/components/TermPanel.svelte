<script lang="ts">
	import { resolve } from '$app/paths';
	import { fade } from 'svelte/transition';
	import type { GlossaryTerm } from '$lib/library/types';
	import { getTermPanel } from '$lib/term-panel.svelte';

	let { glossary, dexIds }: { glossary: Record<string, GlossaryTerm>; dexIds: string[] } = $props();

	const panel = getTermPanel();
	const dexSet = $derived(new Set(dexIds));

	const term = $derived(panel.openId ? (glossary[panel.openId] ?? null) : null);
	const inDex = $derived(panel.openId != null && dexSet.has(panel.openId));
	const pairLabel = $derived(term?.pair ? (glossary[term.pair]?.term ?? term.pair) : null);
	const relatedLabels = $derived((term?.related ?? []).map((id) => glossary[id]?.term ?? id));
	let docked = $state(false);

	function attachPosition(node: HTMLElement) {
		const place = () => {
			const margin = 12;
			const vw = window.innerWidth;
			const vh = window.innerHeight;

			if (vw <= 640) {
				docked = true;
				node.style.left = '';
				node.style.top = '';
				node.style.maxHeight = '';
				return;
			}

			docked = false;
			const width = node.offsetWidth;
			const height = node.offsetHeight;
			const left = Math.min(Math.max(margin, panel.x), Math.max(margin, vw - width - margin));
			const spaceBelow = vh - panel.y - margin;
			const spaceAbove = panel.y - margin;
			const flip = height + margin > spaceBelow && spaceAbove > spaceBelow;

			node.style.left = `${left}px`;
			if (flip) {
				const top = Math.max(margin, panel.y - margin - height);
				node.style.top = `${top}px`;
				node.style.maxHeight = `${Math.max(8 * 16, panel.y - margin * 2)}px`;
			} else {
				const top = panel.y + margin;
				node.style.top = `${top}px`;
				node.style.maxHeight = `${Math.max(8 * 16, vh - top - margin)}px`;
			}
		};

		const observer = new ResizeObserver(place);
		observer.observe(node);
		place();
		return () => observer.disconnect();
	}
</script>

{#key panel.generation}
	{#if panel.openId}
		<div
			class={['term-panel', docked && 'docked']}
			style:--x="{panel.x}px"
			style:--y="{panel.y}px"
			role="dialog"
			aria-modal="false"
			aria-labelledby="term-panel-title"
			transition:fade|global={{ duration: 180 }}
			{@attach attachPosition}
		>
			<div class="compact">
				<div class="head">
					<h2 id="term-panel-title">
						{term?.term ?? panel.openId}
						{#if term?.symbol}
							<span class="symbol">{term.symbol}</span>
						{/if}
					</h2>
					<button type="button" class="icon" onclick={() => panel.close()} aria-label="Close">
						×
					</button>
				</div>
				{#if term?.definition}
					<p class="definition">{term.definition}</p>
				{:else}
					<p class="definition muted">No glossary entry for this id.</p>
				{/if}
			</div>

			<div class={['extra', panel.expanded && 'open']}>
				<div class="extra-inner">
					{#if term?.jurisdiction}
						<p><span class="label">Jurisdiction</span> {term.jurisdiction}</p>
					{/if}
					{#if pairLabel}
						<p><span class="label">Pair</span> {pairLabel}</p>
					{/if}
					{#if term?.equation}
						<p><span class="label">Equation</span> <span class="mono">{term.equation}</span></p>
					{/if}
					{#if term?.notes}
						<p><span class="label">Notes</span> {term.notes}</p>
					{/if}
					{#if relatedLabels.length > 0}
						<p><span class="label">Related</span> {relatedLabels.join(', ')}</p>
					{/if}
				</div>
			</div>

			<div class="actions">
				<button
					type="button"
					class="text-btn term-panel-keep"
					onclick={() => panel.toggleExpanded()}
				>
					{panel.expanded ? 'Show less' : 'Expand'}
				</button>
				{#if inDex && panel.openId}
					<a class="term-panel-keep" href={resolve('/dex/[id]', { id: panel.openId })}
						>View in EIC-Dex →</a
					>
				{/if}
			</div>
		</div>
	{/if}
{/key}

<style>
	.term-panel {
		position: fixed;
		z-index: 20;
		left: clamp(0.75rem, var(--x), calc(100vw - 22.5rem));
		top: clamp(0.75rem, calc(var(--y) + 12px), calc(100vh - 9rem));
		width: min(22rem, calc(100vw - 1.5rem));
		max-height: min(70vh, 36rem);
		overflow: auto;
		padding: 0.9rem 1rem 0.75rem;
		border: 1px solid var(--border);
		background: var(--bg-panel);
		color: var(--text);
		box-shadow: 0 12px 40px rgb(0 0 0 / 0.45);
		font-family: var(--font-ui);
		font-size: 0.95rem;
		line-height: 1.45;
	}

	.head {
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
		gap: 0.75rem;
	}

	h2 {
		margin: 0;
		font-family: var(--font-body);
		font-size: 1.15rem;
		line-height: 1.3;
	}

	.symbol {
		margin-left: 0.35rem;
		color: var(--token);
		font-weight: 500;
	}

	.definition {
		margin: 0.55rem 0 0;
	}

	.muted {
		color: var(--text-muted);
	}

	.icon,
	.text-btn {
		margin: 0;
		padding: 0;
		border: 0;
		background: none;
		color: var(--text-muted);
		cursor: pointer;
	}

	.icon {
		font-size: 1.35rem;
		line-height: 1;
	}

	.text-btn:hover,
	.icon:hover {
		color: var(--text);
	}

	.extra {
		display: grid;
		grid-template-rows: 0fr;
		opacity: 0;
		transition:
			grid-template-rows 180ms ease,
			opacity 180ms ease;
	}

	.extra.open {
		grid-template-rows: 1fr;
		opacity: 1;
		margin-top: 0.65rem;
	}

	.extra-inner {
		overflow: hidden;
	}

	.extra-inner p {
		margin: 0.4rem 0 0;
	}

	.label {
		display: block;
		color: var(--text-muted);
		font-size: 0.72rem;
		letter-spacing: 0.05em;
		text-transform: uppercase;
	}

	.mono {
		font-family: ui-monospace, 'Cascadia Code', monospace;
		font-size: 0.88em;
	}

	.actions {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 0.75rem 1.1rem;
		margin-top: 0.8rem;
	}

	.term-panel.docked {
		left: 0.75rem;
		right: 0.75rem;
		top: auto;
		bottom: 0.75rem;
		width: auto;
		max-height: min(70vh, 36rem);
	}

	@media (max-width: 40rem) {
		.term-panel {
			left: 0.75rem;
			right: 0.75rem;
			top: auto;
			bottom: 0.75rem;
			width: auto;
			max-height: min(70vh, 36rem);
		}
	}
</style>
