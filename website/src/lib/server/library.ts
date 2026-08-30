import { readFileSync } from 'node:fs';
import { parse } from 'yaml';
import type { DexEntry, GlossaryTerm } from '$lib/library/types';
import { EIC_DEX_PATH, GLOSSARY_PATH } from './paths';

type RawGlossary = {
	terms?: Record<string, unknown>[];
};

type RawDex = {
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

function normalizeDexEntry(raw: Record<string, unknown>): DexEntry | null {
	const id = str(raw.id);
	if (!id) return null;
	return {
		id,
		symbol: str(raw.symbol),
		equation: str(raw.equation),
		operator: str(raw.operator),
		depends_on: strList(raw.depends_on),
		roots: strList(raw.roots),
		notes: str(raw.notes)
	};
}

let glossaryCache: GlossaryTerm[] | undefined;
let glossaryByIdCache: Record<string, GlossaryTerm> | undefined;
let dexCache: DexEntry[] | undefined;
let dexByIdCache: Record<string, DexEntry> | undefined;

export function loadGlossary(): GlossaryTerm[] {
	if (glossaryCache) return glossaryCache;
	const raw = parse(readFileSync(GLOSSARY_PATH, 'utf8')) as RawGlossary;
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

export function loadDexEntries(): DexEntry[] {
	if (dexCache) return dexCache;
	const raw = parse(readFileSync(EIC_DEX_PATH, 'utf8')) as RawDex;
	const entries: DexEntry[] = [];
	const seen = new Set<string>();
	for (const row of [...(raw.operators ?? []), ...(raw.entries ?? [])]) {
		const entry = normalizeDexEntry(row);
		if (!entry || seen.has(entry.id)) continue;
		seen.add(entry.id);
		entries.push(entry);
	}
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
