<script lang="ts">
	import { asset, resolve } from '$app/paths';
</script>

<svelte:head>
	<title>About — Lokapal</title>
</svelte:head>

<main class="section">
	<div class="byline">
		<img class="avatar" src={asset('/lokapal-main.png')} alt="" width="80" height="80" />
		<div>
			<p class="name">Lokapal</p>
			<p class="aka">Ricardo Pintos</p>
		</div>
	</div>

	<h1>About</h1>
	<p class="lede">
		This site is the public home of Conciliatorics, the philosophical framework I am developing.
		Besides this page, it has five sections:
	</p>

	<div class="body">
		<ul>
			<li>
				<a href={resolve('/start')}>Start here</a>
				— a short walkthrough of the load-bearing ideas, for a first reading that does not begin at chapter
				one.
			</li>
			<li>
				<a href={resolve('/treatise')}>Treatise</a>
				— the full text, with clickable terms and inlined diagrams.
			</li>
			<li>
				<a href={resolve('/dex')}>EIC-Dex</a>
				— the Core EIC equation graph, searchable by name or symbol.
			</li>
			<li>
				<a href={resolve('/dialogue')}>In dialogue</a>
				— contact with academic literature: a buffet of conversations, especially political science, without
				dissolving into it.
			</li>
			<li>
				<a href={resolve('/cases')}>Cases</a>
				— applications scoped to government systems, once the case writing begins.
			</li>
		</ul>

		<h2>Contact</h2>
		<ul class="links">
			<li><a href="mailto:lokapal@proton.me">lokapal@proton.me</a></li>
			<li><a href="https://x.com/lokapalxyz">x.com/lokapalxyz</a></li>
			<li>Discord: lokapal.xyz</li>
			<li><a href="https://github.com/lokapal-xyz">github.com/lokapal-xyz</a></li>
			<li><a href="https://lokapal.xyz/">lokapal.xyz</a></li>
		</ul>
	</div>
</main>

<style>
	.byline {
		display: flex;
		align-items: center;
		gap: 0.85rem;
		margin: 0 0 1.5rem;
		font-family: var(--font-ui);
	}

	.avatar {
		display: block;
		width: 2.6rem;
		height: 2.6rem;
		border-radius: 50%;
		object-fit: cover;
		border: 1px solid var(--border);
	}

	.name {
		margin: 0;
		font-weight: 650;
		line-height: 1.2;
	}

	.aka {
		margin: 0.15rem 0 0;
		color: var(--text-muted);
		font-size: 0.9rem;
		line-height: 1.2;
	}

	h2 {
		margin: 2rem 0 0.6rem;
		font-size: 1.15rem;
	}

	.links {
		padding-left: 0;
		list-style: none;
	}

	.links li {
		margin: 0.25rem 0;
	}
</style>
