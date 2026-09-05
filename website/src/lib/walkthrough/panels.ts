// Keep aligned with misc/entry-point-content.md.

export type MarkKind =
	'intervention' | 'anatomy' | 'physiology' | 'synthesis' | 'jay' | 'sparrow' | 'dove' | 'crow';

export type Lens = {
	term: string;
	text: string;
};

export type PanelAction =
	| { kind: 'primary'; href: '/treatise'; label: string; blurb: string }
	| { kind: 'soon'; label: string; blurb: string };

export type Panel = {
	id: string;
	kicker: string;
	title: string;
	mark?: MarkKind;
	paragraphs: string[];
	lenses?: Lens[];
	closer?: string;
	actions?: PanelAction[];
};

export const PANELS: Panel[] = [
	{
		id: 'intro',
		kicker: 'Start here',
		title: 'A perspective inside Systemics',
		paragraphs: [
			'The analytical study of systems has many homes — mathematics, cybernetics, ecology, philosophy among them — and no settled agreement about whether they should be forced into one science. Conciliatorics does not try to settle that. It assumes a meta-discipline, Systemics, that can contain those perspectives without demanding they merge.',
			"Inside that container, Conciliatorics is a perspective that seeks to reconcile the inventive aspects of systemic intervention: the work of a member who tries to influence a system's behavior by first working on its medium.",
			'What follows is a map of the load-bearing joints of that perspective. It is not a summary of the treatise, and it is not a sequence of independent insights. Each idea is a signpost in one analytical synthesis. The treatise remains the argument.'
		]
	},
	{
		id: 'method-focus',
		kicker: 'Inventive intervention',
		title: 'Method and focus',
		mark: 'intervention',
		paragraphs: [
			'Whenever inventive intervention is performed, there is always a method and a focus. They are not optional extras, and they are not performed in isolation from the system, the member, and the medium — only emphasized.',
			'The method is either Contemplation or Transformation. Contemplation emphasizes the intervener: knowledge-building and judgement. Transformation emphasizes the system: concrete change and performance. The focus is either Intrinsicality or Interstitiality. Intrinsicality emphasizes the intervenable, and the properties inherent to it. Interstitiality emphasizes the systemic, and the properties that hold between things.',
			'A ceramic mug and a glass mug differ by an intrinsic property: the material. That a mug is "yours" is interstitial. It arises from the relation you develop with the object, and is not inherent to you or to the mug.'
		]
	},
	{
		id: 'four-parcels',
		kicker: 'Inventive intervention',
		title: 'Four parcels',
		mark: 'intervention',
		paragraphs: [
			'Method and focus cross. The resulting configurations are the Inventive Parcels: Intrinsic Contemplation, Interstitial Contemplation, Intrinsic Transformation, and Interstitial Transformation. They can be small actions or long endeavors, performed by one intervener or by many. They are never, in this model, four unrelated practices.',
			'When a parcel develops continuously and expansively, it becomes an Inventive Edification. As a convenience of orientation — not as a claim that the fields are the parcels — the four edifications may be associated with the sciences, technology, philosophy, and the arts. If the parcel names are still abstract, those associations are a way in.',
			'What matters for Conciliatorics is the order of priority. Edification is meant to remain subordinate to the systems it serves. The moment the framework is treated as more important than the members, the medium, and the system it was built to enhance, the relationship has already inverted.'
		]
	},
	{
		id: 'ossification',
		kicker: 'Inventive intervention',
		title: 'Ossification',
		mark: 'intervention',
		paragraphs: [
			'That inversion is Inventive Ossification: a once-dynamic edification that has begun to demand that the system pass through its filter. A healthy tension between intrinsicality and interstitiality becomes dogmatic separation. Open fields calcify into ideologies — scientism, technologism, philosophism, aestheticism — and the interveners most devoted to an ossified parcel start requiring loyalty.',
			'The conflict then runs on several fronts at once: inside a parcel, over which values should dominate; between parcels, each trying to subordinate the others; and between those who would preserve the ossification and those who would not.',
			'Philosophy is treated here as the parcel most at risk. It has historically given itself license to analyze whatever feels appropriate, and so has the weakest habit of stating where it stops. That is one reason the treatise develops the philosophical parcel first.'
		]
	},
	{
		id: 'conciliation',
		kicker: 'Inventive intervention',
		title: 'Conciliation',
		mark: 'intervention',
		paragraphs: [
			'Inventive Conciliation is the restoration of functional processes in that edification. It is not a victory condition, and it is not a new ideology to replace the old one. Ossification is a fracture in the relation among parcels; conciliation restores their reciprocal character, so that an outcome in one remains congruent with how the others engage the same system.',
			'One form of this work stands as a constitution rather than a checklist. The articles can be invoked separately: identify which parcel has ossified, watch for outcomes that invalidate the others, revise until no parcel is dismissed, keep a focus without losing the periphery. None of this is completed once. Edification can ossify again at any moment. Conciliation has to be practiced as a continuous task, under the permanent pressure of ambition, intrigue, and identitarian blindness.',
			'This is why Conciliatorics exists as a named perspective: to reconcile inventive intervention with the systems it claims to serve, instead of letting any one parcel become the world.'
		]
	},
	{
		id: 'anatomy-set',
		kicker: 'Interstitial anatomy',
		title: 'Four methods, equal weight',
		mark: 'anatomy',
		paragraphs: [
			'The treatise then develops one parcel in depth: Edified Interstitial Contemplation, or EIC — philosophy, chosen because it is the most liable to ossify. EIC keeps to interstitial attributes, the relational properties that hold between things, rather than claiming jurisdiction over everything that exists. That narrowing is a discipline, not a lack of ambition.',
			'What EIC hands an analyst at the structural level is Interstitial Anatomy: four methods of equal weight. Discernment, Observation, Resolution, and Operation. Accentuating one is a temporary focus; the other three remain in play. A potential capacity — the ability to discern — is not the same as a concrete act, a member discerning. The names used here are the acts.'
		]
	},
	{
		id: 'discernment',
		kicker: 'Interstitial anatomy',
		title: 'Discernment',
		mark: 'jay',
		paragraphs: [
			'Blue jays are creatures of habit: the same bird returns, year after year, to a roof it has claimed. Held still, its plumage can be read. Returning across seasons, that reading can be compared. Neither moment alone would tell you much. Stillness without succession is detail with nothing to set it against; succession without stillness is change too restless to read.',
			"Discernment is the method of knowing in that sense. A phenomenon is held still enough to be read, and read again across a succession of such moments. The act can be bounded by the discerner's perspective or detached from it — subjectivity and objectivity, in ordinary language — but the method is the same: knowing without collapsing into a single frozen impression or a blur."
		]
	},
	{
		id: 'observation',
		kicker: 'Interstitial anatomy',
		title: 'Observation',
		mark: 'sparrow',
		paragraphs: [
			"A fledgling sparrow's first flight looks like failure, or luck, or nothing at all. Only a succession of attempts, each a little farther than the last, lets the movement be read as learning rather than flailing. Observation is not discernment under another name. It is the method of attending to movement as pattern.",
			'That attending can come from above or from below, and it can carry judgement or withhold it. The treatise develops those combinations; what matters here is the distinction of job. Discernment asks what can be known. Observation asks what is actually being watched, and whether the watching has become a verdict before the pattern has had time to appear.'
		]
	},
	{
		id: 'resolution',
		kicker: 'Interstitial anatomy',
		title: 'Resolution',
		mark: 'dove',
		paragraphs: [
			"A dove alone, sitting still, is resting. A dule of doves going still together, at the instant a hawk's shadow crosses the street, is the resolution of a threat: safety in numbers, achieved in a single held beat. Resolution is the method of settling a challenge — not by declaring one pressure illegitimate, but by holding the relevant tensions together long enough that a viable arrangement can appear.",
			'Chaos is not wrongness, and order is not rightness. Friction here is structural; conflict is behavioral. Both pairs generate the problems that have to be resolved. The method ends in viability: an understanding of what can be endured in this context, rather than a complaint that the world will not stop presenting challenges.'
		]
	},
	{
		id: 'operation',
		kicker: 'Interstitial anatomy',
		title: 'Operation',
		mark: 'crow',
		paragraphs: [
			'One crow flying south means little. A murder of crows lifting off together, the same direction, as the cold arrives, is a migration: a coordinated operation no single bird could perform alone. Operation is the method of acting inside a system, so that motion is shared, at the same moment, by those taking part.',
			'It is also the oldest piece of this framework, and was called the Compass before it had a systematic name. Acting requires an identity that can hold a boundary and remain permeable, and a participation that is both proactive and receptive. The treatise develops those as cardinal directions. Action, here, is a structured method — not whatever is left over after the thinking is done.'
		]
	},
	{
		id: 'two-longings',
		kicker: 'Interstitial physiology',
		title: 'Two longings',
		mark: 'physiology',
		paragraphs: [
			'Anatomy is the static side. Systems also live, and most complex ones are organic or instrumental. A biological system carries a perdurability longing: to keep existing. An artificial one carries a functionality longing: to perform what it was made to do. Each longing, on its own, can be coherent. An organism does not have to be "functional" in the instrumental sense; a tool does not have to survive as a lineage.',
			'A mixed system longs for both. Humanity is the near example; others are easy to imagine. Self-defense is a rare case in which the two have been roughly reconciled: preserve life, but not by making indiscriminate killing a functional ethic. Most mixed-system endeavors do not resolve so cleanly.'
		]
	},
	{
		id: 'axiom',
		kicker: 'Interstitial physiology',
		title: 'The incompatibility axiom',
		mark: 'physiology',
		paragraphs: [
			'In a mixed system, each longing predisposes the undesirable pole of the other. A system that is working well cannot expect that state to last. A system that freezes an arrangement in order to last will start working badly. Functionality and perdurability are not compatible in a mixed physiology.',
			'That is the Incompatibility Axiom. It is meant to be strange. Nations proclaim eternal inevitability; parties are asked to remain for the good of the people; families are bound to traditional obedience; religions promise heavenly permanence. Empires fall, politics corrupts, families break, and Heaven remains a promise.',
			'The reader is free to reject the axiom. Within Conciliatorics it is treated as true, because the rest of the synthesis follows from it.'
		]
	},
	{
		id: 'two-syntheses',
		kicker: 'Interstitial physiology',
		title: 'Unification and conciliation',
		mark: 'physiology',
		paragraphs: [
			'If the axiom is granted, a mixed system is forced onto one of two paths. Unification Synthesis accepts perdurable dysfunctionality: the empire that keeps itself together by silencing representation. Conciliation Synthesis accepts imperdurable functionality: the office that works, and is vacated on purpose, even when the holder is still popular.',
			'The ethical preference in this framework is conciliation. The remaining problem is practical. If the working arrangement cannot be made permanent, how does anything persist?'
		]
	},
	{
		id: 'demand-to-endure',
		kicker: 'Attributes synthesis',
		title: 'The demand to endure',
		mark: 'synthesis',
		paragraphs: [
			'The attachment to perdurability is not a bookkeeping error. It is tied to mortality, to meaning, and to the fear that to be replaced is to have meant nothing. The intellect can accept that cells and species perish. It still insists that this particular I must endure.',
			'The answer is not a better argument for death. It is a change of scale. A cell does not persist. The tissue does, because cells iterate: they form, contribute, decay, and are succeeded. When that iteration is disrupted — when cells live longer than they should — the tissue sickens. The problem of lasting, at the scale that matters, is a problem of iteration.'
		]
	},
	{
		id: 'pathway',
		kicker: 'Attributes synthesis',
		title: 'Iterated imperdurable functionality',
		mark: 'synthesis',
		paragraphs: [
			'The Conciliation Pathway is iterated imperdurable functionality. Persistence is built by repeating a working, mortal arrangement, not by defending one arrangement against time. A term-limited office has the same shape as the tissue: the function continues because the holder does not.',
			'Meaning and legacy can remain. They cannot be a demand that this form never die. A mixed system may last — even past the decay of purely organic or instrumental things — only if it consents to be iterated, and if those who compose it can accept being iterated themselves.'
		]
	},
	{
		id: 'reciprocity',
		kicker: 'Attributes synthesis',
		title: 'Status reciprocity',
		mark: 'synthesis',
		paragraphs: [
			'These interstitial statuses have an intrinsic correlate, which is how they become usable on systems that already have ordinary names. Unification synthesis shows up as centralization. Conciliation synthesis shows up as decentralization. Status Reciprocity is that pairing.',
			'From then on, a centralized system can be read as unifying in order to last, even at the cost of function. A decentralized one can be read as staying functional by rotating, splitting, or replacing its parts. The questions become specific: what blocks a turn toward decentralization here, what that turn would cost, what would have to iterate in order to persist.',
			'The treatise is where those readings are built. The walkthrough only names the joints that make them possible.'
		]
	},
	{
		id: 'cta',
		kicker: 'Onward',
		title: 'The treatise',
		paragraphs: [
			'The treatise is the integrated development of what these panels have indicated: the operators, the diagrams, the vocabulary, and the rest of the joints.',
			'A slower video series, one stretch per idea, is being prepared. It is not available yet.',
			'Core EIC — from the opening of Attributes Dynamics through Status Reciprocity — is complete as a structure. What grows past that floor, Edge EIC and Edified Intrinsic Transformation (EIT) among them, is how you can tell the work is still being built rather than closed.'
		],
		actions: [
			{
				kind: 'primary',
				href: '/treatise',
				label: 'Start reading the treatise',
				blurb: 'The full text, with clickable terms.'
			},
			{
				kind: 'soon',
				label: 'Video series',
				blurb: 'Coming Soon'
			}
		]
	}
];

export function parseEntryHash(hash: string, count: number): number | null {
	if (!hash) return null;
	const query = hash.startsWith('#') ? hash.slice(1) : hash;
	const value = new URLSearchParams(query).get('entry');
	if (value == null || value === '') return null;
	const n = Number(value);
	if (!Number.isInteger(n) || n < 1) return null;
	return Math.min(n, count) - 1;
}

export function entryHash(index: number): string {
	return `#entry=${index + 1}`;
}
