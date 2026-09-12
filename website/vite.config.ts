import { resolve } from 'node:path';
import adapter from '@sveltejs/adapter-vercel';
import { sveltekit } from '@sveltejs/kit/vite';
import { mdsvex } from 'mdsvex';
import { defineConfig } from 'vite';
import { glossaryTokens } from './src/lib/mdsvex/glossary-tokens.ts';
import { inlineDiagrams } from './src/lib/mdsvex/inline-diagrams.ts';
import { wrapTables } from './src/lib/mdsvex/wrap-tables.ts';
import { SITE_ORIGIN } from './src/lib/site.ts';

const repoRoot = resolve(import.meta.dirname, '..');

export default defineConfig({
	server: {
		fs: {
			allow: [repoRoot]
		}
	},
	plugins: [
		sveltekit({
			compilerOptions: {
				// Force runes mode for the project, except for libraries. Can be removed in svelte 6.
				runes: ({ filename }) =>
					filename.split(/[/\\]/).includes('node_modules') ? undefined : true
			},
			adapter: adapter(),
			prerender: {
				origin: SITE_ORIGIN
			},
			preprocess: [
				mdsvex({
					extensions: ['.svx', '.md'],
					remarkPlugins: [glossaryTokens, inlineDiagrams, wrapTables]
				})
			],
			extensions: ['.svelte', '.svx', '.md']
		})
	]
});
