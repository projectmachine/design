import { sql, type SQL } from 'drizzle-orm';
import { drizzle, type PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import postgres, { type Sql } from 'postgres';
import * as schema from './schema/index.js';

export type OpenDesignDb = PostgresJsDatabase<typeof schema>;
export type OpenDesignSqlClient = Sql;

export interface CreateOpenDesignDbOptions {
  databaseUrl: string;
  prepare?: boolean;
  max?: number;
}

export interface SupabaseTokenClaims {
  iss?: string;
  sub?: string;
  aud?: string[] | string;
  exp?: number;
  nbf?: number;
  iat?: number;
  jti?: string;
  role?: string;
  [claim: string]: unknown;
}

export function createOpenDesignSqlClient(options: CreateOpenDesignDbOptions): OpenDesignSqlClient {
  return postgres(options.databaseUrl, {
    max: options.max ?? 10,
    // Supabase transaction pooler requires prepared statements to be disabled.
    prepare: options.prepare ?? false,
  });
}

export function createOpenDesignDb(client: OpenDesignSqlClient): OpenDesignDb {
  return drizzle(client, { schema });
}

export function createOpenDesignDbFromUrl(options: CreateOpenDesignDbOptions): {
  client: OpenDesignSqlClient;
  db: OpenDesignDb;
} {
  const client = createOpenDesignSqlClient(options);
  return {
    client,
    db: createOpenDesignDb(client),
  };
}

function claimsSql(token: SupabaseTokenClaims): SQL {
  return sql.raw(JSON.stringify(token).replaceAll("'", "''"));
}

function claimSql(value: unknown): SQL {
  return sql.raw(String(value ?? '').replaceAll("'", "''"));
}

export async function withSupabaseRls<T>(
  db: OpenDesignDb,
  token: SupabaseTokenClaims,
  operation: (tx: OpenDesignDb) => Promise<T>,
): Promise<T> {
  return db.transaction(async (tx) => {
    await tx.execute(sql`
      SELECT set_config('request.jwt.claims', '${claimsSql(token)}', TRUE);
      SELECT set_config('request.jwt.claim.sub', '${claimSql(token.sub)}', TRUE);
      SET LOCAL ROLE ${sql.raw(token.role === 'service_role' ? 'service_role' : 'authenticated')};
    `);
    try {
      return await operation(tx as OpenDesignDb);
    } finally {
      await tx.execute(sql`
        SELECT set_config('request.jwt.claims', NULL, TRUE);
        SELECT set_config('request.jwt.claim.sub', NULL, TRUE);
        RESET ROLE;
      `);
    }
  });
}
