import { pgPolicy, pgTable, text, timestamp } from 'drizzle-orm/pg-core';
import { authenticatedRole } from 'drizzle-orm/supabase';
import { isAdminSql } from './profiles.js';

export const globalConfig = pgTable('global_config', {
  key: text('key').primaryKey(),
  value: text('value').notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
}, () => [
  pgPolicy('global_config_admin_all', {
    for: 'all',
    to: authenticatedRole,
    using: isAdminSql,
    withCheck: isAdminSql,
  }),
]).enableRLS();

export const usageEvents = pgTable('usage_events', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull(),
  providerId: text('provider_id'),
  model: text('model'),
  eventKind: text('event_kind').notNull(),
  quantity: text('quantity'),
  metadataJson: text('metadata_json'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
}, () => [
  pgPolicy('usage_events_admin_all', {
    for: 'all',
    to: authenticatedRole,
    using: isAdminSql,
    withCheck: isAdminSql,
  }),
]).enableRLS();
