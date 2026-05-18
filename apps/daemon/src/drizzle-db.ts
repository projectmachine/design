import {
  createOpenDesignDbFromUrl,
  projects,
  conversations,
  messages,
  templates,
  routines,
  routineRuns,
  tabs,
  deployments,
  previewComments,
  and,
  desc,
  eq,
  type OpenDesignDb,
} from '@open-design/db';
import type { DaemonDbConfig } from './storage/daemon-db.js';

export type DaemonDrizzleDb = OpenDesignDb;

let cached: { url: string; db: DaemonDrizzleDb; close: () => Promise<void> } | null = null;

export function openDrizzleDatabase(config: DaemonDbConfig): DaemonDrizzleDb | null {
  if (config.kind !== 'postgres') return null;
  const url = config.postgres?.connectionString;
  if (!url) return null;
  if (cached?.url === url) return cached.db;
  const { client, db } = createOpenDesignDbFromUrl({ databaseUrl: url });
  cached = {
    url,
    db,
    close: () => client.end({ timeout: 5 }),
  };
  return db;
}

export async function closeDrizzleDatabase(): Promise<void> {
  if (!cached) return;
  const current = cached;
  cached = null;
  await current.close();
}

export async function listDrizzleProjects(db: DaemonDrizzleDb) {
  return db.select().from(projects).orderBy(desc(projects.updatedAt));
}

export async function getDrizzleProject(db: DaemonDrizzleDb, id: string) {
  const rows = await db.select().from(projects).where(eq(projects.id, id)).limit(1);
  return rows[0] ?? null;
}

export async function listDrizzleConversations(db: DaemonDrizzleDb, projectId: string) {
  return db
    .select()
    .from(conversations)
    .where(eq(conversations.projectId, projectId))
    .orderBy(desc(conversations.updatedAt));
}

export async function listDrizzleMessages(db: DaemonDrizzleDb, conversationId: string) {
  return db.select().from(messages).where(eq(messages.conversationId, conversationId));
}

export async function listDrizzleTemplates(db: DaemonDrizzleDb) {
  return db.select().from(templates).orderBy(desc(templates.createdAt));
}

export async function listDrizzleRoutines(db: DaemonDrizzleDb) {
  return db.select().from(routines).orderBy(desc(routines.createdAt));
}

export async function listDrizzleRoutineRuns(db: DaemonDrizzleDb, routineId: string, limit = 20) {
  return db
    .select()
    .from(routineRuns)
    .where(eq(routineRuns.routineId, routineId))
    .orderBy(desc(routineRuns.startedAt))
    .limit(limit);
}

export async function listDrizzleTabs(db: DaemonDrizzleDb, projectId: string) {
  return db.select().from(tabs).where(eq(tabs.projectId, projectId));
}

export async function listDrizzleDeployments(db: DaemonDrizzleDb, projectId: string) {
  return db
    .select()
    .from(deployments)
    .where(eq(deployments.projectId, projectId))
    .orderBy(desc(deployments.updatedAt));
}

export async function getDrizzleDeployment(
  db: DaemonDrizzleDb,
  projectId: string,
  fileName: string,
  providerId: string,
) {
  const rows = await db
    .select()
    .from(deployments)
    .where(and(
      eq(deployments.projectId, projectId),
      eq(deployments.fileName, fileName),
      eq(deployments.providerId, providerId),
    ))
    .limit(1);
  return rows[0] ?? null;
}

export async function listDrizzlePreviewComments(
  db: DaemonDrizzleDb,
  projectId: string,
  conversationId: string,
) {
  return db
    .select()
    .from(previewComments)
    .where(and(
      eq(previewComments.projectId, projectId),
      eq(previewComments.conversationId, conversationId),
    ))
    .orderBy(desc(previewComments.updatedAt));
}
