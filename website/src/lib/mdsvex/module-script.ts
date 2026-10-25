import type { PreprocessorGroup } from 'svelte/compiler';

/**
 * mdsvex 0.12 writes front matter as `<script context="module">`.
 * Svelte 5 warns on that attribute and wants `<script module>`.
 * https://github.com/pngwn/MDsveX/issues/649
 */
export function moduleScript(): PreprocessorGroup {
	return {
		name: 'module-script',
		markup({ content, filename }) {
			if (filename && !filename.endsWith('.md') && !filename.endsWith('.svx')) return;
			if (!content.includes('context="module"') && !content.includes("context='module'")) {
				return;
			}
			return {
				code: content.replace(
					/<script\b([^>]*?)\scontext=(["'])module\2([^>]*)>/g,
					'<script$1 module$3>'
				)
			};
		}
	};
}
