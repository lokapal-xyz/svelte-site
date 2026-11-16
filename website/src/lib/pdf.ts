/** Content fingerprint of the treatise PDF. Changes only when the file bytes change. */
export const PDF_VERSION = __PDF_VERSION__;

/** `resolvedPath` is the result of `asset('/conciliatorics.pdf')`, which may be relative. */
export function treatisePdfHref(resolvedPath: string): string {
	return `${resolvedPath}?v=${PDF_VERSION}`;
}
