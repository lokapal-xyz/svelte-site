<script lang="ts">
	import { resolve } from '$app/paths';
</script>

<svelte:head>
	<title>Start here — Lokapal</title>
</svelte:head>

<main class="section">
	<h1>Start here</h1>
	<p class="lede">
		The treatise is long, and it uses its own vocabulary. This page will become a short walkthrough
		of five ideas, shown one panel at a time, so a first reading does not have to begin at chapter
		one.
	</p>

	<div class="body">
		<p>The sequence, when it is built:</p>
		<ol>
			<li>
				Why most frameworks calcify into ideology, and how Conciliatorics is built to resist that.
			</li>
			<li>
				Four lenses for looking at a system — Discernment, Observation, Resolution, and Operation.
			</li>
			<li>
				The Incompatibility Axiom: functionality and perdurability cannot coexist in a mixed system.
			</li>
			<li>
				The Conciliation Pathway: persistence through iterated imperdurable functionality, not
				through resisting change.
			</li>
			<li>
				Status Reciprocity — a way to recognize the same pattern in centralization and
				decentralization.
			</li>
		</ol>
		<p>
			Until that walkthrough exists, the live paths are the
			<a href={resolve('/treatise')}>treatise</a>
			and the
			<a href={resolve('/dex')}>EIC-Dex</a>.
		</p>
	</div>
</main>
