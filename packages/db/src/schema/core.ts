import { sql } from 'drizzle-orm';
import {
  bigint,
  boolean,
  index,
  integer,
  pgPolicy,
  pgTable,
  primaryKey,
  text,
  uniqueIndex,
  uuid,
} from 'drizzle-orm/pg-core';
import { authenticatedRole, authUid } from 'drizzle-orm/supabase';
import { profiles } from './profiles.js';

const timestampMs = (name: string) => bigint(name, { mode: 'number' });

const ownRowPolicy = (userId: { name: string }) => [
  pgPolicy(`${userId.name}_authenticated_own_rows`, {
    for: 'all',
    to: authenticatedRole,
    using: sql`${userId} = ${authUid}`,
    withCheck: sql`${userId} = ${authUid}`,
  }),
];

export const projects = pgTable('projects', {
  id: text('id').primaryKey(),
  userId: uuid('user_id').notNull().references(() => profiles.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  skillId: text('skill_id'),
  designSystemId: text('design_system_id'),
  pendingPrompt: text('pending_prompt'),
  metadataJson: text('metadata_json'),
  appliedPluginSnapshotId: text('applied_plugin_snapshot_id'),
  customInstructions: text('custom_instructions'),
  createdAt: timestampMs('created_at').notNull(),
  updatedAt: timestampMs('updated_at').notNull(),
}, (table) => [
  index('idx_projects_user_updated').on(table.userId, table.updatedAt),
  ...ownRowPolicy(table.userId),
]).enableRLS();

export const templates = pgTable('templates', {
  id: text('id').primaryKey(),
  userId: uuid('user_id').notNull().references(() => profiles.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  description: text('description'),
  sourceProjectId: text('source_project_id').references(() => projects.id, { onDelete: 'set null' }),
  filesJson: text('files_json').notNull(),
  createdAt: timestampMs('created_at').notNull(),
}, (table) => [
  index('idx_templates_user_created').on(table.userId, table.createdAt),
  ...ownRowPolicy(table.userId),
]).enableRLS();

export const conversations = pgTable('conversations', {
  id: text('id').primaryKey(),
  userId: uuid('user_id').notNull().references(() => profiles.id, { onDelete: 'cascade' }),
  projectId: text('project_id').notNull().references(() => projects.id, { onDelete: 'cascade' }),
  title: text('title'),
  appliedPluginSnapshotId: text('applied_plugin_snapshot_id'),
  createdAt: timestampMs('created_at').notNull(),
  updatedAt: timestampMs('updated_at').notNull(),
}, (table) => [
  index('idx_conv_project').on(table.projectId, table.updatedAt),
  index('idx_conv_user_updated').on(table.userId, table.updatedAt),
  ...ownRowPolicy(table.userId),
]).enableRLS();

export const messages = pgTable('messages', {
  id: text('id').primaryKey(),
  userId: uuid('user_id').notNull().references(() => profiles.id, { onDelete: 'cascade' }),
  conversationId: text('conversation_id').notNull().references(() => conversations.id, { onDelete: 'cascade' }),
  role: text('role').notNull(),
  content: text('content').notNull(),
  agentId: text('agent_id'),
  agentName: text('agent_name'),
  runId: text('run_id'),
  runStatus: text('run_status'),
  lastRunEventId: text('last_run_event_id'),
  eventsJson: text('events_json'),
  attachmentsJson: text('attachments_json'),
  commentAttachmentsJson: text('comment_attachments_json'),
  producedFilesJson: text('produced_files_json'),
  feedbackJson: text('feedback_json'),
  startedAt: timestampMs('started_at'),
  endedAt: timestampMs('ended_at'),
  position: integer('position').notNull(),
  createdAt: timestampMs('created_at').notNull(),
}, (table) => [
  index('idx_messages_conv').on(table.conversationId, table.position),
  index('idx_messages_user_created').on(table.userId, table.createdAt),
  ...ownRowPolicy(table.userId),
]).enableRLS();

export const previewComments = pgTable('preview_comments', {
  id: text('id').primaryKey(),
  userId: uuid('user_id').notNull().references(() => profiles.id, { onDelete: 'cascade' }),
  projectId: text('project_id').notNull().references(() => projects.id, { onDelete: 'cascade' }),
  conversationId: text('conversation_id').notNull().references(() => conversations.id, { onDelete: 'cascade' }),
  filePath: text('file_path').notNull(),
  elementId: text('element_id').notNull(),
  selector: text('selector').notNull(),
  label: text('label').notNull(),
  text: text('text').notNull(),
  positionJson: text('position_json').notNull(),
  htmlHint: text('html_hint').notNull(),
  selectionKind: text('selection_kind'),
  memberCount: integer('member_count'),
  podMembersJson: text('pod_members_json'),
  note: text('note').notNull(),
  status: text('status').notNull(),
  createdAt: timestampMs('created_at').notNull(),
  updatedAt: timestampMs('updated_at').notNull(),
}, (table) => [
  uniqueIndex('idx_preview_comments_unique_target')
    .on(table.projectId, table.conversationId, table.filePath, table.elementId),
  index('idx_preview_comments_conversation').on(table.projectId, table.conversationId, table.updatedAt),
  ...ownRowPolicy(table.userId),
]).enableRLS();

export const tabs = pgTable('tabs', {
  userId: uuid('user_id').notNull().references(() => profiles.id, { onDelete: 'cascade' }),
  projectId: text('project_id').notNull().references(() => projects.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  position: integer('position').notNull(),
  isActive: boolean('is_active').notNull().default(false),
}, (table) => [
  primaryKey({ columns: [table.projectId, table.name] }),
  index('idx_tabs_project').on(table.projectId, table.position),
  ...ownRowPolicy(table.userId),
]).enableRLS();

export const deployments = pgTable('deployments', {
  id: text('id').primaryKey(),
  userId: uuid('user_id').notNull().references(() => profiles.id, { onDelete: 'cascade' }),
  projectId: text('project_id').notNull().references(() => projects.id, { onDelete: 'cascade' }),
  fileName: text('file_name').notNull(),
  providerId: text('provider_id').notNull(),
  url: text('url').notNull(),
  deploymentId: text('deployment_id'),
  deploymentCount: integer('deployment_count').notNull().default(1),
  target: text('target').notNull().default('preview'),
  status: text('status').notNull().default('ready'),
  statusMessage: text('status_message'),
  reachableAt: timestampMs('reachable_at'),
  providerMetadataJson: text('provider_metadata_json'),
  createdAt: timestampMs('created_at').notNull(),
  updatedAt: timestampMs('updated_at').notNull(),
}, (table) => [
  uniqueIndex('idx_deployments_unique_provider').on(table.projectId, table.fileName, table.providerId),
  index('idx_deployments_project').on(table.projectId, table.updatedAt),
  ...ownRowPolicy(table.userId),
]).enableRLS();

export const routines = pgTable('routines', {
  id: text('id').primaryKey(),
  userId: uuid('user_id').notNull().references(() => profiles.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  prompt: text('prompt').notNull(),
  scheduleKind: text('schedule_kind').notNull(),
  scheduleValue: text('schedule_value').notNull(),
  scheduleJson: text('schedule_json'),
  projectMode: text('project_mode').notNull(),
  projectId: text('project_id').references(() => projects.id, { onDelete: 'set null' }),
  skillId: text('skill_id'),
  agentId: text('agent_id'),
  enabled: boolean('enabled').notNull().default(true),
  createdAt: timestampMs('created_at').notNull(),
  updatedAt: timestampMs('updated_at').notNull(),
}, (table) => [
  index('idx_routines_user_created').on(table.userId, table.createdAt),
  ...ownRowPolicy(table.userId),
]).enableRLS();

export const routineRuns = pgTable('routine_runs', {
  id: text('id').primaryKey(),
  userId: uuid('user_id').notNull().references(() => profiles.id, { onDelete: 'cascade' }),
  routineId: text('routine_id').notNull().references(() => routines.id, { onDelete: 'cascade' }),
  trigger: text('trigger').notNull(),
  status: text('status').notNull(),
  projectId: text('project_id').notNull().references(() => projects.id, { onDelete: 'cascade' }),
  conversationId: text('conversation_id').notNull().references(() => conversations.id, { onDelete: 'cascade' }),
  agentRunId: text('agent_run_id').notNull(),
  startedAt: timestampMs('started_at').notNull(),
  completedAt: timestampMs('completed_at'),
  summary: text('summary'),
  error: text('error'),
  errorCode: text('error_code'),
}, (table) => [
  index('idx_routine_runs_routine').on(table.routineId, table.startedAt),
  index('idx_routine_runs_user_started').on(table.userId, table.startedAt),
  ...ownRowPolicy(table.userId),
]).enableRLS();
