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
	description: string;
};

export type EdgeStatus = 'seedling' | 'budding' | 'bloom';

export type EdgeTrunk = {
	id: string;
	title: string;
	chapter: string;
};

export type EdgeLeaf = {
	id: string;
	title: string;
	status: EdgeStatus;
	trunk: string;
	lede: string;
	chapters: string[];
};
