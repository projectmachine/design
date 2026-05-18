import express, { type Request, type Response, type NextFunction } from 'express';
import multer from 'multer';
import fs from 'node:fs';
import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import http, { type Server } from 'node:http';
import path from 'node:path';
import { randomUUID } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { readAppConfig, writeAppConfig } from './app-config.js';
import { readCurrentAppVersionInfo } from './app-version.js';
import { resolveDaemonDbConfig } from './storage/daemon-db.js';
import { createSupabaseAuthContext } from './auth-middleware.js';
import {
  buildProjectArchive,
  deleteProjectFile,
  ensureProject,
  listFiles,
  mimeFor,
  readProjectFile,
  renameProjectFile,
  writeProjectFile,
} from './projects.js';

export interface StartServerOptions {
  host?: string;
  port?: number;
  returnServer?: boolean;
  staticDir?: string;
}

type Project = {
  id: string;
  name: string;
  skillId: string | null;
  designSystemId: string | null;
  pendingPrompt?: string | null;
  metadata?: Record<string, unknown>;
  customInstructions?: string | null;
  createdAt: number;
  updatedAt: number;
  status?: { value: string };
};

type Conversation = {
  id: string;
  projectId: string;
  title?: string;
  createdAt: number;
  updatedAt: number;
};

type Store = {
  projects: Project[];
  conversations: Conversation[];
  messages: Record<string, unknown[]>;
  tabs: Record<string, { tabs: unknown[]; active: string | null }>;
  templates: unknown[];
  comments: Record<string, unknown[]>;
};

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 50 * 1024 * 1024, files: 50 } });
const defaultStore = (): Store => ({ projects: [], conversations: [], messages: {}, tabs: {}, templates: [], comments: {} });

function projectRoot(): string {
  return path.resolve(fileURLToPath(new URL('../../..', import.meta.url)));
}

function dataDir(root = projectRoot()): string {
  const configured = process.env.OD_DATA_DIR;
  if (configured && configured.trim()) {
    return path.resolve(configured.replace(/^~(?=$|\/)/, process.env.HOME ?? '~'));
  }
  return path.join(root, '.od');
}

function webOutDir(root = projectRoot()): string {
  return path.join(root, 'apps/web/out');
}

function storeFile(root = projectRoot()): string {
  return path.join(dataDir(root), 'app-store.json');
}

async function readStore(root = projectRoot()): Promise<Store> {
  try {
    const parsed = JSON.parse(await readFile(storeFile(root), 'utf8')) as Partial<Store>;
    return { ...defaultStore(), ...parsed };
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') return defaultStore();
    throw error;
  }
}

async function saveStore(store: Store, root = projectRoot()): Promise<void> {
  await mkdir(dataDir(root), { recursive: true });
  await writeFile(storeFile(root), JSON.stringify(store, null, 2));
}

function projectsDir(root = projectRoot()): string {
  return path.join(dataDir(root), 'projects');
}

function artifactsDir(root = projectRoot()): string {
  return path.join(dataDir(root), 'artifacts');
}

function asyncRoute(handler: (req: Request, res: Response, next: NextFunction) => Promise<void> | void) {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(handler(req, res, next)).catch(next);
  };
}

function apiError(res: Response, status: number, code: string, message: string): void {
  res.status(status).json({ error: { code, message } });
}

function findProject(store: Store, id: string): Project | null {
  return store.projects.find((project) => project.id === id) ?? null;
}

function upsertConversation(store: Store, projectId: string, title?: string): Conversation {
  const now = Date.now();
  const conversation: Conversation = { id: randomUUID(), projectId, title: title || 'Conversation', createdAt: now, updatedAt: now };
  store.conversations.unshift(conversation);
  return conversation;
}

function safeBodyObject(req: Request): Record<string, unknown> {
  return req.body && typeof req.body === 'object' && !Array.isArray(req.body) ? req.body as Record<string, unknown> : {};
}

function routeParam(req: Request, name: string): string {
  const value = req.params[name];
  if (!value) throw new Error(`missing route parameter: ${name}`);
  return value;
}

function catalogStubs(app: express.Express): void {
  app.get('/api/agents', (_req, res) => res.json({ agents: [] }));
  app.get('/api/skills', (_req, res) => res.json({ skills: [] }));
  app.get('/api/design-templates', (_req, res) => res.json({ designTemplates: [] }));
  app.get('/api/design-templates/:id', (_req, res) => apiError(res, 404, 'NOT_FOUND', 'design template not found'));
  app.get('/api/design-systems', (_req, res) => res.json({ designSystems: [] }));
  app.get('/api/design-systems/:id', (_req, res) => apiError(res, 404, 'NOT_FOUND', 'design system not found'));
  app.get('/api/prompt-templates', (_req, res) => res.json({ promptTemplates: [] }));
  app.get('/api/codex-pets', (_req, res) => res.json({ pets: [] }));
  app.get('/api/plugins', (_req, res) => res.json({ plugins: [] }));
  app.get('/api/marketplaces', (_req, res) => res.json({ marketplaces: [] }));
  app.get('/api/connectors', (_req, res) => res.json({ connectors: [] }));
  app.get('/api/connectors/status', (_req, res) => res.json({ connectors: [] }));
  app.get('/api/mcp/install-info', (_req, res) => res.json({ installInfo: null }));
  app.get('/api/mcp/servers', (_req, res) => res.json({ servers: [] }));
  app.put('/api/mcp/servers', (_req, res) => res.json({ servers: [] }));
  app.get('/api/media/config', (_req, res) => res.json({ config: null }));
  app.put('/api/media/config', (_req, res) => res.json({ config: null }));
  app.get('/api/deploy/config', (_req, res) => res.json({ config: null }));
  app.put('/api/deploy/config', (_req, res) => res.json({ config: null }));
  app.get('/api/live-artifacts', (_req, res) => res.json({ artifacts: [] }));
  app.get('/api/routines', (_req, res) => res.json({ routines: [] }));
  app.post('/api/routines', (_req, res) => apiError(res, 410, 'REMOVED', 'routines are not available in this web-only fork'));
  app.get('/api/orbit/status', (_req, res) => res.json({ enabled: false }));
  app.post('/api/orbit/run', (_req, res) => apiError(res, 410, 'REMOVED', 'orbit is not available in this web-only fork'));
  app.post('/api/test/connection', (_req, res) => res.json({ ok: false, error: 'agent provider tests are not available' }));
  app.post('/api/provider/models', (_req, res) => res.json({ models: [] }));
  app.post('/api/runs', (_req, res) => apiError(res, 410, 'REMOVED', 'agent runs are not available in this web-only fork'));
  app.get('/api/runs', (_req, res) => res.json({ runs: [] }));
  app.post('/api/proxy/thaura/stream', asyncRoute(async (req, res) => {
    const apiKey = process.env.THAURA_API_KEY ?? '';
    if (!apiKey) {
      res.status(500).json({ error: 'THAURA_API_KEY environment variable is not set' });
      return;
    }
    const body = safeBodyObject(req);
    const model = typeof body.model === 'string' ? body.model : 'thaura';
    const systemPrompt = typeof body.systemPrompt === 'string' ? body.systemPrompt : '';
    const messages = Array.isArray(body.messages) ? body.messages as Array<{ role: string; content: string }> : [];
    const maxTokens = typeof body.maxTokens === 'number' ? body.maxTokens : 8192;

    const chatMessages: Array<{ role: string; content: string }> = [];
    if (systemPrompt) chatMessages.push({ role: 'system', content: systemPrompt });
    chatMessages.push(...messages);

    let upstream: Awaited<ReturnType<typeof fetch>>;
    try {
      upstream = await fetch('https://backend.thaura.ai/v1/chat/completions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
        body: JSON.stringify({ model, messages: chatMessages, max_tokens: maxTokens, stream: true }),
      });
    } catch (err) {
      res.status(502).json({ error: String(err) });
      return;
    }

    if (!upstream.ok || !upstream.body) {
      const text = await upstream.text().catch(() => '');
      res.setHeader('Content-Type', 'text/event-stream');
      res.write(`event: error\ndata: ${JSON.stringify({ message: `upstream ${upstream.status}: ${text}` })}\n\n`);
      res.end();
      return;
    }

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    const reader = upstream.body.getReader();
    const decoder = new TextDecoder();
    let buf = '';
    try {
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        buf += decoder.decode(value, { stream: true });
        const lines = buf.split('\n');
        buf = lines.pop() ?? '';
        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed.startsWith('data: ')) continue;
          const data = trimmed.slice(6);
          if (data === '[DONE]') {
            res.write(`event: end\ndata: {}\n\n`);
            res.end();
            return;
          }
          try {
            const chunk = JSON.parse(data) as { choices?: Array<{ delta?: { content?: string } }> };
            const content = chunk.choices?.[0]?.delta?.content;
            if (content) res.write(`event: delta\ndata: ${JSON.stringify({ delta: content })}\n\n`);
          } catch { /* skip malformed chunks */ }
        }
      }
    } catch (err) {
      if (!res.writableEnded) res.write(`event: error\ndata: ${JSON.stringify({ message: String(err) })}\n\n`);
    }
    if (!res.writableEnded) { res.write(`event: end\ndata: {}\n\n`); res.end(); }
  }));
  app.post('/api/proxy/:provider/stream', (_req, res) => apiError(res, 410, 'REMOVED', 'LLM proxy routes are not available'));
}

export async function startServer(options: StartServerOptions = {}): Promise<string | { server: Server; url: string; shutdown: () => Promise<void> }> {
  const root = projectRoot();
  const runtimeDataDir = dataDir(root);
  await mkdir(runtimeDataDir, { recursive: true });
  await mkdir(projectsDir(root), { recursive: true });
  await mkdir(artifactsDir(root), { recursive: true });

  const app = express();
  app.disable('x-powered-by');
  app.use(express.json({ limit: '25mb' }));
  app.use(express.urlencoded({ extended: true, limit: '25mb' }));

  const dbConfig = resolveDaemonDbConfig(process.env);
  const auth = createSupabaseAuthContext(dbConfig);

  app.get('/api/health', (_req, res) => res.json({ ok: true }));
  app.get('/api/version', asyncRoute(async (_req, res) => {
    res.json(await readCurrentAppVersionInfo());
  }));
  app.get('/api/daemon/status', (_req, res) => res.json({ ok: true, mode: 'web-only' }));
  if (auth) app.use('/api', auth.requireAuth);

  app.get('/api/daemon/db', (_req, res) => res.json({ kind: dbConfig.kind }));
  app.get('/api/app-config', asyncRoute(async (_req, res) => {
    res.json({ config: await readAppConfig(runtimeDataDir) });
  }));
  app.put('/api/app-config', asyncRoute(async (req, res) => {
    res.json({ config: await writeAppConfig(runtimeDataDir, safeBodyObject(req)) });
  }));
  app.post('/api/active', (_req, res) => res.json({ ok: true }));

  catalogStubs(app);

  app.get('/api/projects', asyncRoute(async (_req, res) => {
    const store = await readStore(root);
    res.json({ projects: store.projects.map((project) => ({ ...project, status: project.status ?? { value: 'not_started' } })) });
  }));

  app.post('/api/projects', asyncRoute(async (req, res) => {
    const body = safeBodyObject(req);
    const now = Date.now();
    const id = typeof body.id === 'string' && body.id ? body.id : randomUUID();
    const project: Project = {
      id,
      name: typeof body.name === 'string' && body.name.trim() ? body.name.trim() : 'Untitled project',
      skillId: typeof body.skillId === 'string' ? body.skillId : null,
      designSystemId: typeof body.designSystemId === 'string' ? body.designSystemId : null,
      pendingPrompt: typeof body.pendingPrompt === 'string' ? body.pendingPrompt : null,
      metadata: body.metadata && typeof body.metadata === 'object' && !Array.isArray(body.metadata) ? body.metadata as Record<string, unknown> : {},
      createdAt: now,
      updatedAt: now,
      status: { value: 'not_started' },
    };
    const store = await readStore(root);
    store.projects.unshift(project);
    const conversation = upsertConversation(store, id, 'New conversation');
    await ensureProject(projectsDir(root), id);
    await saveStore(store, root);
    res.status(201).json({ project, conversationId: conversation.id });
  }));

  app.get('/api/projects/:id', asyncRoute(async (req, res) => {
    const project = findProject(await readStore(root), routeParam(req, 'id'));
    if (!project) return apiError(res, 404, 'NOT_FOUND', 'project not found');
    res.json({ project });
  }));

  app.patch('/api/projects/:id', asyncRoute(async (req, res) => {
    const store = await readStore(root);
    const project = findProject(store, routeParam(req, 'id'));
    if (!project) return apiError(res, 404, 'NOT_FOUND', 'project not found');
    const body = safeBodyObject(req);
    for (const key of ['name', 'pendingPrompt', 'customInstructions'] as const) {
      if (typeof body[key] === 'string' || body[key] === null) (project as Record<string, unknown>)[key] = body[key];
    }
    if (typeof body.skillId === 'string' || body.skillId === null) project.skillId = body.skillId;
    if (typeof body.designSystemId === 'string' || body.designSystemId === null) project.designSystemId = body.designSystemId;
    if (body.metadata && typeof body.metadata === 'object' && !Array.isArray(body.metadata)) project.metadata = body.metadata as Record<string, unknown>;
    project.updatedAt = Date.now();
    await saveStore(store, root);
    res.json({ project });
  }));

  app.delete('/api/projects/:id', asyncRoute(async (req, res) => {
    const store = await readStore(root);
    store.projects = store.projects.filter((project) => project.id !== routeParam(req, 'id'));
    store.conversations = store.conversations.filter((conversation) => conversation.projectId !== routeParam(req, 'id'));
    delete store.tabs[routeParam(req, 'id')];
    await rm(path.join(projectsDir(root), routeParam(req, 'id')), { recursive: true, force: true });
    await saveStore(store, root);
    res.json({ ok: true });
  }));

  app.get('/api/projects/:id/events', (req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache', Connection: 'keep-alive' });
    res.write(`event: ready\ndata: ${JSON.stringify({ projectId: routeParam(req, 'id') })}\n\n`);
  });

  app.get('/api/projects/:id/conversations', asyncRoute(async (req, res) => {
    const store = await readStore(root);
    res.json({ conversations: store.conversations.filter((conversation) => conversation.projectId === routeParam(req, 'id')) });
  }));

  app.post('/api/projects/:id/conversations', asyncRoute(async (req, res) => {
    const store = await readStore(root);
    if (!findProject(store, routeParam(req, 'id'))) return apiError(res, 404, 'NOT_FOUND', 'project not found');
    const conversation = upsertConversation(store, routeParam(req, 'id'), typeof req.body?.title === 'string' ? req.body.title : undefined);
    await saveStore(store, root);
    res.status(201).json({ conversation });
  }));

  app.patch('/api/projects/:projectId/conversations/:conversationId', asyncRoute(async (req, res) => {
    const store = await readStore(root);
    const conversation = store.conversations.find((item) => item.id === routeParam(req, 'conversationId') && item.projectId === routeParam(req, 'projectId'));
    if (!conversation) return apiError(res, 404, 'NOT_FOUND', 'conversation not found');
    if (typeof req.body?.title === 'string') conversation.title = req.body.title;
    conversation.updatedAt = Date.now();
    await saveStore(store, root);
    res.json({ conversation });
  }));

  app.delete('/api/projects/:projectId/conversations/:conversationId', asyncRoute(async (req, res) => {
    const store = await readStore(root);
    store.conversations = store.conversations.filter((item) => item.id !== routeParam(req, 'conversationId') || item.projectId !== routeParam(req, 'projectId'));
    delete store.messages[routeParam(req, 'conversationId')];
    await saveStore(store, root);
    res.json({ ok: true });
  }));

  app.get('/api/projects/:projectId/conversations/:conversationId/messages', asyncRoute(async (req, res) => {
    const store = await readStore(root);
    res.json({ messages: store.messages[routeParam(req, 'conversationId')] ?? [] });
  }));

  app.put('/api/projects/:projectId/conversations/:conversationId/messages/:messageId', asyncRoute(async (req, res) => {
    const store = await readStore(root);
    const messages = store.messages[routeParam(req, 'conversationId')] ?? [];
    const next = { ...safeBodyObject(req), id: routeParam(req, 'messageId') };
    const index = messages.findIndex((message: unknown) => typeof message === 'object' && message != null && (message as { id?: unknown }).id === routeParam(req, 'messageId'));
    if (index >= 0) messages[index] = next;
    else messages.push(next);
    store.messages[routeParam(req, 'conversationId')] = messages;
    await saveStore(store, root);
    res.json({ message: next });
  }));

  app.get('/api/projects/:id/tabs', asyncRoute(async (req, res) => {
    const store = await readStore(root);
    res.json(store.tabs[routeParam(req, 'id')] ?? { tabs: [], active: null });
  }));

  app.put('/api/projects/:id/tabs', asyncRoute(async (req, res) => {
    const store = await readStore(root);
    store.tabs[routeParam(req, 'id')] = { tabs: Array.isArray(req.body?.tabs) ? req.body.tabs : [], active: typeof req.body?.active === 'string' ? req.body.active : null };
    await saveStore(store, root);
    res.json(store.tabs[routeParam(req, 'id')]);
  }));

  app.get('/api/projects/:id/files', asyncRoute(async (req, res) => {
    res.json({ files: await listFiles(projectsDir(root), routeParam(req, 'id')) });
  }));

  app.post('/api/projects/:id/files', upload.single('file'), asyncRoute(async (req, res) => {
    const file = req.file;
    const body = safeBodyObject(req);
    const name = typeof body.name === 'string' ? body.name : file?.originalname;
    if (!name) return apiError(res, 400, 'BAD_REQUEST', 'name is required');
    const content = file?.buffer ?? (body.encoding === 'base64' && typeof body.content === 'string' ? Buffer.from(body.content, 'base64') : Buffer.from(typeof body.content === 'string' ? body.content : '', 'utf8'));
    res.status(201).json({ file: await writeProjectFile(projectsDir(root), routeParam(req, 'id'), name, content) });
  }));

  app.post('/api/projects/:id/upload', upload.array('files'), asyncRoute(async (req, res) => {
    const files = (req.files ?? []) as Express.Multer.File[];
    const written = [];
    for (const file of files) written.push({ ...(await writeProjectFile(projectsDir(root), routeParam(req, 'id'), file.originalname, file.buffer)), originalName: file.originalname });
    res.status(201).json({ files: written });
  }));

  app.post('/api/projects/:id/files/rename', asyncRoute(async (req, res) => {
    if (typeof req.body?.from !== 'string' || typeof req.body?.to !== 'string') return apiError(res, 400, 'BAD_REQUEST', 'from and to are required');
    await renameProjectFile(projectsDir(root), routeParam(req, 'id'), req.body.from, req.body.to);
    res.json({ ok: true });
  }));

  app.get('/api/projects/:id/raw/*', asyncRoute(async (req, res) => {
    const name = (req.params as Record<string, string | undefined>)['0'] ?? '';
    res.type(mimeFor(name));
    res.send(await readProjectFile(projectsDir(root), routeParam(req, 'id'), name));
  }));

  app.delete('/api/projects/:id/raw/*', asyncRoute(async (req, res) => {
    const name = (req.params as Record<string, string | undefined>)['0'] ?? '';
    await deleteProjectFile(projectsDir(root), routeParam(req, 'id'), name);
    res.json({ ok: true });
  }));

  app.get('/api/projects/:id/archive', asyncRoute(async (req, res) => {
    const archive = await buildProjectArchive(projectsDir(root), routeParam(req, 'id'));
    res.setHeader('content-type', 'application/zip');
    res.setHeader('content-disposition', `attachment; filename="${archive.baseName}.zip"`);
    res.send(archive.buffer);
  }));

  app.get('/api/templates', asyncRoute(async (_req, res) => {
    res.json({ templates: (await readStore(root)).templates });
  }));
  app.post('/api/templates', asyncRoute(async (req, res) => {
    const store = await readStore(root);
    const template = { id: randomUUID(), ...safeBodyObject(req), createdAt: Date.now() };
    store.templates.unshift(template);
    await saveStore(store, root);
    res.status(201).json({ template });
  }));
  app.get('/api/templates/:id', asyncRoute(async (req, res) => {
    const template = (await readStore(root)).templates.find((item) => typeof item === 'object' && item != null && (item as { id?: unknown }).id === routeParam(req, 'id'));
    if (!template) return apiError(res, 404, 'NOT_FOUND', 'template not found');
    res.json({ template });
  }));
  app.delete('/api/templates/:id', asyncRoute(async (req, res) => {
    const store = await readStore(root);
    store.templates = store.templates.filter((item) => typeof item !== 'object' || item == null || (item as { id?: unknown }).id !== routeParam(req, 'id'));
    await saveStore(store, root);
    res.json({ ok: true });
  }));

  app.post('/api/artifacts/save', asyncRoute(async (req, res) => {
    const body = safeBodyObject(req);
    const name = typeof body.name === 'string' ? body.name : `${randomUUID()}.html`;
    const content = typeof body.content === 'string' ? body.content : '';
    await writeFile(path.join(artifactsDir(root), path.basename(name)), content);
    res.status(201).json({ ok: true, path: `/artifacts/${encodeURIComponent(path.basename(name))}` });
  }));

  app.use('/artifacts', express.static(artifactsDir(root), { fallthrough: false }));

  const staticDir = options.staticDir ?? webOutDir(root);
  if (fs.existsSync(staticDir)) {
    app.use(express.static(staticDir));
    app.get('*', (req, res, next) => {
      if (req.path.startsWith('/api/') || req.path.startsWith('/artifacts/')) return next();
      res.sendFile(path.join(staticDir, 'index.html'));
    });
  }

  app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
    const message = err instanceof Error ? err.message : String(err);
    apiError(res, 500, 'INTERNAL_ERROR', message);
  });

  const port = options.port ?? (Number(process.env.OD_PORT) || 7456);
  const host = options.host ?? process.env.OD_BIND_HOST ?? '127.0.0.1';
  const server = http.createServer(app);
  const url = await new Promise<string>((resolve) => {
    server.listen(port, host, () => {
      const address = server.address();
      const actualPort = typeof address === 'object' && address ? address.port : port;
      resolve(`http://${host === '0.0.0.0' ? '127.0.0.1' : host}:${actualPort}`);
    });
  });

  if (options.returnServer) {
    return { server, url, shutdown: async () => undefined };
  }
  return url;
}
