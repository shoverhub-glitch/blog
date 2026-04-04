import { supabase, Blog, Category, Tag } from '../lib/supabase';

const CACHE_DURATION = 5 * 60 * 1000;

const cache = new Map<string, { data: any; timestamp: number }>();

const getCached = <T>(key: string): T | null => {
  const cached = cache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data as T;
  }
  return null;
};

const setCache = (key: string, data: any) => {
  cache.set(key, { data, timestamp: Date.now() });
};

export const blogService = {
  async getFeaturedBlogs(limit: number = 3): Promise<Blog[]> {
    const cacheKey = `featured-${limit}`;
    const cached = getCached<Blog[]>(cacheKey);
    if (cached) return cached;

    const { data, error } = await supabase
      .from('blogs')
      .select(`
        id, title, slug, excerpt, cover_image, published_at, view_count,
        category:categories(id, name, slug)
      `)
      .eq('published', true)
      .eq('featured', true)
      .order('published_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    const result = (data || []) as unknown as Blog[];
    setCache(cacheKey, result);
    return result;
  },

  async getLatestBlogs(page: number = 1, limit: number = 12): Promise<{ blogs: Blog[], total: number }> {
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const { data, error, count } = await supabase
      .from('blogs')
      .select(`
        id, title, slug, excerpt, cover_image, published_at, view_count,
        category:categories(id, name, slug)
      `, { count: 'exact' })
      .eq('published', true)
      .order('published_at', { ascending: false })
      .range(from, to);

    if (error) throw error;
    return { blogs: (data || []) as unknown as Blog[], total: count || 0 };
  },

  async getBlogBySlug(slug: string): Promise<Blog | null> {
    const { data, error } = await supabase
      .from('blogs')
      .select(`
        *,
        category:categories(*),
        blog_tags(tag:tags(*))
      `)
      .eq('slug', slug)
      .eq('published', true)
      .maybeSingle();

    if (error) throw error;

    if (data && data.blog_tags) {
      data.tags = data.blog_tags.map((bt: any) => bt.tag);
      delete data.blog_tags;
    }

    return data as Blog | null;
  },

  async incrementViewCount(blogId: string): Promise<void> {
    await supabase.rpc('increment_view_count', { blog_id: blogId });
  },

  async searchBlogs(query: string, page: number = 1, limit: number = 12): Promise<{ blogs: Blog[], total: number }> {
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const { data, error, count } = await supabase
      .from('blogs')
      .select(`
        id, title, slug, excerpt, cover_image, published_at, view_count,
        category:categories(id, name, slug)
      `, { count: 'exact' })
      .eq('published', true)
      .or(`title.ilike.%${query}%,excerpt.ilike.%${query}%`)
      .order('published_at', { ascending: false })
      .range(from, to);

    if (error) throw error;
    return { blogs: (data || []) as unknown as Blog[], total: count || 0 };
  },

  async getBlogsByCategory(categorySlug: string, page: number = 1, limit: number = 12): Promise<{ blogs: Blog[], total: number }> {
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const { data: category } = await supabase
      .from('categories')
      .select('id')
      .eq('slug', categorySlug)
      .maybeSingle();

    if (!category) return { blogs: [], total: 0 };

    const { data, error, count } = await supabase
      .from('blogs')
      .select(`
        id, title, slug, excerpt, cover_image, published_at, view_count,
        category:categories(id, name, slug)
      `, { count: 'exact' })
      .eq('published', true)
      .eq('category_id', category.id)
      .order('published_at', { ascending: false })
      .range(from, to);

    if (error) throw error;
    return { blogs: (data || []) as unknown as Blog[], total: count || 0 };
  },

  async getRelatedBlogs(blogId: string, categoryId: string | null, limit: number = 3): Promise<Blog[]> {
    let query = supabase
      .from('blogs')
      .select(`
        id, title, slug, excerpt, cover_image, published_at, view_count,
        category:categories(id, name, slug)
      `)
      .eq('published', true)
      .neq('id', blogId)
      .limit(limit);

    if (categoryId) {
      query = query.eq('category_id', categoryId);
    }

    const { data, error } = await query.order('published_at', { ascending: false });

    if (error) throw error;
    return (data || []) as unknown as Blog[];
  },

  async getAllCategories(): Promise<Category[]> {
    const cacheKey = 'categories-all';
    const cached = getCached<Category[]>(cacheKey);
    if (cached) return cached;

    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name');

    if (error) throw error;
    const result = (data || []) as unknown as Category[];
    setCache(cacheKey, result);
    return result;
  },

  async getAllTags(): Promise<Tag[]> {
    const { data, error } = await supabase
      .from('tags')
      .select('*')
      .order('name');

    if (error) throw error;
    return (data || []) as unknown as Tag[];
  },

  clearCache() {
    cache.clear();
  },
};
