import { supabase } from './supabase';
import type { User } from '@supabase/supabase-js';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: string;
}

export async function signIn(email: string, password: string): Promise<AuthUser> {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    throw error;
  }
  return mapUser(data.user);
}

export async function signOut(): Promise<void> {
  await supabase.auth.signOut();
}

export async function getSession(): Promise<AuthUser | null> {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session?.user) {
    return null;
  }
  return mapUser(session.user);
}

export async function requireAuth(): Promise<AuthUser> {
  const user = await getSession();
  if (!user) {
    throw new Error('NO_AUTH');
  }
  return user;
}

export function onAuthChange(callback: (user: AuthUser | null) => void): () => void {
  const { data } = supabase.auth.onAuthStateChange((_event, session) => {
    callback(session?.user ? mapUser(session.user) : null);
  });
  return () => data.subscription.unsubscribe();
}

function mapUser(user: User): AuthUser {
  const metadata = user.user_metadata ?? {};
  return {
    id: user.id,
    email: user.email ?? '',
    name: metadata.name ?? 'Admin',
    role: metadata.role ?? 'user',
  };
}

/**
 * Obtiene la URL de login absoluta respetando el base path de Astro.
 * Necesario para redirects desde client-side.
 */
export function getLoginUrl(): string {
  const raw = import.meta.env.BASE_URL ?? '/';
  const base = raw.endsWith('/') ? raw : raw + '/';
  return `${base}admin/login`;
}
