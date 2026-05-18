import { createClient, type SupabaseClient, type User } from '@supabase/supabase-js';
import type { RequestHandler } from 'express';
import type { UserRole } from '@open-design/contracts';
import { isUserRole } from '@open-design/contracts';
import type { DaemonDbConfig } from './storage/daemon-db.js';

export interface AuthenticatedRequestUser {
  id: string;
  email: string;
  role: UserRole;
  accessToken: string;
}

export interface SupabaseAuthContext {
  client: SupabaseClient;
  requireAuth: RequestHandler;
  requireRole: (role: UserRole) => RequestHandler;
}

export function bearerTokenFromAuthorizationHeader(header: unknown): string | null {
  if (typeof header !== 'string') return null;
  const match = /^Bearer\s+(.+)$/i.exec(header.trim());
  return match?.[1] ?? null;
}

export function createSupabaseAuthContext(config: DaemonDbConfig): SupabaseAuthContext | null {
  if (config.kind !== 'postgres' || !config.supabase) return null;
  const client = createClient(config.supabase.url, config.supabase.serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
  return {
    client,
    requireAuth: createRequireAuthMiddleware(client),
    requireRole: (role) => createRequireRoleMiddleware(role),
  };
}

function createRequireAuthMiddleware(client: SupabaseClient): RequestHandler {
  return async (req, res, next) => {
    const token = bearerTokenFromAuthorizationHeader(req.get('authorization'));
    if (!token) {
      res.status(401).json({
        error: { code: 'AUTH_REQUIRED', message: 'Authorization: Bearer <Supabase access token> required' },
      });
      return;
    }
    const { data, error } = await client.auth.getUser(token);
    if (error || !data.user) {
      res.status(401).json({
        error: { code: 'AUTH_INVALID', message: 'Supabase access token is invalid or expired' },
      });
      return;
    }
    const role = await resolveUserRole(client, data.user);
    (req as { user?: AuthenticatedRequestUser }).user = {
      id: data.user.id,
      email: data.user.email ?? '',
      role,
      accessToken: token,
    };
    next();
  };
}

function createRequireRoleMiddleware(role: UserRole): RequestHandler {
  return (req, res, next) => {
    const user = (req as { user?: AuthenticatedRequestUser }).user;
    if (!user) {
      res.status(401).json({
        error: { code: 'AUTH_REQUIRED', message: 'Authentication required' },
      });
      return;
    }
    if (user.role !== role) {
      res.status(403).json({
        error: { code: 'ROLE_REQUIRED', message: `${role} role required` },
      });
      return;
    }
    next();
  };
}

async function resolveUserRole(client: SupabaseClient, user: User): Promise<UserRole> {
  const metadataRole = user.app_metadata?.role ?? user.user_metadata?.role;
  if (isUserRole(metadataRole)) return metadataRole;
  const { data } = await client
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .maybeSingle();
  const profile = data as { role?: unknown } | null;
  return isUserRole(profile?.role) ? profile.role : 'user';
}
