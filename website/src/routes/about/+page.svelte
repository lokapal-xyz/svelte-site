<script lang="ts">
	import { asset, resolve } from '$app/paths';
	import { SITE_EMAIL } from '$lib/site';
</script>

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
		This site is the public home of Conciliatorics, a perspective within Systemics.
	</p>

	<div class="body">
		<a class="gate" href={resolve('/start')}>
			<span class="label">Start here</span>
			<span class="blurb">A short walkthrough of the main ideas.</span>
		</a>

		<h2>Contact</h2>
		<nav class="socials" aria-label="Contact">
			<a href="mailto:{SITE_EMAIL}" title={SITE_EMAIL} aria-label="Email {SITE_EMAIL}">
				<svg viewBox="0 0 24 24" aria-hidden="true">
					<path
						d="M1.5 8.67v8.58a3 3 0 0 0 3 3h15a3 3 0 0 0 3-3V8.67l-8.928 5.493a3 3 0 0 1-3.144 0z"
					/>
					<path
						d="M22.5 6.908V6.75a3 3 0 0 0-3-3h-15a3 3 0 0 0-3 3v.158l9.714 5.978a1.5 1.5 0 0 0 1.572 0z"
					/>
				</svg>
			</a>
			<a href="https://x.com/lokapalxyz" rel="me" title="X @lokapalxyz" aria-label="X @lokapalxyz">
				<svg viewBox="0 0 24 24" aria-hidden="true">
					<path
						d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z"
					/>
				</svg>
			</a>
			<a
				href="https://t.me/lokapalxyz"
				rel="me"
				title="Telegram @lokapalxyz"
				aria-label="Telegram @lokapalxyz"
			>
				<svg viewBox="0 0 24 24" aria-hidden="true">
					<path
						d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"
					/>
				</svg>
			</a>
			<a
				href="https://github.com/lokapal-xyz"
				rel="me"
				title="GitHub lokapal-xyz"
				aria-label="GitHub lokapal-xyz"
			>
				<svg viewBox="0 0 24 24" aria-hidden="true">
					<path
						d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"
					/>
				</svg>
			</a>
		</nav>
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

	.gate {
		display: flex;
		flex-direction: column;
		justify-content: center;
		gap: 0.2rem;
		box-sizing: border-box;
		width: fit-content;
		min-width: 14rem;
		max-width: 100%;
		min-height: 4.5rem;
		margin-bottom: 0;
		padding: 0.85rem 1rem;
		border: 1px solid var(--border);
		border-radius: 0.75rem;
		color: var(--text);
		font-family: var(--font-ui);
		text-decoration: none;
		transition:
			border-color 180ms ease,
			color 180ms ease;
	}

	.gate:hover {
		border-color: var(--accent);
		color: var(--accent);
	}

	.label {
		font-weight: 650;
	}

	.blurb {
		color: var(--text-muted);
		font-size: 0.9rem;
		line-height: 1.4;
		transition: color 180ms ease;
	}

	.gate:hover .blurb {
		color: var(--accent);
	}

	h2 {
		margin: 2rem 0 0.6rem;
		font-size: 1.15rem;
	}

	.socials {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 0.15rem;
	}

	.socials a {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 2.5rem;
		height: 2.5rem;
		color: var(--text-muted);
		text-decoration: none;
		border-radius: 0.35rem;
		transition: color 180ms ease;
	}

	.socials a:hover {
		color: var(--accent);
	}

	.socials a:focus {
		outline: none;
	}

	.socials a:focus-visible {
		outline: 2px solid var(--accent);
		outline-offset: 2px;
	}

	.socials svg {
		display: block;
		width: 1.35rem;
		height: 1.35rem;
		fill: currentColor;
	}
</style>
