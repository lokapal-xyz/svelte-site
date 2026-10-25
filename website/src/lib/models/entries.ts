export type ModelEntry = {
	id: string;
	title: string;
	repoUrl: string;
	repoLabel: string;
	video: '/models/schelling-v01.mp4';
	poster: '/models/schelling-v01-poster.jpg';
	videoLabel: string;
	commands: string;
};

/** One object per model. The introduction on `/models` stays; add the prose beside the new id. */
export const modelEntries: ModelEntry[] = [
	{
		id: 'schelling-v01',
		title: 'v0.1 — Schelling Operational Status',
		repoUrl: 'https://github.com/lokapal-xyz/computational-systemics-schelling-v0.1',
		repoLabel: 'Open the v0.1 GitHub repository',
		video: '/models/schelling-v01.mp4',
		poster: '/models/schelling-v01-poster.jpg',
		videoLabel:
			'Recording of the Schelling Operational Status dashboard. Cyan and amber agents start mixed, then gather into same-color clusters while the segregation index rises.',
		commands: `git clone https://github.com/lokapal-xyz/computational-systemics-schelling-v0.1
cd computational-systemics-schelling-v0.1
chmod +x setup.sh   # only needed once
./setup.sh`
	}
];
