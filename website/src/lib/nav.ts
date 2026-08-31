export type Section = {
	href: '/start' | '/treatise' | '/dex' | '/dialogue' | '/cases' | '/about';
	label: string;
	blurb: string;
};

export const sections: Section[] = [
	{ href: '/start', label: 'Start here', blurb: 'A short walkthrough of the main ideas.' },
	{ href: '/treatise', label: 'Treatise', blurb: 'The full text, with clickable terms.' },
	{ href: '/dex', label: 'EIC-Dex', blurb: 'The Core EIC equation graph.' },
	{ href: '/dialogue', label: 'In dialogue', blurb: 'Contact with academic literature.' },
	{ href: '/cases', label: 'Cases', blurb: 'Government systems, applied with care.' },
	{ href: '/about', label: 'About', blurb: 'The project, and how to reach me.' }
];

export function sectionIsActive(pathname: string, href: Section['href']): boolean {
	if (href === '/treatise') {
		return pathname === '/treatise' || /^\/\d/.test(pathname);
	}
	if (href === '/dex') {
		return pathname === '/dex' || pathname.startsWith('/dex/');
	}
	return pathname === href;
}
