import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

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
