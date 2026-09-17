export type Section = {
	href: '/start' | '/treatise' | '/dex' | '/edge' | '/dialogue' | '/about';
	label: string;
	blurb: string;
};

export const sections: Section[] = [
	{ href: '/start', label: 'Start here', blurb: 'A short walkthrough of the main ideas.' },
	{ href: '/treatise', label: 'Treatise', blurb: 'The full text, with clickable terms.' },
	{ href: '/dex', label: 'EIC-Dex', blurb: 'Trace Core EIC through the equation graph.' },
	{ href: '/edge', label: 'Edge EIC', blurb: 'The EIC foliage, one leaf at a time.' },
	{ href: '/dialogue', label: 'In dialogue', blurb: 'Contact with academic literature.' },
	{ href: '/about', label: 'About', blurb: 'The project, and how to reach me.' }
];

export function sectionIsActive(pathname: string, href: Section['href']): boolean {
	if (href === '/treatise') {
		return pathname === '/treatise' || /^\/\d/.test(pathname);
	}
	if (href === '/dex') {
		return pathname === '/dex' || pathname.startsWith('/dex/');
	}
	if (href === '/edge') {
		return pathname === '/edge' || pathname.startsWith('/edge/');
	}
	if (href === '/dialogue') {
		return pathname === '/dialogue' || pathname.startsWith('/dialogue/');
	}
	return pathname === href;
}
