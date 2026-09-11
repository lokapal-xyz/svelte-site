import { resolve } from 'node:path';

/** Repo root. Kit cwd is `website/` (Vercel Root Directory). */
export const REPO_ROOT = resolve(process.cwd(), '..');

export const GLOSSARY_PATH = resolve(REPO_ROOT, 'library/glossary/glossary.yaml');
export const EIC_DEX_PATH = resolve(REPO_ROOT, 'library/eic-dex/eic-dex.yaml');
export const DIALOGUE_PATH = resolve(REPO_ROOT, 'library/dialogue/dialogue.yaml');
export const DIALOGUE_CONVERSATIONS_DIR = resolve(REPO_ROOT, 'library/dialogue/conversations');
export const DOCS_PATH = resolve(REPO_ROOT, 'docs');
export const SVG_DIR = resolve(REPO_ROOT, 'diagrams/svg');
