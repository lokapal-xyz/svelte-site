import type { DexEntry, DexFamily, GlossaryTerm } from './types';

export type DexLabel = {
	id: string;
	name: string;
	symbol: string;
};

export function labelOf(
	id: string,
	glossary: Record<string, GlossaryTerm>,
	dex: Record<string, DexEntry>
): DexLabel {
	const term = glossary[id];
	const entry = dex[id];
	const symbol = entry?.symbol ?? term?.symbol;
	return {
		id,
		name: term?.term ?? id,
		symbol: symbol && symbol.length > 0 ? symbol : ''
	};
}

export function sameIds(a?: string[], b?: string[]): boolean {
	if (!a?.length && !b?.length) return true;
	if (!a || !b || a.length !== b.length) return false;
	const other = new Set(b);
	return a.every((id) => other.has(id));
}

export function showComposition(entry: DexEntry): boolean {
	return (entry.depends_on?.length ?? 0) > 0;
}

export function showRoots(entry: DexEntry): boolean {
	if (entry.kind !== 'derived' || !entry.roots?.length) return false;
	return !sameIds(entry.roots, entry.depends_on);
}

export function formedBy(dex: Record<string, DexEntry>, operatorId: string): string[] {
	return Object.values(dex)
		.filter((entry) => entry.operator === operatorId)
		.map((entry) => entry.id);
}

export function familyMembers(dex: Record<string, DexEntry>, familyId: string): string[] {
	return Object.values(dex)
		.filter((entry) => entry.family === familyId)
		.map((entry) => entry.id);
}

export function kindLine(entry: DexEntry, operatorName?: string): string {
	if (entry.kind === 'operator') return 'Attribute operator';
	if (entry.kind === 'root') return 'Terminal primitive';
	if (operatorName) return `Formed by ${operatorName}`;
	return 'Derived concept';
}

export type FamilyGroup = DexFamily & { ids: string[] };

export function groupByFamily(
	families: DexFamily[],
	dex: Record<string, DexEntry>,
	ids: string[]
): FamilyGroup[] {
	const allowed = new Set(ids);
	const groups: FamilyGroup[] = [];
	for (const family of families) {
		const familyIds = Object.values(dex)
			.filter((entry) => entry.family === family.id && allowed.has(entry.id))
			.map((entry) => entry.id);
		if (familyIds.length > 0) groups.push({ ...family, ids: familyIds });
	}
	return groups;
}

export type KickerBlock = { kicker: string; families: FamilyGroup[] };

export function groupByKicker(groups: FamilyGroup[]): KickerBlock[] {
	const blocks: KickerBlock[] = [];
	for (const group of groups) {
		const last = blocks.at(-1);
		if (last && last.kicker === group.kicker) last.families.push(group);
		else blocks.push({ kicker: group.kicker, families: [group] });
	}
	return blocks;
}

export function kickerSlug(kicker: string): string {
	return kicker
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-|-$/g, '');
}
