import { mkdir, readdir, readFile, rename, rm, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import JSZip from 'jszip';

export function projectDir(projectsRoot: string, projectId: string): string {
  if (!/^[A-Za-z0-9_-]+$/.test(projectId)) throw new Error('invalid project id');
  return path.join(projectsRoot, projectId);
}

export function resolveProjectDir(projectsRoot: string, projectId: string): string {
  return projectDir(projectsRoot, projectId);
}

export async function ensureProject(projectsRoot: string, projectId: string): Promise<string> {
  const dir = projectDir(projectsRoot, projectId);
  await mkdir(dir, { recursive: true });
  return dir;
}

export async function listFiles(projectsRoot: string, projectId: string): Promise<Array<{ name: string; path: string; type: 'file'; size: number; mtime: number; kind: string; mime: string }>> {
  const dir = projectDir(projectsRoot, projectId);
  const out: Array<{ name: string; path: string; type: 'file'; size: number; mtime: number; kind: string; mime: string }> = [];
  await collectFiles(dir, '', out);
  return out.sort((a, b) => b.mtime - a.mtime);
}

async function collectFiles(dir: string, relDir: string, out: Array<{ name: string; path: string; type: 'file'; size: number; mtime: number; kind: string; mime: string }>): Promise<void> {
  let entries;
  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') return;
    throw error;
  }
  for (const entry of entries) {
    if (entry.name.startsWith('.')) continue;
    const rel = relDir ? `${relDir}/${entry.name}` : entry.name;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      await collectFiles(full, rel, out);
    } else if (entry.isFile()) {
      const s = await stat(full);
      out.push({ name: rel, path: rel, type: 'file', size: s.size, mtime: s.mtimeMs, kind: kindFor(rel), mime: mimeFor(rel) });
    }
  }
}

export async function readProjectFile(projectsRoot: string, projectId: string, name: string): Promise<Buffer> {
  return readFile(resolveSafe(projectDir(projectsRoot, projectId), name));
}

export async function writeProjectFile(projectsRoot: string, projectId: string, name: string, body: Buffer | string): Promise<{ name: string; path: string; type: 'file'; size: number; mtime: number; kind: string; mime: string }> {
  const root = await ensureProject(projectsRoot, projectId);
  const full = resolveSafe(root, name);
  await mkdir(path.dirname(full), { recursive: true });
  await writeFile(full, body);
  const s = await stat(full);
  return { name, path: name, type: 'file', size: s.size, mtime: s.mtimeMs, kind: kindFor(name), mime: mimeFor(name) };
}

export async function deleteProjectFile(projectsRoot: string, projectId: string, name: string): Promise<void> {
  await rm(resolveSafe(projectDir(projectsRoot, projectId), name), { force: true });
}

export async function renameProjectFile(projectsRoot: string, projectId: string, from: string, to: string): Promise<void> {
  const root = projectDir(projectsRoot, projectId);
  const source = resolveSafe(root, from);
  const target = resolveSafe(root, to);
  await mkdir(path.dirname(target), { recursive: true });
  await rename(source, target);
}

export async function buildProjectArchive(projectsRoot: string, projectId: string): Promise<{ buffer: Buffer; baseName: string }> {
  const files = await listFiles(projectsRoot, projectId);
  const zip = new JSZip();
  for (const file of files) {
    zip.file(file.path, await readProjectFile(projectsRoot, projectId, file.path));
  }
  return { buffer: await zip.generateAsync({ type: 'nodebuffer', compression: 'DEFLATE' }), baseName: projectId };
}

export function resolveSafe(root: string, name: string): string {
  const normalized = name.replace(/\\/g, '/');
  if (!normalized || normalized.startsWith('/') || normalized.split('/').some((part) => part === '..' || part === '.')) {
    throw new Error('invalid file path');
  }
  const full = path.resolve(root, normalized);
  const resolvedRoot = path.resolve(root);
  if (full !== resolvedRoot && !full.startsWith(`${resolvedRoot}${path.sep}`)) throw new Error('invalid file path');
  return full;
}

export function mimeFor(name: string): string {
  const ext = path.extname(name).toLowerCase();
  if (ext === '.html' || ext === '.htm') return 'text/html; charset=utf-8';
  if (ext === '.css') return 'text/css; charset=utf-8';
  if (ext === '.js' || ext === '.mjs') return 'text/javascript; charset=utf-8';
  if (ext === '.json') return 'application/json; charset=utf-8';
  if (ext === '.svg') return 'image/svg+xml';
  if (ext === '.png') return 'image/png';
  if (ext === '.jpg' || ext === '.jpeg') return 'image/jpeg';
  if (ext === '.gif') return 'image/gif';
  if (ext === '.webp') return 'image/webp';
  if (ext === '.md') return 'text/markdown; charset=utf-8';
  return 'application/octet-stream';
}

function kindFor(name: string): string {
  const ext = path.extname(name).toLowerCase();
  if (['.png', '.jpg', '.jpeg', '.gif', '.webp', '.svg'].includes(ext)) return 'image';
  if (ext === '.html' || ext === '.htm') return 'html';
  if (ext === '.md') return 'markdown';
  return 'file';
}
