import {
	loadDialogueConversations,
	loadDialogueFields,
	loadDialogueJoints
} from '$lib/server/dialogue';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = () => ({
	fields: loadDialogueFields(),
	joints: loadDialogueJoints(),
	conversations: loadDialogueConversations()
});
