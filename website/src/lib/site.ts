/** Public origin. Keep in sync with `prerender.origin` in vite.config.ts (imported from here). */
export const SITE_ORIGIN = 'https://www.lokapal.xyz';
export const SITE_NAME = 'Lokapal';
export const SITE_AUTHOR = 'Lokapal (Ricardo Pintos)';
export const SITE_EMAIL = 'lokapal@proton.me';
export const TWITTER_SITE = '@lokapalxyz';

export const SITE_X = 'https://x.com/lokapalxyz';
export const SITE_YOUTUBE = 'https://www.youtube.com/@lokapalxyz';
export const SITE_SUBSTACK = 'https://substack.com/@lokapal';
export const SITE_INSTAGRAM = 'https://www.instagram.com/lokapalxyz/';
export const SITE_TELEGRAM = 'https://t.me/lokapalxyz';
export const SITE_ENS = 'https://app.ens.domains/lokapal.eth';
export const SITE_GITHUB = 'https://github.com/lokapal-xyz';

export const OG_IMAGE_PATH = '/og.png';
export const OG_IMAGE_WIDTH = 1200;
export const OG_IMAGE_HEIGHT = 630;
export const OG_IMAGE_ALT = 'Lokapal compass emblem';

/** Browser chrome. Distinct from the share-card navy `#041b3b`. */
export const THEME_COLOR = '#171719';

export const SAME_AS = [
	SITE_X,
	SITE_YOUTUBE,
	SITE_SUBSTACK,
	SITE_INSTAGRAM,
	SITE_TELEGRAM,
	SITE_ENS,
	SITE_GITHUB
] as const;
