import { createClient } from '@supabase/supabase-js';

const runtimeEnv = typeof import.meta !== 'undefined' ? import.meta.env ?? {} : {};
const processEnv = typeof process !== 'undefined' ? process.env ?? {} : {};

const disableSupabase = [
  processEnv.DISABLE_SUPABASE,
  processEnv.SUPABASE_DISABLED,
  processEnv.VITE_DISABLE_SUPABASE,
  runtimeEnv.VITE_DISABLE_SUPABASE,
  runtimeEnv.DISABLE_SUPABASE,
].some(value => String(value).toLowerCase() === 'true');

const supabaseUrl = String(
  processEnv.SUPABASE_URL ||
  processEnv.VITE_SUPABASE_URL ||
  runtimeEnv.VITE_SUPABASE_URL ||
  runtimeEnv.SUPABASE_URL ||
  ''
).trim();

const supabaseAnonKey = String(
  processEnv.SUPABASE_ANON_KEY ||
  processEnv.VITE_SUPABASE_ANON_KEY ||
  runtimeEnv.VITE_SUPABASE_ANON_KEY ||
  runtimeEnv.SUPABASE_ANON_KEY ||
  ''
).trim();

const hasSupabaseConfig = Boolean(supabaseUrl && supabaseAnonKey);
const shouldUseSupabase = !disableSupabase && hasSupabaseConfig;

if (!shouldUseSupabase) {
  console.warn('[supabase] Supabase is disabled or unavailable. Falling back to a no-op client.');
}

// If env vars are missing, provide a noop/mock Supabase client to allow local dev to continue.
function createNoopQueryBuilder() {
  const result = { data: null, error: null };
  const builder: Record<string, any> = {
    then: (resolve: (value: typeof result) => unknown) => Promise.resolve(result).then(resolve),
    catch: (onRejected: (reason?: unknown) => unknown) => Promise.resolve(result).catch(onRejected),
    finally: (onFinally: () => void) => Promise.resolve(result).finally(onFinally),
    select: () => builder,
    insert: () => builder,
    update: () => builder,
    upsert: () => builder,
    delete: () => builder,
    eq: () => builder,
    order: () => builder,
    limit: () => builder,
    in: () => builder,
    or: () => builder,
    match: () => builder,
    filter: () => builder,
    contains: () => builder,
    maybeSingle: async () => result,
    single: async () => result,
    csv: () => builder,
    textSearch: () => builder,
    ilike: () => builder,
    like: () => builder,
    neq: () => builder,
    gt: () => builder,
    gte: () => builder,
    lt: () => builder,
    lte: () => builder,
    is: () => builder,
    not: () => builder,
    range: () => builder,
    with: () => builder,
    onConflict: () => builder,
  };

  return new Proxy(builder, {
    get(target, prop) {
      if (prop === 'then') return target.then;
      if (prop === 'catch') return target.catch;
      if (prop === 'finally') return target.finally;
      if (prop in target) return target[prop];
      return (..._args: unknown[]) => builder;
    },
  });
}

function createNoopClient() {
  const auth = {
    getSession: async () => ({ data: { session: null }, error: null }),
    getSessionFromUrl: async () => ({ data: { session: null }, error: null }),
    getUser: async () => ({ data: { user: null }, error: null }),
    signInWithPassword: async () => ({ data: { user: null, session: null }, error: null }),
    signUp: async () => ({ data: { user: null, session: null }, error: null }),
    signOut: async () => ({ error: null }),
    resetPasswordForEmail: async () => ({ error: null }),
    updateUser: async () => ({ data: { user: null }, error: null }),
    onAuthStateChange: () => ({ data: { subscription: null }, error: null }),
  };

  const storage = {
    from: () => createNoopQueryBuilder(),
  };

  const handler = {
    get(_target, prop) {
      if (prop === 'then') return undefined;
      if (prop === 'auth') return auth;
      if (prop === 'storage') return storage;
      if (prop === 'rpc') return async () => ({ data: null, error: null });
      if (prop === 'from') return () => createNoopQueryBuilder();
      return createNoopQueryBuilder();
    },
    apply: () => Promise.resolve({ data: null, error: null }),
  };

  return new Proxy(async () => ({ data: null, error: null }), handler);
}

export const supabase = shouldUseSupabase ? createClient(supabaseUrl, supabaseAnonKey) : createNoopClient();

// lib/supabase.ts - Mettre à jour les types

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  image_url: string;
  author: string;
  category: string;
  tags: string[];
  is_featured: boolean;
  is_published: boolean;
  views: number;
  published_at: string;
  created_at: string;
  updated_at?: string;
  
  // Nouveaux champs SEO
  meta_title?: string;
  meta_description?: string;
  focus_keyword?: string;
  reading_time?: number;
  word_count?: number;
}

export interface BlogSEOMetrics {
  id: string;
  post_id: string;
  date: string;
  impressions: number;
  clicks: number;
  ctr: number;
  avg_position: number;
  created_at: string;
}

export interface SEOAnalysis {
  post_id: string;
  title: string;
  seo_score: number;
  stats: {
    title_length: number;
    description_length: number;
    word_count: number;
    reading_time: number;
    tags_count: number;
    has_image: boolean;
  };
  analysis: {
    issues: string[];
    warnings: string[];
    success: string[];
  };
  recommendations: string[];
}
export interface BlogCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  created_at: string;
}

export interface Atelier {
  id: string;
  title: string;
  slug: string;
  description: string;
  long_description: string;
  category: 'technologie' | 'business' | 'design' | 'marketing' | 'finance' | 'autre';
  image: string;
  date: string;
  time: string;
  duration: number;
  location: string;
  capacity: number;
  registered: number;
  language: 'Français' | 'Anglais' | 'Mixte';
  level: 'Débutant' | 'Intermédiaire' | 'Avancé';
  instructor: {
    name: string;
    title: string;
    image: string;
    bio: string;
  };
  objectives: string[];
  program: {
    time: string;
    title: string;
    description: string;
  }[];
  prerequisites: string[];
  materials: string[];
  price: number;
  tags: string[];
  is_online: boolean;
  meet_link?: string;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
}
