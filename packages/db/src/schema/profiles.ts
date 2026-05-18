import { sql } from 'drizzle-orm';
import { pgPolicy, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { authenticatedRole, authUid, authUsers } from 'drizzle-orm/supabase';

export const userRoles = ['admin', 'user'] as const;
export type UserRole = (typeof userRoles)[number];

export const profiles = pgTable('profiles', {
  id: uuid('id')
    .primaryKey()
    .references(() => authUsers.id, { onDelete: 'cascade' }),
  role: text('role', { enum: userRoles }).notNull().default('user'),
  displayName: text('display_name'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  pgPolicy('profiles_select_own', {
    for: 'select',
    to: authenticatedRole,
    using: sql`${table.id} = ${authUid}`,
  }),
  pgPolicy('profiles_update_own', {
    for: 'update',
    to: authenticatedRole,
    using: sql`${table.id} = ${authUid}`,
    withCheck: sql`${table.id} = ${authUid}`,
  }),
]).enableRLS();

export const isAdminSql = sql`EXISTS (
  SELECT 1 FROM profiles
  WHERE profiles.id = ${authUid}
    AND profiles.role = 'admin'
)`;
