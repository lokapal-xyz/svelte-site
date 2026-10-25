import type { Component } from 'svelte';

const modules = import.meta.glob<{ default: Component }>(
	'../../../../library/edge-eic/leaves/*.md',
	{ eager: true }
);

export function getEdgeComponent(id: string) {
	const key = Object.keys(modules).find((path) => path.endsWith(`/${id}.md`));
	return key ? modules[key].default : undefined;
}
