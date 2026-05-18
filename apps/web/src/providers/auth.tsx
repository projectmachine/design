import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { AuthUser, UserRole } from '@open-design/contracts';
import { getSupabaseClient, isSupabaseAuthConfigured } from './supabase';

interface AuthContextValue {
  configured: boolean;
  loading: boolean;
  user: AuthUser | null;
  role: UserRole | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const configured = isSupabaseAuthConfigured();
  const supabase = useMemo(() => getSupabaseClient(), []);
  const [loading, setLoading] = useState(configured);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    if (!configured || !supabase) {
      setLoading(false);
      return;
    }
    let mounted = true;
    void supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return;
      const session = data.session;
      setAccessToken(session?.access_token ?? null);
      setUser(session?.user ? authUserFromSupabase(session.user) : null);
      setLoading(false);
    });
    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      setAccessToken(session?.access_token ?? null);
      setUser(session?.user ? authUserFromSupabase(session.user) : null);
      setLoading(false);
    });
    return () => {
      mounted = false;
      data.subscription.unsubscribe();
    };
  }, [configured, supabase]);

  useEffect(() => {
    if (!configured) return;
    const originalFetch = window.fetch.bind(window);
    window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
      const url = typeof input === 'string'
        ? input
        : input instanceof URL
          ? input.toString()
          : input.url;
      if (!url.startsWith('/api/') || !accessToken) return originalFetch(input, init);
      const headers = new Headers(init?.headers);
      if (!headers.has('authorization')) {
        headers.set('authorization', `Bearer ${accessToken}`);
      }
      return originalFetch(input, { ...init, headers });
    };
    return () => {
      window.fetch = originalFetch;
    };
  }, [accessToken, configured]);

  const signIn = useCallback(async (email: string, password: string) => {
    if (!supabase) throw new Error('Supabase auth is not configured');
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
  }, [supabase]);

  const signUp = useCallback(async (email: string, password: string) => {
    if (!supabase) throw new Error('Supabase auth is not configured');
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) throw error;
  }, [supabase]);

  const signOut = useCallback(async () => {
    if (!supabase) return;
    await supabase.auth.signOut();
  }, [supabase]);

  const value: AuthContextValue = {
    configured,
    loading,
    user,
    role: user?.role ?? null,
    signIn,
    signUp,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const value = useContext(AuthContext);
  if (!value) throw new Error('useAuth must be used inside AuthProvider');
  return value;
}

function authUserFromSupabase(user: {
  id: string;
  email?: string;
  created_at?: string;
  app_metadata?: Record<string, unknown>;
  user_metadata?: Record<string, unknown>;
}): AuthUser {
  const role = roleFromMetadata(user.app_metadata?.role) ?? roleFromMetadata(user.user_metadata?.role) ?? 'user';
  return {
    id: user.id,
    email: user.email ?? '',
    role,
    createdAt: user.created_at ?? new Date().toISOString(),
    displayName: typeof user.user_metadata?.display_name === 'string'
      ? user.user_metadata.display_name
      : null,
  };
}

function roleFromMetadata(value: unknown): UserRole | null {
  return value === 'admin' || value === 'user' ? value : null;
}
