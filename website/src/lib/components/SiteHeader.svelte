<script lang="ts">
	import { afterNavigate } from '$app/navigation';
	import { asset, resolve } from '$app/paths';
	import { page } from '$app/state';
	import type { Attachment } from 'svelte/attachments';
	import { MediaQuery } from 'svelte/reactivity';
	import { sectionIsActive, sections } from '$lib/nav';

	const overlay = new MediaQuery('max-width: 36rem');

	const onHome = $derived(page.url.pathname === '/');
	let open = $state(false);
	let instant = $state(false);

	afterNavigate(() => {
		close('instant');
	});

	function toggle(event: MouseEvent) {
		event.stopPropagation();
		instant = false;
		open = !open;
	}

	function close(mode: 'slide' | 'instant' = 'slide') {
		instant = mode === 'instant';
		open = false;
	}

	function onWindowKey(event: KeyboardEvent) {
		if (event.key === 'Escape' && open) close();
	}

	const measure: Attachment<HTMLElement> = (node) => {
		const set = () => {
			const height = `${node.offsetHeight}px`;
			node.style.setProperty('--header-h', height);
			document.documentElement.style.setProperty('--header-h', height);
		};
		set();
		const observer = new ResizeObserver(set);
		observer.observe(node);
		return () => {
			observer.disconnect();
			document.documentElement.style.removeProperty('--header-h');
		};
	};
</script>

<svelte:window onkeydown={onWindowKey} />

<header class="site-header grain-surface" {@attach measure}>
	<div class="inner">
		<a
			class="mark"
			href={resolve('/')}
			aria-current={onHome ? 'page' : undefined}
			onclick={() => {
				if (onHome) close();
			}}
		>
			<img src={asset('/icon-transparent.png')} alt="" width="32" height="32" />
			Lokapal
		</a>
		<button
			type="button"
			class="menu-toggle"
			aria-expanded={open}
			aria-controls="site-nav"
			aria-label={open ? 'Close menu' : 'Open menu'}
			onclick={toggle}
		>
			<svg viewBox="0 0 24 24" aria-hidden="true">
				{#if open}
					<path d="M5 5l14 14M19 5 5 19" />
				{:else}
					<path d="M3 6h18M3 12h18M3 18h18" />
				{/if}
			</svg>
		</button>
		{#if open}
			<button type="button" class="scrim" tabindex="-1" aria-hidden="true" onclick={() => close()}
			></button>
		{/if}
		<nav
			id="site-nav"
			class={{ open, instant, 'grain-surface': overlay.current }}
			aria-label="Site"
			inert={overlay.current && !open}
		>
			{#each sections as section (section.href)}
				<a
					href={resolve(section.href)}
					aria-current={sectionIsActive(page.url.pathname, section.href) ? 'page' : undefined}
					onclick={() => {
						if (sectionIsActive(page.url.pathname, section.href)) close();
					}}
				>
					{section.label}
				</a>
			{/each}
		</nav>
	</div>
</header>

<style>
	.site-header {
		position: sticky;
		top: 0;
		z-index: 10;
		background-color: var(--bg);
		border-bottom: 1px solid var(--border);
	}

	.inner {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: space-between;
		gap: 0.75rem 1.5rem;
		width: min(var(--page), calc(100% - 2rem));
		margin: 0 auto;
		padding: 0.85rem 0 0.8rem;
		font-family: var(--font-ui);
	}

	.mark {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		color: var(--text);
		font-size: 1.05rem;
		font-weight: 650;
		letter-spacing: 0.01em;
		text-decoration: none;
	}

	.mark img {
		display: block;
		width: 1.7rem;
		height: 1.7rem;
	}

	.menu-toggle {
		display: none;
		align-items: center;
		justify-content: center;
		width: 2rem;
		height: 2rem;
		padding: 0;
		border: 0;
		background: none;
		color: var(--text);
		line-height: 0;
		cursor: pointer;
	}

	.menu-toggle svg {
		display: block;
		width: 1.5rem;
		height: 1.5rem;
		stroke: currentColor;
		stroke-width: 2;
		stroke-linecap: round;
		fill: none;
	}

	.menu-toggle:focus {
		outline: none;
	}

	.menu-toggle:focus-visible {
		outline: 2px solid var(--accent);
		outline-offset: 2px;
	}

	.scrim {
		display: none;
	}

	nav {
		display: flex;
		flex-wrap: wrap;
		gap: 0.55rem 1rem;
	}

	nav a {
		color: var(--text-muted);
		text-decoration: none;
	}

	nav a:hover,
	nav a[aria-current='page'] {
		color: var(--text);
	}

	nav a[aria-current='page'] {
		text-decoration: underline;
		text-underline-offset: 0.28em;
	}

	@media (max-width: 36rem) {
		.inner {
			display: grid;
			grid-template-columns: 2.75rem 1fr 2.75rem;
			grid-template-rows: auto;
			grid-auto-flow: dense;
			align-items: center;
			flex-wrap: nowrap;
			gap: 0;
			padding: 0.45rem 0;
		}

		.menu-toggle {
			display: inline-flex;
			grid-column: 1;
			grid-row: 1;
			align-self: center;
			justify-self: start;
		}

		.mark {
			grid-column: 2;
			grid-row: 1;
			align-self: center;
			justify-self: center;
			line-height: 1;
		}

		.scrim {
			display: block;
			position: fixed;
			top: var(--header-h, 3.8rem);
			right: 0;
			bottom: 0;
			left: 0;
			z-index: 11;
			padding: 0;
			border: 0;
			background: transparent;
			cursor: default;
		}

		nav {
			display: flex;
			position: fixed;
			top: var(--header-h, 3.8rem);
			left: 0;
			right: 0;
			z-index: 12;
			flex-direction: column;
			flex-wrap: nowrap;
			gap: 0;
			padding: 0.35rem 0 0.7rem;
			background-color: var(--bg);
			border-bottom: 1px solid var(--border);
			visibility: hidden;
			pointer-events: none;
			opacity: 0;
			transform: translateY(-0.75rem);
			transition:
				opacity 220ms ease,
				transform 220ms ease,
				visibility 0s linear 220ms;
		}

		nav.open {
			visibility: visible;
			pointer-events: auto;
			opacity: 1;
			transform: none;
			transition:
				opacity 220ms ease,
				transform 220ms ease,
				visibility 0s linear 0s;
		}

		nav.instant {
			transition: none;
		}

		nav a {
			box-sizing: border-box;
			width: min(var(--page), calc(100% - 2rem));
			margin-inline: auto;
			padding: 0.7rem 0;
		}
	}

	@media (max-width: 36rem) and (prefers-reduced-motion: reduce) {
		nav {
			transition: none;
		}
	}
</style>
