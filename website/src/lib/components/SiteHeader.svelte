<script lang="ts">
	import { asset, resolve } from '$app/paths';
	import { page } from '$app/state';
	import { sectionIsActive, sections } from '$lib/nav';

	const onHome = $derived(page.url.pathname === '/');
</script>

<header class="site-header">
	<div class="inner">
		<a class="mark" href={resolve('/')} aria-current={onHome ? 'page' : undefined}>
			<img src={asset('/icon-transparent.png')} alt="" width="32" height="32" />
			Lokapal
		</a>
		<nav aria-label="Site">
			{#each sections as section (section.href)}
				<a
					href={resolve(section.href)}
					aria-current={sectionIsActive(page.url.pathname, section.href) ? 'page' : undefined}
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
		background: var(--bg);
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
</style>
