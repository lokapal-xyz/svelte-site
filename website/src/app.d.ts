import type { Component } from 'svelte';

// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	/** Inlined by Vite from the bytes of `static/conciliatorics.pdf`. */
	const __PDF_VERSION__: string;

	namespace App {
		// interface Error {}
		// interface Locals {}
		interface PageData {
			seo?: import('$lib/seo').Seo;
			preview?: boolean;
		}
		interface PageState {
			entry?: number;
		}
		// interface Platform {}
	}
}

declare module '*.md' {
	const component: Component;
	export default component;
}

declare module '*.yaml?raw' {
	const src: string;
	export default src;
}

export {};
