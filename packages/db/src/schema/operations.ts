import { sql } from 'drizzle-orm';
import {
  bigint,
  index,
  integer,
  pgPolicy,
  pgTable,
  primaryKey,
  real,
  text,
  uuid,
} from 'drizzle-orm/pg-core';
import { authenticatedRole, authUid } from 'drizzle-orm/supabase';
import { conversations, projects } from './core.js';
import { profiles } from './profiles.js';

const timestampMs = (name: string) => bigint(name, { mode: 'number' });

const ownRowPolicy = (name: string, userId: { name: string }) => pgPolicy(name, {
  for: 'all',
  to: authenticatedRole,
  using: sql`${userId} = ${authUid}`,
  withCheck: sql`${userId} = ${authUid}`,
});

export const critiqueRuns = pgTable('critique_runs', {
  id: text('id').primaryKey(),
  userId: uuid('user_id').notNull().references(() => profiles.id, { onDelete: 'cascade' }),
  projectId: text('project_id').notNull().references(() => projects.id, { onDelete: 'cascade' }),
  conversationId: text('conversation_id').references(() => conversations.id, { onDelete: 'set null' }),
  artifactPath: text('artifact_path'),
  status: text('status').notNull(),
  score: real('score'),
  roundsJson: text('rounds_json').notNull().default('[]'),
  transcriptPath: text('transcript_path'),
  protocolVersion: integer('protocol_version').notNull(),
  createdAt: timestampMs('created_at').notNull(),
  updatedAt: timestampMs('updated_at').notNull(),
}, (table) => [
  index('idx_critique_runs_project').on(table.projectId, table.updatedAt),
  index('idx_critique_runs_status').on(table.status),
  ownRowPolicy('critique_runs_own_rows', table.userId),
]).enableRLS();

export const mediaTasks = pgTable('media_tasks', {
  id: text('id').primaryKey(),
  userId: uuid('user_id').notNull().references(() => profiles.id, { onDelete: 'cascade' }),
  projectId: text('project_id').notNull().references(() => projects.id, { onDelete: 'cascade' }),
  status: text('status').notNull(),
  surface: text('surface'),
  model: text('model'),
  progressJson: text('progress_json').notNull().default('[]'),
  fileJson: text('file_json'),
  errorJson: text('error_json'),
  startedAt: timestampMs('started_at').notNull(),
  endedAt: timestampMs('ended_at'),
  createdAt: timestampMs('created_at').notNull(),
  updatedAt: timestampMs('updated_at').notNull(),
}, (table) => [
  index('idx_media_tasks_project').on(table.projectId, table.updatedAt),
  index('idx_media_tasks_status').on(table.status, table.updatedAt),
  ownRowPolicy('media_tasks_own_rows', table.userId),
]).enableRLS();

export const registryEntries = pgTable('registry_entries', {
  backendId: text('backend_id').notNull(),
  name: text('name').notNull(),
  version: text('version').notNull(),
  entryJson: text('entry_json').notNull(),
  updatedAt: timestampMs('updated_at').notNull(),
}, (table) => [
  primaryKey({ columns: [table.backendId, table.name] }),
  pgPolicy('registry_entries_authenticated_read', {
    for: 'select',
    to: authenticatedRole,
    using: sql`true`,
  }),
]).enableRLS();
