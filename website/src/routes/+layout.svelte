<script lang="ts">
	import '../app.css';
	import { afterNavigate } from '$app/navigation';
	import { asset } from '$app/paths';
	import { page } from '$app/state';
	import { FlockController, setFlock } from '$lib/birds/flock.svelte';
	import BirdFlock from '$lib/components/BirdFlock.svelte';
	import Seo from '$lib/components/Seo.svelte';
	import SiteHeader from '$lib/components/SiteHeader.svelte';
	import TermPanel from '$lib/components/TermPanel.svelte';
	import { resolveSeo } from '$lib/seo';
	import { TermPanelState, setTermPanel } from '$lib/term-panel.svelte';
	import type { LayoutProps } from './$types';

	let { data, children }: LayoutProps = $props();
	const seo = $derived(resolveSeo(page.status, page.url.pathname, page.data.seo, data.preview));

	const panel = new TermPanelState();
	setTermPanel(panel);
	setFlock(new FlockController());

	afterNavigate((navigation) => {
		panel.close();
		if (navigation.type === 'enter') {
			window.scrollTo(0, 0);
		}
	});

	function keepPanel(target: EventTarget | null) {
		return target instanceof Element && target.closest('.term-panel-keep');
	}

	function onWindowClick(event: MouseEvent) {
		const target = event.target;
		if (!(target instanceof Element)) return;
		if (keepPanel(target)) return;

		const token = target.closest('[data-glossary-id]');
		if (token instanceof HTMLElement && token.dataset.glossaryId) {
			panel.open(token.dataset.glossaryId, event.clientX, event.clientY);
			return;
		}

		const node = target.closest('[data-id]');
		const id = node?.getAttribute('data-id');
		if (id) {
			panel.open(id, event.clientX, event.clientY);
			return;
		}

		panel.close();
	}

	function onWindowKey(event: KeyboardEvent) {
		if (
			(event.key === 'Enter' || event.key === ' ') &&
			event.target instanceof HTMLElement &&
			event.target.classList.contains('glossary-token') &&
			event.target.dataset.glossaryId
		) {
			event.preventDefault();
			const rect = event.target.getBoundingClientRect();
			panel.open(event.target.dataset.glossaryId, rect.left + rect.width / 2, rect.top);
			return;
		}

		if (!panel.openId) return;
		if (keepPanel(event.target)) return;
		panel.close();
	}

	function onWindowWheel(event: WheelEvent) {
		if (!panel.openId) return;
		if (event.target instanceof Element && event.target.closest('.term-panel')) return;
		panel.close();
	}

	function onWindowScroll() {
		if (panel.openId) panel.close();
	}

	function scrollToTop() {
		window.scrollTo(0, 0);
	}
</script>

<Seo {seo} />

<svelte:head>
	<link rel="icon" href={asset('/favicon.ico')} />
	<meta name="color-scheme" content="dark" />
</svelte:head>

<svelte:window
	onclick={onWindowClick}
	onkeydown={onWindowKey}
	onwheel={onWindowWheel}
	onscroll={onWindowScroll}
	onload={scrollToTop}
/>

<SiteHeader />
<div class="page">
	{#key page.url.pathname}
		<div class="page-body">
			{@render children()}
		</div>
	{/key}
</div>

<BirdFlock />
<TermPanel glossary={data.glossary} dexIds={data.dexIds} />
