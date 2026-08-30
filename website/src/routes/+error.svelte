<script lang="ts">
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
</script>

<svelte:head>
	<title>{page.status} — Conciliatorics</title>
</svelte:head>

<main class="error">
	<h1>{page.status}</h1>
	<p>{page.error?.message ?? 'Something went wrong.'}</p>
	<p><a href={resolve('/')}>Back to the treatise</a></p>
</main>

<style>
	.error {
		width: min(var(--content), 100%);
		margin: 3rem auto 0;
	}

	h1 {
		margin: 0 0 0.5rem;
		font-size: 2.15rem;
	}
</style>
