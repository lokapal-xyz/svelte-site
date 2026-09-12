import { error } from '@sveltejs/kit';
import { clampDescription } from '$lib/seo';
import {
	getDialogueConversation,
	loadDialogueConversations,
	loadDialogueFields
} from '$lib/server/dialogue';
import type { EntryGenerator, PageServerLoad } from './$types';

export const entries: EntryGenerator = () =>
	loadDialogueConversations().map((conversation) => ({ id: conversation.id }));

export const load: PageServerLoad = ({ params }) => {
	const conversation = getDialogueConversation(params.id);
	if (!conversation) error(404, 'Conversation not found');
	const field = loadDialogueFields().find((row) => row.id === conversation.field);
	const related = conversation.related
		.map((id) => getDialogueConversation(id))
		.filter((row) => row != null);
	return {
		conversation,
		field,
		related,
		seo: {
			title: `${conversation.title} — In dialogue`,
			description: clampDescription(conversation.lede),
			type: 'article' as const
		}
	};
};
