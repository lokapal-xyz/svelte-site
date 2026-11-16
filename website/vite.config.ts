import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import adapter from '@sveltejs/adapter-vercel';
import { sveltekit } from '@sveltejs/kit/vite';
import { mdsvex } from 'mdsvex';
import { defineConfig } from 'vite';
import { glossaryTokens } from './src/lib/mdsvex/glossary-tokens.ts';
import { inlineDiagrams } from './src/lib/mdsvex/inline-diagrams.ts';
import { moduleScript } from './src/lib/mdsvex/module-script.ts';
import { wrapTables } from './src/lib/mdsvex/wrap-tables.ts';
import { SITE_ORIGIN } from './src/lib/site.ts';

const repoRoot = resolve(import.meta.dirname, '..');

// Brave on Android can reopen a PDF it already stored and ignore Cache-Control.
// The download links include this fingerprint, so a new file is a new address.
const pdfVersion = createHash('sha256')
	.update(readFileSync(resolve(import.meta.dirname, 'static/conciliatorics.pdf')))
	.digest('hex')
	.slice(0, 12);

export default defineConfig({
	define: {
		__PDF_VERSION__: JSON.stringify(pdfVersion)
	},
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
				}),
				moduleScript()
			],
			extensions: ['.svelte', '.svx', '.md']
		})
	]
});
