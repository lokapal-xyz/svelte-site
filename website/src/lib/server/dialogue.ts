import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { parse } from 'yaml';
import type {
	DialogueConversation,
	DialogueField,
	DialogueInterlocutor,
	DialogueJoint,
	DialogueManner
} from '$lib/library/types';
import { listChapters } from './chapters';
import { DIALOGUE_CONVERSATIONS_DIR, DIALOGUE_PATH } from './paths';

type RawDialogue = {
	fields?: Record<string, unknown>[];
	joints?: Record<string, unknown>[];
	conversations?: Record<string, unknown>[];
};

const MANNERS = new Set<DialogueManner>(['light-touch', 'positioning', 'bulk', 'contact']);

function str(value: unknown): string | undefined {
	if (typeof value === 'string') {
		const trimmed = value.trim();
		return trimmed.length > 0 ? trimmed : undefined;
	}
	if (typeof value === 'number' || typeof value === 'boolean') return String(value);
	return undefined;
}

function strList(value: unknown): string[] {
	if (!Array.isArray(value)) return [];
	return value.map(str).filter((item): item is string => item != null);
}

function normalizeField(raw: Record<string, unknown>): DialogueField | null {
	const id = str(raw.id);
	const title = str(raw.title);
	const manner = str(raw.manner);
	const blurb = str(raw.blurb);
	if (!id || !title || !blurb) return null;
	if (!manner || !MANNERS.has(manner as DialogueManner)) {
		throw new Error(`Dialogue field "${id ?? '?'}" has unknown manner "${manner ?? ''}"`);
	}
	return { id, title, manner: manner as DialogueManner, blurb };
}

function normalizeJoint(raw: Record<string, unknown>): DialogueJoint | null {
	const id = str(raw.id);
	const label = str(raw.label);
	const chapter = str(raw.chapter);
	if (!id || !label || !chapter) return null;
	return { id, label, chapter };
}

function normalizeInterlocutor(raw: unknown): DialogueInterlocutor | null {
	if (typeof raw !== 'object' || raw == null) return null;
	const row = raw as Record<string, unknown>;
	const name = str(row.name);
	if (!name) return null;
	return { name, sort_name: str(row.sort_name) ?? name };
}

function normalizeConversation(
	raw: Record<string, unknown>,
	fieldIds: Set<string>,
	jointIds: Set<string>
): DialogueConversation | null {
	const id = str(raw.id);
	const title = str(raw.title);
	const lede = str(raw.lede);
	const field = str(raw.field);
	if (!id || !title || !lede || !field) return null;
	if (!fieldIds.has(field)) {
		throw new Error(`Dialogue conversation "${id}" has unknown field "${field}"`);
	}

	const interlocutors = (Array.isArray(raw.interlocutors) ? raw.interlocutors : [])
		.map(normalizeInterlocutor)
		.filter((row): row is DialogueInterlocutor => row != null);
	if (interlocutors.length === 0) {
		throw new Error(`Dialogue conversation "${id}" needs at least one interlocutor`);
	}

	const joints = strList(raw.joints);
	for (const joint of joints) {
		if (!jointIds.has(joint)) {
			throw new Error(`Dialogue conversation "${id}" has unknown joint "${joint}"`);
		}
	}

	return {
		id,
		title,
		lede,
		field,
		interlocutors,
		joints,
		chapters: strList(raw.chapters),
		related: strList(raw.related).filter((other) => other !== id),
		sources: strList(raw.sources)
	};
}

let fieldsCache: DialogueField[] | undefined;
let jointsCache: DialogueJoint[] | undefined;
let conversationsCache: DialogueConversation[] | undefined;

function loadRaw(): RawDialogue {
	return parse(readFileSync(DIALOGUE_PATH, 'utf8')) as RawDialogue;
}

export function loadDialogueFields(): DialogueField[] {
	if (fieldsCache) return fieldsCache;
	const fields: DialogueField[] = [];
	const seen = new Set<string>();
	for (const row of loadRaw().fields ?? []) {
		const field = normalizeField(row);
		if (!field || seen.has(field.id)) continue;
		seen.add(field.id);
		fields.push(field);
	}
	if (fields.length === 0) {
		throw new Error('dialogue.yaml is missing a fields catalog');
	}
	fieldsCache = fields;
	return fields;
}

export function loadDialogueJoints(): DialogueJoint[] {
	if (jointsCache) return jointsCache;
	const chapterSlugs = new Set(listChapters().map((chapter) => chapter.slug));
	const joints: DialogueJoint[] = [];
	const seen = new Set<string>();
	for (const row of loadRaw().joints ?? []) {
		const joint = normalizeJoint(row);
		if (!joint || seen.has(joint.id)) continue;
		if (!chapterSlugs.has(joint.chapter)) {
			throw new Error(`Dialogue joint "${joint.id}" points at missing chapter "${joint.chapter}"`);
		}
		seen.add(joint.id);
		joints.push(joint);
	}
	jointsCache = joints;
	return joints;
}

export function loadDialogueConversations(): DialogueConversation[] {
	if (conversationsCache) return conversationsCache;
	const fieldIds = new Set(loadDialogueFields().map((field) => field.id));
	const jointIds = new Set(loadDialogueJoints().map((joint) => joint.id));
	const chapterSlugs = new Set(listChapters().map((chapter) => chapter.slug));
	const conversations: DialogueConversation[] = [];
	const seen = new Set<string>();

	for (const row of loadRaw().conversations ?? []) {
		const conversation = normalizeConversation(row, fieldIds, jointIds);
		if (!conversation || seen.has(conversation.id)) continue;
		for (const slug of conversation.chapters) {
			if (!chapterSlugs.has(slug)) {
				throw new Error(
					`Dialogue conversation "${conversation.id}" points at missing chapter "${slug}"`
				);
			}
		}
		const body = join(DIALOGUE_CONVERSATIONS_DIR, `${conversation.id}.md`);
		if (!existsSync(body)) {
			throw new Error(`Dialogue conversation "${conversation.id}" is missing ${body}`);
		}
		seen.add(conversation.id);
		conversations.push(conversation);
	}

	for (const conversation of conversations) {
		for (const related of conversation.related) {
			if (!seen.has(related)) {
				throw new Error(
					`Dialogue conversation "${conversation.id}" relates to unknown "${related}"`
				);
			}
		}
	}

	if (existsSync(DIALOGUE_CONVERSATIONS_DIR)) {
		for (const file of readdirSync(DIALOGUE_CONVERSATIONS_DIR)) {
			if (!file.endsWith('.md')) continue;
			const id = file.slice(0, -3);
			if (!seen.has(id)) {
				throw new Error(`Dialogue markdown "${file}" has no conversation row in dialogue.yaml`);
			}
		}
	}

	conversationsCache = conversations;
	return conversations;
}

export function getDialogueConversation(id: string): DialogueConversation | undefined {
	return loadDialogueConversations().find((row) => row.id === id);
}
