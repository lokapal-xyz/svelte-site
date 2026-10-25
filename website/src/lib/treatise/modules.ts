import type { Component } from 'svelte';

const modules = import.meta.glob<{ default: Component }>('../../../../docs/**/*.md', {
	eager: true
});

export function getChapterComponent(slug: string) {
	const key = Object.keys(modules).find((path) => path.endsWith(`/${slug}.md`));
	return key ? modules[key].default : undefined;
}
