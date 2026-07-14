import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Faltan variables de entorno VITE_SUPABASE_URL y/o VITE_SUPABASE_ANON_KEY. ' +
      'Copia .env.example a .env y ajusta los valores.'
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
  // Deshabilitar realtime en Node (build SSR) para evitar error de WebSocket
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
});

// ============================================================
// Tipos
// ============================================================
export interface Article {
  id: number;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  featured_image: string | null;
  tags: string | null;
  is_published: boolean;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface ContactMessage {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  country: string | null;
  message: string;
  is_read: boolean;
  created_at: string;
  updated_at: string;
}

export interface SiteConfig {
  id: number;
  key: string;
  value: string | null;
  created_at: string;
  updated_at: string;
}

export type SiteConfigMap = Record<string, string>;

export interface ArticleInput {
  title: string;
  excerpt?: string | null;
  content: string;
  featured_image?: string | null;
  tags?: string | null;
  is_published: boolean;
}

export interface ContactMessageInput {
  name: string;
  email: string;
  phone?: string | null;
  country?: string | null;
  message: string;
}

export interface Link {
  id: number;
  title: string;
  url: string;
  icon: string | null;
  description: string | null;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface LinkInput {
  title: string;
  url: string;
  icon?: string | null;
  description?: string | null;
  sort_order: number;
  is_active: boolean;
}
