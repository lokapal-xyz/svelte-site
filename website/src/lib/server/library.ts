import { parse } from 'yaml';
import type { DexEntry, DexFamily, DexKind, GlossaryTerm } from '$lib/library/types';
import dexSource from '../../../../library/eic-dex/eic-dex.yaml?raw';
import glossarySource from '../../../../library/glossary/glossary.yaml?raw';

type RawGlossary = {
	terms?: Record<string, unknown>[];
};

type RawDex = {
	families?: Record<string, unknown>[];
	operators?: Record<string, unknown>[];
	entries?: Record<string, unknown>[];
};

function str(value: unknown): string | undefined {
	if (typeof value === 'string') {
		const trimmed = value.trim();
		return trimmed.length > 0 ? trimmed : undefined;
	}
	if (typeof value === 'number' || typeof value === 'boolean') return String(value);
	return undefined;
}

function strList(value: unknown): string[] | undefined {
	if (!Array.isArray(value)) return undefined;
	const items = value.map(str).filter((item): item is string => item != null);
	return items.length > 0 ? items : undefined;
}

function normalizeGlossaryTerm(raw: Record<string, unknown>): GlossaryTerm | null {
	const id = str(raw.id);
	if (!id) return null;
	return {
		id,
		term: str(raw.term) ?? id,
		symbol: raw.symbol == null ? undefined : str(raw.symbol),
		part: str(raw.part),
		jurisdiction: str(raw.jurisdiction),
		pair: str(raw.pair),
		equation: str(raw.equation),
		definition: str(raw.definition) ?? '',
		notes: str(raw.notes),
		related: strList(raw.related),
		status: str(raw.status)
	};
}

function dexKind(raw: Record<string, unknown>, fromOperators: boolean): DexKind {
	if (fromOperators) return 'operator';
	if (str(raw.equation) || str(raw.operator)) return 'derived';
	return 'root';
}

function normalizeFamily(raw: Record<string, unknown>): DexFamily | null {
	const id = str(raw.id);
	const title = str(raw.title);
	const kicker = str(raw.kicker);
	if (!id || !title || !kicker) return null;
	return {
		id,
		title,
		kicker,
		chapter: str(raw.chapter),
		blurb: str(raw.blurb)
	};
}

function normalizeDexEntry(
	raw: Record<string, unknown>,
	fromOperators: boolean,
	familyIds: Set<string>
): DexEntry | null {
	const id = str(raw.id);
	const family = str(raw.family);
	if (!id || !family) return null;
	if (!familyIds.has(family)) {
		throw new Error(`Dex entry "${id}" has unknown family "${family}"`);
	}
	return {
		id,
		family,
		kind: dexKind(raw, fromOperators),
		symbol: str(raw.symbol),
		equation: str(raw.equation),
		operator: str(raw.operator),
		depends_on: strList(raw.depends_on),
		roots: strList(raw.roots),
		used_by: [],
		notes: str(raw.notes)
	};
}

function attachUsedBy(entries: DexEntry[]): void {
	const usedBy = new Map<string, string[]>();
	for (const entry of entries) {
		for (const dep of entry.depends_on ?? []) {
			const list = usedBy.get(dep) ?? [];
			list.push(entry.id);
			usedBy.set(dep, list);
		}
	}
	for (const entry of entries) {
		entry.used_by = usedBy.get(entry.id) ?? [];
	}
}

let glossaryCache: GlossaryTerm[] | undefined;
let glossaryByIdCache: Record<string, GlossaryTerm> | undefined;
let familyCache: DexFamily[] | undefined;
let dexCache: DexEntry[] | undefined;
let dexByIdCache: Record<string, DexEntry> | undefined;

export function loadGlossary(): GlossaryTerm[] {
	if (glossaryCache) return glossaryCache;
	const raw = parse(glossarySource) as RawGlossary;
	const terms: GlossaryTerm[] = [];
	for (const row of raw.terms ?? []) {
		const term = normalizeGlossaryTerm(row);
		if (term) terms.push(term);
	}
	glossaryCache = terms;
	return terms;
}

export function loadGlossaryById(): Record<string, GlossaryTerm> {
	if (glossaryByIdCache) return glossaryByIdCache;
	const byId: Record<string, GlossaryTerm> = {};
	for (const term of loadGlossary()) byId[term.id] = term;
	glossaryByIdCache = byId;
	return byId;
}

function loadRawDex(): RawDex {
	return parse(dexSource) as RawDex;
}

export function loadDexFamilies(): DexFamily[] {
	if (familyCache) return familyCache;
	const families: DexFamily[] = [];
	const seen = new Set<string>();
	for (const row of loadRawDex().families ?? []) {
		const family = normalizeFamily(row);
		if (!family || seen.has(family.id)) continue;
		seen.add(family.id);
		families.push(family);
	}
	if (families.length === 0) {
		throw new Error('eic-dex.yaml is missing a families catalog');
	}
	familyCache = families;
	return families;
}

export function loadDexEntries(): DexEntry[] {
	if (dexCache) return dexCache;
	const raw = loadRawDex();
	const familyIds = new Set(loadDexFamilies().map((family) => family.id));
	const entries: DexEntry[] = [];
	const seen = new Set<string>();

	const push = (row: Record<string, unknown>, fromOperators: boolean) => {
		const entry = normalizeDexEntry(row, fromOperators, familyIds);
		if (!entry || seen.has(entry.id)) return;
		seen.add(entry.id);
		entries.push(entry);
	};

	for (const row of raw.operators ?? []) push(row, true);
	for (const row of raw.entries ?? []) push(row, false);

	attachUsedBy(entries);
	dexCache = entries;
	return entries;
}

export function loadDexById(): Record<string, DexEntry> {
	if (dexByIdCache) return dexByIdCache;
	const byId: Record<string, DexEntry> = {};
	for (const entry of loadDexEntries()) byId[entry.id] = entry;
	dexByIdCache = byId;
	return byId;
}
