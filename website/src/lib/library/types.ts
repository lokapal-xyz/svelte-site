export type GlossaryTerm = {
	id: string;
	term: string;
	symbol?: string | null;
	part?: string;
	jurisdiction?: string;
	pair?: string;
	equation?: string;
	definition: string;
	notes?: string;
	related?: string[];
	status?: string;
};

export type DexKind = 'operator' | 'root' | 'derived';

export type DexFamily = {
	id: string;
	title: string;
	kicker: string;
	chapter?: string;
	blurb?: string;
};

export type DexEntry = {
	id: string;
	family: string;
	kind: DexKind;
	symbol?: string;
	equation?: string;
	operator?: string;
	depends_on?: string[];
	roots?: string[];
	used_by: string[];
	notes?: string;
};

export type ChapterMeta = {
	slug: string;
	title: string;
	partDir: string;
	partTitle: string;
};

export type DialogueManner = 'light-touch' | 'positioning' | 'bulk' | 'contact';

export type DialogueField = {
	id: string;
	title: string;
	manner: DialogueManner;
	blurb: string;
};

export type DialogueJoint = {
	id: string;
	label: string;
	chapter: string;
};

export type DialogueInterlocutor = {
	name: string;
	sort_name: string;
};

export type DialogueConversation = {
	id: string;
	title: string;
	lede: string;
	field: string;
	interlocutors: DialogueInterlocutor[];
	joints: string[];
	chapters: string[];
	related: string[];
	sources: string[];
};
