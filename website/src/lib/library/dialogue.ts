import type {
	DialogueConversation,
	DialogueField,
	DialogueInterlocutor,
	DialogueJoint,
	DialogueManner
} from './types';

export const MANNER_LABEL: Record<DialogueManner, string> = {
	'light-touch': 'Light-touch',
	positioning: 'Positioning',
	bulk: 'Home literature',
	contact: 'Contact'
};

export type FieldBlock = DialogueField & { conversations: DialogueConversation[] };

export function conversationsForField(
	fieldId: string,
	conversations: DialogueConversation[]
): DialogueConversation[] {
	return conversations.filter((row) => row.field === fieldId);
}

export function groupByField(
	fields: DialogueField[],
	conversations: DialogueConversation[]
): FieldBlock[] {
	return fields.map((field) => ({
		...field,
		conversations: conversationsForField(field.id, conversations)
	}));
}

export type JointBlock = DialogueJoint & { conversations: DialogueConversation[] };

export function groupByJoint(
	joints: DialogueJoint[],
	conversations: DialogueConversation[]
): JointBlock[] {
	const blocks: JointBlock[] = [];
	for (const joint of joints) {
		const rows = conversations.filter((row) => row.joints.includes(joint.id));
		if (rows.length > 0) blocks.push({ ...joint, conversations: rows });
	}
	return blocks;
}

export type InterlocutorBlock = DialogueInterlocutor & { conversations: DialogueConversation[] };

export function groupByInterlocutor(conversations: DialogueConversation[]): InterlocutorBlock[] {
	const byKey = new Map<string, InterlocutorBlock>();
	for (const conversation of conversations) {
		for (const person of conversation.interlocutors) {
			const key = person.sort_name.toLowerCase();
			const existing = byKey.get(key);
			if (existing) {
				if (!existing.conversations.some((row) => row.id === conversation.id)) {
					existing.conversations.push(conversation);
				}
			} else {
				byKey.set(key, { ...person, conversations: [conversation] });
			}
		}
	}
	return [...byKey.values()].sort((a, b) =>
		a.sort_name.localeCompare(b.sort_name, 'en', { sensitivity: 'base' })
	);
}

export function interlocutorLine(conversation: DialogueConversation): string {
	const names = conversation.interlocutors.map((row) => row.name);
	if (names.length === 0) return '';
	if (names.length === 1) return names[0];
	if (names.length === 2) return `${names[0]} and ${names[1]}`;
	return `${names.slice(0, -1).join(', ')}, and ${names.at(-1)}`;
}

export function interlocutorSlug(sortName: string): string {
	return sortName
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-|-$/g, '');
}

export function conversationMatches(
	conversation: DialogueConversation,
	field: DialogueField | undefined,
	joints: DialogueJoint[],
	needle: string
): boolean {
	const q = needle.trim().toLowerCase();
	if (!q) return true;
	const jointLabels = conversation.joints
		.map((id) => joints.find((joint) => joint.id === id)?.label ?? id)
		.join(' ');
	const haystack = [
		conversation.id,
		conversation.title,
		conversation.lede,
		field?.title ?? '',
		jointLabels,
		...conversation.interlocutors.map((row) => `${row.name} ${row.sort_name}`)
	]
		.join(' ')
		.toLowerCase();
	return haystack.includes(q);
}
