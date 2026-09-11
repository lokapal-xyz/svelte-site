import type { Component } from 'svelte';

const modules = import.meta.glob<{ default: Component }>(
	'../../../../library/dialogue/conversations/*.md',
	{ eager: true }
);

export function getDialogueComponent(id: string) {
	const key = Object.keys(modules).find((path) => path.endsWith(`/${id}.md`));
	return key ? modules[key].default : undefined;
}
