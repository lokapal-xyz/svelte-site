<script lang="ts">
	import { pushState } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { onMount } from 'svelte';
	import type { Attachment } from 'svelte/attachments';
	import WalkthroughMark from './WalkthroughMark.svelte';
	import { entryHash, PANELS, parseEntryHash } from './panels';

	const last = PANELS.length - 1;
	let index = $state(0);
	const panel = $derived(PANELS[index] ?? PANELS[0]);
	const atFirst = $derived(index <= 0);
	const atLast = $derived(index >= last);

	onMount(() => {
		index = parseEntryHash(window.location.hash, PANELS.length) ?? 0;
	});

	function go(to: number) {
		const next = Math.max(0, Math.min(last, to));
		if (next === index) return;
		index = next;
		pushState(resolve(`/start${entryHash(next)}`), { entry: next });
	}

	function onPopState() {
		index = parseEntryHash(window.location.hash, PANELS.length) ?? 0;
	}

	function onKey(event: KeyboardEvent) {
		if (event.defaultPrevented || event.repeat) return;
		if (event.metaKey || event.ctrlKey || event.altKey || event.shiftKey) return;
		const target = event.target;
		if (
			target instanceof HTMLElement &&
			(target.isContentEditable ||
				target.closest('input, textarea, select, [contenteditable="true"]'))
		) {
			return;
		}
		if (event.key === 'ArrowLeft') {
			event.preventDefault();
			go(index - 1);
		} else if (event.key === 'ArrowRight') {
			event.preventDefault();
			go(index + 1);
		}
	}

	const swipe: Attachment<HTMLElement> = (node) => {
		let x0 = 0;
		let y0 = 0;
		let pointer = -1;

		function down(event: PointerEvent) {
			if (event.pointerType === 'mouse' && event.button !== 0) return;
			const target = event.target;
			if (target instanceof Element && target.closest('a, button')) return;
			pointer = event.pointerId;
			x0 = event.clientX;
			y0 = event.clientY;
		}

		function up(event: PointerEvent) {
			if (event.pointerId !== pointer) return;
			pointer = -1;
			const dx = event.clientX - x0;
			const dy = event.clientY - y0;
			if (Math.abs(dx) < 64 || Math.abs(dx) < Math.abs(dy) * 1.5) return;
			go(dx < 0 ? index + 1 : index - 1);
		}

		function cancel(event: PointerEvent) {
			if (event.pointerId === pointer) pointer = -1;
		}

		node.addEventListener('pointerdown', down);
		node.addEventListener('pointerup', up);
		node.addEventListener('pointercancel', cancel);
		return () => {
			node.removeEventListener('pointerdown', down);
			node.removeEventListener('pointerup', up);
			node.removeEventListener('pointercancel', cancel);
		};
	};

	const resetScroll =
		(panelIndex: number): Attachment<HTMLElement> =>
		(node) => {
			void panelIndex;
			node.scrollTop = 0;
		};
</script>

<svelte:window onkeydown={onKey} onpopstate={onPopState} />

<main class="walk" aria-label="Walkthrough of the main ideas">
	<div class="stage" {@attach swipe} {@attach resetScroll(index)}>
		{#key panel.id}
			<article class="panel" aria-labelledby="walk-title">
				{#if panel.mark}
					<WalkthroughMark kind={panel.mark} />
				{/if}
				<p class="kicker">{panel.kicker}</p>
				<h1 id="walk-title">{panel.title}</h1>
				<div class="prose">
					{#each panel.paragraphs as paragraph, i (i)}
						<p>{paragraph}</p>
					{/each}
					{#if panel.lenses}
						<ul class="lenses">
							{#each panel.lenses as lens (lens.term)}
								<li>
									<strong>{lens.term}</strong>
									<span>{lens.text}</span>
								</li>
							{/each}
						</ul>
					{/if}
					{#if panel.closer}
						<p>{panel.closer}</p>
					{/if}
					{#if panel.actions}
						<div class="actions">
							{#each panel.actions as action (action.label)}
								{#if action.kind === 'primary'}
									<a class="gate primary" href={resolve(action.href)}>
										<span class="label">{action.label}</span>
										<span class="blurb">{action.blurb}</span>
									</a>
								{:else}
									<div class="gate soon">
										<span class="label">{action.label}</span>
										<span class="blurb">
											<span class="badge">{action.blurb}</span>
										</span>
									</div>
								{/if}
							{/each}
						</div>
					{/if}
				</div>
			</article>
		{/key}
	</div>

	<div class="controls grain-surface">
		<p class="count" aria-live="polite">{index + 1} / {PANELS.length}</p>
		<div class="nav">
			<button
				type="button"
				class="dir"
				onclick={() => go(index - 1)}
				disabled={atFirst}
				aria-label="Previous panel"
			>
				‹
			</button>
			<ol class="dots" aria-hidden="true">
				{#each PANELS as item, i (item.id)}
					<li class={{ current: i === index }}></li>
				{/each}
			</ol>
			<button
				type="button"
				class="dir"
				onclick={() => go(index + 1)}
				disabled={atLast}
				aria-label="Next panel"
			>
				›
			</button>
		</div>
	</div>
</main>

<style>
	.walk {
		display: flex;
		flex-direction: column;
		flex: 1 1 auto;
		width: min(var(--content), 100%);
		min-height: 0;
		margin: 0 auto;
		padding: 0.55rem 0 0.2rem;
	}

	.stage {
		flex: 1 1 auto;
		display: flex;
		flex-direction: column;
		min-height: 0;
		overflow-y: auto;
		overscroll-behavior: contain;
		touch-action: pan-y;
		scrollbar-width: thin;
		scrollbar-color: var(--border) transparent;
	}

	.stage::-webkit-scrollbar {
		width: 0.4rem;
	}

	.stage::-webkit-scrollbar-thumb {
		background: var(--border);
		border-radius: 0.25rem;
	}

	.panel {
		width: 100%;
		flex: 0 0 auto;
		margin-block: auto;
		padding-bottom: 0.85rem;
		animation: enter-fade 180ms ease;
	}

	.kicker {
		margin: 0 0 0.3rem;
		color: var(--text-muted);
		font-family: var(--font-ui);
		font-size: 0.8rem;
		letter-spacing: 0.04em;
		text-transform: uppercase;
	}

	h1 {
		margin: 0 0 0.7rem;
		font-size: 1.7rem;
		line-height: 1.25;
		font-weight: 650;
	}

	.prose {
		line-height: 1.55;
	}

	.prose p {
		margin: 0.55rem 0;
	}

	.lenses {
		margin: 0.7rem 0;
		padding: 0;
		list-style: none;
	}

	.lenses li {
		display: flex;
		flex-wrap: wrap;
		gap: 0.35rem 0.55rem;
		margin: 0.28rem 0;
		line-height: 1.4;
	}

	.lenses strong {
		font-weight: 650;
		color: var(--token);
	}

	.actions {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 0.75rem;
		margin-top: 1.15rem;
		font-family: var(--font-ui);
	}

	.gate {
		display: flex;
		flex-direction: column;
		justify-content: center;
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

	.gate.primary:hover {
		border-color: var(--accent);
		color: var(--accent);
	}

	.gate.soon {
		opacity: 0.72;
	}

	.label {
		font-weight: 650;
	}

	.blurb {
		color: var(--text-muted);
		font-size: 0.9rem;
		line-height: 1.4;
	}

	.gate.primary:hover .blurb {
		color: var(--accent);
	}

	.badge {
		display: inline-block;
		margin-right: 0.35rem;
		color: var(--token);
		font-size: 0.72rem;
		font-weight: 650;
		letter-spacing: 0.04em;
		text-transform: uppercase;
	}

	.controls {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.3rem;
		flex: 0 0 auto;
		padding: 0.75rem 0 0.35rem;
		background-color: var(--bg);
		font-family: var(--font-ui);
	}

	.nav {
		display: flex;
		align-items: center;
		gap: 0.75rem;
	}

	.dir {
		width: 2.75rem;
		height: 2.75rem;
		padding: 0;
		border: 1px solid var(--border);
		border-radius: 0.75rem;
		background: var(--bg-raised);
		color: var(--text);
		font-size: 1.45rem;
		line-height: 1;
		cursor: pointer;
		transition:
			border-color 180ms ease,
			color 180ms ease;
	}

	.dir:focus {
		outline: none;
	}

	.dir:hover:not(:disabled),
	.dir:focus-visible:not(:disabled) {
		border-color: var(--accent);
		color: var(--accent);
	}

	.dir:focus-visible:not(:disabled) {
		outline: 2px solid var(--accent);
		outline-offset: 2px;
	}

	.dir:disabled {
		opacity: 0.35;
		cursor: default;
	}

	.count {
		margin: 0;
		color: var(--text-muted);
		font-size: 0.8rem;
		letter-spacing: 0.04em;
	}

	.dots {
		display: flex;
		justify-content: center;
		flex-wrap: nowrap;
		gap: 0.35rem;
		margin: 0;
		padding: 0;
		list-style: none;
	}

	.dots li {
		width: 0.4rem;
		height: 0.4rem;
		border-radius: 50%;
		background: var(--border);
	}

	.dots li.current {
		background: var(--token);
	}

	@media (max-width: 36rem) {
		.walk {
			padding: 0.55rem 0 0;
		}

		.panel {
			margin-top: auto;
			margin-bottom: 0;
			padding-bottom: 0.15rem;
		}

		.prose p:last-child {
			margin-bottom: 0.2rem;
		}

		.controls {
			gap: 0.06rem;
			padding: 0.16rem 0 max(0.4rem, env(safe-area-inset-bottom, 0px));
		}

		.actions {
			grid-template-columns: 1fr;
		}

		h1 {
			font-size: 1.5rem;
		}

		.dots {
			flex: 0 0 auto;
			flex-wrap: wrap;
			width: calc(9 * 0.4rem + 8 * 0.35rem);
			max-width: calc(9 * 0.4rem + 8 * 0.35rem);
			min-width: 0;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.panel {
			animation: none;
		}
	}
</style>
