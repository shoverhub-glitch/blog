import { supabase, Blog, Category, Tag } from '../../lib/supabase';
import { imageService } from './imageService';

const COUNT_MODE = 'planned' as const;

const slugifyTag = (value: string): string => value
  .toLowerCase()
  .trim()
  .replace(/\s+/g, '-')
  .replace(/[^\w-]/g, '');

const uniqueNormalizedTags = (tags: string[]): string[] => {
  const seen = new Set<string>();
  const result: string[] = [];

  for (const tag of tags) {
    const normalized = tag.trim();
    if (!normalized) continue;
    const key = normalized.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    result.push(normalized);
  }

  return result;
};

const normalizeTagsString = (tags?: string): string => {
  if (!tags) return '';
  const unique = uniqueNormalizedTags(tags.split(',').map((t) => t.trim()));
  return unique.join(', ');
};

export interface BlogFormData {
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  cover_image: string;
  category_id: string | null;
  published: boolean;
  published_at?: string | null;
  featured: boolean;
  tags?: string;
  scheduled_at?: string | null;
  draft_preview_slug?: string;
}

export const adminBlogService = {
  async createBlog(data: BlogFormData): Promise<Blog> {
    try {
      const tagsString = normalizeTagsString(data.tags);
      
      const blogData = {
        title: data.title,
        slug: data.slug,
        content: data.content,
        excerpt: data.excerpt,
        cover_image: data.cover_image,
        category_id: data.category_id,
        published: data.published,
        featured: data.featured,
        author_name: 'ShoverHub Team',
        view_count: 0,
        tags: tagsString,
        published_at: data.published ? data.published_at || new Date().toISOString() : null,
      };

      const { data: blog, error } = await supabase
        .from('blogs')
        .insert(blogData)
        .select()
        .single();

      if (error) throw error;

      return blog;
    } catch (err) {
      console.error('Create blog error:', err);
      throw err;
    }
  },

  async updateBlog(blogId: string, data: Partial<BlogFormData>): Promise<Blog> {
    try {
      const tagsString = data.tags;

      const updateData: Record<string, unknown> = {
        ...data,
        ...(data?.published === true && !data?.published_at
          ? { published_at: new Date().toISOString() }
          : {}),
        updated_at: new Date().toISOString(),
      };

      if (tagsString !== undefined) {
        updateData.tags = normalizeTagsString(tagsString);
      }

      const { data: blog, error } = await supabase
        .from('blogs')
        .update(updateData)
        .eq('id', blogId)
        .select()
        .single();

      if (error) throw error;

      return blog;
    } catch (error) {
      console.error('Failed to update blog:', error);
      throw error;
    }
  },

  async getBlogById(blogId: string): Promise<Blog | null> {
    try {
      const { data, error } = await supabase
        .from('blogs')
        .select(`
          *,
          category:categories(*)
        `)
        .eq('id', blogId)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        const tags = uniqueNormalizedTags((data.tags || '').split(',').map((t: string) => t.trim()));
        data.tags_list = tags.map((name) => ({
          id: slugifyTag(name) || name,
          name,
          slug: slugifyTag(name) || name.toLowerCase(),
          created_at: data.created_at || new Date().toISOString(),
        }));
      }

      return data;
    } catch (error) {
      console.error('Failed to get blog:', error);
      throw error;
    }
  },

  async getAllAdminBlogs(
    page: number = 1,
    limit: number = 20
  ): Promise<{ blogs: Blog[]; total: number }> {
    try {
      const from = (page - 1) * limit;
      const to = from + limit - 1;

      const { data, error, count } = await supabase
        .from('blogs')
        .select(`
          *,
          category:categories(*)
        `, { count: COUNT_MODE })
        .order('created_at', { ascending: false })
        .range(from, to);

      if (error) throw error;

      return { blogs: data || [], total: count || 0 };
    } catch (error) {
      console.error('Failed to get blogs:', error);
      throw error;
    }
  },

  async deleteBlog(blogId: string, imageUrl?: string): Promise<void> {
    try {
      if (imageUrl) {
        await imageService.deleteImage(imageUrl);
      }

      const { error } = await supabase.from('blogs').delete().eq('id', blogId);

      if (error) throw error;
    } catch (error) {
      console.error('Failed to delete blog:', error);
      throw error;
    }
  },

  async getCategories(): Promise<Category[]> {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name');

      if (error) throw error;

      return data || [];
    } catch (error) {
      console.error('Failed to get categories:', error);
      throw error;
    }
  },

  async getTags(): Promise<Tag[]> {
    try {
      const { data, error } = await supabase
        .from('blogs')
        .select('tags')
        .not('tags', 'is', null)
        .neq('tags', '');

      if (error) throw error;

      const names = uniqueNormalizedTags(
        (data || []).flatMap((row: { tags?: string }) =>
          (row.tags || '').split(',').map((tag) => tag.trim()).filter(Boolean)
        )
      );

      return names.map((name) => ({
        id: slugifyTag(name) || name,
        name,
        slug: slugifyTag(name) || name.toLowerCase(),
        created_at: new Date().toISOString(),
      }));
    } catch (error) {
      console.error('Failed to get tags:', error);
      throw error;
    }
  },

  generateSlug(title: string): string {
    return title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .slice(0, 100);
  },

  validateBlogData(data: BlogFormData): string | null {
    if (!data.title?.trim()) return 'Title is required';
    if (!data.slug?.trim()) return 'Slug is required';
    if (!data.content?.trim()) return 'Content is required';
    if (!data.excerpt?.trim()) return 'Excerpt is required';
    if (data.title.length > 200) return 'Title must be less than 200 characters';
    if (data.excerpt.length > 300) return 'Excerpt must be less than 300 characters';
    if (data.slug.length > 100) return 'Slug must be less than 100 characters';
    return null;
  },
};