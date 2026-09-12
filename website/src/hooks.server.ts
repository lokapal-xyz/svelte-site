import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	const response = await resolve(event);
	if (process.env.VERCEL_ENV === 'preview' || process.env.VERCEL_ENV === 'development') {
		response.headers.set('X-Robots-Tag', 'noindex, nofollow');
	}
	return response;
};
