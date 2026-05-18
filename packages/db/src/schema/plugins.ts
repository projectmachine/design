import { sql } from 'drizzle-orm';
import {
  bigint,
  index,
  integer,
  pgPolicy,
  pgTable,
  text,
  uuid,
} from 'drizzle-orm/pg-core';
import { authenticatedRole, authUid } from 'drizzle-orm/supabase';
import { conversations, projects } from './core.js';
import { isAdminSql, profiles } from './profiles.js';

const timestampMs = (name: string) => bigint(name, { mode: 'number' });

const adminPolicy = (name: string) => pgPolicy(name, {
  for: 'all',
  to: authenticatedRole,
  using: isAdminSql,
  withCheck: isAdminSql,
});

const ownRowPolicy = (name: string, userId: { name: string }) => pgPolicy(name, {
  for: 'all',
  to: authenticatedRole,
  using: sql`${userId} = ${authUid}`,
  withCheck: sql`${userId} = ${authUid}`,
});

export const installedPlugins = pgTable('installed_plugins', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  version: text('version').notNull(),
  sourceKind: text('source_kind').notNull(),
  source: text('source').notNull(),
  pinnedRef: text('pinned_ref'),
  sourceDigest: text('source_digest'),
  sourceMarketplaceId: text('source_marketplace_id'),
  sourceMarketplaceEntryName: text('source_marketplace_entry_name'),
  sourceMarketplaceEntryVersion: text('source_marketplace_entry_version'),
  marketplaceTrust: text('marketplace_trust'),
  resolvedSource: text('resolved_source'),
  resolvedRef: text('resolved_ref'),
  archiveIntegrity: text('archive_integrity'),
  trust: text('trust').notNull(),
  capabilitiesGranted: text('capabilities_granted').notNull(),
  manifestJson: text('manifest_json').notNull(),
  fsPath: text('fs_path').notNull(),
  installedAt: timestampMs('installed_at').notNull(),
  updatedAt: timestampMs('updated_at').notNull(),
}, (table) => [
  index('idx_installed_plugins_source_kind').on(table.sourceKind),
  adminPolicy('installed_plugins_admin_all'),
]).enableRLS();

export const pluginMarketplaces = pgTable('plugin_marketplaces', {
  id: text('id').primaryKey(),
  url: text('url').notNull(),
  specVersion: text('spec_version').notNull().default('1.0.0'),
  version: text('version').notNull().default('0.0.0'),
  trust: text('trust').notNull(),
  manifestJson: text('manifest_json').notNull(),
  addedAt: timestampMs('added_at').notNull(),
  refreshedAt: timestampMs('refreshed_at').notNull(),
}, () => [
  adminPolicy('plugin_marketplaces_admin_all'),
]).enableRLS();

export const appliedPluginSnapshots = pgTable('applied_plugin_snapshots', {
  id: text('id').primaryKey(),
  userId: uuid('user_id').notNull().references(() => profiles.id, { onDelete: 'cascade' }),
  projectId: text('project_id').notNull().references(() => projects.id, { onDelete: 'cascade' }),
  conversationId: text('conversation_id').references(() => conversations.id, { onDelete: 'set null' }),
  runId: text('run_id'),
  pluginId: text('plugin_id').notNull(),
  pluginSpecVersion: text('plugin_spec_version').notNull().default('1.0.0'),
  pluginVersion: text('plugin_version').notNull(),
  manifestSourceDigest: text('manifest_source_digest').notNull(),
  sourceMarketplaceId: text('source_marketplace_id'),
  sourceMarketplaceEntryName: text('source_marketplace_entry_name'),
  sourceMarketplaceEntryVersion: text('source_marketplace_entry_version'),
  marketplaceTrust: text('marketplace_trust'),
  resolvedSource: text('resolved_source'),
  resolvedRef: text('resolved_ref'),
  archiveIntegrity: text('archive_integrity'),
  pinnedRef: text('pinned_ref'),
  taskKind: text('task_kind').notNull(),
  inputsJson: text('inputs_json').notNull(),
  resolvedContextJson: text('resolved_context_json').notNull(),
  pipelineJson: text('pipeline_json'),
  genuiSurfacesJson: text('genui_surfaces_json').notNull().default('[]'),
  capabilitiesGranted: text('capabilities_granted').notNull(),
  capabilitiesRequired: text('capabilities_required').notNull().default('[]'),
  assetsStagedJson: text('assets_staged_json').notNull(),
  connectorsRequiredJson: text('connectors_required_json').notNull().default('[]'),
  connectorsResolvedJson: text('connectors_resolved_json').notNull().default('[]'),
  mcpServersJson: text('mcp_servers_json').notNull().default('[]'),
  pluginTitle: text('plugin_title'),
  pluginDescription: text('plugin_description'),
  queryText: text('query_text'),
  status: text('status').notNull().default('fresh'),
  appliedAt: timestampMs('applied_at').notNull(),
  expiresAt: timestampMs('expires_at'),
}, (table) => [
  index('idx_snapshots_project').on(table.projectId),
  index('idx_snapshots_run').on(table.runId),
  index('idx_snapshots_plugin').on(table.pluginId, table.pluginVersion),
  ownRowPolicy('applied_plugin_snapshots_own_rows', table.userId),
]).enableRLS();

export const runDevloopIterations = pgTable('run_devloop_iterations', {
  id: text('id').primaryKey(),
  userId: uuid('user_id').notNull().references(() => profiles.id, { onDelete: 'cascade' }),
  runId: text('run_id').notNull(),
  stageId: text('stage_id').notNull(),
  iteration: integer('iteration').notNull(),
  artifactDiffSummary: text('artifact_diff_summary'),
  critiqueSummary: text('critique_summary'),
  tokensUsed: integer('tokens_used'),
  endedAt: timestampMs('ended_at').notNull(),
}, (table) => [
  index('idx_devloop_run').on(table.runId),
  index('idx_devloop_run_stage').on(table.runId, table.stageId),
  ownRowPolicy('run_devloop_iterations_own_rows', table.userId),
]).enableRLS();

export const genuiSurfaces = pgTable('genui_surfaces', {
  id: text('id').primaryKey(),
  userId: uuid('user_id').notNull().references(() => profiles.id, { onDelete: 'cascade' }),
  projectId: text('project_id').notNull().references(() => projects.id, { onDelete: 'cascade' }),
  conversationId: text('conversation_id').references(() => conversations.id, { onDelete: 'set null' }),
  runId: text('run_id'),
  pluginSnapshotId: text('plugin_snapshot_id').references(() => appliedPluginSnapshots.id, { onDelete: 'set null' }),
  surfaceId: text('surface_id').notNull(),
  kind: text('kind').notNull(),
  persist: text('persist').notNull(),
  schemaDigest: text('schema_digest'),
  valueJson: text('value_json'),
  status: text('status').notNull(),
  respondedBy: text('responded_by'),
  requestedAt: timestampMs('requested_at').notNull(),
  respondedAt: timestampMs('responded_at'),
  expiresAt: timestampMs('expires_at'),
}, (table) => [
  index('idx_genui_proj_surface').on(table.projectId, table.surfaceId),
  index('idx_genui_conv_surface').on(table.conversationId, table.surfaceId),
  index('idx_genui_run').on(table.runId),
  ownRowPolicy('genui_surfaces_own_rows', table.userId),
]).enableRLS();
