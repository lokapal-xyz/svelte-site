<script lang="ts">
	import { asset } from '$app/paths';
	import type { Attachment } from 'svelte/attachments';
	import { modelEntries } from '$lib/models/entries';

	const playShowcase: Attachment<HTMLVideoElement> = (node) => {
		const media = window.matchMedia('(prefers-reduced-motion: reduce)');
		if (media.matches) return;
		node.play().catch(() => {});
	};

	/** `https://github.com/owner/repo` → `owner/repo`. */
	function repoSlug(url: string) {
		return url.replace(/^https?:\/\/github\.com\//, '').replace(/\/$/, '');
	}
</script>

<main class="section">
	<h1>Computational Systemics</h1>
	<p class="lede">
		Computational Systemics is a series of generative agent-based models that operationalize
		concepts from the Conciliatorics framework.
	</p>

	<div class="body">
		<p>
			An agent-based model (ABM) is a computational simulation approach used to study the behavior 
			and interactions of autonomous entities—known as "agents"—and observe how these micro-level 
			actions create complex global patterns or macro-level phenomena. 
		</p>
		<p>
			Unlike traditional top-down models that look at a system as a whole using aggregate equations, 
			ABMs use a bottom-up approach. They simulate individual participants (such as people, cars, 
			animals, or companies) following a set of specific rules to see how the system behaves 
			organically over time.
		</p>
		<p>
			The models are written in Mesa so they remain easy to inspect, modify, and extend. 
			Each major version is preserved and offered separately, so a simpler, more familiar 
			case stays available alongside later elaborations. All entries includes a short description, 
			a showcase recording, and a link to its GitHub repository. To interact with a model, 
			clone that repository and run it locally.
		</p>

		{#each modelEntries as entry (entry.id)}
			<article class="entry" id={entry.id}>
				<h2>{entry.title}</h2>
				{#if entry.id === 'schelling-v01'}
					<p>
						This first model recovers the classic Schelling segregation result while expressing the
						agents' decision rule through Operational Status.
					</p>
					<ul>
						<li>
							Fronterization holds the agent's current attribute (binary in this version: two
							types).
						</li>
						<li>
							Permeability is the minimum share of similar neighbors the agent requires. A higher
							value is stricter: the agent accepts less local difference.
						</li>
						<li>
							Receptivity detects when the proportion of similar neighbors falls below that share.
						</li>
						<li>Proceptivity moves the agent to a random empty cell when it is dissatisfied.</li>
					</ul>
					<p>
						With a moderate permeability, around 0.3 to 0.5, the familiar pattern appears: agents
						start relatively mixed and gradually form larger same-type clusters. The recording shows
						the grid, the rising segregation index, and the count of dissatisfied agents.
					</p>
					<p>
						The mapping stays close to the original Schelling micromotives so the Operational Status
						vocabulary can be checked against a well-known benchmark. Later versions will introduce
						multiple simultaneous criteria and dynamic changes to Fronterization.
					</p>
				{/if}

				<video
					{@attach playShowcase}
					controls
					loop
					muted
					playsinline
					preload="auto"
					poster={asset(entry.poster)}
					aria-label={entry.videoLabel}
				>
					<source src={asset(entry.video)} type="video/mp4" />
				</video>

				<a
					class="repo"
					href={entry.repoUrl}
					title="{entry.repoLabel} (opens in a new tab)"
					target="_blank"
					rel="noopener noreferrer"
				>
					<svg viewBox="0 0 24 24" aria-hidden="true">
						<path
							d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"
						/>
					</svg>
					<span class="repo-copy">
						<span class="repo-label">Repository</span>
						<span class="repo-slug">{repoSlug(entry.repoUrl)}</span>
					</span>
					<span class="sr">Opens in a new tab.</span>
				</a>

				<h3>How to run</h3>
				<p class="run">
					The script needs Python 3.12 or newer. It prints a local address. Open that address in a
					browser. Stop the dashboard with Ctrl+C.
				</p>
				<pre><code>{entry.commands}</code></pre>
			</article>
		{/each}
	</div>
</main>

<style>
	.entry {
		margin-top: 2.2rem;
		padding-top: 1.6rem;
		border-top: 1px solid var(--border);
	}

	h2 {
		margin: 0 0 0.75rem;
		font-size: 1.4rem;
		line-height: 1.25;
		font-weight: 650;
	}

	video {
		display: block;
		width: 100%;
		height: auto;
		margin: 1.15rem 0 1rem;
		border: 1px solid var(--border);
		border-radius: 0.75rem;
		background: #000;
	}

	.repo {
		position: relative;
		display: inline-flex;
		align-items: center;
		gap: 0.7rem;
		box-sizing: border-box;
		max-width: 100%;
		margin: 0.15rem 0 0;
		padding: 0.65rem 0.9rem;
		border: 1px solid var(--border);
		border-radius: 0.75rem;
		color: var(--text);
		font-family: var(--font-ui);
		text-decoration: none;
		transition:
			border-color 180ms ease,
			color 180ms ease;
	}

	.repo:hover {
		border-color: var(--accent);
		color: var(--accent);
	}

	.repo:focus {
		outline: none;
	}

	.repo:focus-visible {
		outline: 2px solid var(--accent);
		outline-offset: 2px;
	}

	.repo svg {
		flex: none;
		width: 1.35rem;
		height: 1.35rem;
		fill: currentColor;
	}

	.repo-copy {
		display: flex;
		flex-direction: column;
		gap: 0.12rem;
		min-width: 0;
	}

	.repo-label {
		font-weight: 650;
		line-height: 1.2;
	}

	.repo-slug {
		color: var(--text-muted);
		font-family: ui-monospace, 'Cascadia Code', monospace;
		font-size: 0.82rem;
		line-height: 1.35;
		overflow-wrap: anywhere;
		transition: color 180ms ease;
	}

	.repo:hover .repo-slug {
		color: var(--accent);
	}

	.sr {
		position: absolute;
		width: 1px;
		height: 1px;
		overflow: hidden;
		clip: rect(0 0 0 0);
	}

	h3 {
		margin: 1.35rem 0 0.35rem;
		color: var(--text-muted);
		font-family: var(--font-ui);
		font-size: 1.05rem;
		font-weight: 600;
		letter-spacing: 0.02em;
		line-height: 1.3;
	}

	.run {
		margin: 0.35rem 0 0.7rem;
		color: var(--text-muted);
	}

	pre {
		overflow: auto;
		margin: 0;
		padding: 0.85rem 1rem;
		border: 1px solid var(--border);
		background-color: var(--bg-inset);
		font-family: ui-monospace, 'Cascadia Code', monospace;
		font-size: 0.9em;
		line-height: 1.5;
	}

	code {
		font-family: inherit;
		font-size: inherit;
	}
</style>
