import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  created_at: string;
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
  created_at: string;
}

export interface Blog {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  cover_image: string;
  author_name: string;
  author_id: string | null;
  category_id: string | null;
  published: boolean;
  featured: boolean;
  view_count: number;
  published_at: string;
  created_at: string;
  updated_at: string;
  tags: string | Tag[];
  tags_list?: Tag[];
  category?: Category;
}
