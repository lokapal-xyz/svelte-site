<script lang="ts">
	import { page } from '$app/state';
	import { resolve } from '$app/paths';

	const onTreatise = $derived(page.url.pathname === '/' || /^\/\d/.test(page.url.pathname));
	const onDex = $derived(page.url.pathname === '/dex' || page.url.pathname.startsWith('/dex/'));
</script>

<header class="site-header">
	<div class="inner">
		<a class="mark" href={resolve('/')}>Conciliatorics</a>
		<nav aria-label="Site">
			<a href={resolve('/')} aria-current={onTreatise ? 'page' : undefined}>Treatise</a>
			<a href={resolve('/dex')} aria-current={onDex ? 'page' : undefined}>EIC-Dex</a>
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
		align-items: baseline;
		justify-content: space-between;
		gap: 0.75rem 1.5rem;
		width: min(var(--page), calc(100% - 2rem));
		margin: 0 auto;
		padding: 1.15rem 0 1rem;
		font-family: var(--font-ui);
	}

	.mark {
		color: var(--text);
		font-size: 1.05rem;
		font-weight: 650;
		letter-spacing: 0.01em;
		text-decoration: none;
	}

	nav {
		display: flex;
		gap: 1.1rem;
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
