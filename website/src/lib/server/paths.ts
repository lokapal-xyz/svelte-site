import { resolve } from 'node:path';

/** Repo root. Kit cwd is `website/` (Vercel Root Directory). Build-time mdsvex only. */
export const REPO_ROOT = resolve(process.cwd(), '..');

export const GLOSSARY_PATH = resolve(REPO_ROOT, 'library/glossary/glossary.yaml');
export const SVG_DIR = resolve(REPO_ROOT, 'diagrams/svg');
