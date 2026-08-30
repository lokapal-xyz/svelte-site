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

export type DexEntry = {
	id: string;
	symbol?: string;
	equation?: string;
	operator?: string;
	depends_on?: string[];
	roots?: string[];
	notes?: string;
};

export type ChapterMeta = {
	slug: string;
	title: string;
	partDir: string;
	partTitle: string;
};
