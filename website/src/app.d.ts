import type { Component } from 'svelte';

// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
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

export {};
