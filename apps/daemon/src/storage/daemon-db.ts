export type DaemonDbKind = 'sqlite' | 'postgres';

export interface DaemonDbConfig {
  kind: DaemonDbKind;
  postgres?: {
    connectionString: string;
    host:     string;
    port:     number;
    database: string;
    user:     string;
    sslMode?: 'disable' | 'require' | 'verify-full';
  };
  supabase?: {
    url:            string;
    anonKey:        string;
    serviceRoleKey: string;
  };
}

export class DaemonDbConfigError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'DaemonDbConfigError';
  }
}

export function resolveDaemonDbConfig(env?: Record<string, string | undefined>): DaemonDbConfig {
  const e = env ?? process.env;
  const kind = (e.OD_DAEMON_DB ?? (e.DATABASE_URL ? 'postgres' : 'sqlite')).trim().toLowerCase();
  if (kind === 'postgres') {
    const connectionString = e.DATABASE_URL ?? '';
    const parsed = parsePostgresConnectionString(connectionString);
    const host = e.OD_PG_HOST ?? parsed?.host ?? '';
    const portStr = e.OD_PG_PORT ?? (parsed?.port ? String(parsed.port) : '5432');
    const database = e.OD_PG_DATABASE ?? parsed?.database ?? '';
    const user = e.OD_PG_USER ?? parsed?.user ?? '';
    const sslMode = e.OD_PG_SSL_MODE === 'disable' || e.OD_PG_SSL_MODE === 'verify-full'
      ? e.OD_PG_SSL_MODE
      : 'require';
    const supabaseUrl = e.SUPABASE_URL ?? '';
    const supabaseAnonKey = e.SUPABASE_ANON_KEY ?? '';
    const supabaseServiceRoleKey = e.SUPABASE_SERVICE_ROLE_KEY ?? '';
    if (!connectionString || !host || !database || !user) {
      throw new DaemonDbConfigError(
        'OD_DAEMON_DB=postgres requires DATABASE_URL. OD_PG_HOST, OD_PG_DATABASE, and OD_PG_USER may override values parsed from DATABASE_URL. ' +
        'OD_PG_PORT defaults to 5432; OD_PG_SSL_MODE defaults to "require".',
      );
    }
    if (!supabaseUrl || !supabaseAnonKey || !supabaseServiceRoleKey) {
      throw new DaemonDbConfigError(
        'OD_DAEMON_DB=postgres requires SUPABASE_URL, SUPABASE_ANON_KEY, and SUPABASE_SERVICE_ROLE_KEY.',
      );
    }
    return {
      kind: 'postgres',
      postgres: {
        connectionString,
        host,
        port:     Number.parseInt(portStr, 10) || 5432,
        database,
        user,
        sslMode,
      },
      supabase: {
        url:            supabaseUrl,
        anonKey:        supabaseAnonKey,
        serviceRoleKey: supabaseServiceRoleKey,
      },
    };
  }
  if (kind !== 'sqlite' && kind !== '') {
    throw new DaemonDbConfigError(
      `unknown OD_DAEMON_DB value '${kind}'. Accepted: 'sqlite' (default), 'postgres'.`,
    );
  }
  return { kind: 'sqlite' };
}

function parsePostgresConnectionString(value: string) {
  if (!value) return null;
  try {
    const url = new URL(value);
    return {
      host:     url.hostname,
      port:     url.port ? Number.parseInt(url.port, 10) : undefined,
      database: url.pathname.replace(/^\/+/, ''),
      user:     decodeURIComponent(url.username),
    };
  } catch {
    return null;
  }
}
