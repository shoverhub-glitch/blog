import { supabase, Blog, Category, Tag } from '../lib/supabase';

const CACHE_DURATION = 5 * 60 * 1000;
const COUNT_MODE = 'planned' as const;

const cache = new Map<string, { data: unknown; timestamp: number }>();
const inFlightRequests = new Map<string, Promise<unknown>>();

interface SearchBlogsRpcPayload {
  total: number;
  blogs: Blog[];
}

const slugifyTag = (value: string): string => value
  .toLowerCase()
  .trim()
  .replace(/[^a-z0-9\s-]/g, '')
  .replace(/\s+/g, '-')
  .replace(/-+/g, '-');

const derivePopularTagsFromBlogs = async (limit: number): Promise<Tag[]> => {
  const { data, error } = await supabase
    .from('blogs')
    .select('tags')
    .eq('published', true)
    .not('tags', 'is', null)
    .neq('tags', '');

  if (error) throw error;

  const counts = new Map<string, number>();

  (data || []).forEach((row: { tags?: string }) => {
    if (!row.tags) return;
    row.tags
      .split(',')
      .map((tag) => tag.trim())
      .filter(Boolean)
      .forEach((tag) => {
        counts.set(tag, (counts.get(tag) || 0) + 1);
      });
  });

  const nowIso = new Date().toISOString();
  return Array.from(counts.entries())
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, limit)
    .map(([name]) => ({
      id: slugifyTag(name) || name,
      name,
      slug: slugifyTag(name) || name.toLowerCase(),
      created_at: nowIso,
    }));
};

const getCached = <T>(key: string): T | null => {
  const cached = cache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data as T;
  }
  return null;
};

const setCache = (key: string, data: unknown) => {
  cache.set(key, { data, timestamp: Date.now() });
};

const runWithDedup = <T>(requestKey: string, requestFn: () => Promise<T>): Promise<T> => {
  const pending = inFlightRequests.get(requestKey);
  if (pending) return pending as Promise<T>;

  const promise = requestFn().finally(() => {
    inFlightRequests.delete(requestKey);
  });

  inFlightRequests.set(requestKey, promise as Promise<unknown>);
  return promise;
};

export const blogService = {
  async getFeaturedBlogs(limit: number = 3): Promise<Blog[]> {
    const cacheKey = `featured-${limit}`;
    const cached = getCached<Blog[]>(cacheKey);
    if (cached) return cached;

    const requestKey = `req-${cacheKey}`;
    return runWithDedup(requestKey, async () => {
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
    });
  },

  async getTrendingBlogs(limit: number = 5): Promise<Blog[]> {
    const cacheKey = `trending-${limit}`;
    const cached = getCached<Blog[]>(cacheKey);
    if (cached) return cached;

    const requestKey = `req-${cacheKey}`;
    return runWithDedup(requestKey, async () => {
      const { data, error } = await supabase
        .from('blogs')
        .select(`
          id, title, slug, excerpt, cover_image, published_at, view_count,
          category:categories(id, name, slug)
        `)
        .eq('published', true)
        .order('view_count', { ascending: false })
        .limit(limit);

      if (error) throw error;
      const result = (data || []) as unknown as Blog[];
      setCache(cacheKey, result);
      return result;
    });
  },

  async getLatestBlogs(page: number = 1, limit: number = 12): Promise<{ blogs: Blog[], total: number }> {
    const cacheKey = `latest-${page}-${limit}`;
    const cached = getCached<{ blogs: Blog[]; total: number }>(cacheKey);
    if (cached) return cached;

    const requestKey = `req-${cacheKey}`;
    return runWithDedup(requestKey, async () => {
      const from = (page - 1) * limit;
      const to = from + limit - 1;

      const { data, error, count } = await supabase
        .from('blogs')
        .select(`
          id, title, slug, excerpt, cover_image, published_at, view_count,
          category:categories(id, name, slug)
        `, { count: COUNT_MODE })
        .eq('published', true)
        .order('published_at', { ascending: false })
        .range(from, to);

      if (error) throw error;
      const result = { blogs: (data || []) as unknown as Blog[], total: count || 0 };
      setCache(cacheKey, result);
      return result;
    });
  },

  async getBlogBySlug(slug: string): Promise<Blog | null> {
    const requestKey = `req-blog-slug-${slug}`;
    return runWithDedup(requestKey, async () => {
      const { data, error } = await supabase
        .from('blogs')
        .select(`
          *,
          category:categories(*)
        `)
        .eq('slug', slug)
        .eq('published', true)
        .maybeSingle();

      if (error) throw error;
      return data as Blog | null;
    });
  },

  async incrementViewCount(blogId: string): Promise<void> {
    await supabase.rpc('increment_view_count', { blog_id: blogId });
  },

  async searchBlogs(query: string, page: number = 1, limit: number = 12): Promise<{ blogs: Blog[], total: number }> {
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const sanitizedQuery = query.replace(/[%_]/g, '\\$&').trim();
    if (!sanitizedQuery) {
      return { blogs: [], total: 0 };
    }

    const requestKey = `req-search-${sanitizedQuery}-${page}-${limit}`;
    return runWithDedup(requestKey, async () => {
      const { data: rpcData, error: rpcError } = await supabase.rpc('search_blogs', {
        p_query: sanitizedQuery,
        p_limit: limit,
        p_offset: from,
      });

      if (!rpcError && rpcData) {
        const payload = rpcData as SearchBlogsRpcPayload;
        return {
          blogs: Array.isArray(payload.blogs) ? payload.blogs : [],
          total: Number(payload.total) || 0,
        };
      }

      const isMissingFunction = (rpcError?.message || '').toLowerCase().includes('search_blogs');
      if (rpcError && !isMissingFunction) {
        throw rpcError;
      }

      const searchPattern = `%${sanitizedQuery}%`;

      const { data, error, count } = await supabase
        .from('blogs')
        .select(`
          id, title, slug, excerpt, cover_image, published_at, view_count,
          category:categories(id, name, slug)
        `, { count: COUNT_MODE })
        .eq('published', true)
        .or(`title.ilike.${searchPattern},excerpt.ilike.${searchPattern}`)
        .order('published_at', { ascending: false })
        .range(from, to);

      if (error) throw error;
      return { blogs: (data || []) as unknown as Blog[], total: count || 0 };
    });
  },

  async getBlogsByCategory(categorySlug: string, page: number = 1, limit: number = 12): Promise<{ blogs: Blog[], total: number }> {
    const cacheKey = `category-${categorySlug}-${page}-${limit}`;
    const cached = getCached<{ blogs: Blog[]; total: number }>(cacheKey);
    if (cached) return cached;

    const requestKey = `req-${cacheKey}`;
    return runWithDedup(requestKey, async () => {
      const from = (page - 1) * limit;
      const to = from + limit - 1;

      const { data: category } = await supabase
        .from('categories')
        .select('id')
        .eq('slug', categorySlug)
        .maybeSingle();

      if (!category) {
        const emptyResult = { blogs: [], total: 0 };
        setCache(cacheKey, emptyResult);
        return emptyResult;
      }

      const { data, error, count } = await supabase
        .from('blogs')
        .select(`
          id, title, slug, excerpt, cover_image, published_at, view_count,
          category:categories(id, name, slug)
        `, { count: COUNT_MODE })
        .eq('published', true)
        .eq('category_id', category.id)
        .order('published_at', { ascending: false })
        .range(from, to);

      if (error) throw error;
      const result = { blogs: (data || []) as unknown as Blog[], total: count || 0 };
      setCache(cacheKey, result);
      return result;
    });
  },

  async getRelatedBlogs(blogId: string, categoryId: string | null, limit: number = 3): Promise<Blog[]> {
    const requestKey = `req-related-${blogId}-${categoryId || 'none'}-${limit}`;
    return runWithDedup(requestKey, async () => {
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
    });
  },

  async getAllCategories(): Promise<Category[]> {
    const cacheKey = 'categories-all';
    const cached = getCached<Category[]>(cacheKey);
    if (cached) return cached;

    const requestKey = `req-${cacheKey}`;
    return runWithDedup(requestKey, async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('id, name, slug, description, created_at')
        .order('name');

      if (error) throw error;
      const result = (data || []) as unknown as Category[];
      setCache(cacheKey, result);
      return result;
    });
  },

  async getAllTags(): Promise<Tag[]> {
    const cacheKey = 'tags-all';
    const cached = getCached<Tag[]>(cacheKey);
    if (cached) return cached;

    const requestKey = `req-${cacheKey}`;
    return runWithDedup(requestKey, async () => {
      const result = await derivePopularTagsFromBlogs(100);
      setCache(cacheKey, result);
      return result;
    });
  },

  async getPopularTags(limit: number = 10): Promise<Tag[]> {
    const cacheKey = `tags-popular-${limit}`;
    const cached = getCached<Tag[]>(cacheKey);
    if (cached) return cached;

    const requestKey = `req-${cacheKey}`;
    return runWithDedup(requestKey, async () => {
      const result = await derivePopularTagsFromBlogs(limit);
      setCache(cacheKey, result);
      return result;
    });
  },

  clearCache() {
    cache.clear();
    inFlightRequests.clear();
  },
};
