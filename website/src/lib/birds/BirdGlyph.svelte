<script lang="ts">
	import type { BirdKind, Pose } from './flock.svelte';

	let { kind, pose }: { kind: BirdKind; pose: Pose } = $props();
</script>

<svg class="glyph {kind}" viewBox="0 0 48 36" aria-hidden="true">
	{#snippet stance(x1: number, x2: number, y: number, drop: number)}
		{#if pose === 'walk-a'}
			<path class="stroke" d="M{x1} {y} {x1 - 4.2} {y + drop}M{x2} {y} {x2 + 4.2} {y + drop}" />
		{:else if pose === 'walk-b'}
			<path class="stroke" d="M{x1} {y} {x1 + 3.6} {y + drop}M{x2} {y} {x2 - 3.6} {y + drop}" />
		{:else}
			<path class="stroke" d="M{x1} {y}v{drop}M{x2} {y}v{drop}" />
		{/if}
	{/snippet}

	{#if kind === 'dove'}
		{@render stance(18, 24, 30.5, 4.2)}
		<path d="M9 21 1.5 16.5 8 26Z" />
		<ellipse cx="20" cy="22" rx="12.2" ry="8.4" />
		<circle cx="31.2" cy="14.8" r="7" />
		<path d="M37.2 14.2 44 16.2 37.2 18.4Z" />
		<circle class="eye" cx="33.6" cy="13.4" r="1.35" />
		{#if pose === 'wings-up'}
			<ellipse cx="17" cy="12" rx="8" ry="4.2" transform="rotate(-55 17 12)" />
		{:else if pose === 'wings-down'}
			<ellipse cx="16.5" cy="26" rx="8.2" ry="4" transform="rotate(38 16.5 26)" />
		{:else}
			<ellipse cx="17.5" cy="22.5" rx="7.2" ry="3.6" transform="rotate(-18 17.5 22.5)" />
		{/if}
	{:else if kind === 'sparrow'}
		{@render stance(17, 22, 31, 3.6)}
		<path d="M10 20 2 8.5 12 19Z" />
		<ellipse cx="20" cy="23.2" rx="9.2" ry="6.4" />
		<circle cx="28.8" cy="17.2" r="5.4" />
		<path d="M33.6 16.6 39.4 18.2 33.6 19.6Z" />
		<circle class="eye" cx="30.6" cy="16" r="1.2" />
		{#if pose === 'wings-up'}
			<ellipse cx="17.5" cy="14.5" rx="6.5" ry="3.3" transform="rotate(-52 17.5 14.5)" />
		{:else if pose === 'wings-down'}
			<ellipse cx="16.8" cy="26.5" rx="6.6" ry="3.1" transform="rotate(42 16.8 26.5)" />
		{:else}
			<ellipse cx="17.8" cy="23.2" rx="5.6" ry="2.8" transform="rotate(-16 17.8 23.2)" />
		{/if}
	{:else if kind === 'jay'}
		{@render stance(18.5, 24.5, 30.8, 4)}
		<path d="M8.5 21 1 17.5 8 26.5Z" />
		<ellipse cx="20.5" cy="22.2" rx="11.4" ry="7.8" />
		<circle cx="31.4" cy="14.6" r="6.6" />
		<path class="crest" d="M29.2 9.2 33.6 1.6 36.4 10.4Z" />
		<path d="M37.2 14.2 43.6 16.4 37.2 18.2Z" />
		<ellipse class="belly" cx="21.5" cy="24" rx="6.2" ry="4.2" />
		<circle class="eye" cx="33.6" cy="13.4" r="1.3" />
		{#if pose === 'wings-up'}
			<ellipse cx="16.8" cy="11.2" rx="8.4" ry="4.4" transform="rotate(-58 16.8 11.2)" />
		{:else if pose === 'wings-down'}
			<ellipse cx="16.2" cy="26.4" rx="8.4" ry="4.1" transform="rotate(40 16.2 26.4)" />
		{:else}
			<ellipse cx="17.2" cy="22.4" rx="7" ry="3.4" transform="rotate(-22 17.2 22.4)" />
		{/if}
	{:else}
		{@render stance(18, 24, 30.6, 4.2)}
		<path d="M8 20.5 1.2 18.2 8.4 26Z" />
		<ellipse cx="19.5" cy="21.6" rx="12.4" ry="8" />
		<circle cx="30.2" cy="16.6" r="6.4" />
		<path d="M35.6 15.4 47 18.2 35.6 21.2Z" />
		<circle class="eye crow-eye" cx="32.4" cy="15.2" r="1.25" />
		{#if pose === 'wings-up'}
			<ellipse cx="16.4" cy="12.2" rx="8.2" ry="4.2" transform="rotate(-50 16.4 12.2)" />
		{:else if pose === 'wings-down'}
			<ellipse cx="15.8" cy="26.2" rx="8.4" ry="4" transform="rotate(36 15.8 26.2)" />
		{:else}
			<ellipse cx="16.8" cy="22" rx="7.4" ry="3.6" transform="rotate(-14 16.8 22)" />
		{/if}
	{/if}
</svg>

<style>
	.glyph {
		display: block;
		width: 2.6rem;
		height: 1.95rem;
		overflow: visible;
	}

	.glyph :where(ellipse, circle, path) {
		stroke-width: 1.15;
		stroke-linejoin: round;
		stroke-linecap: round;
	}

	.stroke {
		fill: none;
	}

	.eye {
		stroke: none;
		fill: #171719;
	}

	.dove {
		fill: #efebe3;
		stroke: #c9c3b6;
	}

	.sparrow {
		fill: #a06b3c;
		stroke: #c4a574;
	}

	.jay {
		fill: #6b9ad0;
		stroke: #9bbce0;
	}

	.crest {
		fill: #4f7fb8;
	}

	.belly {
		fill: #e8eef6;
		stroke: none;
	}

	.crow {
		fill: #3a3a42;
		stroke: #b0b0b8;
	}

	.crow-eye {
		fill: #c4a574;
	}
</style>
